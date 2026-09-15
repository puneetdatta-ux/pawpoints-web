"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";

// Founder-only review queue: approve, suggest changes on, or reject
// merchant-proposed rewards on the website instead of the SQL editor. Both
// RPCs are admin-gated server-side (app_admins) — non-admins get empty
// results and failed writes, so this page is a convenience, not the
// security boundary.

type Pending = {
  id: string; cafe_id: string; cafe_name: string;
  reward_name: string; points: number; submitted_at: string;
  starts_at: string | null; ends_at: string | null;
};

type Verdict = "approve" | "changes" | "reject";

const fmtDate = (d: string) =>
  new Date(`${d}T00:00:00`).toLocaleDateString("en-NZ", { day: "numeric", month: "short", year: "numeric" });

export default function AdminRewardsPage() {
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pending, setPending] = useState<Pending[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  // Per-row armed verdict: 'changes'/'reject' opens the note field before
  // submitting; approve fires straight away.
  const [armed, setArmed] = useState<{ id: string; verdict: "changes" | "reject" } | null>(null);
  const [note, setNote] = useState("");

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

  async function review(r: Pending, verdict: Verdict, message: string | null) {
    setBusyId(r.id);
    const supabase = createClient();
    // Production signature: (p_id, p_verdict 'approve'|'changes'|'reject', p_message).
    const { data, error } = await supabase.rpc("admin_review_reward", {
      p_id: r.id, p_verdict: verdict, p_message: message,
    });
    setBusyId(null);
    // The RPC returns terse log text (e.g. "APPROVED + LIVE: X") — translate
    // to plain sentences. A reject's success echo is "REJECTED: <name>"
    // exactly; anything else starting with REJECTED is a server refusal.
    const ok = !error && typeof data === "string" && (
      (verdict === "approve" && data.startsWith("APPROVED")) ||
      (verdict === "changes" && data.startsWith("CHANGES SUGGESTED")) ||
      (verdict === "reject" && data === `REJECTED: ${r.reward_name}`)
    );
    const line = !ok
      ? "Couldn't submit that — try again."
      : verdict === "approve" ? `Approved '${r.reward_name}' — now live.`
      : verdict === "changes" ? `Asked for changes on '${r.reward_name}'.`
      : `Rejected '${r.reward_name}'.`;
    setLog((l) => [line, ...l].slice(0, 8));
    if (ok) { setArmed(null); setNote(""); }
    await refresh();
  }

  function arm(r: Pending, verdict: "changes" | "reject") {
    if (armed?.id === r.id && armed.verdict === verdict) { setArmed(null); setNote(""); return; }
    setArmed({ id: r.id, verdict });
    setNote("");
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
            Sign in with a PawPoints admin account to review rewards.
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
          <h1 className="text-2xl font-bold text-[#152825]">Reward review</h1>
          <p className="mt-1 text-sm text-[#4A5A57]">
            Approving puts the reward live in walkers&apos; apps immediately.
          </p>

          {pending.length === 0 ? (
            <p className="mt-5 text-sm text-[#9aa8a5]">Queue&apos;s empty — nothing waiting. 🐾</p>
          ) : (
            <ul className="mt-4 divide-y divide-[#eef1f0]">
              {pending.map((r) => {
                const isArmed = armed?.id === r.id ? armed.verdict : null;
                return (
                  <li key={r.id} className="py-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-semibold text-[#152825]">{r.reward_name}</p>
                        <p className="text-sm text-[#4A5A57]">
                          {r.cafe_name} · <b>{r.points} pts</b> ·{" "}
                          {new Date(r.submitted_at).toLocaleString("en-NZ")}
                        </p>
                        {(r.starts_at || r.ends_at) && (
                          <p className="text-xs text-[#4A5A57]">
                            Valid {r.starts_at ? fmtDate(r.starts_at) : "now"} – {r.ends_at ? fmtDate(r.ends_at) : "ongoing"}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => review(r, "approve", null)}
                          disabled={busyId === r.id}
                          className="rounded-lg bg-[#16B8A6] px-3 py-2 text-sm font-bold text-white hover:bg-[#0A6B60] disabled:opacity-60"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => arm(r, "changes")}
                          disabled={busyId === r.id}
                          className={`rounded-lg border px-3 py-2 text-sm font-bold disabled:opacity-60 ${
                            isArmed === "changes"
                              ? "border-[#8a5a00] bg-[#FFF6DD] text-[#8a5a00]"
                              : "border-[#e8d9a8] text-[#8a5a00] hover:bg-[#FFF6DD]"
                          }`}
                        >
                          Suggest changes
                        </button>
                        <button
                          onClick={() => arm(r, "reject")}
                          disabled={busyId === r.id}
                          className={`rounded-lg border px-3 py-2 text-sm font-bold disabled:opacity-60 ${
                            isArmed === "reject"
                              ? "border-[#c2413f] bg-[#fdecec] text-[#c2413f]"
                              : "border-[#e8b4b2] text-[#c2413f] hover:bg-[#fdecec]"
                          }`}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                    {isArmed && (
                      <div className="mt-3">
                        <textarea
                          rows={2} maxLength={500} autoFocus
                          placeholder={isArmed === "changes"
                            ? "What should the merchant change? (they'll see this)"
                            : "Optional note to the merchant"}
                          value={note} onChange={(e) => setNote(e.target.value)}
                          className="w-full rounded-lg border border-[#d8e2e0] px-3 py-2 text-sm text-[#152825] focus:border-[#16B8A6] focus:outline-none"
                        />
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            onClick={() => review(r, isArmed, note.trim() || null)}
                            disabled={busyId === r.id || (isArmed === "changes" && !note.trim())}
                            className={`rounded-lg px-4 py-2 text-sm font-bold text-white disabled:opacity-60 ${
                              isArmed === "changes" ? "bg-[#8a5a00] hover:bg-[#6d4700]" : "bg-[#c2413f] hover:bg-[#a53331]"
                            }`}
                          >
                            {busyId === r.id ? "Sending…"
                              : isArmed === "changes" ? "Send suggestion" : "Confirm reject"}
                          </button>
                          <button
                            onClick={() => { setArmed(null); setNote(""); }}
                            className="text-sm font-semibold text-[#4A5A57] underline"
                          >
                            Cancel
                          </button>
                          {isArmed === "changes" && !note.trim() && (
                            <span className="text-xs text-[#9aa8a5]">A note is required for change suggestions.</span>
                          )}
                        </div>
                      </div>
                    )}
                    {r.points > 1000 && (
                      <p className="mt-2 text-xs font-semibold text-[#c2413f]">
                        ⚠ Above the 1,000-point wallet cap — unredeemable as priced.
                      </p>
                    )}
                    {r.points > 750 && r.points <= 1000 && (
                      <p className="mt-2 text-xs text-[#8a5a00]">
                        Big-ticket reward — needs a long saving streak to reach.
                      </p>
                    )}
                  </li>
                );
              })}
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
