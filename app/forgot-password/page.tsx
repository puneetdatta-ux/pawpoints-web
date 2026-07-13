"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function sendReset(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6faf9] px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold text-[#152825]">Reset your password</h1>
        {sent ? (
          <p className="mt-4 text-sm text-[#4A5A57]">
            If an account exists for <strong>{email}</strong>, a password reset link is on
            its way. Open it on this device to set a new password.
          </p>
        ) : (
          <form onSubmit={sendReset} className="mt-4 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#152825]">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#d8e2e0] px-3 py-2 text-[#152825] focus:border-[#16B8A6] focus:outline-none"
              />
            </div>
            {error && <p className="text-sm text-[#c2413f]">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-lg bg-[#16B8A6] px-4 py-2.5 font-semibold text-white hover:bg-[#0A6B60] disabled:opacity-60"
            >
              {busy ? "Sending…" : "Send reset link"}
            </button>
          </form>
        )}
        <p className="mt-6 text-center text-sm text-[#4A5A57]">
          <Link href="/login" className="text-[#0A6B60] underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
