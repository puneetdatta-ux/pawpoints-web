import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyApproval } from "@/lib/admin/sign";

// One-click approve/reject target for the reward-review email. Calls the
// same admin_review_reward RPC as the /admin/rewards queue — its admin
// check only applies to signed-in users, so the service role (no
// auth.uid()) passes, and the HMAC link is this route's security boundary.
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id") ?? "";
  const action = request.nextUrl.searchParams.get("action") ?? "";
  const sig = request.nextUrl.searchParams.get("sig") ?? "";

  const page = (title: string, body: string, status = 200) =>
    new Response(
      `<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1">
      <body style="font-family:system-ui;background:#f6faf9;display:flex;justify-content:center;padding:40px 16px">
      <div style="background:#fff;border-radius:16px;padding:32px;max-width:420px;text-align:center">
      <div style="font-size:40px">🎁</div><h1 style="color:#152825">${title}</h1>
      <p style="color:#4A5A57">${body}</p></div></body>`,
      { status, headers: { "content-type": "text/html; charset=utf-8" } }
    );

  if (
    !/^[0-9a-f-]{36}$/i.test(id) ||
    (action !== "approve" && action !== "reject") ||
    !verifyApproval(`${action}:${id}`, sig)
  ) {
    return page("Link not valid", "This review link is invalid or has been tampered with.", 403);
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("admin_review_reward", {
    p_id: id,
    p_verdict: action,
  });

  // The RPC reports refusals as "REJECTED: ..." strings rather than errors.
  if (error || (typeof data === "string" && data.startsWith("REJECTED:") && action === "approve")) {
    console.error("reward review failed", error ?? data);
    return page(
      "Something went wrong",
      `Could not update — ${error?.message ?? data}. Use the queue at /admin/rewards.`,
      500
    );
  }
  return page(
    action === "approve" ? "Reward approved!" : "Reward rejected",
    action === "approve"
      ? "It's live in walkers' apps now."
      : `The merchant's proposal was rejected. ${data ?? ""}`
  );
}
