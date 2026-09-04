"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";

function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "link"
      ? "That link has expired or was already used. Please try again."
      : null
  );
  const [busy, setBusy] = useState(false);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }
    let next = searchParams.get("next") ?? "/account";
    if (!next.startsWith("/")) next = "/account";
    window.location.assign(next);
  }

  return (
    <form onSubmit={signIn} className="space-y-4">
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
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-[#152825]">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-[#d8e2e0] px-3 py-2 text-[#152825] focus:border-[#16B8A6] focus:outline-none"
        />
      </div>
      {error && <p className="text-sm text-[#c2413f]">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-lg bg-[#16B8A6] px-4 py-2.5 font-semibold text-white hover:bg-[#0A6B60] disabled:opacity-60"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
      <p className="text-center text-sm text-[#4A5A57]">
        <Link href="/forgot-password" className="text-[#0A6B60] underline">
          Forgot your password?
        </Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6faf9] px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold text-[#152825]">Sign in to PawPoints</h1>
        <p className="mb-6 text-sm text-[#4A5A57]">
          Use the same email and password as the PawPoints app.
        </p>
        <Suspense>
          <LoginForm />
        </Suspense>

        {/* New-user join paths: walkers sign up in the app; merchants go
            through partner onboarding (no self-serve merchant signup). */}
        <div className="mt-8 border-t border-[#e4ecea] pt-6">
          <p className="mb-3 text-center text-sm font-medium text-[#4A5A57]">
            New to PawPoints?
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/#get"
              className="rounded-lg border border-[#16B8A6] px-3 py-2.5 text-center text-sm font-semibold text-[#0A6B60] hover:bg-[#EAF8F5]"
            >
              🐾 Join as a walker
            </Link>
            <Link
              href="/join-merchant"
              className="rounded-lg border border-[#d8e2e0] px-3 py-2.5 text-center text-sm font-semibold text-[#4A5A57] hover:bg-[#f6faf9]"
            >
              🏪 Join as a merchant
            </Link>
          </div>
          <p className="mt-3 text-center text-xs text-[#9aa8a5]">
            Walkers sign up free in the app · merchants get their first two months free
          </p>
        </div>
      </div>
    </main>
  );
}
