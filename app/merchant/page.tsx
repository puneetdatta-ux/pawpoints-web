"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";

// Merchant portal: the signed-in owner views their business profile and
// proposes or edits rewards. Everything runs through owner-gated SECURITY
// DEFINER RPCs (get_my_merchant, merchant_list_rewards, merchant_upsert_reward,
// merchant_set_reward_active, get_reward_messages, send_reward_message) —
// proposals AND edits land approval='pending' and go live only after Puneet
// approves (site: /admin/rewards).

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
  starts_at: string | null; ends_at: string | null; terms: string | null;
  description: string | null; image_url: string | null;
};

type ReviewNote = { sender: string; message: string; created_at: string };

// Receipt rows only — the RPC never returns the walker's or dog's identity.
type Redemption = { reward_name: string; points_cost: number; redeemed_at: string; code: string };

const DEFAULT_TERMS = "*Merchant may refuse or withdraw this offer at any time.";

const fmtDate = (d: string) =>
  new Date(`${d}T00:00:00`).toLocaleDateString("en-NZ", { day: "numeric", month: "short", year: "numeric" });

export default function MerchantPortalPage() {
  const [checking, setChecking] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  // Latest note from PawPoints per reward id (only 'changes'/'rejected' rewards).
  const [notes, setNotes] = useState<Record<string, ReviewNote>>({});
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [replyBusyId, setReplyBusyId] = useState<string | null>(null);
  // Form: null = proposing a new reward, otherwise the id being edited.
  const [editId, setEditId] = useState<string | null>(null);
  const [editingLive, setEditingLive] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPoints, setNewPoints] = useState("");
  // Special terms shown to walkers under the reward — prefilled, editable.
  const [newTerms, setNewTerms] = useState(DEFAULT_TERMS);
  // Featured-card extras — with a description and photo the reward renders as
  // the featured banner in walkers' apps.
  const [newDesc, setNewDesc] = useState("");
  const [newImageUrl, setNewImageUrl] = useState<string | null>(null);
  const [uploadingImg, setUploadingImg] = useState(false);
  // Validity window — "forever" (the default) sends null dates.
  const [forever, setForever] = useState(true);
  const [starts, setStarts] = useState("");
  const [ends, setEnds] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [redemptions, setRedemptions] = useState<Redemption[]>([]);

  const loadRewards = useCallback(async (cafeId: string) => {
    const supabase = createClient();
    supabase.rpc("owner_recent_redemptions", { p_cafe_id: cafeId })
      .then(({ data: reds }) => setRedemptions(reds ?? []));
    const { data } = await supabase.rpc("merchant_list_rewards", { p_cafe_id: cafeId });
    const rows: Reward[] = data ?? [];
    setRewards(rows);
    // Pull PawPoints' latest note for rewards that need attention (usually 0–2).
    const needing = rows.filter((r) => r.approval === "changes" || r.approval === "rejected");
    const entries = await Promise.all(needing.map(async (r) => {
      const { data: msgs } = await supabase.rpc("get_reward_messages", { p_reward_id: r.id });
      const admin = (msgs ?? []).filter((m: ReviewNote) => m.sender === "admin");
      return [r.id, admin[admin.length - 1] ?? null] as const;
    }));
    const next: Record<string, ReviewNote> = {};
    for (const [id, note] of entries) if (note) next[id] = note;
    setNotes(next);
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

  function resetForm() {
    setEditId(null); setEditingLive(false);
    setNewName(""); setNewPoints(""); setNewTerms(DEFAULT_TERMS);
    setNewDesc(""); setNewImageUrl(null);
    setForever(true); setStarts(""); setEnds("");
    setNotice(null); setError(null);
  }

  function startEdit(r: Reward) {
    setEditId(r.id);
    setEditingLive(r.approval === "approved" && r.is_active);
    setNewName(r.name);
    setNewPoints(String(r.points));
    setNewTerms(r.terms ?? "");
    setNewDesc(r.description ?? "");
    setNewImageUrl(r.image_url ?? null);
    setForever(!r.starts_at && !r.ends_at);
    setStarts(r.starts_at ?? "");
    setEnds(r.ends_at ?? "");
    setNotice(null); setError(null);
    document.getElementById("rw-name")?.focus();
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!merchant) return;
    setNotice(null); setError(null);
    const pStarts = forever ? null : (starts || null);
    const pEnds = forever ? null : (ends || null);
    if (pStarts && pEnds && pEnds < pStarts) {
      setError("The end date must be on or after the start date.");
      return;
    }
    const today = new Date().toLocaleDateString("en-CA"); // yyyy-mm-dd, local time
    if (pEnds && pEnds < today) {
      setError("The end date is already in the past.");
      return;
    }
    setBusy(true);
    const supabase = createClient();
    const { data, error: rpcErr } = await supabase.rpc("merchant_upsert_reward", {
      p_cafe_id: merchant.cafe_id, p_id: editId,
      p_name: newName.trim(), p_points: parseInt(newPoints, 10),
      p_starts: pStarts, p_ends: pEnds,
      p_terms: newTerms.trim() || null,
      p_description: newDesc.trim() || null,
      p_image_url: newImageUrl,
    });
    setBusy(false);
    if (rpcErr) { setError(rpcErr.message); return; }
    if (!data?.success) { setError(data?.message ?? "We couldn't send that for review. Check your connection and try again."); return; }
    resetForm();
    setNotice(data.message);
    await loadRewards(merchant.cafe_id);
  }

  // Shrink to the promo budget (≤800px, heavy jpeg — it sits under a dark
  // scrim in the app) and upload to the public reward-images bucket.
  async function uploadImage(file: File) {
    if (!merchant) return;
    setError(null); setUploadingImg(true);
    try {
      const bmp = await createImageBitmap(file);
      const scale = Math.min(1, 800 / bmp.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(bmp.width * scale);
      canvas.height = Math.round(bmp.height * scale);
      canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
      const blob: Blob = await new Promise((res, rej) =>
        canvas.toBlob((b) => (b ? res(b) : rej(new Error("encode failed"))), "image/jpeg", 0.6));
      const supabase = createClient();
      const path = `${merchant.cafe_id}/${Date.now()}.jpg`;
      const { error: upErr } = await supabase.storage
        .from("reward-images").upload(path, blob, { contentType: "image/jpeg" });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("reward-images").getPublicUrl(path);
      setNewImageUrl(pub?.publicUrl ?? null);
    } catch {
      setError("The photo didn't upload. Try a different image.");
    } finally {
      setUploadingImg(false);
    }
  }

  async function setActive(r: Reward, active: boolean) {
    if (!merchant) return;
    setError(null);
    const supabase = createClient();
    const { data, error: rpcErr } = await supabase.rpc("merchant_set_reward_active", {
      p_cafe_id: merchant.cafe_id, p_id: r.id, p_active: active,
    });
    // Never fail silently — a Pause that quietly does nothing leaves a live
    // reward the merchant believes is off.
    if (rpcErr || !data?.success) {
      setError(data?.message ?? `We couldn't ${active ? "resume" : "pause"} that reward. Try again in a moment.`);
      return;
    }
    await loadRewards(merchant.cafe_id);
  }

  async function sendReply(r: Reward) {
    if (!merchant) return;
    const msg = (replyDrafts[r.id] ?? "").trim();
    if (!msg) return;
    setReplyBusyId(r.id); setError(null);
    const supabase = createClient();
    const { data, error: rpcErr } = await supabase.rpc("send_reward_message", {
      p_reward_id: r.id, p_message: msg,
    });
    setReplyBusyId(null);
    if (rpcErr || !data?.success) {
      setError(data?.message ?? "We couldn't send that reply. Try again in a moment.");
      return;
    }
    setReplyDrafts((d) => ({ ...d, [r.id]: "" }));
    setNotice("Reply sent to PawPoints.");
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
          <p className="mb-6 text-sm text-[#4A5A57]">Sign in with your merchant account to view your profile and propose rewards.</p>
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
  // Status naming matches the app's reward cards: Live / Paused / In review /
  // Changes asked / Not approved.
  const badge = (r: Reward) =>
    r.approval === "pending" ? ["In review", "bg-[#FFF6DD] text-[#8a5a00]"]
    : r.approval === "changes" ? ["Changes asked", "bg-[#FFF6DD] text-[#8a5a00]"]
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

        {/* ── Add / edit a reward ── */}
        <div className="rounded-2xl bg-white p-7 shadow-sm">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-lg font-bold text-[#152825]">{editId ? "Edit reward" : "Add a reward"}</h2>
            {editId && (
              <button type="button" onClick={resetForm} className="text-sm font-semibold text-[#0A6B60] underline">
                Cancel edit
              </button>
            )}
          </div>
          <p className="mt-1 text-sm text-[#4A5A57]">
            Priced in points. Walkers earn up to 20 points a day and can hold up to 1,000 —
            rewards between 50 and 500 points are the sweet spot.
          </p>
          {editId && editingLive && (
            <p className="mt-2 rounded-lg bg-[#FFF6DD] px-3 py-2 text-sm text-[#8a5a00]">
              Saving takes this reward off walkers&apos; phones until PawPoints approves the change.
            </p>
          )}
          <form onSubmit={submit} className="mt-4 space-y-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-[#9aa8a5]" htmlFor="rw-name">
                What the walker gets
              </label>
              <input
                id="rw-name" type="text" required minLength={3} maxLength={200}
                placeholder="e.g. 20% off any coffee"
                value={newName} onChange={(e) => setNewName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#d8e2e0] px-3 py-2 text-[#152825] focus:border-[#16B8A6] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-[#9aa8a5]" htmlFor="rw-desc">
                One line about the offer (optional)
              </label>
              <input
                id="rw-desc" type="text" maxLength={200}
                placeholder="e.g. Up to 45 minutes, one-on-one."
                value={newDesc} onChange={(e) => setNewDesc(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#d8e2e0] px-3 py-2 text-[#152825] focus:border-[#16B8A6] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-[#9aa8a5]" htmlFor="rw-photo">
                Photo (optional)
              </label>
              {newImageUrl ? (
                <div className="mt-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={newImageUrl} alt="Reward photo" className="h-28 w-full rounded-lg object-cover" />
                  <button type="button" onClick={() => setNewImageUrl(null)}
                    className="mt-1 text-xs font-semibold text-[#c2413f] underline">
                    Remove photo
                  </button>
                </div>
              ) : (
                <input
                  id="rw-photo" type="file" accept="image/*" disabled={uploadingImg}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f); e.target.value = ""; }}
                  className="mt-1 w-full text-sm text-[#4A5A57] file:mr-3 file:rounded-lg file:border-0 file:bg-[#DFF3EF] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-[#0A6B60]"
                />
              )}
              {uploadingImg && <p className="mt-1 text-xs text-[#9aa8a5]">Uploading…</p>}
              <p className="mt-1 text-xs text-[#9aa8a5]">
                With a description and photo, your reward shows as a featured banner in walkers&apos; apps.
              </p>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-[#9aa8a5]">
                Special terms (shown to walkers)
              </label>
              <textarea
                maxLength={200} rows={2}
                value={newTerms} onChange={(e) => setNewTerms(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#d8e2e0] px-3 py-2 text-sm text-[#152825] focus:border-[#16B8A6] focus:outline-none"
              />
              <p className="mt-1 text-xs text-[#9aa8a5]">
                Approved offers appear in the Rewards tab and may be featured in
                walkers&apos; feeds — currently up to twice a week (merchant terms,
                clause 2).
              </p>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm text-[#4A5A57]">
                <input
                  type="checkbox" checked={forever}
                  onChange={(e) => setForever(e.target.checked)}
                  className="h-4 w-4 accent-[#16B8A6]"
                />
                Offer valid forever
              </label>
              {!forever && (
                <div className="mt-2 flex gap-3">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-[#9aa8a5]" htmlFor="rw-starts">
                      Starts
                    </label>
                    <input
                      id="rw-starts" type="date"
                      value={starts} onChange={(e) => setStarts(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-[#d8e2e0] px-3 py-2 text-sm text-[#152825] focus:border-[#16B8A6] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-[#9aa8a5]" htmlFor="rw-ends">
                      Ends
                    </label>
                    <input
                      id="rw-ends" type="date"
                      value={ends} onChange={(e) => setEnds(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-[#d8e2e0] px-3 py-2 text-sm text-[#152825] focus:border-[#16B8A6] focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-[#9aa8a5]" htmlFor="rw-points">
                  Points
                </label>
                <input
                  id="rw-points" type="number" required min={5} max={2000}
                  placeholder="150"
                  value={newPoints} onChange={(e) => setNewPoints(e.target.value)}
                  className="mt-1 w-40 rounded-lg border border-[#d8e2e0] px-3 py-2 text-[#152825] focus:border-[#16B8A6] focus:outline-none"
                />
              </div>
              <button type="submit" disabled={busy}
                className="flex-1 self-end rounded-lg bg-[#16B8A6] px-4 py-2 font-semibold text-white hover:bg-[#0A6B60] disabled:opacity-60">
                {busy ? "Sending…" : "Send for review"}
              </button>
            </div>
            {notice && <p className="text-sm text-[#0A6B60]">{notice}</p>}
            {error && <p className="text-sm text-[#c2413f]">{error}</p>}
          </form>
        </div>

        {/* ── Your rewards ── */}
        <div className="rounded-2xl bg-white p-7 shadow-sm">
          <h2 className="text-lg font-bold text-[#152825]">Your rewards</h2>
          {rewards.length === 0 ? (
            <p className="mt-2 text-sm text-[#9aa8a5]">Nothing yet — add your first reward above. 🐾</p>
          ) : (
            <ul className="mt-3 divide-y divide-[#eef1f0]">
              {rewards.map((r) => {
                const [label, cls] = badge(r);
                const note = notes[r.id];
                return (
                  <li key={r.id} className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="font-semibold text-[#152825]">{r.name}</p>
                        <p className="text-sm text-[#4A5A57]">
                          {r.points} pts
                          {(r.starts_at || r.ends_at) && (
                            <span className="ml-2 text-xs text-[#9aa8a5]">
                              {r.starts_at ? fmtDate(r.starts_at) : "Now"} – {r.ends_at ? fmtDate(r.ends_at) : "ongoing"}
                            </span>
                          )}
                        </p>
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
                      <button
                        onClick={() => startEdit(r)}
                        className="rounded-lg border border-[#d8e2e0] px-3 py-1.5 text-xs font-semibold text-[#4A5A57] hover:bg-[#f6faf9]"
                      >
                        Edit
                      </button>
                    </div>
                    {(r.approval === "changes" || r.approval === "rejected") && (
                      <div className="mt-2 rounded-lg bg-[#FFF6DD] px-3 py-2">
                        <p className="text-sm text-[#8a5a00]">
                          {note ? <>PawPoints: &ldquo;{note.message}&rdquo;</> : "PawPoints asked for a change — edit and resubmit."}
                        </p>
                        <div className="mt-2 flex gap-2">
                          <input
                            type="text" maxLength={500}
                            placeholder="Reply to PawPoints…"
                            value={replyDrafts[r.id] ?? ""}
                            onChange={(e) => setReplyDrafts((d) => ({ ...d, [r.id]: e.target.value }))}
                            className="w-full flex-1 rounded-lg border border-[#e8d9a8] bg-white px-3 py-1.5 text-sm text-[#152825] focus:border-[#16B8A6] focus:outline-none"
                          />
                          <button
                            onClick={() => sendReply(r)}
                            disabled={replyBusyId === r.id || !(replyDrafts[r.id] ?? "").trim()}
                            className="rounded-lg bg-[#16B8A6] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0A6B60] disabled:opacity-60"
                          >
                            {replyBusyId === r.id ? "Sending…" : "Reply"}
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* ── Recent redemptions ── */}
        <div className="rounded-2xl bg-white p-7 shadow-sm">
          <h2 className="text-lg font-bold text-[#152825]">Recent redemptions</h2>
          <p className="mt-1 text-sm text-[#4A5A57]">
            The last 14 days. Walkers stay anonymous — you see the reward, points and receipt code only.
          </p>
          {redemptions.length === 0 ? (
            <p className="mt-4 text-sm text-[#9aa8a5]">No redemptions in the last 14 days. 🐾</p>
          ) : (
            <ul className="mt-3 divide-y divide-[#eef1f0]">
              {redemptions.map((r) => (
                <li key={r.code + r.redeemed_at} className="flex items-baseline justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#152825]">{r.reward_name}</p>
                    <p className="text-xs text-[#9aa8a5]">
                      {new Date(r.redeemed_at).toLocaleString("en-NZ", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      {" · RCPT "}{r.code}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-[#0A6B60]">−{r.points_cost} pts</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="text-center text-xs text-[#9aa8a5]">
          Taking a redemption happens in the PawPoints app — Settings → Merchant Portal with your store code.
        </p>
      </div>
    </main>
  );
}
