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
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // In-page email verification (Supabase "Confirm email", 6-digit code).
  const [needsVerify, setNeedsVerify] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpBusy, setOtpBusy] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpNotice, setOtpNotice] = useState<string | null>(null);

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setOtpBusy(true);
    setOtpError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: otp.trim(),
      type: "signup",
    });
    setOtpBusy(false);
    if (error) { setOtpError(error.message); return; }
    setNeedsVerify(false);
    setDone(true);
  }

  async function resendCode() {
    setOtpBusy(true);
    setOtpError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.resend({ type: "signup", email: email.trim().toLowerCase() });
    setOtpBusy(false);
    if (error) setOtpError(error.message);
    else setOtpNotice("A fresh code is on its way.");
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
        data: {
          display_name: contactName.trim(),
          city,
          profile_type: "merchant",
        },
      },
    });
    if (signUpError && !/already registered/i.test(signUpError.message)) {
      setError(signUpError.message);
      setBusy(false);
      return;
    }

    const { error } = await supabase.from("merchant_applications").insert({
      business_name: businessName.trim(),
      contact_name: contactName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      city,
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
          <form onSubmit={verifyCode} className="space-y-3">
            <h1 className="mb-1 text-2xl font-bold text-[#152825]">Verify your email</h1>
            <p className="text-sm leading-relaxed text-[#4A5A57]">
              Enter the code we just emailed to <b>{email.trim().toLowerCase()}</b>. Your application
              is already with us — this just confirms the address is yours.
            </p>
            <input
              type="text" inputMode="numeric" required minLength={6} maxLength={8} autoFocus
              placeholder="Verification code"
              value={otp} onChange={(e) => setOtp(e.target.value)}
              className="w-full rounded-lg border border-[#d8e2e0] px-3 py-2 text-center text-lg tracking-widest text-[#152825] focus:border-[#16B8A6] focus:outline-none"
            />
            {otpError && <p className="text-sm text-[#c2413f]">{otpError}</p>}
            {otpNotice && <p className="text-sm text-[#0A6B60]">{otpNotice}</p>}
            <button
              type="submit" disabled={otpBusy}
              className="w-full rounded-lg bg-[#16B8A6] px-4 py-2.5 font-semibold text-white hover:bg-[#0A6B60] disabled:opacity-60"
            >
              {otpBusy ? "Verifying…" : "Verify email"}
            </button>
            <button
              type="button" onClick={resendCode} disabled={otpBusy}
              className="w-full text-sm text-[#0A6B60] underline disabled:opacity-60"
            >
              Resend code
            </button>
          </form>
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
                  We verify every merchant with a quick phone call before anything goes live.
                </p>
              </div>
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
