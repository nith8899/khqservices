import { NextResponse } from "next/server";
import type { ZodType } from "zod";
import { MIN_FILL_MS, flattenZodErrors } from "@/lib/validation/enquiry";
import { sanitizeFilename, verifyFileContent } from "@/lib/validation/files";
import { UPLOAD_DEFAULTS } from "@/config/site";
import { clientIp, rateLimit } from "@/lib/security/rate-limit";
import {
  claimSubmission,
  recordNotifications,
  releaseSubmission,
  saveEnquiry,
} from "./store";
import { storageMode } from "./mode";
import { buildCustomerConfirmation, buildInternalNotification, sendEmail } from "@/lib/email";

export interface UploadedFile {
  name: string;
  bytes: Uint8Array;
}

interface Options<T> {
  kind: "quote" | "contact";
  schema: ZodType<T>;
  raw: unknown;
  files: UploadedFile[];
  headers: Headers;
  rateLimitMax?: number;
}

const fail = (status: number, message: string, errors?: Record<string, string>) =>
  NextResponse.json({ ok: false, message, errors }, { status });

export function uploadLimits() {
  const maxFileMB = Number(process.env.MAX_UPLOAD_MB) || UPLOAD_DEFAULTS.maxFileMB;
  return { maxFileMB, maxFiles: UPLOAD_DEFAULTS.maxFiles };
}

/**
 * Shared pipeline for the quote and contact endpoints:
 * rate limit → validate → anti-spam → idempotency → persist → notify.
 */
export async function processSubmission<T extends Record<string, unknown>>(opts: Options<T>) {
  const { kind, schema, raw, files, headers } = opts;
  const ip = clientIp(headers);

  const rl = rateLimit(`${kind}:${ip}`, opts.rateLimitMax ?? 5, 10 * 60 * 1000);
  if (!rl.allowed) {
    const res = fail(429, "Too many submissions. Please wait a few minutes and try again.");
    res.headers.set("Retry-After", String(rl.retryAfterSeconds));
    return res;
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return fail(400, "Please correct the highlighted fields.", flattenZodErrors(parsed.error));
  }
  const data = parsed.data as T & { startedAt?: number; submissionId: string; website?: string };

  // Anti-spam: honeypot (schema enforces empty) and minimum fill time.
  if (typeof data.startedAt === "number" && Date.now() - data.startedAt < MIN_FILL_MS) {
    return fail(400, "That was submitted too quickly. Please review your details and try again.");
  }

  // Uploads: count, extension, size, and real content type.
  const { maxFileMB, maxFiles } = uploadLimits();
  if (files.length > maxFiles) return fail(400, `Please upload no more than ${maxFiles} files.`);
  const verified: { originalName: string; extension: string; bytes: Uint8Array }[] = [];
  for (const f of files) {
    const check = verifyFileContent(f.name, f.bytes, maxFileMB);
    if (!check.ok) return fail(400, check.error ?? "Invalid file.", { documents: check.error ?? "Invalid file." });
    verified.push({
      originalName: sanitizeFilename(f.name),
      extension: check.extension as string,
      bytes: f.bytes,
    });
  }

  const { startedAt: _s, website: _w, ...stored } = data;
  void _s;
  void _w;

  // Demo mode: validate everything but persist nothing, and never claim receipt.
  if (storageMode() === "demo") {
    return NextResponse.json({ ok: true, demo: true });
  }

  const claim = await claimSubmission(data.submissionId);
  if (claim.state === "duplicate") {
    return NextResponse.json({ ok: true, demo: false, duplicate: true, reference: claim.reference });
  }
  if (claim.state === "in-progress") {
    return fail(409, "This enquiry is already being processed. Please wait a moment.");
  }

  let record;
  try {
    record = await saveEnquiry({
      submissionId: data.submissionId,
      kind,
      data: stored,
      files: verified,
    });
  } catch {
    await releaseSubmission(data.submissionId).catch(() => {});
    console.error("[enquiry] failed to persist submission");
    return fail(500, "We could not save your enquiry. Please try again shortly.");
  }

  // Notifications never affect whether the enquiry is considered received.
  const internalTo = process.env.NOTIFY_EMAIL_TO;
  const internalMsg = buildInternalNotification(
    record.reference,
    stored,
    verified.map((f) => f.originalName),
  );
  const internal = internalTo ? await sendEmail({ to: internalTo, ...internalMsg, replyTo: String(stored.email) }) : "skipped";
  const confirm = buildCustomerConfirmation(
    record.reference,
    String(stored.contactPerson ?? stored.name ?? "there"),
  );
  const customer = await sendEmail({ to: String(stored.email), ...confirm });
  await recordNotifications(record.reference, { internal, customer });

  return NextResponse.json({
    ok: true,
    demo: false,
    reference: record.reference,
    emailStatus: { internal, customer },
  });
}
