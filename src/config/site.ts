/**
 * Central business configuration for KHQ Services.
 *
 * Unknown company details are deliberately left as explicit placeholders.
 * Replace them here (or via NEXT_PUBLIC_* environment variables) once the
 * real details are confirmed. Nothing in this file should be invented.
 */

export const PLACEHOLDER = "[To be supplied]";

const env = (value: string | undefined, fallback: string) =>
  value && value.trim() ? value.trim() : fallback;

export const siteConfig = {
  name: "KHQ Services",
  /** Registered name as shown on the company logo. */
  legalName: "KHQ Services (Cambodia) Co., Ltd",
  tagline: "Reliable Logistics. Supporting Every Industry.",
  altTagline: "Moving Your Business Forward.",
  description:
    "KHQ Services helps businesses coordinate freight, imports, equipment transportation, and commercial deliveries into Cambodia with practical planning and responsive service.",
  url: env(process.env.NEXT_PUBLIC_SITE_URL, "http://localhost:3000"),
  locale: "en",
  /** Languages the content layer is structured for. Khmer requires reviewed copy. */
  supportedLocales: ["en"] as const,

  contact: {
    email: env(process.env.NEXT_PUBLIC_CONTACT_EMAIL, "[Business email to be supplied]"),
    phone: env(process.env.NEXT_PUBLIC_CONTACT_PHONE, "[Telephone to be supplied]"),
    messaging: env(
      process.env.NEXT_PUBLIC_CONTACT_MESSAGING,
      "[Messaging contact (e.g. Telegram / WhatsApp) to be supplied]",
    ),
    address: env(process.env.NEXT_PUBLIC_CONTACT_ADDRESS, "[Office address to be supplied]"),
    hours: env(process.env.NEXT_PUBLIC_BUSINESS_HOURS, "[Business hours to be supplied]"),
  },

  social: [] as { label: string; href: string }[],

  /** Routes KHQ has confirmed it can arrange. Empty until confirmed by the business. */
  confirmedRoutes: [] as string[],

  privacyContactNote:
    "Privacy questions can be sent to the business email shown on the Contact page.",
} as const;

export const hasRealContact = (value: string) => !value.startsWith("[");

/** Maximum upload size per file (MB). Override with MAX_UPLOAD_MB on the server. */
export const UPLOAD_DEFAULTS = {
  maxFileMB: 10,
  maxFiles: 5,
  allowedExtensions: ["pdf", "xlsx", "xls", "csv", "docx", "doc", "png", "jpg", "jpeg"],
} as const;
