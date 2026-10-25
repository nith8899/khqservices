import { NextResponse } from "next/server";
import { enquirySchema } from "@/lib/validation/enquiry";
import { processSubmission, uploadLimits, type UploadedFile } from "@/lib/enquiries/submit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Intentionally only POST: there is no public GET/PUT/DELETE for enquiries or documents.
export async function POST(request: Request) {
  const { maxFileMB, maxFiles } = uploadLimits();
  const maxBody = (maxFiles * maxFileMB + 1) * 1024 * 1024;
  const declared = Number(request.headers.get("content-length") || 0);
  if (declared > maxBody) {
    return NextResponse.json({ ok: false, message: "The upload is too large." }, { status: 413 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  let raw: unknown;
  try {
    raw = JSON.parse(String(form.get("payload") ?? ""));
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const files: UploadedFile[] = [];
  for (const entry of form.getAll("documents")) {
    if (typeof entry === "string" || entry.size === 0) continue;
    files.push({ name: entry.name, bytes: new Uint8Array(await entry.arrayBuffer()) });
  }

  return processSubmission({
    kind: "quote",
    schema: enquirySchema,
    raw,
    files,
    headers: request.headers,
  });
}
