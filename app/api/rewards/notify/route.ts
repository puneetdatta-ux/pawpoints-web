import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendFounderEmail } from "@/lib/admin/mailer";
import { signApproval } from "@/lib/admin/sign";

// Target of a Supabase Database Webhook on merchant_rewards (INSERT and
// UPDATE): whenever a reward lands in the review queue, email the founder
// the details with one-click approve/reject links. The webhook must send
// the shared secret in an x-webhook-secret header; the row is re-read
// server-side and review_notified_at makes repeat deliveries no-ops.
export async function POST(request: NextRequest) {
  if (request.headers.get("x-webhook-secret") !== process.env.REWARDS_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let recordId: unknown;
  try {
    const payload = await request.json();
    recordId = payload?.record?.id;
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  if (typeof recordId !== "string" || !/^[0-9a-f-]{36}$/i.test(recordId)) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: reward } = await supabase
    .from("merchant_rewards")
    .select("*")
    .eq("id", recordId)
    .eq("approval", "pending")
    .is("review_notified_at", null)
    .single();
  if (!reward) return NextResponse.json({ ok: true }); // not pending, or already notified

  const { data: merchant } = await supabase
    .from("merchants")
    .select("name, city")
    .eq("cafe_id", reward.cafe_id)
    .single();

  const esc = (s: unknown) =>
    String(s ?? "—").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const link = (action: "approve" | "reject") =>
    `${request.nextUrl.origin}/api/rewards/review?id=${reward.id}&action=${action}&sig=${signApproval(`${action}:${reward.id}`)}`;
  const points = Number(reward.points ?? reward.points_cost ?? 0);

  // Full offer as the walker will see it (founder request 2026-09-16):
  // description, terms, validity window and the merchant's photo.
  const fmtDate = (d: unknown) =>
    d ? new Date(String(d)).toLocaleDateString("en-NZ", { day: "numeric", month: "short", year: "numeric" }) : null;
  const validity =
    reward.starts_at || reward.ends_at
      ? `${fmtDate(reward.starts_at) ?? "now"} → ${fmtDate(reward.ends_at) ?? "no end date"}`
      : "Always on (no dates)";
  const imageUrl = typeof reward.image_url === "string" && /^https:\/\//.test(reward.image_url) ? reward.image_url : null;
  const detail = (label: string, value: unknown) =>
    `<tr><td style="font-weight:bold;vertical-align:top;padding:6px 12px 6px 0;white-space:nowrap">${esc(label)}</td>
         <td style="padding:6px 0;white-space:pre-wrap">${esc(value)}</td></tr>`;

  const html = `
    <h2>🎁 New reward for review: ${esc(reward.reward_name ?? reward.name)}</h2>
    <p><b>${esc(merchant?.name ?? reward.cafe_id)}</b>${merchant?.city ? ` · ${esc(merchant.city)}` : ""}
       · <b>${esc(points)} points</b></p>
    ${points > 1000 ? `<p style="color:#c2413f"><b>⚠ Above the 1,000-point wallet cap — no walker can ever hold enough to redeem it.</b></p>` : ""}
    ${imageUrl
      ? `<p><img src="${esc(imageUrl)}" alt="Reward photo" width="320"
           style="max-width:100%;border-radius:12px;display:block"></p>`
      : `<p style="color:#888;font-size:13px">No photo attached.</p>`}
    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;max-width:560px">
      ${detail("Description", reward.description || "—")}
      ${detail("Terms", reward.terms || "—")}
      ${detail("Valid", validity)}
    </table>
    <p style="color:#888;font-size:12px">This is the full offer exactly as walkers will see it.</p>
    <p>
      <a href="${link("approve")}" style="display:inline-block;background:#16B8A6;color:#fff;
        padding:12px 24px;border-radius:8px;font-weight:bold;text-decoration:none">Approve</a>
      &nbsp;
      <a href="${link("reject")}" style="display:inline-block;background:#fff;color:#c2413f;
        border:1px solid #e8b4b2;padding:12px 24px;border-radius:8px;font-weight:bold;
        text-decoration:none">Reject</a>
    </p>
    <p style="color:#888;font-size:12px">Approving puts the reward live in walkers' apps
    immediately. The full queue is at ${esc(request.nextUrl.origin)}/admin/rewards.</p>`;

  try {
    await sendFounderEmail(
      `Reward to review: ${reward.reward_name ?? reward.name} (${merchant?.name ?? reward.cafe_id})`,
      html
    );
  } catch (e) {
    console.error("reward alert failed", e);
    return NextResponse.json({ error: "send failed" }, { status: 500 });
  }

  await supabase
    .from("merchant_rewards")
    .update({ review_notified_at: new Date().toISOString() })
    .eq("id", recordId);
  return NextResponse.json({ ok: true });
}
