import { createAdminClient } from "@/lib/supabase/admin";

// Emails TO merchants (reward verdicts) go out through Resend from the same
// hello@ identity as auth and store-code emails — never through the founder's
// Gmail SMTP. Needs RESEND_API_KEY in the host env.
const RESEND_URL = "https://api.resend.com/emails";

export function escapeHtml(s: unknown) {
  return String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string
  );
}

/** The active owner's email for a store, via merchant_operators → auth. */
export async function merchantOwnerEmail(cafeId: string): Promise<string | null> {
  const supabase = createAdminClient();
  const { data: op } = await supabase
    .from("merchant_operators")
    .select("user_id")
    .eq("cafe_id", cafeId)
    .eq("role", "owner")
    .eq("status", "active")
    .limit(1)
    .maybeSingle();
  if (!op?.user_id) return null;
  const { data } = await supabase.auth.admin.getUserById(op.user_id);
  return data?.user?.email ?? null;
}

export async function sendMerchantEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");
  const res = await fetch(RESEND_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ from: "PawPoints <hello@pawpoints.co.nz>", to: [to], subject, html }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

export function wrap(title: string, body: string) {
  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
      <h2 style="color:#0A6B60">${escapeHtml(title)}</h2>
      ${body}
      <p style="color:#5a6d69;font-size:13px;margin-top:28px">PawPoints · Auckland, New Zealand · reply to this email to reach us</p>
    </div>`;
}
