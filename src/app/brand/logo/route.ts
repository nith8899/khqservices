import { readLogoFile, readStored } from "@/lib/settings";

export const dynamic = "force-dynamic";

/** Public logo only. Serves the single file named in settings; never a user-supplied path. */
export async function GET() {
  const { logo } = await readStored();
  if (!logo) return new Response(null, { status: 404 });
  const data = await readLogoFile(logo.file);
  if (!data) return new Response(null, { status: 404 });
  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": logo.mime,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
