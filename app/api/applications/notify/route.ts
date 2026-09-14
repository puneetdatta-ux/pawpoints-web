import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendFounderEmail } from "@/lib/admin/mailer";
import { signApproval } from "@/lib/admin/sign";

// Called by the merchant sign-up page right after an application row is
// inserted. Re-reads the row server-side (so a forged request can't invent
// content) and emails the founder every field plus a one-click approve link.
// notified_at makes it idempotent — repeat calls for the same row are no-ops.
export async function POST(request: NextRequest) {
  let id: unknown;
  try {
    ({ id } = await request.json());
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  if (typeof id !== "string" || !/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: app } = await supabase
    .from("merchant_applications")
    .select("*")
    .eq("id", id)
    .is("notified_at", null)
    .single();
  if (!app) return NextResponse.json({ ok: true }); // unknown or already notified

  const esc = (s: unknown) =>
    String(s ?? "—").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const approveUrl = `${request.nextUrl.origin}/api/applications/approve?id=${app.id}&sig=${signApproval(app.id)}`;

  const rows: [string, unknown][] = [
    ["Business", app.business_name],
    ["Contact", app.contact_name],
    ["Email", app.email],
    ["Phone", app.phone],
    ["City", app.city],
    ["Website", app.website],
    ["Show contact publicly", app.show_contact ? "Yes" : "No"],
    ["About", app.summary],
  ];
  const html = `
    <h2>🐾 New merchant application: ${esc(app.business_name)}</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="font-weight:bold;vertical-align:top">${esc(k)}</td><td>${esc(v)}</td></tr>`
        )
        .join("")}
    </table>
    <p>Call ${esc(app.contact_name)} on ${esc(app.phone)} to verify, then:</p>
    <p><a href="${approveUrl}"
      style="display:inline-block;background:#16B8A6;color:#fff;padding:12px 24px;
      border-radius:8px;font-weight:bold;text-decoration:none">Approve ${esc(app.business_name)}</a></p>
    <p style="color:#888;font-size:12px">Approving marks the application approved in the
    database. Only click after the phone verification.</p>`;

  try {
    await sendFounderEmail(`New merchant application: ${app.business_name}`, html);
  } catch (e) {
    console.error("founder alert failed", e);
    return NextResponse.json({ error: "send failed" }, { status: 500 });
  }

  await supabase
    .from("merchant_applications")
    .update({ notified_at: new Date().toISOString() })
    .eq("id", id);
  return NextResponse.json({ ok: true });
}
