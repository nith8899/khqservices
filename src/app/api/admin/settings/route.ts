import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAdmin, sameOrigin } from "@/lib/admin/auth";
import { deleteLogoFile, detectLogo, readStored, saveLogoFile, settingsSchema, writeStored, type LogoInfo } from "@/lib/settings";
import { flattenZodErrors } from "@/lib/validation/enquiry";

export const dynamic = "force-dynamic";

const fail = (status: number, message: string, errors?: Record<string, string>) =>
  NextResponse.json({ ok: false, message, errors }, { status });

export async function POST(request: Request) {
  if (!sameOrigin(request)) return fail(403, "Forbidden.");
  if (!(await isAdmin())) return fail(401, "Please sign in.");

  let form: FormData;
  let raw: unknown;
  try {
    form = await request.formData();
    raw = JSON.parse(String(form.get("payload") ?? ""));
  } catch {
    return fail(400, "Invalid request.");
  }
  const parsed = settingsSchema.safeParse(raw);
  if (!parsed.success) return fail(400, "Please correct the highlighted fields.", flattenZodErrors(parsed.error));

  const current = await readStored();
  let logo: LogoInfo | undefined = current.logo;

  if (form.get("removeLogo") === "true") logo = undefined;
  const upload = form.get("logo");
  if (upload && typeof upload !== "string" && upload.size > 0) {
    const bytes = new Uint8Array(await upload.arrayBuffer());
    const kind = detectLogo(bytes);
    if (!kind) {
      return fail(400, "Logo must be a PNG, JPG, or WebP image of 2 MB or less.", { logo: "Unsupported or oversized image." });
    }
    const name = `logo-${randomBytes(8).toString("hex")}.${kind.ext}`;
    await saveLogoFile(name, bytes, kind.mime);
    logo = { file: name, mime: kind.mime, version: randomBytes(4).toString("hex") };
  }

  if (current.logo && current.logo.file !== logo?.file) {
    await deleteLogoFile(current.logo.file);
  }

  await writeStored({ ...parsed.data, logo });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, logoUrl: logo ? `/brand/logo?v=${logo.version}` : null });
}
