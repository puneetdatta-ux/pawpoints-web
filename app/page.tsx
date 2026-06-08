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
          <a href="#partners" className="hover:text-zinc-900">For businesses</a>
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
          Rewarding the moments
          <br />
          <span className="text-[#1D9E75]">you share.</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-zinc-600 max-w-2xl mx-auto leading-relaxed">
          At PawPoints, we believe every step you take with your furry best friend
          should be celebrated. Our app transforms your daily dog walks into
          meaningful rewards—like free coffees, delicious treats, and exclusive
          discounts at participating cafés and shops in your town. We track your
          journey together using GPS, ensuring your dog stays active and healthy
          while you enjoy the perks you both deserve.
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
          Free for walkers, forever. First month free for businesses.
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
              title="Enjoy your walk"
              body="Simply tap 'Start' in the app before you head out. Our GPS gently tracks your distance and time together. Capture the joy of the moment by taking a photo of your happy dog when you finish."
            />
            <Step
              num="2"
              emoji="🐾"
              title="Earn fairly"
              body="Every walk brings you closer to a reward, and our system is thoughtfully designed to be fair for dogs of all shapes and sizes. We tailor healthy exercise goals to your dog's specific breed—so a small companion hitting their target earns the exact same rewards as a giant breed reaching theirs."
            />
            <Step
              num="3"
              emoji="☕"
              title="Treat yourself"
              body="Share your unique 4-digit code at any of our partner cafés and shops in your town to enjoy a complimentary coffee, a hearty breakfast item, or special discounts."
            />
          </div>
        </div>
      </section>

      {/* ── Partner section ── */}
      <section id="partners" className="px-6 py-20 max-w-5xl mx-auto">
        <div className="bg-[#F5FAF8] border border-[#D5EBE0] rounded-2xl p-10 sm:p-14 text-center">
          <span className="inline-block text-3xl mb-4">🏪</span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            For café &amp; retail owners: welcome a loving community to your door
          </h2>
          <p className="text-lg text-zinc-700 max-w-2xl mx-auto leading-relaxed">
            Turn local dog walkers into loyal regulars by joining the PawPoints
            family. We help you connect with your town&apos;s vibrant and growing
            community of dog owners, driving walk-in traffic directly to your door.
            Joining is effortless and risk-free—with zero setup costs and your
            first month entirely free. Our turnkey loyalty program handles all the
            tracking behind the scenes; all your team needs to do is verify codes
            at the till and welcome your new guests.
          </p>
          <div className="mt-8">
            <a
              href="mailto:support@pawpoints.co.nz?subject=Partnership%20enquiry"
              className="inline-block bg-[#1D9E75] hover:bg-[#148562] text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              Become a partner →
            </a>
          </div>
          <p className="mt-6 text-sm text-zinc-500 max-w-2xl mx-auto leading-relaxed">
            <span className="font-semibold text-zinc-700">Growing our community.</span>{" "}
            We&apos;re actively bringing more wonderful local cafés and shops into our
            network soon. To our Paw Parents in Wellington and Christchurch—we
            can&apos;t wait to meet you in early 2027!
          </p>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="px-6 py-20 bg-[#1D9E75] text-white text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Ready to step out together?
        </h2>
        <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto leading-relaxed">
          Download PawPoints today for Android (iOS coming soon). Let your next
          walk become your next warm cup of coffee or in-store discount. Ask your
          favourite café or retailer if they&apos;re on PawPoints to help our
          community grow.
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
