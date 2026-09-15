import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyApproval } from "@/lib/admin/sign";

// Review targets for the reward-review email.
//   GET  ?action=approve → one click: live immediately.
//   GET  ?action=reject  → a small form asking WHY (founder request
//                          2026-09-15); nothing changes until it's submitted.
//   POST (from that form) → rejected + the reason saved to the reward's
//                          message thread.
// The merchant's email (approved / rejected + reason) is NOT sent from here:
// the pp_notify_reward_verdict database trigger sends it on commit, so it
// fires identically whether the founder decides here, in the app's Settings
// queue, or on /admin/rewards.
// Calls the same admin_review_reward RPC as the /admin/rewards queue — its
// admin check only applies to signed-in users, so the service role (no
// auth.uid()) passes, and the HMAC link is this route's security boundary.

const escapeHtml = (s: unknown) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string
  );

const page = (icon: string, title: string, body: string, status = 200) =>
  new Response(
    `<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1">
    <body style="font-family:system-ui;background:#f6faf9;display:flex;justify-content:center;padding:40px 16px;margin:0">
    <div style="background:#fff;border-radius:16px;padding:32px;max-width:440px;width:100%;text-align:center">
    <div style="font-size:40px">${icon}</div><h1 style="color:#152825;font-size:22px">${title}</h1>
    ${body}</div></body>`,
    { status, headers: { "content-type": "text/html; charset=utf-8" } }
  );

const valid = (id: string, action: string, sig: string) =>
  /^[0-9a-f-]{36}$/i.test(id) &&
  (action === "approve" || action === "reject") &&
  verifyApproval(`${action}:${id}`, sig);

async function rewardContext(id: string) {
  const supabase = createAdminClient();
  const { data: reward } = await supabase
    .from("merchant_rewards")
    .select("id, name, points, cafe_id")
    .eq("id", id)
    .maybeSingle();
  if (!reward) return null;
  const { data: merchant } = await supabase
    .from("merchants")
    .select("name")
    .eq("cafe_id", reward.cafe_id)
    .maybeSingle();
  return { reward, merchantName: merchant?.name ?? reward.cafe_id };
}

async function decide(id: string, verdict: "approve" | "reject", message: string | null) {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("admin_review_reward", {
    p_id: id,
    p_verdict: verdict,
    p_message: message,
  });
  // The RPC reports refusals as "REJECTED: ..." strings rather than errors;
  // a reject's own success echo is "REJECTED: <name>", so only treat it as a
  // failure when approving.
  if (error || (verdict === "approve" && typeof data === "string" && data.startsWith("REJECTED:"))) {
    throw new Error(error?.message ?? String(data));
  }
}

const notFound = () =>
  page("🤔", "Reward not found", `<p style="color:#4A5A57">It may have been deleted by the merchant.</p>`, 404);
const badLink = () =>
  page("🔒", "Link not valid", `<p style="color:#4A5A57">This review link is invalid or has been tampered with.</p>`, 403);
const failed = (e: unknown) =>
  page("⚠️", "Something went wrong", `<p style="color:#4A5A57">Could not update — ${escapeHtml((e as Error).message)}. Use the queue at /admin/rewards.</p>`, 500);

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id") ?? "";
  const action = request.nextUrl.searchParams.get("action") ?? "";
  const sig = request.nextUrl.searchParams.get("sig") ?? "";
  if (!valid(id, action, sig)) return badLink();

  const ctx = await rewardContext(id);
  if (!ctx) return notFound();
  const name = escapeHtml(ctx.reward.name);

  if (action === "reject") {
    // Ask for the reason before anything changes.
    return page(
      "✍️",
      `Reject “${name}”?`,
      `<p style="color:#4A5A57;text-align:left">Tell <b>${escapeHtml(ctx.merchantName)}</b> why — this goes to them by email
         and appears in the reward's message thread in their portal.</p>
       <form method="post" style="text-align:left">
         <input type="hidden" name="id" value="${escapeHtml(id)}">
         <input type="hidden" name="sig" value="${escapeHtml(sig)}">
         <textarea name="reason" required minlength="5" maxlength="500" rows="5"
           placeholder="e.g. Points are too high for what's offered — a 200–300 point reward would be redeemed far more often."
           style="width:100%;box-sizing:border-box;padding:12px;border:1px solid #d8e2e0;border-radius:10px;font:inherit"></textarea>
         <button type="submit" style="margin-top:14px;width:100%;background:#c2413f;color:#fff;border:0;
           padding:14px;border-radius:10px;font-weight:bold;font-size:16px">Reject and send reason</button>
       </form>
       <p style="color:#888;font-size:12px;margin-top:14px">Changed your mind? Just close this page — nothing has been changed.</p>`
    );
  }

  try {
    await decide(id, "approve", null);
  } catch (e) {
    return failed(e);
  }
  return page(
    "🎁",
    "Reward approved!",
    `<p style="color:#4A5A57"><b>${name}</b> is live in walkers' apps now. ${escapeHtml(ctx.merchantName)} is being emailed.</p>`
  );
}

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const id = String(form.get("id") ?? "");
  const sig = String(form.get("sig") ?? "");
  const reason = String(form.get("reason") ?? "").trim();
  if (!valid(id, "reject", sig)) return badLink();
  if (reason.length < 5 || reason.length > 500) {
    return page("✍️", "Reason needed", `<p style="color:#4A5A57">Please go back and give the merchant a short reason (5–500 characters).</p>`, 400);
  }

  const ctx = await rewardContext(id);
  if (!ctx) return notFound();

  try {
    await decide(id, "reject", reason);
  } catch (e) {
    return failed(e);
  }
  return page(
    "📨",
    "Reward rejected",
    `<p style="color:#4A5A57"><b>${escapeHtml(ctx.reward.name)}</b> is marked rejected. Your reason is saved to its message thread and is being emailed to ${escapeHtml(ctx.merchantName)}.</p>`
  );
}
