import { NextResponse } from "next/server";
import { clearSessionCookie, sameOrigin } from "@/lib/admin/auth";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ ok: false }, { status: 403 });
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
