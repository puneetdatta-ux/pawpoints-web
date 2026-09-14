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

  // admin_approve_application does the whole go-live in one transaction:
  // merchants row, owner link in merchant_operators, trial subscription,
  // application marked approved. Returns the new cafe_id.
  const supabase = createAdminClient();
  const { data: cafeId, error } = await supabase.rpc("admin_approve_application", {
    app_id: id,
  });

  if (error || !cafeId) {
    console.error("approve failed", error);
    return page("Something went wrong", "Could not approve — check the application in Supabase.", 500);
  }
  return page(
    "Merchant approved and live!",
    `They're now on the app's merchant screen (cafe id: ${cafeId}), the owner account is linked,
     and the two-month free trial has started. Address and map location can be added in Supabase
     when you have them.`
  );
}
