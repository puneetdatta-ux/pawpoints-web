"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";
import { CITY_SECTIONS } from "@/lib/cities";

// Merchant application: stores the three fields Puneet verifies by PHONE call
// before approving — deliberately no self-serve signup and no extra data
// collected (data minimisation). Rows land in merchant_applications; alerts
// go to Puneet, who calls, verifies, and sets up the merchant manually.
export default function JoinMerchantPage() {
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [summary, setSummary] = useState("");
  const [website, setWebsite] = useState("");
  const [showContact, setShowContact] = useState(true); // default ticked
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Email verification via the confirmation link in the sign-up email
  // (Supabase "Confirm email" — the template's {{ .ConfirmationURL }}).
  const [needsVerify, setNeedsVerify] = useState(false);
  const [otpBusy, setOtpBusy] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpNotice, setOtpNotice] = useState<string | null>(null);

  async function resendLink() {
    setOtpBusy(true);
    setOtpError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email.trim().toLowerCase(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/email-confirmed` },
    });
    setOtpBusy(false);
    if (error) setOtpError(error.message);
    else setOtpNotice("A fresh link is on its way — check your inbox and spam folder.");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const supabase = createClient();

    // Create their merchant account right away (no dog — profile_type
    // 'merchant' skips the app's dog-setup gate). Portal access and café
    // linkage still only happen after Puneet phone-verifies and approves.
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/email-confirmed`,
        data: {
          display_name: contactName.trim(),
          city,
          profile_type: "merchant",
        },
      },
    });
    if (signUpError) {
      // Never file an application against an account we haven't proven is
      // theirs: an existing email must sign in (app → Settings → Merchant) or
      // email us. Same policy as the in-app sign-up.
      setError(
        /already registered/i.test(signUpError.message)
          ? "This email already has a PawPoints account. Sign in to the app and choose Merchant under Settings, or email support@pawpoints.co.nz with your business name and phone."
          : signUpError.message
      );
      setBusy(false);
      return;
    }

    const { error } = await supabase.from("merchant_applications").insert({
      business_name: businessName.trim(),
      contact_name: contactName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      city,
      summary: summary.trim(),
      website: website.trim() || null,
      show_contact: showContact,
    });
    if (error) {
      setError("Something went wrong — please try again, or email support@pawpoints.co.nz");
      setBusy(false);
      return;
    }
    // A fresh account with no session ⇒ email confirmation is on: verify here.
    if (!signUpError && !signUpData?.session) setNeedsVerify(true);
    else setDone(true);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6faf9] px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
        {done ? (
          <div className="text-center">
            <div className="mb-3 text-4xl">🐾</div>
            <h1 className="mb-2 text-2xl font-bold text-[#152825]">Application received!</h1>
            <p className="mb-6 text-sm leading-relaxed text-[#4A5A57]">
              Thanks, {contactName.trim() || "friend"} — your account is created
              (check your email if a confirmation link is required). We&apos;ll give
              you a call on <b>{phone.trim()}</b> to verify the details and switch{" "}
              <b>{businessName.trim()}</b> on. Your first two months are free.
            </p>
            <Link href="/" className="text-sm font-semibold text-[#0A6B60] underline">
              ← Back home
            </Link>
          </div>
        ) : needsVerify ? (
          <div className="space-y-3">
            <h1 className="mb-1 text-2xl font-bold text-[#152825]">Check your email</h1>
            <p className="text-sm leading-relaxed text-[#4A5A57]">
              We&apos;ve sent a confirmation link to <b>{email.trim().toLowerCase()}</b>.
              Click it to verify your address — your application is already with
              us, and we&apos;ll call you on <b>{phone.trim()}</b> to get{" "}
              <b>{businessName.trim()}</b> switched on.
            </p>
            <p className="text-sm leading-relaxed text-[#4A5A57]">
              Can&apos;t see it? Check your spam folder, or resend below.
            </p>
            {otpError && <p className="text-sm text-[#c2413f]">{otpError}</p>}
            {otpNotice && <p className="text-sm text-[#0A6B60]">{otpNotice}</p>}
            <button
              type="button" onClick={resendLink} disabled={otpBusy}
              className="w-full rounded-lg bg-[#16B8A6] px-4 py-2.5 font-semibold text-white hover:bg-[#0A6B60] disabled:opacity-60"
            >
              {otpBusy ? "Sending…" : "Resend confirmation email"}
            </button>
            <Link href="/" className="block text-center text-sm text-[#0A6B60] underline">
              ← Back home
            </Link>
          </div>
        ) : (
          <>
            <h1 className="mb-1 text-2xl font-bold text-[#152825]">Join as a merchant</h1>
            <p className="mb-6 text-sm text-[#4A5A57]">
              Tell us who you are and we&apos;ll call you to get set up — first two
              months free, priced in points, never money.
            </p>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label htmlFor="business" className="block text-sm font-medium text-[#152825]">
                  Business name
                </label>
                <input
                  id="business"
                  type="text"
                  required
                  minLength={2}
                  maxLength={120}
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#d8e2e0] px-3 py-2 text-[#152825] focus:border-[#16B8A6] focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-[#152825]">
                  Your name
                </label>
                <input
                  id="contact"
                  type="text"
                  required
                  minLength={2}
                  maxLength={80}
                  autoComplete="name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#d8e2e0] px-3 py-2 text-[#152825] focus:border-[#16B8A6] focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#152825]">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  maxLength={120}
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#d8e2e0] px-3 py-2 text-[#152825] focus:border-[#16B8A6] focus:outline-none"
                />
                <p className="mt-1 text-xs text-[#9aa8a5]">
                  Your PawPoints merchant account is created under this email.
                </p>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#152825]">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#d8e2e0] px-3 py-2 text-[#152825] focus:border-[#16B8A6] focus:outline-none"
                />
                <p className="mt-1 text-xs text-[#9aa8a5]">
                  Use this to sign in to the PawPoints app once you&apos;re approved.
                </p>
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-[#152825]">
                  City
                </label>
                <select
                  id="city" required value={city} onChange={(e) => setCity(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#d8e2e0] bg-white px-3 py-2 text-[#152825] focus:border-[#16B8A6] focus:outline-none"
                >
                  <option value="" disabled>Choose your city</option>
                  {CITY_SECTIONS.map((s) => (
                    <optgroup key={s.title} label={s.title}>
                      {s.data.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-[#152825]">
                  Phone number
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  minLength={7}
                  maxLength={25}
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#d8e2e0] px-3 py-2 text-[#152825] focus:border-[#16B8A6] focus:outline-none"
                />
                <p className="mt-1 text-xs text-[#9aa8a5]">
                  Used once for a verification call about your business before anything goes live.
                  Not shown to other users, never used for marketing, and deleted if your
                  application isn&apos;t approved.
                </p>
              </div>
              <div>
                <label htmlFor="summary" className="block text-sm font-medium text-[#152825]">
                  About your business
                </label>
                <textarea
                  id="summary"
                  required
                  minLength={20}
                  maxLength={700}
                  rows={4}
                  placeholder="What you offer and why dog walkers will love you (about 100 words)"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#d8e2e0] px-3 py-2 text-[#152825] focus:border-[#16B8A6] focus:outline-none"
                />
                <p className="mt-1 text-xs text-[#9aa8a5]">
                  Shown on your business profile in the app once you&apos;re approved.
                </p>
              </div>
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-[#152825]">
                  Website <span className="font-normal text-[#9aa8a5]">(optional)</span>
                </label>
                <input
                  id="website"
                  type="text"
                  maxLength={200}
                  placeholder="www.yourbusiness.co.nz"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#d8e2e0] px-3 py-2 text-[#152825] focus:border-[#16B8A6] focus:outline-none"
                />
              </div>
              <label className="flex items-start gap-2 text-sm text-[#4A5A57]">
                <input
                  type="checkbox"
                  checked={showContact}
                  onChange={(e) => setShowContact(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[#16B8A6]"
                />
                <span>Show my name and phone number on my business profile so walkers can get in touch</span>
              </label>
              {error && <p className="text-sm text-[#c2413f]">{error}</p>}
              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-lg bg-[#16B8A6] px-4 py-2.5 font-semibold text-white hover:bg-[#0A6B60] disabled:opacity-60"
              >
                {busy ? "Sending…" : "Apply to join"}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-[#4A5A57]">
              Dog walker instead?{" "}
              <Link href="/#get" className="text-[#0A6B60] underline">
                Get the app
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
