import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// PKCE code exchange target for email confirmation and password recovery links.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "/account";
  if (!next.startsWith("/")) next = "/account"; // never redirect off-site

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }

  // Sign-up confirmation links are often opened on a different device from
  // the one that signed up, so the PKCE exchange fails there — but Supabase's
  // verify endpoint has already confirmed the email before redirecting here.
  // Show success rather than bouncing a just-confirmed user to a login error.
  if (next === "/email-confirmed") return NextResponse.redirect(`${origin}${next}`);

  return NextResponse.redirect(`${origin}/login?error=link`);
}
