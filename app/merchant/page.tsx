"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";

// Merchant portal: the signed-in owner views their business profile and
// proposes promotions. Everything runs through owner-gated SECURITY DEFINER
// RPCs (get_my_merchant, merchant_list_rewards, merchant_upsert_reward,
// merchant_set_reward_active) — proposals land approval='pending' and go live
// only after Puneet approves (site: /admin/rewards).

type Merchant = {
  cafe_id: string; name: string; status: string; is_active: boolean;
  city: string | null; suburb: string | null; address: string | null;
  website: string | null; summary: string | null;
  contact_name: string | null; contact_phone: string | null;
  show_contact: boolean; category: string;
};

type Reward = {
  id: string; name: string; points: number; icon: string;
  is_active: boolean; approval: string; created_at: string;
};

export default function MerchantPortalPage() {
  const [checking, setChecking] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [newName, setNewName] = useState("");
  const [newPoints, setNewPoints] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadRewards = useCallback(async (cafeId: string) => {
    const supabase = createClient();
    const { data } = await supabase.rpc("merchant_list_rewards", { p_cafe_id: cafeId });
    setRewards(data ?? []);
  }, []);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setChecking(false); return; }
      setSignedIn(true);
      const { data } = await supabase.rpc("get_my_merchant");
      const m = Array.isArray(data) ? data[0] : data;
      if (m) {
        setMerchant(m as Merchant);
        await loadRewards((m as Merchant).cafe_id);
      }
      setChecking(false);
    })();
  }, [loadRewards]);

  async function propose(e: React.FormEvent) {
    e.preventDefault();
    if (!merchant) return;
    setBusy(true); setNotice(null); setError(null);
    const supabase = createClient();
    const { data, error: rpcErr } = await supabase.rpc("merchant_upsert_reward", {
      p_cafe_id: merchant.cafe_id, p_id: null,
      p_name: newName.trim(), p_points: parseInt(newPoints, 10),
    });
    setBusy(false);
    if (rpcErr) { setError(rpcErr.message); return; }
    if (!data?.success) { setError(data?.message ?? "Something went wrong."); return; }
    setNotice(data.message);
    setNewName(""); setNewPoints("");
    await loadRewards(merchant.cafe_id);
  }

  async function setActive(r: Reward, active: boolean) {
    if (!merchant) return;
    const supabase = createClient();
    const { data } = await supabase.rpc("merchant_set_reward_active", {
      p_cafe_id: merchant.cafe_id, p_id: r.id, p_active: active,
    });
    if (data?.success) await loadRewards(merchant.cafe_id);
  }

  if (checking) {
    return <main className="flex min-h-screen items-center justify-center bg-[#f6faf9]"><p className="text-[#4A5A57]">Loading…</p></main>;
  }

  if (!signedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6faf9] px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mb-3 text-4xl">🏪</div>
          <h1 className="mb-2 text-2xl font-bold text-[#152825]">Merchant portal</h1>
          <p className="mb-6 text-sm text-[#4A5A57]">Sign in with your merchant account to view your profile and propose promotions.</p>
          <Link href="/login?next=/merchant" className="inline-block w-full rounded-lg bg-[#16B8A6] px-4 py-2.5 font-semibold text-white hover:bg-[#0A6B60]">Sign in</Link>
        </div>
      </main>
    );
  }

  if (!merchant) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6faf9] px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mb-3 text-4xl">🐾</div>
          <h1 className="mb-2 text-2xl font-bold text-[#152825]">No business linked yet</h1>
          <p className="mb-6 text-sm leading-relaxed text-[#4A5A57]">
            This account isn&apos;t linked to a verified business. If you&apos;ve applied,
            we&apos;ll call you to verify — your portal unlocks right after. Otherwise,{" "}
            <Link href="/join-merchant" className="text-[#0A6B60] underline">apply here</Link>.
          </p>
          <Link href="/" className="text-sm font-semibold text-[#0A6B60] underline">← Back home</Link>
        </div>
      </main>
    );
  }

  const live = merchant.status === "approved" && merchant.is_active;
  const badge = (r: Reward) =>
    r.approval === "pending" ? ["Pending review", "bg-[#FFF6DD] text-[#8a5a00]"]
    : r.approval === "rejected" ? ["Not approved", "bg-[#fdecec] text-[#c2413f]"]
    : r.is_active ? ["Live", "bg-[#DFF3EF] text-[#0A6B60]"]
    : ["Paused", "bg-[#eef1f0] text-[#5a6d69]"];

  return (
    <main className="min-h-screen bg-[#f6faf9] px-4 py-10">
      <div className="mx-auto max-w-xl space-y-5">
        {/* ── Profile ── */}
        <div className="rounded-2xl bg-white p-7 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-[#152825]">{merchant.name}</h1>
              <p className="mt-0.5 text-sm text-[#4A5A57]">
                {[merchant.suburb, merchant.city].filter(Boolean).join(", ")}
              </p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${live ? "bg-[#DFF3EF] text-[#0A6B60]" : "bg-[#FFF6DD] text-[#8a5a00]"}`}>
              {live ? "Trusted partner ✓" : "Verification pending"}
            </span>
          </div>
          {merchant.summary && <p className="mt-4 text-sm leading-relaxed text-[#4A5A57]">{merchant.summary}</p>}
          <div className="mt-4 space-y-1 text-sm">
            {merchant.address && <p className="text-[#4A5A57]">📍 {merchant.address}</p>}
            {merchant.website && (
              <p><a href={merchant.website.startsWith("http") ? merchant.website : `https://${merchant.website}`}
                    target="_blank" rel="noreferrer" className="font-semibold text-[#0A6B60] underline">
                🌐 {merchant.website.replace(/^https?:\/\//, "")}
              </a></p>
            )}
            {merchant.contact_name && (
              <p className="text-[#4A5A57]">
                👤 {merchant.contact_name}{merchant.contact_phone ? ` · ${merchant.contact_phone}` : ""}
                <span className="ml-1 text-xs text-[#9aa8a5]">
                  ({merchant.show_contact ? "shown on your profile" : "hidden from your profile"})
                </span>
              </p>
            )}
          </div>
          <p className="mt-4 text-xs text-[#9aa8a5]">
            Want to change your profile details? Email{" "}
            <a href="mailto:support@pawpoints.co.nz" className="underline">support@pawpoints.co.nz</a> — profile edits go live after a quick check.
          </p>
        </div>

        {/* ── Propose a promotion ── */}
        <div className="rounded-2xl bg-white p-7 shadow-sm">
          <h2 className="text-lg font-bold text-[#152825]">Propose a promotion</h2>
          <p className="mt-1 text-sm text-[#4A5A57]">
            Priced in points. Walkers earn up to 20 points a day and can hold at most 280 —
            rewards between 50 and 250 points are the sweet spot.
          </p>
          <form onSubmit={propose} className="mt-4 space-y-3">
            <input
              type="text" required minLength={3} maxLength={60}
              placeholder="e.g. Free puppuccino with any coffee"
              value={newName} onChange={(e) => setNewName(e.target.value)}
              className="w-full rounded-lg border border-[#d8e2e0] px-3 py-2 text-[#152825] focus:border-[#16B8A6] focus:outline-none"
            />
            <div className="flex gap-3">
              <input
                type="number" required min={5} max={2000}
                placeholder="Points (e.g. 150)"
                value={newPoints} onChange={(e) => setNewPoints(e.target.value)}
                className="w-40 rounded-lg border border-[#d8e2e0] px-3 py-2 text-[#152825] focus:border-[#16B8A6] focus:outline-none"
              />
              <button type="submit" disabled={busy}
                className="flex-1 rounded-lg bg-[#16B8A6] px-4 py-2 font-semibold text-white hover:bg-[#0A6B60] disabled:opacity-60">
                {busy ? "Submitting…" : "Submit for approval"}
              </button>
            </div>
            {notice && <p className="text-sm text-[#0A6B60]">{notice}</p>}
            {error && <p className="text-sm text-[#c2413f]">{error}</p>}
          </form>
        </div>

        {/* ── Your promotions ── */}
        <div className="rounded-2xl bg-white p-7 shadow-sm">
          <h2 className="text-lg font-bold text-[#152825]">Your promotions</h2>
          {rewards.length === 0 ? (
            <p className="mt-2 text-sm text-[#9aa8a5]">Nothing yet — propose your first promotion above. 🐾</p>
          ) : (
            <ul className="mt-3 divide-y divide-[#eef1f0]">
              {rewards.map((r) => {
                const [label, cls] = badge(r);
                return (
                  <li key={r.id} className="flex items-center gap-3 py-3">
                    <div className="flex-1">
                      <p className="font-semibold text-[#152825]">{r.name}</p>
                      <p className="text-sm text-[#4A5A57]">{r.points} pts</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${cls}`}>{label}</span>
                    {r.approval === "approved" && (
                      <button
                        onClick={() => setActive(r, !r.is_active)}
                        className="rounded-lg border border-[#d8e2e0] px-3 py-1.5 text-xs font-semibold text-[#4A5A57] hover:bg-[#f6faf9]"
                      >
                        {r.is_active ? "Pause" : "Resume"}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <p className="text-center text-xs text-[#9aa8a5]">
          Redemptions happen in the PawPoints app — Settings → Merchant Portal with your store code.
        </p>
      </div>
    </main>
  );
}
