"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";
import { CITY_SECTIONS } from "@/lib/cities";

// Web mirror of the app's AuthScreen sign-up. All the real work happens
// server-side: the on_auth_user_created trigger reads this exact metadata
// shape and creates the users row + first dog, same as an app sign-up —
// keep the metadata keys identical to AuthScreen.js.

export default function JoinWalkerPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [dogName, setDogName] = useState("");
  const [dogBreed, setDogBreed] = useState("");
  const [dogAge, setDogAge] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<"confirm-email" | "signed-in" | null>(null);
  // Email verification via the confirmation link in the sign-up email
  // (Supabase "Confirm email" — the template's {{ .ConfirmationURL }}).
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

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const age = parseInt(dogAge, 10);
    if (Number.isNaN(age) || age < 0 || age > 25) {
      setError("Please enter a valid dog age (0–25).");
      return;
    }

    setBusy(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/email-confirmed`,
        // Same metadata shape as the app's AuthScreen — the server trigger
        // builds the profile and dog from these keys.
        data: {
          display_name: name.trim(),
          city,
          dog_name: dogName.trim(),
          dog_breed: dogBreed.trim(),
          dog_age: age,
        },
      },
    });
    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }
    setOutcome(data.session ? "signed-in" : "confirm-email");
  }

  if (outcome) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6faf9] px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mb-3 text-4xl">🐾</div>
          <h1 className="mb-2 text-2xl font-bold text-[#152825]">
            Welcome to the pack{name.trim() ? `, ${name.trim()}` : ""}!
          </h1>
          {outcome === "confirm-email" ? (
            <div className="space-y-3 text-left">
              <p className="text-sm leading-relaxed text-[#4A5A57]">
                We&apos;ve sent a confirmation link to <b>{email.trim().toLowerCase()}</b>.
                Click it to verify your address, then download the app and sign in
                with the same email and password.
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
              <Link
                href="/#get"
                className="block w-full rounded-lg border border-[#16B8A6] px-4 py-2.5 text-center font-semibold text-[#0A6B60] hover:bg-[#f6faf9]"
              >
                Get the app
              </Link>
            </div>
          ) : (
            <>
              <p className="mb-6 text-sm leading-relaxed text-[#4A5A57]">
                Your email is verified and your account is ready — download the app and sign in
                with the same email and password to start your first walk.
              </p>
              <Link
                href="/#get"
                className="inline-block w-full rounded-lg bg-[#16B8A6] px-4 py-2.5 font-semibold text-white hover:bg-[#0A6B60]"
              >
                Get the app
              </Link>
            </>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6faf9] px-4 py-10">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold text-[#152825]">Join as a walker</h1>
        <p className="mb-6 text-sm text-[#4A5A57]">
          One account for the app and the web — walks are tracked in the app.
        </p>
        <form onSubmit={signUp} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#152825]">
              Name (as others will see you)
            </label>
            <input
              id="name" type="text" required minLength={1} maxLength={80} autoComplete="name"
              value={name} onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#d8e2e0] px-3 py-2 text-[#152825] focus:border-[#16B8A6] focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#152825]">
              Email
            </label>
            <input
              id="email" type="email" required autoComplete="email"
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#d8e2e0] px-3 py-2 text-[#152825] focus:border-[#16B8A6] focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#152825]">
              Password
            </label>
            <input
              id="password" type="password" required minLength={6} autoComplete="new-password"
              placeholder="Min. 6 characters"
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#d8e2e0] px-3 py-2 text-[#152825] focus:border-[#16B8A6] focus:outline-none"
            />
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

          <p className="pt-1 text-sm font-semibold text-[#0A6B60]">Your dog</p>
          <div>
            <label htmlFor="dogname" className="block text-sm font-medium text-[#152825]">
              Dog&apos;s name
            </label>
            <input
              id="dogname" type="text" required minLength={1} maxLength={60}
              value={dogName} onChange={(e) => setDogName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#d8e2e0] px-3 py-2 text-[#152825] focus:border-[#16B8A6] focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="breed" className="block text-sm font-medium text-[#152825]">
                Breed
              </label>
              <input
                id="breed" type="text" required minLength={2} maxLength={60}
                placeholder="e.g. Labrador"
                value={dogBreed} onChange={(e) => setDogBreed(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#d8e2e0] px-3 py-2 text-[#152825] focus:border-[#16B8A6] focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-[#152825]">
                Age (years)
              </label>
              <input
                id="age" type="number" required min={0} max={25}
                value={dogAge} onChange={(e) => setDogAge(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#d8e2e0] px-3 py-2 text-[#152825] focus:border-[#16B8A6] focus:outline-none"
              />
            </div>
          </div>

          {error && <p className="text-sm text-[#c2413f]">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-[#16B8A6] px-4 py-2.5 font-semibold text-white hover:bg-[#0A6B60] disabled:opacity-60"
          >
            {busy ? "Creating account…" : "Create account"}
          </button>
          <p className="text-center text-xs leading-relaxed text-[#9aa8a5]">
            By creating an account you agree to our{" "}
            <Link href="/terms" className="text-[#0A6B60] underline">Terms</Link> and{" "}
            <Link href="/privacy" className="text-[#0A6B60] underline">Privacy Policy</Link>.
          </p>
        </form>
        <p className="mt-5 text-center text-sm text-[#4A5A57]">
          Already have an account?{" "}
          <Link href="/login" className="text-[#0A6B60] underline">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
