import Link from "next/link";

// Segmented switch at the top of both join pages (founder request
// 2026-09-15): the two sign-up paths are separate pages, so the "other"
// option is a plain link and the current one is the highlighted, inert half.
export default function JoinToggle({ active }: { active: "walker" | "merchant" }) {
  const base =
    "flex-1 rounded-full px-4 py-2 text-center text-sm font-semibold transition-colors";
  const on = `${base} bg-[#0A6B60] text-white`;
  const off = `${base} text-[#0A6B60] hover:bg-[#E8FAF7]`;
  return (
    <div
      role="tablist"
      aria-label="Join as"
      className="mb-6 flex rounded-full border border-[#CFEDE8] bg-white p-1"
    >
      {active === "walker" ? (
        <span role="tab" aria-selected="true" className={on}>Dog walker</span>
      ) : (
        <Link role="tab" aria-selected="false" href="/join-walker" className={off}>Dog walker</Link>
      )}
      {active === "merchant" ? (
        <span role="tab" aria-selected="true" className={on}>Merchant</span>
      ) : (
        <Link role="tab" aria-selected="false" href="/join-merchant" className={off}>Merchant</Link>
      )}
    </div>
  );
}
