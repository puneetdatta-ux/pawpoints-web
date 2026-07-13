import type { SupabaseClient } from "@supabase/supabase-js";

// ── Signed-URL resolution (ported from the app's supabase.js) ────────────────
// Stored values may be a storage path (e.g. "userId/file.jpg") or a legacy full
// public URL. We extract the path and create a short-lived signed URL. Unknown
// external http URLs are returned as-is.
export function toStoragePath(value: string | null | undefined, bucket: string): string | null {
  if (!value) return null;
  if (!value.startsWith("http")) return value; // already a path
  const pub = `/public/${bucket}/`;
  let idx = value.indexOf(pub);
  if (idx !== -1) return decodeURIComponent(value.slice(idx + pub.length).split("?")[0]);
  const obj = `/${bucket}/`;
  idx = value.indexOf(obj);
  if (idx !== -1) return decodeURIComponent(value.slice(idx + obj.length).split("?")[0]);
  return null; // external/unknown http URL
}

// Batch: returns Map original value -> displayable signed URL (or null)
export async function resolveSignedUrls(
  supabase: SupabaseClient,
  bucket: string,
  values: (string | null | undefined)[],
  expiresIn = 3600
): Promise<Map<string, string | null>> {
  const map = new Map<string, string | null>();
  const valueToPath = new Map<string, string>();
  const pathSet = new Set<string>();

  for (const v of values) {
    if (!v || map.has(v) || valueToPath.has(v)) continue;
    const path = toStoragePath(v, bucket);
    if (!path) {
      map.set(v, v.startsWith("http") ? v : null);
      continue;
    }
    valueToPath.set(v, path);
    pathSet.add(path);
  }

  const paths = [...pathSet];
  if (paths.length > 0) {
    const { data, error } = await supabase.storage.from(bucket).createSignedUrls(paths, expiresIn);
    const signedByPath = new Map<string, string | null>();
    if (!error && data) data.forEach((it) => signedByPath.set(it.path ?? "", it.signedUrl || null));
    for (const [v, p] of valueToPath) map.set(v, signedByPath.get(p) || null);
  }
  return map;
}

// Single signed URL
export async function resolveSignedUrl(
  supabase: SupabaseClient,
  bucket: string,
  value: string | null | undefined,
  expiresIn = 3600
): Promise<string | null> {
  if (!value) return null;
  const path = toStoragePath(value, bucket);
  if (!path) return value.startsWith("http") ? value : null;
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn);
  return error ? null : data?.signedUrl || null;
}
