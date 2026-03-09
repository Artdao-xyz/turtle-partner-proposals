/**
 * In-memory store for local previews (dev only).
 * No Blob storage - content lives in process memory until server restart.
 * Uses globalThis so the store survives Turbopack module reloads in dev.
 */

const LOCAL_PREFIX = "local-";
const GLOBAL_KEY = "__resource_hub_preview_store__";

function getStore(): Map<string, string> {
  const g = globalThis as unknown as { [key: string]: Map<string, string> | undefined };
  if (!g[GLOBAL_KEY]) g[GLOBAL_KEY] = new Map();
  return g[GLOBAL_KEY];
}

export function isLocalPreviewId(previewId: string): boolean {
  return previewId.startsWith(LOCAL_PREFIX);
}

export function getLocalPreviewContent(previewId: string): string | null {
  return getStore().get(previewId) ?? null;
}

export function setLocalPreviewContent(previewId: string, content: string): void {
  getStore().set(previewId, content);
}

export function generateLocalPreviewId(): string {
  return LOCAL_PREFIX + crypto.randomUUID().replace(/-/g, "").slice(0, 12);
}
