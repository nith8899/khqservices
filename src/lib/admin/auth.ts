import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "khq_admin";
const SESSION_HOURS = 8;

/** Admin is only enabled when all three variables are set; otherwise every admin route refuses. */
export function adminConfigured(): boolean {
  return Boolean(
    process.env.ADMIN_USERNAME &&
      process.env.ADMIN_PASSWORD_HASH &&
      (process.env.ADMIN_SESSION_SECRET ?? "").length >= 32,
  );
}

const safeEqual = (a: Buffer, b: Buffer) => a.length === b.length && timingSafeEqual(a, b);

/** Stored format: `scrypt:<saltHex>:<hashHex>` (generate with `npm run admin:hash`). */
export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, salt, hash] = stored.split(":");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(password, Buffer.from(salt, "hex"), expected.length);
  return safeEqual(actual, expected);
}

export function checkCredentials(username: string, password: string): boolean {
  if (!adminConfigured()) return false;
  const userOk = safeEqual(Buffer.from(username), Buffer.from(process.env.ADMIN_USERNAME as string));
  const passOk = verifyPassword(password, process.env.ADMIN_PASSWORD_HASH as string);
  return userOk && passOk; // both always evaluated
}

const sign = (payload: string) =>
  createHmac("sha256", process.env.ADMIN_SESSION_SECRET as string).update(payload).digest("base64url");

export function createSessionToken(now = Date.now()): string {
  const payload = Buffer.from(
    JSON.stringify({ exp: now + SESSION_HOURS * 3600_000, n: randomBytes(8).toString("hex") }),
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined, now = Date.now()): boolean {
  if (!token || !adminConfigured()) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  if (!safeEqual(Buffer.from(sig), Buffer.from(sign(payload)))) return false;
  try {
    return (JSON.parse(Buffer.from(payload, "base64url").toString()) as { exp: number }).exp > now;
  } catch {
    return false;
  }
}

export async function isAdmin(): Promise<boolean> {
  return verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value);
}

export async function setSessionCookie() {
  (await cookies()).set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_HOURS * 3600,
  });
}

export async function clearSessionCookie() {
  (await cookies()).delete(SESSION_COOKIE);
}

/** CSRF defence in depth (on top of SameSite=Strict): state-changing requests must be same-origin. */
export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
