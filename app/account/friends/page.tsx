"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { resolveSignedUrls } from "@/lib/storage";

type Friend = {
  id: string;
  name: string | null;
  dog_name: string | null;
  dog_breed: string | null;
  avatarUrl: string | null;
};

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[] | null>(null);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Same mapping as the app: a friendship row can hold me on either side.
      const { data: friendships } = await supabase
        .from("friendships")
        .select("user_id, friend_id")
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
        .eq("status", "accepted");

      const friendIds = (friendships || []).map((f) =>
        f.user_id === user.id ? f.friend_id : f.user_id
      );

      if (friendIds.length === 0) {
        setFriends([]);
        return;
      }

      const { data: profiles } = await supabase
        .from("users")
        .select("id, name, dog_name, dog_breed, avatar_url")
        .in("id", friendIds)
        .order("name");

      const avatarMap = await resolveSignedUrls(
        supabase,
        "avatars",
        (profiles || []).map((p) => p.avatar_url)
      );

      setFriends(
        (profiles || []).map((p) => ({
          id: p.id,
          name: p.name,
          dog_name: p.dog_name,
          dog_breed: p.dog_breed,
          avatarUrl: p.avatar_url ? avatarMap.get(p.avatar_url) || null : null,
        }))
      );
    })();
  }, []);

  if (friends === null) return <p className="text-[#4A5A57]">Loading your friends…</p>;

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-[#152825]">Friends</h1>
      {friends.length === 0 ? (
        <p className="text-[#4A5A57]">
          No friends yet — find friends from the app&apos;s Friends tab.
        </p>
      ) : (
        <ul className="space-y-3">
          {friends.map((f) => (
            <li
              key={f.id}
              className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm"
            >
              {f.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={f.avatarUrl}
                  alt=""
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e8f4f2] text-xl">
                  🐾
                </div>
              )}
              <div>
                <p className="font-semibold text-[#152825]">{f.name || "Walker"}</p>
                {(f.dog_name || f.dog_breed) && (
                  <p className="text-sm text-[#4A5A57]">
                    {[f.dog_name, f.dog_breed].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
