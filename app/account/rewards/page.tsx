"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

type Points = { available: number; walk_earned: number; bonus: number };

type Tx = {
  id: string;
  date: string;
  label: string;
  detail: string;
  points: number; // positive = earned, negative = spent
  status?: string;
};

export default function RewardsPage() {
  const [points, setPoints] = useState<Points | null>(null);
  const [txs, setTxs] = useState<Tx[] | null>(null);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Match the app + server window: start of today (local) minus 14 days.
      const windowStart = new Date();
      windowStart.setHours(0, 0, 0, 0);
      windowStart.setDate(windowStart.getDate() - 14);
      const windowStartIso = windowStart.toISOString();
      const now = new Date();

      const [summaryRes, walksRes, redemptionsRes] = await Promise.all([
        supabase.rpc("get_points_summary"),
        supabase
          .from("walks")
          .select("id, points_earned, walked_at, km")
          .eq("user_id", user.id)
          .gte("walked_at", windowStartIso)
          .order("walked_at", { ascending: false }),
        supabase
          .from("redemptions")
          .select(
            "id, points_cost, status, expires_at, created_at, redeemed_at, cafe_name, reward_name"
          )
          .eq("user_id", user.id)
          .gte("created_at", windowStartIso)
          .order("created_at", { ascending: false }),
      ]);

      if (summaryRes.data) setPoints(summaryRes.data as Points);

      const earned: Tx[] = (walksRes.data || [])
        .filter((w) => (w.points_earned || 0) > 0)
        .map((w) => {
          // Expires at the start of the day 15 days after the earn day —
          // same rule as the app and the server's 2-week walk-points window.
          const expiresAt = new Date(w.walked_at);
          expiresAt.setHours(0, 0, 0, 0);
          expiresAt.setDate(expiresAt.getDate() + 15);
          return {
            id: `w-${w.id}`,
            date: w.walked_at,
            label: "Walk",
            detail: w.km != null ? `${Number(w.km).toFixed(1)} km walk` : "Walk",
            points: w.points_earned || 0,
            status:
              expiresAt > now
                ? `expires ${expiresAt.toLocaleDateString("en-NZ", { day: "numeric", month: "short" })}`
                : "expired",
          };
        });

      const spent: Tx[] = (redemptionsRes.data || []).map((r) => {
        let status = "";
        if (r.status === "redeemed") status = "redeemed";
        else if (r.status === "pending")
          status = r.expires_at && new Date(r.expires_at) > now ? "code active" : "code expired";
        return {
          id: `r-${r.id}`,
          date: r.created_at,
          label: r.cafe_name || "Reward",
          detail: r.reward_name || "Redemption",
          points: -(r.points_cost || 0),
          status,
        };
      });

      setTxs(
        [...earned, ...spent].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );
    })();
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-[#152825]">Rewards</h1>

      <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-4xl font-bold text-[#0A6B60]">{points?.available ?? "—"}</p>
        <p className="mt-1 text-sm text-[#4A5A57]">points available to spend</p>
        <p className="mt-3 text-xs text-[#4A5A57]">
          Redeem points at partner cafés from the app — codes are shown at the till.
        </p>
      </section>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#4A5A57]">
        Last 2 weeks
      </h2>
      {txs === null ? (
        <p className="text-[#4A5A57]">Loading your history…</p>
      ) : txs.length === 0 ? (
        <p className="text-[#4A5A57]">No activity in the last two weeks.</p>
      ) : (
        <ul className="space-y-2">
          {txs.map((t) => (
            <li
              key={t.id}
              className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm"
            >
              <div>
                <p className="font-semibold text-[#152825]">{t.detail}</p>
                <p className="text-xs text-[#4A5A57]">
                  {t.label !== t.detail && `${t.label} · `}
                  {new Date(t.date).toLocaleDateString("en-NZ", {
                    day: "numeric",
                    month: "short",
                  })}
                  {t.status && ` · ${t.status}`}
                </p>
              </div>
              <span
                className={
                  "font-bold " + (t.points >= 0 ? "text-[#0A6B60]" : "text-[#c2413f]")
                }
              >
                {t.points >= 0 ? `+${t.points}` : t.points}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
