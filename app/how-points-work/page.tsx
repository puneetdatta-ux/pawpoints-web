import Link from "next/link";

export const metadata = {
  title: "How Points Work — Walk the dog, earn the points",
  description:
    "PawPoints explained in plain English: your dog's daily walk goal, how points are earned (10 for the goal, up to 20 a day), rest days, and the two-week freshness rule.",
};

// Keep these numbers in sync with the app's award_walk_points function:
// 10 pts at the breed daily goal, 20/day cap, flat 10 on suggested rest days,
// 14-day freshness, ~280 maximum balance.
const rules = [
  {
    num: "1",
    title: "Every dog has a daily goal",
    body: "A Border Collie and a Chihuahua don't need the same walk — so PawPoints sets a daily distance-and-time goal matched to your dog's breed and age. You'll see it on the Walk screen.",
  },
  {
    num: "2",
    title: "Hit the goal, get 10 points",
    body: "Halfway there? That's about 5. Feeling ambitious? Keep walking — up to 20 points a day, and it all adds up across every walk you take that day.",
  },
  {
    num: "3",
    title: "Spend them on treats",
    body: "Redeem your points at partner cafés and shops around New Zealand — each partner decides what your points are worth at their counter. Walk in, show your code, enjoy.",
  },
];

export default function HowPointsWork() {
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
          Walk the dog. Earn the points. 🐾
        </h1>
        <p className="text-xl sm:text-2xl font-light opacity-90 max-w-2xl mx-auto leading-relaxed">
          No maths degree required. Your dog has a daily walk goal — meet it,
          and the points roll in.
        </p>
      </section>

      {/* ── The three rules ── */}
      <section className="px-6 py-16 max-w-3xl mx-auto">
        <div className="space-y-6">
          {rules.map((r) => (
            <div
              key={r.num}
              className="flex gap-5 bg-[#F5FAF8] rounded-2xl p-6 sm:p-8"
            >
              <div className="flex-none w-10 h-10 rounded-full bg-[#1D9E75] text-white font-extrabold flex items-center justify-center">
                {r.num}
              </div>
              <div>
                <h2 className="text-xl font-bold mb-1 text-[#0A6B60]">
                  {r.title}
                </h2>
                <p className="text-zinc-700 leading-relaxed">{r.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── The scale at a glance ── */}
        <div className="grid grid-cols-3 gap-3 mt-8">
          <div className="rounded-xl bg-[#EAF8F5] py-6 text-center">
            <div className="text-xs font-bold text-zinc-500 tracking-wide">
              HALF THE GOAL
            </div>
            <div className="text-3xl font-extrabold text-[#0A6B60] mt-1">
              ~5 pts
            </div>
          </div>
          <div className="rounded-xl bg-[#1D9E75] py-6 text-center">
            <div className="text-xs font-bold text-emerald-100 tracking-wide">
              GOAL MET
            </div>
            <div className="text-3xl font-extrabold text-white mt-1">10 pts</div>
          </div>
          <div className="rounded-xl bg-[#0A6B60] py-6 text-center">
            <div className="text-xs font-bold text-emerald-100 tracking-wide">
              DOUBLE IT (MAX)
            </div>
            <div className="text-3xl font-extrabold text-[#FFCB47] mt-1">
              20 pts
            </div>
          </div>
        </div>
      </section>

      {/* ── Rest days + freshness ── */}
      <section className="px-6 pb-16 max-w-3xl mx-auto grid sm:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-[#FFF6DD] p-6">
          <h3 className="font-bold text-[#8a5a00] mb-1">Rest days count too</h3>
          <p className="text-sm leading-relaxed text-[#6b5a33]">
            When the app suggests your dog takes a breather, putting your paws
            up earns a flat 10 points for the day. Good recovery is good dog
            care.
          </p>
        </div>
        <div className="rounded-2xl bg-[#DFF3EF] p-6">
          <h3 className="font-bold text-[#0A6B60] mb-1">
            Points stay fresh for 2 weeks
          </h3>
          <p className="text-sm leading-relaxed text-[#28433e]">
            Walk points are like good coffee — best enjoyed fresh. Each
            walk&apos;s points last 14 days, so keep walking and keep treating.
            A perfect fortnight tops out at <b>280 points</b> — the stuff of
            legends.
          </p>
        </div>
      </section>

      {/* ── Fair play ── */}
      <section className="px-6 pb-20 max-w-3xl mx-auto">
        <div className="rounded-2xl border border-zinc-200 p-6">
          <h3 className="font-bold mb-1">The fair-play fine print 🐾</h3>
          <p className="text-sm leading-relaxed text-zinc-500">
            A walk needs to be at least a minute and 0.2 km to count — a dash
            to the letterbox doesn&apos;t fool anyone. And if you&apos;re moving
            faster than 15 km/h, that&apos;s a bike ride, not a walkies.
            Distance is measured on your phone; your location is never stored
            or shared.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#1D9E75] text-white px-6 py-16 text-center">
        <h2 className="text-2xl font-bold mb-3">Ready to start earning?</h2>
        <p className="opacity-90 mb-6">
          Grab the lead — your dog has been ready for hours.
        </p>
        <Link
          href="/#get"
          className="inline-block bg-white text-[#0A6B60] font-bold rounded-full px-8 py-3 hover:bg-emerald-50"
        >
          Get PawPoints
        </Link>
      </section>
    </div>
  );
}
