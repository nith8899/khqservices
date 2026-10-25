import { beforeAll, describe, expect, it } from "vitest";
import { randomBytes, scryptSync } from "node:crypto";
import { checkCredentials, createSessionToken, sameOrigin, verifySessionToken } from "@/lib/admin/auth";
import { detectLogo, settingsSchema } from "@/lib/settings";

beforeAll(() => {
  const salt = randomBytes(16);
  process.env.ADMIN_USERNAME = "boss";
  process.env.ADMIN_PASSWORD_HASH = `scrypt:${salt.toString("hex")}:${scryptSync("correct horse battery", salt, 64).toString("hex")}`;
  process.env.ADMIN_SESSION_SECRET = "x".repeat(40);
});

describe("admin auth", () => {
  it("accepts only the right credentials", () => {
    expect(checkCredentials("boss", "correct horse battery")).toBe(true);
    expect(checkCredentials("boss", "wrong")).toBe(false);
    expect(checkCredentials("other", "correct horse battery")).toBe(false);
  });
  it("verifies, expires, and rejects tampered session tokens", () => {
    const now = 1_000_000;
    const t = createSessionToken(now);
    expect(verifySessionToken(t, now + 1000)).toBe(true);
    expect(verifySessionToken(t, now + 9 * 3600_000)).toBe(false);
    expect(verifySessionToken(t.slice(0, -2) + "xx", now + 1000)).toBe(false);
    expect(verifySessionToken(undefined)).toBe(false);
  });
  it("is disabled when not configured", () => {
    const secret = process.env.ADMIN_SESSION_SECRET;
    process.env.ADMIN_SESSION_SECRET = "short";
    expect(verifySessionToken(createSessionToken())).toBe(false);
    process.env.ADMIN_SESSION_SECRET = secret;
  });
  it("requires same-origin requests", () => {
    const req = (origin?: string) =>
      new Request("http://site.test/api", { headers: { host: "site.test", ...(origin ? { origin } : {}) } });
    expect(sameOrigin(req("http://site.test"))).toBe(true);
    expect(sameOrigin(req("http://evil.test"))).toBe(false);
    expect(sameOrigin(req())).toBe(false);
  });
});

describe("settings", () => {
  it("validates contact settings", () => {
    const ok = { email: "a@b.co", phone: "1", messaging: "", address: "", hours: "", social: [{ label: "X", href: "https://x.com/a" }] };
    expect(settingsSchema.safeParse(ok).success).toBe(true);
    expect(settingsSchema.safeParse({ ...ok, email: "nope" }).success).toBe(false);
    expect(settingsSchema.safeParse({ ...ok, social: [{ label: "X", href: "javascript:alert(1)" }] }).success).toBe(false);
  });
  it("accepts only real PNG/JPEG/WebP content for logos", () => {
    expect(detectLogo(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 1, 2]))?.ext).toBe("png");
    expect(detectLogo(new TextEncoder().encode("<svg onload=alert(1)>"))).toBeUndefined();
    expect(detectLogo(new Uint8Array(0))).toBeUndefined();
  });
});
