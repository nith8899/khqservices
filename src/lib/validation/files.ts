import { UPLOAD_DEFAULTS } from "@/config/site";

export interface FileCheckResult {
  ok: boolean;
  error?: string;
  extension?: string;
}

type Signature = { bytes: number[]; offset?: number };

const SIGNATURES: Record<string, Signature[]> = {
  pdf: [{ bytes: [0x25, 0x50, 0x44, 0x46] }], // %PDF
  png: [{ bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] }],
  jpg: [{ bytes: [0xff, 0xd8, 0xff] }],
  jpeg: [{ bytes: [0xff, 0xd8, 0xff] }],
  // OOXML (docx/xlsx) are ZIP containers
  docx: [{ bytes: [0x50, 0x4b, 0x03, 0x04] }],
  xlsx: [{ bytes: [0x50, 0x4b, 0x03, 0x04] }],
  // Legacy OLE2 compound files (doc/xls)
  doc: [{ bytes: [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1] }],
  xls: [{ bytes: [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1] }],
};

export function getExtension(filename: string): string {
  const idx = filename.lastIndexOf(".");
  return idx === -1 ? "" : filename.slice(idx + 1).toLowerCase();
}

/** Strip path components and unsafe characters for display/storage of the original name. */
export function sanitizeFilename(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? "file";
  const cleaned = base.replace(/[^\w.\- ()]/g, "_").replace(/\.{2,}/g, ".").slice(0, 120);
  return cleaned || "file";
}

function matches(buf: Uint8Array, sig: Signature): boolean {
  const off = sig.offset ?? 0;
  return sig.bytes.every((b, i) => buf[off + i] === b);
}

function looksLikePlainText(buf: Uint8Array): boolean {
  // Reject binary content (NUL bytes or too many control characters) for CSV.
  const n = Math.min(buf.length, 8192);
  let control = 0;
  for (let i = 0; i < n; i++) {
    const b = buf[i];
    if (b === 0) return false;
    if (b < 9 || (b > 13 && b < 32)) control++;
  }
  return n === 0 || control / n < 0.01;
}

export function maxFileBytes(maxMB: number = UPLOAD_DEFAULTS.maxFileMB): number {
  return Math.floor(maxMB * 1024 * 1024);
}

/** Client-side pre-check using only name and size (content is verified again on the server). */
export function precheckFile(
  file: { name: string; size: number },
  maxMB: number = UPLOAD_DEFAULTS.maxFileMB,
): FileCheckResult {
  const extension = getExtension(file.name);
  if (!(UPLOAD_DEFAULTS.allowedExtensions as readonly string[]).includes(extension)) {
    return {
      ok: false,
      error: `"${sanitizeFilename(file.name)}" is not an accepted file type. Accepted: ${UPLOAD_DEFAULTS.allowedExtensions.join(", ").toUpperCase()}.`,
    };
  }
  if (file.size === 0) return { ok: false, error: `"${sanitizeFilename(file.name)}" is empty.` };
  if (file.size > maxFileBytes(maxMB)) {
    return { ok: false, error: `"${sanitizeFilename(file.name)}" is larger than ${maxMB} MB.` };
  }
  return { ok: true, extension };
}

/** Server-side check: extension allowlist, size, and actual content signature. */
export function verifyFileContent(
  name: string,
  bytes: Uint8Array,
  maxMB: number = UPLOAD_DEFAULTS.maxFileMB,
): FileCheckResult {
  const pre = precheckFile({ name, size: bytes.length }, maxMB);
  if (!pre.ok) return pre;
  const ext = pre.extension as string;

  if (ext === "csv") {
    return looksLikePlainText(bytes)
      ? { ok: true, extension: ext }
      : { ok: false, error: `"${sanitizeFilename(name)}" does not look like a valid CSV file.` };
  }

  const sigs = SIGNATURES[ext];
  if (!sigs || !sigs.some((s) => matches(bytes, s))) {
    return {
      ok: false,
      error: `"${sanitizeFilename(name)}" content does not match its .${ext} extension.`,
    };
  }
  return { ok: true, extension: ext };
}
