import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation/enquiry";
import { processSubmission } from "@/lib/enquiries/submit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const declared = Number(request.headers.get("content-length") || 0);
  if (declared > 64 * 1024) {
    return NextResponse.json({ ok: false, message: "The request is too large." }, { status: 413 });
  }
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }
  return processSubmission({
    kind: "contact",
    schema: contactSchema,
    raw,
    files: [],
    headers: request.headers,
  });
}
