import { getCloudflareContext } from "@opennextjs/cloudflare";

/** Minimal shapes of the Cloudflare bindings we use (avoids a heavy types dependency). */
export interface KVLike {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
}

export interface R2Like {
  put(
    key: string,
    value: Uint8Array,
    options?: { httpMetadata?: { contentType?: string } },
  ): Promise<unknown>;
  get(key: string): Promise<{ arrayBuffer(): Promise<ArrayBuffer> } | null>;
  delete(key: string): Promise<void>;
}

/**
 * Bindings declared in wrangler.jsonc:
 *  - KHQ_KV    : enquiry records, idempotency keys, admin settings
 *  - KHQ_FILES : private R2 bucket for uploaded documents and the logo
 * Only available when running on Cloudflare (ENQUIRY_STORAGE=cloudflare).
 */
export async function cfBindings(): Promise<{ kv: KVLike; files: R2Like }> {
  const { env } = await getCloudflareContext({ async: true });
  const e = env as unknown as { KHQ_KV?: KVLike; KHQ_FILES?: R2Like };
  if (!e.KHQ_KV || !e.KHQ_FILES) {
    throw new Error("Cloudflare bindings KHQ_KV / KHQ_FILES are not configured");
  }
  return { kv: e.KHQ_KV, files: e.KHQ_FILES };
}
