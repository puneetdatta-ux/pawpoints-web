import Link from "next/link";

export const metadata = {
  title: "Why It Matters — For You and Your Furry One",
  description:
    "Dog walks aren't just exercise. They're a daily ritual of connection — between you and your dog, and between you and the world outside your front door.",
};

const dogBenefits = [
  {
    emoji: "💪",
    title: "Physical health",
    body: "Regular walks keep joints supple, weight healthy, and hearts strong. A walked dog is a happy, longer-living dog.",
  },
  {
    emoji: "🧠",
    title: "Mental stimulation",
    body: "Every sniff is a story. The world is your dog's newspaper, and walking lets them read every edition.",
  },
  {
    emoji: "☯️",
    title: "Behavioural balance",
    body: "A dog with an outlet for energy is calmer, less destructive, and more settled at home. Walked dogs simply behave better.",
  },
  {
    emoji: "🤝",
    title: "Socialisation",
    body: "Meeting other dogs, people, and environments builds confidence and reduces anxiety over time.",
  },
  {
    emoji: "🔄",
    title: "Purpose and routine",
    body: "Dogs are creatures of rhythm. A daily walk gives them something to look forward to — and they'll remind you, faithfully, every single day.",
  },
];

const humanBenefits = [
  {
    emoji: "🌿",
    title: "Stress relief",
    body: "Even 20 minutes outside lowers cortisol levels. Your dog doesn't care about your inbox — and for a little while, neither will you.",
  },
  {
    emoji: "💡",
    title: "Mental clarity",
    body: "Walking creates space to think, process, and breathe. Some of your best ideas will arrive somewhere between the front gate and the park.",
  },
  {
    emoji: "⚖️",
    title: "Work-life separation",
    body: "A morning or evening walk creates a natural boundary between work mode and home mode. It's a commute worth having.",
  },
  {
    emoji: "🚶",
    title: "Physical wellbeing",
    body: "Daily steps add up. Without even trying, dog owners consistently walk more than non-dog owners.",
  },
  {
    emoji: "💬",
    title: "Human connection",
    body: "Dog people talk to each other. Your dog is your best social icebreaker, your neighbourhood ambassador, and your reason to look up from your phone.",
  },
];

export default function WhyItMatters() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans">
      {/* ── Nav ── */}
      <header className="px-6 py-5 max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🐾</span>
          <span className="text-xl font-bold tracking-tight">PawPoints</span>
        </Link>
        <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-900">
          ← Back home
        </Link>
      </header>

      {/* ── Hero ── */}
      <section className="bg-[#1D9E75] text-white px-6 py-20 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
          Why It Matters 🐾
        </h1>
        <p className="text-xl sm:text-2xl font-light opacity-90 max-w-2xl mx-auto leading-relaxed">
          For you and your furry one
        </p>
      </section>

      {/* ── Opening ── */}
      <section className="px-6 py-16 max-w-3xl mx-auto">
        <p className="text-xl leading-relaxed text-zinc-700 mb-6">
          There&apos;s something quietly magical about the moment you clip on the
          lead and watch your dog&apos;s whole body light up with joy. They don&apos;t
          know what day it is, what&apos;s due at work, or what&apos;s worrying you
          — they just know you&apos;re going, together. And honestly? That might be
          exactly what both of you need.
        </p>
        <p className="text-xl leading-relaxed text-zinc-700">
          Dog walks aren&apos;t just exercise. They&apos;re a daily ritual of
          connection — between you and your dog, and between you and the world
          outside your front door.
        </p>
      </section>

      {/* ── Dog benefits ── */}
      <section className="bg-[#F5FAF8] px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-2 text-center">
            Why it matters for your furry one
          </h2>
          <p className="text-center text-zinc-500 mb-12 text-sm uppercase tracking-widest">
            🐕
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {dogBenefits.map((b) => (
              <BenefitCard key={b.title} {...b} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Human benefits ── */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-2 text-center">
            Why it matters for you
          </h2>
          <p className="text-center text-zinc-500 mb-12 text-sm uppercase tracking-widest">
            🧑
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {humanBenefits.map((b) => (
              <BenefitCard key={b.title} {...b} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing quote ── */}
      <section className="bg-[#1D9E75] text-white px-6 py-20 text-center">
        <blockquote className="max-w-2xl mx-auto">
          <p className="text-2xl sm:text-3xl font-light leading-relaxed italic mb-6">
            &ldquo;The lead goes on. The world slows down.
            <br />
            That&apos;s not nothing — that&apos;s everything.&rdquo;
          </p>
          <footer className="text-sm opacity-75">
            — PawPoints
          </footer>
        </blockquote>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-16 text-center">
        <p className="text-lg text-zinc-600 mb-6">
          Track every step. Earn rewards. Make walks count.
        </p>
        <Link
          href="/"
          className="inline-block bg-[#1D9E75] hover:bg-[#148562] text-white font-semibold px-8 py-4 rounded-xl transition shadow-md text-lg"
        >
          Get PawPoints →
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-zinc-900 text-zinc-400 px-6 py-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐾</span>
            <span className="font-bold text-white">PawPoints</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/why-it-matters" className="hover:text-white">Why it matters</Link>
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

function BenefitCard({
  emoji,
  title,
  body,
}: {
  emoji: string;
  title: string;
  body: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100 flex gap-4">
      <span className="text-3xl shrink-0">{emoji}</span>
      <div>
        <h3 className="font-bold text-lg mb-1">{title}</h3>
        <p className="text-zinc-600 leading-relaxed text-sm">{body}</p>
      </div>
    </div>
  );
}
