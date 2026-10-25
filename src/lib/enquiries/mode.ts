export type StorageMode = "file" | "cloudflare" | "demo";

/**
 * "file"       persists enquiries privately on disk (needs a persistent disk).
 * "cloudflare" persists to Cloudflare KV + private R2 (see wrangler.jsonc).
 * anything else is demo mode: nothing is stored or sent.
 */
export const storageMode = (): StorageMode => {
  const v = process.env.ENQUIRY_STORAGE;
  return v === "file" || v === "cloudflare" ? v : "demo";
};
