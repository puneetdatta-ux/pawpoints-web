"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";

// Founder-only review queue: approve or reject merchant-proposed promotions
// on the website instead of the SQL editor. Both RPCs are admin-gated
// server-side (app_admins) — non-admins get empty results and failed writes,
// so this page is a convenience, not the security boundary.

type Pending = {
  id: string; cafe_id: string; cafe_name: string;
  reward_name: string; points: number; submitted_at: string;
};

export default function AdminRewardsPage() {
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pending, setPending] = useState<Pending[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.rpc("admin_list_pending_rewards");
    setPending(data ?? []);
  }, []);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: admin } = await supabase.rpc("is_app_admin");
        setIsAdmin(!!admin);
        if (admin) await refresh();
      }
      setChecking(false);
    })();
  }, [refresh]);

  async function review(r: Pending, approve: boolean) {
    setBusyId(r.id);
    const supabase = createClient();
    const { data, error } = await supabase.rpc("admin_review_reward", {
      p_id: r.id, p_approve: approve,
    });
    setBusyId(null);
    setLog((l) => [error ? `ERROR: ${error.message}` : String(data), ...l].slice(0, 8));
    await refresh();
  }

  if (checking) {
    return <main className="flex min-h-screen items-center justify-center bg-[#f6faf9]"><p className="text-[#4A5A57]">Loading…</p></main>;
  }

  if (!isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6faf9] px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mb-3 text-4xl">🔒</div>
          <h1 className="mb-2 text-2xl font-bold text-[#152825]">Admins only</h1>
          <p className="mb-6 text-sm text-[#4A5A57]">
            Sign in with a PawPoints admin account to review promotions.
          </p>
          <Link href="/login?next=/admin/rewards" className="inline-block w-full rounded-lg bg-[#16B8A6] px-4 py-2.5 font-semibold text-white hover:bg-[#0A6B60]">Sign in</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6faf9] px-4 py-10">
      <div className="mx-auto max-w-xl space-y-5">
        <div className="rounded-2xl bg-white p-7 shadow-sm">
          <h1 className="text-2xl font-bold text-[#152825]">Promotion review</h1>
          <p className="mt-1 text-sm text-[#4A5A57]">
            Approving puts the reward live in walkers&apos; apps immediately.
          </p>

          {pending.length === 0 ? (
            <p className="mt-5 text-sm text-[#9aa8a5]">Queue&apos;s empty — nothing waiting. 🐾</p>
          ) : (
            <ul className="mt-4 divide-y divide-[#eef1f0]">
              {pending.map((r) => (
                <li key={r.id} className="py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-semibold text-[#152825]">{r.reward_name}</p>
                      <p className="text-sm text-[#4A5A57]">
                        {r.cafe_name} · <b>{r.points} pts</b> ·{" "}
                        {new Date(r.submitted_at).toLocaleString("en-NZ")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => review(r, true)}
                        disabled={busyId === r.id}
                        className="rounded-lg bg-[#16B8A6] px-4 py-2 text-sm font-bold text-white hover:bg-[#0A6B60] disabled:opacity-60"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => review(r, false)}
                        disabled={busyId === r.id}
                        className="rounded-lg border border-[#e8b4b2] px-4 py-2 text-sm font-bold text-[#c2413f] hover:bg-[#fdecec] disabled:opacity-60"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                  {r.points > 280 && (
                    <p className="mt-2 text-xs font-semibold text-[#c2413f]">
                      ⚠ Above the 280-point maximum a walker can hold — unredeemable as priced.
                    </p>
                  )}
                  {r.points > 250 && r.points <= 280 && (
                    <p className="mt-2 text-xs text-[#8a5a00]">
                      Near the 280-point ceiling — only perfect two-week streaks reach this.
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {log.length > 0 && (
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#9aa8a5]">Recent actions</p>
            {log.map((l, i) => <p key={i} className="text-sm text-[#4A5A57]">{l}</p>)}
          </div>
        )}
      </div>
    </main>
  );
}
