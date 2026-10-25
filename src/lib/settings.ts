import { promises as fs } from "node:fs";
import path from "node:path";
import { settingsSchema, type EditableSettings } from "./settings-schema";
import { siteConfig } from "@/config/site";
import { dataDir } from "@/lib/enquiries/store";

export { settingsSchema, type EditableSettings };

/**
 * Admin-editable business details, stored in `<dataDir>/settings.json`.
 * Empty values fall back to the defaults in `src/config/site.ts` (placeholders).
 */
export interface LogoInfo {
  file: string;
  mime: string;
  version: string;
}

export interface StoredSettings extends Partial<EditableSettings> {
  logo?: LogoInfo;
}

const file = () => path.join(dataDir(), "settings.json");
export const brandingDir = () => path.join(dataDir(), "branding");

export async function readStored(): Promise<StoredSettings> {
  try {
    return JSON.parse(await fs.readFile(file(), "utf8")) as StoredSettings;
  } catch {
    return {};
  }
}

export async function writeStored(next: StoredSettings) {
  await fs.mkdir(dataDir(), { recursive: true });
  await fs.writeFile(file(), JSON.stringify(next, null, 2), { mode: 0o600 });
}

export interface ResolvedSettings {
  contact: { email: string; phone: string; messaging: string; address: string; hours: string };
  social: { label: string; href: string }[];
  logoUrl?: string;
}

export async function getSiteSettings(): Promise<ResolvedSettings> {
  const s = await readStored();
  const d = siteConfig.contact;
  return {
    contact: {
      email: s.email || d.email,
      phone: s.phone || d.phone,
      messaging: s.messaging || d.messaging,
      address: s.address || d.address,
      hours: s.hours || d.hours,
    },
    social: s.social ?? [...siteConfig.social],
    logoUrl: s.logo ? `/brand/logo?v=${s.logo.version}` : undefined,
  };
}

const LOGO_SIGS: { mime: string; ext: string; test: (b: Uint8Array) => boolean }[] = [
  { mime: "image/png", ext: "png", test: (b) => [0x89, 0x50, 0x4e, 0x47].every((v, i) => b[i] === v) },
  { mime: "image/jpeg", ext: "jpg", test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  {
    mime: "image/webp",
    ext: "webp",
    test: (b) =>
      [0x52, 0x49, 0x46, 0x46].every((v, i) => b[i] === v) && [0x57, 0x45, 0x42, 0x50].every((v, i) => b[8 + i] === v),
  },
];
export const MAX_LOGO_BYTES = 2 * 1024 * 1024;

/** PNG/JPEG/WebP only (SVG is refused because it can carry scripts). Checks real content, not the name. */
export function detectLogo(bytes: Uint8Array) {
  if (bytes.length === 0 || bytes.length > MAX_LOGO_BYTES) return undefined;
  return LOGO_SIGS.find((s) => s.test(bytes));
}
