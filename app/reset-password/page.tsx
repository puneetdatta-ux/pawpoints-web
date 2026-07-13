"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";

export default function ResetPasswordPage() {
  const [hasSession, setHasSession] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setHasSession(!!data.user));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }
    window.location.assign("/account");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6faf9] px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold text-[#152825]">Set a new password</h1>
        {hasSession === null ? (
          <p className="mt-4 text-sm text-[#4A5A57]">Checking your link…</p>
        ) : hasSession ? (
          <form onSubmit={save} className="mt-4 space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#152825]">
                New password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#d8e2e0] px-3 py-2 text-[#152825] focus:border-[#16B8A6] focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-[#152825]">
                Confirm password
              </label>
              <input
                id="confirm"
                type="password"
                required
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#d8e2e0] px-3 py-2 text-[#152825] focus:border-[#16B8A6] focus:outline-none"
              />
            </div>
            {error && <p className="text-sm text-[#c2413f]">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-lg bg-[#16B8A6] px-4 py-2.5 font-semibold text-white hover:bg-[#0A6B60] disabled:opacity-60"
            >
              {busy ? "Saving…" : "Save new password"}
            </button>
          </form>
        ) : (
          <p className="mt-4 text-sm text-[#4A5A57]">
            This page only works right after opening a password reset link.{" "}
            <Link href="/forgot-password" className="text-[#0A6B60] underline">
              Request a new one
            </Link>
            .
          </p>
        )}
      </div>
    </main>
  );
}
