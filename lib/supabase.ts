import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./supabase/config";

// Anonymous client for the public marketing pages (mascot gallery only).
// Authenticated portal pages use lib/supabase/browser.ts instead.
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

export type MascotPhoto = { id: string; dogName: string | null; url: string; createdAt: string };

// Fetch the latest featured mascot photos for the homepage gallery.
export async function fetchMascotGallery(limit = 6): Promise<MascotPhoto[]> {
  const { data, error } = await supabase
    .from("mascot_gallery")
    .select("id, dog_name, photo_path, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    dogName: row.dog_name,
    createdAt: row.created_at,
    url: supabase.storage.from("mascot-gallery").getPublicUrl(row.photo_path).data
      .publicUrl,
  }));
}
