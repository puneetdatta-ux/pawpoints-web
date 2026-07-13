"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { resolveSignedUrls } from "@/lib/storage";

type WalkPhoto = {
  id: string;
  km: number | null;
  walked_at: string;
  photo_url: string;
  points_earned: number | null;
  displayUrl: string | null;
};

export default function PhotosPage() {
  const [photos, setPhotos] = useState<WalkPhoto[] | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data: walks } = await supabase
        .from("walks")
        .select("id, km, walked_at, photo_url, points_earned")
        .eq("user_id", user.id)
        .not("photo_url", "is", null)
        .order("walked_at", { ascending: false })
        .limit(100);

      const urlMap = await resolveSignedUrls(
        supabase,
        "walk-photos",
        (walks || []).map((w) => w.photo_url)
      );

      setPhotos(
        (walks || []).map((w) => ({
          ...w,
          displayUrl: urlMap.get(w.photo_url) || null,
        }))
      );
    })();
  }, []);

  // Mirrors the app's HomeScreen.deleteOwnPhoto: remove the storage object
  // (skip legacy full-URL values), then null the walk's photo_url. The walk
  // and its points are kept.
  async function deletePhoto(walk: WalkPhoto) {
    if (!userId) return;
    if (
      !window.confirm(
        "Delete this photo? Your walk and points are kept — only the photo is removed."
      )
    )
      return;

    setDeleting(walk.id);
    setError(null);
    try {
      const supabase = createClient();
      if (walk.photo_url && !walk.photo_url.startsWith("http")) {
        await supabase.storage.from("walk-photos").remove([walk.photo_url]);
      }
      const { error } = await supabase
        .from("walks")
        .update({ photo_url: null })
        .eq("id", walk.id)
        .eq("user_id", userId);
      if (error) throw error;
      setPhotos((prev) => (prev || []).filter((p) => p.id !== walk.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't delete the photo.");
    } finally {
      setDeleting(null);
    }
  }

  if (photos === null) return <p className="text-[#4A5A57]">Loading your photos…</p>;

  return (
    <div>
      <h1 className="mb-1 text-xl font-bold text-[#152825]">Walk photos</h1>
      <p className="mb-6 text-sm text-[#4A5A57]">
        Deleting a photo keeps the walk and its points.
      </p>
      {error && <p className="mb-4 text-sm text-[#c2413f]">{error}</p>}
      {photos.length === 0 ? (
        <p className="text-[#4A5A57]">No walk photos yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {photos.map((p) => (
            <figure key={p.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
              {p.displayUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.displayUrl}
                  alt={`Walk photo from ${new Date(p.walked_at).toLocaleDateString()}`}
                  className="aspect-square w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex aspect-square items-center justify-center bg-[#e8f4f2] text-3xl">
                  🐾
                </div>
              )}
              <figcaption className="flex items-center justify-between px-3 py-2 text-xs text-[#4A5A57]">
                <span>
                  {new Date(p.walked_at).toLocaleDateString("en-NZ", {
                    day: "numeric",
                    month: "short",
                  })}
                  {p.km != null && ` · ${Number(p.km).toFixed(1)} km`}
                </span>
                <button
                  onClick={() => deletePhoto(p)}
                  disabled={deleting === p.id}
                  className="font-semibold text-[#c2413f] hover:underline disabled:opacity-50"
                >
                  {deleting === p.id ? "Deleting…" : "Delete"}
                </button>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
