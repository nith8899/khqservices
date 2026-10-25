import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { generateReference } from "./reference";
import { storageMode } from "./mode";
import { cfBindings } from "@/lib/cloudflare";

/**
 * File-based private enquiry store.
 *
 * Records and uploads are written under ENQUIRY_DATA_DIR (default `.data/`),
 * which is outside `public/` and is never served over HTTP. There is
 * intentionally NO route that lists, reads, or downloads these files.
 *
 * To move to PostgreSQL later, implement the same functions against a database
 * (see README "Upgrading storage") and keep the route handlers unchanged.
 */

export const dataDir = () => path.resolve(/* turbopackIgnore: true */ process.env.ENQUIRY_DATA_DIR || ".data");

export { storageMode, type StorageMode } from "./mode";

export interface StoredFile {
  originalName: string;
  storedName: string;
  size: number;
  extension: string;
}

export interface NotificationState {
  internal: "sent" | "skipped" | "failed";
  customer: "sent" | "skipped" | "failed";
}

export interface EnquiryRecord {
  reference: string;
  kind: "quote" | "contact";
  status: string;
  createdAt: string;
  data: Record<string, unknown>;
  files: StoredFile[];
  notifications?: NotificationState;
}

const safeSegment = (s: string) => s.replace(/[^A-Za-z0-9_-]/g, "");

async function ensure(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

export type IdempotencyClaim =
  | { state: "claimed" }
  | { state: "duplicate"; reference: string }
  | { state: "in-progress" };

/** Atomically claim a submission id so repeat/double submissions are not stored twice. */
async function fileClaim(submissionId: string): Promise<IdempotencyClaim> {
  const dir = path.join(dataDir(), "idempotency");
  await ensure(dir);
  const file = path.join(dir, `${safeSegment(submissionId)}.json`);
  try {
    await fs.writeFile(file, JSON.stringify({ state: "pending" }), { flag: "wx" });
    return { state: "claimed" };
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "EEXIST") throw err;
  }
  try {
    const existing = JSON.parse(await fs.readFile(file, "utf8")) as { reference?: string };
    if (existing.reference) return { state: "duplicate", reference: existing.reference };
  } catch {
    /* fall through */
  }
  return { state: "in-progress" };
}

async function fileRelease(submissionId: string) {
  const file = path.join(dataDir(), "idempotency", `${safeSegment(submissionId)}.json`);
  await fs.rm(file, { force: true });
}

async function completeSubmission(submissionId: string, reference: string) {
  const file = path.join(dataDir(), "idempotency", `${safeSegment(submissionId)}.json`);
  await fs.writeFile(file, JSON.stringify({ state: "done", reference }));
}

export interface SaveInput {
  submissionId: string;
  kind: "quote" | "contact";
  data: Record<string, unknown>;
  files: { originalName: string; extension: string; bytes: Uint8Array }[];
}

async function fileSave(input: SaveInput): Promise<EnquiryRecord> {
  const root = dataDir();
  const reference = generateReference(input.kind === "contact" ? "KHC" : "KHQ");
  const uploadDir = path.join(root, "uploads", reference);
  const files: StoredFile[] = [];

  if (input.files.length) await ensure(uploadDir);
  for (const f of input.files) {
    // Random stored name: the user-supplied name never touches the filesystem path.
    const storedName = `${randomBytes(12).toString("hex")}.${f.extension}`;
    await fs.writeFile(path.join(uploadDir, storedName), f.bytes, { flag: "wx", mode: 0o600 });
    files.push({
      originalName: f.originalName,
      storedName,
      size: f.bytes.length,
      extension: f.extension,
    });
  }

  const record: EnquiryRecord = {
    reference,
    kind: input.kind,
    status: "New",
    createdAt: new Date().toISOString(),
    data: input.data,
    files,
  };

  const dir = path.join(root, "enquiries");
  await ensure(dir);
  await fs.writeFile(path.join(dir, `${reference}.json`), JSON.stringify(record, null, 2), {
    flag: "wx",
    mode: 0o600,
  });
  await completeSubmission(input.submissionId, reference);
  return record;
}

async function fileRecordNotifications(reference: string, notifications: NotificationState) {
  const file = path.join(dataDir(), "enquiries", `${safeSegment(reference)}.json`);
  try {
    const rec = JSON.parse(await fs.readFile(file, "utf8")) as EnquiryRecord;
    rec.notifications = notifications;
    await fs.writeFile(file, JSON.stringify(rec, null, 2), { mode: 0o600 });
  } catch {
    /* non-fatal: the enquiry itself is already stored */
  }
}

// ---------------------------------------------------------------------------
// Cloudflare backend: records and idempotency keys in KV, documents in private R2.
// KV is eventually consistent, so the duplicate-submission guard is best-effort
// across regions (the browser also blocks double-clicks).
// ---------------------------------------------------------------------------

const IDEM_PENDING_TTL = 120; // seconds; stale "pending" claims expire on their own

async function cfClaim(submissionId: string): Promise<IdempotencyClaim> {
  const { kv } = await cfBindings();
  const key = `idem:${safeSegment(submissionId)}`;
  const existing = await kv.get(key);
  if (existing) {
    const parsed = JSON.parse(existing) as { state: string; reference?: string };
    return parsed.reference ? { state: "duplicate", reference: parsed.reference } : { state: "in-progress" };
  }
  await kv.put(key, JSON.stringify({ state: "pending" }), { expirationTtl: IDEM_PENDING_TTL });
  return { state: "claimed" };
}

async function cfRelease(submissionId: string) {
  const { kv } = await cfBindings();
  await kv.delete(`idem:${safeSegment(submissionId)}`);
}

async function cfSave(input: SaveInput): Promise<EnquiryRecord> {
  const { kv, files: bucket } = await cfBindings();
  const reference = generateReference(input.kind === "contact" ? "KHC" : "KHQ");
  const files: StoredFile[] = [];
  for (const f of input.files) {
    const storedName = `${randomBytes(12).toString("hex")}.${f.extension}`;
    await bucket.put(`uploads/${reference}/${storedName}`, f.bytes);
    files.push({ originalName: f.originalName, storedName, size: f.bytes.length, extension: f.extension });
  }
  const record: EnquiryRecord = {
    reference,
    kind: input.kind,
    status: "New",
    createdAt: new Date().toISOString(),
    data: input.data,
    files,
  };
  await kv.put(`enquiry:${reference}`, JSON.stringify(record));
  await kv.put(
    `idem:${safeSegment(input.submissionId)}`,
    JSON.stringify({ state: "done", reference }),
    { expirationTtl: 60 * 60 * 24 * 7 },
  );
  return record;
}

async function cfRecordNotifications(reference: string, notifications: NotificationState) {
  try {
    const { kv } = await cfBindings();
    const key = `enquiry:${safeSegment(reference)}`;
    const raw = await kv.get(key);
    if (!raw) return;
    const rec = JSON.parse(raw) as EnquiryRecord;
    rec.notifications = notifications;
    await kv.put(key, JSON.stringify(rec));
  } catch {
    /* non-fatal: the enquiry itself is already stored */
  }
}

const isCf = () => storageMode() === "cloudflare";

export const claimSubmission = (id: string) => (isCf() ? cfClaim(id) : fileClaim(id));
export const releaseSubmission = (id: string) => (isCf() ? cfRelease(id) : fileRelease(id));
export const saveEnquiry = (input: SaveInput) => (isCf() ? cfSave(input) : fileSave(input));
export const recordNotifications = (ref: string, n: NotificationState) =>
  isCf() ? cfRecordNotifications(ref, n) : fileRecordNotifications(ref, n);
