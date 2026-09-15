import Link from "next/link";

// Landing page for the confirmation link in the sign-up email. The Supabase
// verify endpoint has already confirmed the address by the time anyone lands
// here, so this page must not depend on a session — the link is often opened
// on a different device from the one that signed up.
export default function EmailConfirmedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6faf9] px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-sm">
        <div className="mb-3 text-4xl">🐾</div>
        <h1 className="mb-2 text-2xl font-bold text-[#152825]">Email confirmed!</h1>
        <p className="mb-6 text-sm leading-relaxed text-[#4A5A57]">
          Your email address is verified. If you signed up as a merchant,
          we&apos;ll be in touch by phone to get your business switched on. If
          you&apos;re a walker, grab the app and sign in with your email and
          password.
        </p>
        <Link
          href="/#get"
          className="mb-3 inline-block w-full rounded-lg bg-[#16B8A6] px-4 py-2.5 font-semibold text-white hover:bg-[#0A6B60]"
        >
          Get the app
        </Link>
        <Link href="/" className="text-sm font-semibold text-[#0A6B60] underline">
          ← Back home
        </Link>
      </div>
    </main>
  );
}
