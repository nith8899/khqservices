import { randomInt } from "node:crypto";

// No 0/O/1/I to avoid confusion when quoting a reference over the phone.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateReference(prefix = "KHQ", now = new Date()): string {
  const yy = String(now.getUTCFullYear()).slice(2);
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  let suffix = "";
  for (let i = 0; i < 6; i++) suffix += ALPHABET[randomInt(ALPHABET.length)];
  return `${prefix}-${yy}${mm}${dd}-${suffix}`;
}

export const REFERENCE_PATTERN = /^[A-Z]{2,6}-\d{6}-[A-Z2-9]{6}$/;
