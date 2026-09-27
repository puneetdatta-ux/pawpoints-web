import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyApproval } from "@/lib/admin/sign";

// One-click approve target for the founder alert email. The HMAC signature
// means only the emailed link works — the id alone is not enough.
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id") ?? "";
  const sig = request.nextUrl.searchParams.get("sig") ?? "";

  const page = (title: string, body: string, status = 200) =>
    new Response(
      `<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1">
      <body style="font-family:system-ui;background:#f6faf9;display:flex;justify-content:center;padding:40px 16px">
      <div style="background:#fff;border-radius:16px;padding:32px;max-width:420px;text-align:center">
      <div style="font-size:40px">🐾</div><h1 style="color:#152825">${title}</h1>
      <p style="color:#4A5A57">${body}</p></div></body>`,
      { status, headers: { "content-type": "text/html; charset=utf-8" } }
    );

  if (!/^[0-9a-f-]{36}$/i.test(id) || !verifyApproval(id, sig)) {
    return page("Link not valid", "This approve link is invalid or has been tampered with.", 403);
  }

  // admin_approve_application (unified 2026-09-15, canonical SQL in the app
  // repo's migrations/) does the whole go-live in one transaction: merchants
  // row, owner link, trial subscription, application marked approved, and it
  // emails the merchant their store code. Returns jsonb:
  //   { success, cafe_id, store_code, owner_linked, email_queued }
  //   or { success, already_approved: true, cafe_id } on a second click.
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("admin_approve_application", {
    app_id: id,
  });
  const result = (data ?? null) as null | {
    success?: boolean; cafe_id?: string; store_code?: string;
    owner_linked?: boolean; email_queued?: boolean; already_approved?: boolean;
  };

  if (error || !result?.cafe_id) {
    console.error("approve failed", error);
    return page("Something went wrong", "Could not approve — check the application in Supabase.", 500);
  }
  if (result.already_approved) {
    return page("Already approved", `This application was approved earlier (cafe id: ${result.cafe_id}). Nothing changed.`);
  }
  return page(
    "Merchant approved and live!",
    `They're now on the app's merchant screen (cafe id: ${result.cafe_id}).
     Store code <strong>${result.store_code}</strong>${result.email_queued ? " has been emailed to them" : " — no email on file, send it yourself"}.
     Owner account ${result.owner_linked ? "linked — Merchant tools works for them already" : "not linked yet — they'll link automatically by signing up with the same email"}.
     Joining is free, no fixed term. Address and map location can be added in Supabase when you have them.`
  );
}
