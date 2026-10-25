import { NextResponse } from "next/server";
import { adminConfigured, checkCredentials, sameOrigin, setSessionCookie } from "@/lib/admin/auth";
import { clientIp, rateLimit } from "@/lib/security/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!adminConfigured()) {
    return NextResponse.json({ ok: false, message: "Admin is not configured." }, { status: 503 });
  }
  if (!sameOrigin(request)) return NextResponse.json({ ok: false, message: "Forbidden." }, { status: 403 });
  const rl = rateLimit(`admin-login:${clientIp(request.headers)}`, 5, 15 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, message: "Too many attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } },
    );
  }
  let body: { username?: unknown; password?: unknown } = {};
  try {
    body = await request.json();
  } catch {
    /* fall through to invalid */
  }
  if (
    typeof body.username !== "string" ||
    typeof body.password !== "string" ||
    !checkCredentials(body.username, body.password)
  ) {
    return NextResponse.json({ ok: false, message: "Invalid username or password." }, { status: 401 });
  }
  await setSessionCookie();
  return NextResponse.json({ ok: true });
}
