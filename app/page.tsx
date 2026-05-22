import Link from "next/link";

const ANDROID_APK_URL =
  "https://expo.dev/accounts/puneetdatta/projects/PawPoints/builds/adaf47a9-dbee-4586-aaca-9c63b4151946";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans">
      {/* ── Nav ── */}
      <header className="px-6 py-5 max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐾</span>
          <span className="text-xl font-bold tracking-tight">PawPoints</span>
        </div>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-zinc-600">
          <a href="#how" className="hover:text-zinc-900">How it works</a>
          <Link href="/why-it-matters" className="hover:text-zinc-900">Why it matters</Link>
          <a href="#partners" className="hover:text-zinc-900">For cafés</a>
          <a
            href={ANDROID_APK_URL}
            className="bg-[#1D9E75] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#148562] transition"
          >
            Get the app
          </a>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="px-6 pt-12 pb-20 max-w-6xl mx-auto text-center">
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight">
          Every dog walk
          <br />
          <span className="text-[#1D9E75]">earns a café reward.</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-zinc-600 max-w-2xl mx-auto leading-relaxed">
          PawPoints turns your dog&apos;s daily walks into free coffees, treats and
          discounts at participating Auckland cafés. GPS tracks your distance.
          Your dog gets exercise. You get rewarded.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href={ANDROID_APK_URL}
            className="bg-[#1D9E75] hover:bg-[#148562] text-white text-lg font-semibold px-8 py-4 rounded-xl transition shadow-md"
          >
            📱 Download for Android
          </a>
          <span className="text-sm text-zinc-500">iOS coming soon</span>
        </div>
        <p className="mt-4 text-xs text-zinc-400">
          Free for walkers, forever. First month free for cafés.
        </p>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="bg-zinc-50 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Step
              num="1"
              emoji="🚶"
              title="Walk your dog"
              body="Tap Start in the app. GPS tracks distance and time. Take a photo of your dog when you're done."
            />
            <Step
              num="2"
              emoji="🐾"
              title="Earn points"
              body="Every walk earns rewards — fair to all dog sizes. The app sets a healthy goal for your dog's breed, so a small dog hitting their target earns the same as a giant hitting theirs."
            />
            <Step
              num="3"
              emoji="☕"
              title="Redeem at cafés"
              body="Show your 4-digit code at any partner café for a free coffee, breakfast item, or discount."
            />
          </div>
        </div>
      </section>

      {/* ── Partner section ── */}
      <section id="partners" className="px-6 py-20 max-w-5xl mx-auto">
        <div className="bg-[#F5FAF8] border border-[#D5EBE0] rounded-2xl p-10 sm:p-14 text-center">
          <span className="inline-block text-3xl mb-4">🏪</span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Café owners — turn dog walkers into regulars
          </h2>
          <p className="text-lg text-zinc-700 max-w-2xl mx-auto leading-relaxed">
            Walk-in traffic from Auckland&apos;s growing community of dog owners.
            Zero setup cost. First month free. Turnkey loyalty program — we
            handle everything, you just verify codes at the till.
          </p>
          <div className="mt-8">
            <a
              href="mailto:support@pawpoints.co.nz?subject=Café%20partnership%20enquiry"
              className="inline-block bg-[#1D9E75] hover:bg-[#148562] text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              Become a partner café →
            </a>
          </div>
          <p className="mt-4 text-sm text-zinc-500">
            Cafés in your neighbourhood coming soon. Paw Parents in Wellington and Christchurch — launching early 2027.
          </p>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="px-6 py-20 bg-[#1D9E75] text-white text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Ready to walk?
        </h2>
        <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
          Download PawPoints today and turn your next walk into your next coffee.
        </p>
        <a
          href={ANDROID_APK_URL}
          className="inline-block bg-white text-[#1D9E75] hover:bg-zinc-100 text-lg font-semibold px-8 py-4 rounded-xl transition shadow-lg"
        >
          📱 Get the app
        </a>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-zinc-900 text-zinc-400 px-6 py-12">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐾</span>
            <span className="font-bold text-white">PawPoints</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <a href="mailto:support@pawpoints.co.nz" className="hover:text-white">
              support@pawpoints.co.nz
            </a>
          </div>
        </div>
        <p className="text-xs text-center mt-8 text-zinc-500">
          © {new Date().getFullYear()} PawPoints · Made in Auckland, NZ 🇳🇿
        </p>
      </footer>
    </div>
  );
}

function Step({ num, emoji, title, body }: {
  num: string; emoji: string; title: string; body: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-zinc-100">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{emoji}</span>
        <span className="text-sm font-bold text-[#1D9E75] bg-[#E1F5EE] px-3 py-1 rounded-full">
          Step {num}
        </span>
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-zinc-600 leading-relaxed">{body}</p>
    </div>
  );
}
