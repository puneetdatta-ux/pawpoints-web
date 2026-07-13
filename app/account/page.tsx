"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { resolveSignedUrl } from "@/lib/storage";

type Profile = {
  name: string | null;
  email: string | null;
  phone: string | null;
  dogName: string | null;
  dogBreed: string | null;
  dogAge: string | null;
  avatarUrl: string | null;
};

type Points = { available: number; walk_earned: number; bonus: number };

export default function AccountPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [points, setPoints] = useState<Points | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // email/phone are column-locked; only get_my_profile() can read them.
      const [{ data: me }, { data: row }, { data: summary }] = await Promise.all([
        supabase.rpc("get_my_profile"),
        supabase
          .from("users")
          .select("name, dog_name, dog_breed, dog_age, avatar_url")
          .eq("id", user.id)
          .single(),
        supabase.rpc("get_points_summary"),
      ]);

      const avatarUrl = await resolveSignedUrl(supabase, "avatars", row?.avatar_url);

      setProfile({
        name: row?.name ?? me?.name ?? null,
        email: me?.email ?? null,
        phone: me?.phone ?? null,
        dogName: row?.dog_name ?? null,
        dogBreed: row?.dog_breed ?? null,
        dogAge: row?.dog_age ?? null,
        avatarUrl,
      });
      if (summary) setPoints(summary as Points);
      setLoading(false);
    })();
  }, []);

  if (loading) return <p className="text-[#4A5A57]">Loading your profile…</p>;
  if (!profile) return <p className="text-[#4A5A57]">Couldn&apos;t load your profile.</p>;

  return (
    <div className="space-y-6">
      <section className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm">
        {profile.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatarUrl}
            alt="Your avatar"
            className="h-20 w-20 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#e8f4f2] text-3xl">
            🐾
          </div>
        )}
        <div>
          <h1 className="text-xl font-bold text-[#152825]">{profile.name || "Walker"}</h1>
          {profile.email && <p className="text-sm text-[#4A5A57]">{profile.email}</p>}
          {profile.phone && <p className="text-sm text-[#4A5A57]">{profile.phone}</p>}
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#4A5A57]">
          Points
        </h2>
        <p className="text-4xl font-bold text-[#0A6B60]">{points?.available ?? 0}</p>
        <p className="mt-1 text-sm text-[#4A5A57]">available to spend</p>
        <div className="mt-4 flex gap-6 text-sm text-[#4A5A57]">
          <span>
            <strong className="text-[#152825]">{points?.walk_earned ?? 0}</strong> from walks
            (last 2 weeks)
          </span>
          <span>
            <strong className="text-[#152825]">{points?.bonus ?? 0}</strong> bonus points
          </span>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#4A5A57]">
          Your dog
        </h2>
        {profile.dogName ? (
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fff4d6] text-2xl">
              🐶
            </div>
            <div>
              <p className="font-semibold text-[#152825]">{profile.dogName}</p>
              <p className="text-sm text-[#4A5A57]">
                {[profile.dogBreed, profile.dogAge && `${profile.dogAge} years`]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-[#4A5A57]">No dog on your profile yet — add one in the app.</p>
        )}
      </section>
    </div>
  );
}
