import Link from "next/link";
import Celebration from "@/app/components/Celebration";

const PLAY_URL = "https://play.google.com/store/apps/details?id=com.hugo.pawpoints";

// Landing page for the confirmation link in the sign-up email. The Supabase
// verify endpoint has already confirmed the address by the time anyone lands
// here, so this page must not depend on a session — the link is often opened
// on a different device from the one that signed up.
export default function EmailConfirmedPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#f6faf9] px-4 py-10">
      <Celebration />
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-sm">
        <div className="mb-3 text-4xl">🎉🐾🎉</div>
        <h1 className="mb-2 text-2xl font-bold text-[#152825]">
          Congratulations — you&apos;re verified!
        </h1>
        <p className="mb-5 text-sm leading-relaxed text-[#4A5A57]">
          And thank you for helping bring the dog-walking community closer.
          Hugo&apos;s doing his happy dance for you. If you signed up as a
          merchant, we&apos;ll be in touch by phone to get your business
          switched on — and everyone can grab the app below.
        </p>

        <a href={PLAY_URL} className="block rounded-2xl border border-[#d8e2e0] p-4 hover:border-[#16B8A6]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/pawpoints-playstore-qr.svg"
            alt="QR code — PawPoints on Google Play"
            width={180}
            height={180}
            className="mx-auto"
          />
          <span className="mt-2 block text-sm font-semibold text-[#0A6B60]">
            Scan or tap to get PawPoints on Google Play
          </span>
        </a>

        <p className="mt-3 text-xs text-[#9aa8a5]">
          🍏 iPhone? The iOS app is a work in progress — hold tight, it&apos;s coming!
        </p>

        <Link href="/" className="mt-5 inline-block text-sm font-semibold text-[#0A6B60] underline">
          ← Back home
        </Link>
      </div>
    </main>
  );
}
