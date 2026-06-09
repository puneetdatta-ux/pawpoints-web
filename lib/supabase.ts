import { createClient } from "@supabase/supabase-js";

// Public anon key — safe for client use (read-only access governed by RLS).
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ohvndmcybxvahjmmjujn.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9odm5kbWN5Ynh2YWhqbW1qdWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MzU5NDksImV4cCI6MjA5MjUxMTk0OX0.nEhbefpd_I3ES_s23ocM8Z-hLY8eCirQ03Sr1BN1JRg";

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
