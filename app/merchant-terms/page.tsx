import Link from "next/link";

export const metadata = {
  title: "Merchant Terms of Service — PawPoints",
  description:
    "The terms that apply to businesses joining PawPoints as merchant partners.",
};

// v1.0 — 6 September 2026. If these terms change, bump the version here, in
// the PDF (public/pawpoints-merchant-terms.pdf), and in the terms_version
// recorded on merchant_applications.

const sections: { h: string; body: string[] }[] = [
  {
    h: "1. Who we are",
    body: [
      "PawPoints is operated by SA Distribution Ltd (\"PawPoints\", \"we\", \"us\"), a New Zealand company. These terms are an agreement between us and the business named in your merchant application (\"you\", the \"Merchant\").",
    ],
  },
  {
    h: "2. What PawPoints provides",
    body: [
      "PawPoints lists your business to dog walkers in your area, displays your business profile (name, summary, website, and — if you choose — a contact name and phone number), and lets walkers redeem the rewards you offer using points they earn by walking their dogs.",
      "We provide the merchant portal for managing your rewards and the redemption tools your staff use in store.",
    ],
  },
  {
    h: "3. Joining is free — no fixed term",
    body: [
      "Joining PawPoints as a merchant is currently free. There is no fixed term, no minimum commitment, and you may leave at any time by telling us in writing (email is fine). We may likewise end or suspend a listing at any time, acting reasonably.",
    ],
  },
  {
    h: "4. If we introduce fees",
    body: [
      "We may introduce or change fees in the future. If we do: (a) we will give you at least 90 days' written notice, stating the price and the date it starts; (b) you will never be charged for any period before that date; (c) you may cancel at any time before the start date and owe nothing; and (d) billing will begin only once you have actively agreed (for example, by setting up payment). Any fees will be stated exclusive of GST, which will be added at the prevailing rate.",
    ],
  },
  {
    h: "5. Verification and approval",
    body: [
      "Listings go live only after we have verified your business (normally by a phone call) and approved it. Rewards you propose appear to walkers only after we approve them. We may decline or remove a listing or reward, acting reasonably.",
    ],
  },
  {
    h: "6. Your rewards are real promises",
    body: [
      "A reward you offer through PawPoints, once approved and active, is a promise to walkers: you agree to honour it for any walker who validly redeems it in store. You may pause or resume an approved reward at any time from the merchant portal; pausing takes effect for new redemptions immediately.",
      "Rewards are priced in points. What a reward is worth in your store is entirely your decision.",
    ],
  },
  {
    h: "7. Your profile and content",
    body: [
      "You are responsible for the accuracy of your business profile (summary, website, contact details). Your contact name and phone number are shown to walkers only if you opt in — you can change that choice by contacting us. Content must be accurate, lawful, and yours to use. We may edit listings for clarity or decline content that is misleading or inappropriate.",
    ],
  },
  {
    h: "8. Redemptions and your staff",
    body: [
      "Redemptions are confirmed in store using the tools we provide (such as your store code and PIN). Keep those credentials secure and share them only with staff who need them. Tell us promptly if you believe they have been compromised and we will reset them.",
    ],
  },
  {
    h: "9. Data and privacy",
    body: [
      "We handle personal information as described in our Privacy Policy (pawpoints.co.nz/privacy). The phone number you give us at application is used for verification and account contact — it is never shown to walkers unless you opt in, and never used for marketing.",
    ],
  },
  {
    h: "10. Liability",
    body: [
      "PawPoints is provided \"as is\". To the maximum extent the law allows: we are not liable for indirect or consequential loss (including lost profits); and our total liability to you in any 12-month period is limited to the fees you paid us in that period (or NZ$100 if you paid none). Nothing in these terms limits rights that cannot be excluded by law. You are in trade, and both parties agree the Consumer Guarantees Act 1993 does not apply to this agreement.",
    ],
  },
  {
    h: "11. Ending the agreement",
    body: [
      "Either of us may end this agreement at any time on written notice. On ending, your listing and rewards are removed from walkers' apps; redemptions validly made before then must still be honoured.",
    ],
  },
  {
    h: "12. Changes to these terms",
    body: [
      "We may update these terms from time to time. Material changes will be notified to the email on your account at least 30 days before they take effect (fee introductions follow clause 4's 90 days). If you keep using PawPoints after that, the updated terms apply; if you don't agree, you may leave under clause 11.",
    ],
  },
  {
    h: "13. General",
    body: [
      "These terms are governed by New Zealand law, and the New Zealand courts have jurisdiction. If part of these terms is found unenforceable, the rest still stands. Questions: support@pawpoints.co.nz.",
    ],
  },
];

export default function MerchantTerms() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans">
      <header className="px-6 py-5 max-w-3xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🐾</span>
          <span className="text-xl font-bold tracking-tight">PawPoints</span>
        </Link>
        <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-900">
          ← Back home
        </Link>
      </header>

      <main className="px-6 pb-20 max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold tracking-tight mt-6 mb-1">
          Merchant Terms of Service
        </h1>
        <p className="text-sm text-zinc-500 mb-6">
          Version 1.0 · 6 September 2026 · SA Distribution Ltd
        </p>

        <a
          href="/pawpoints-merchant-terms.pdf"
          download
          className="inline-block rounded-lg bg-[#16B8A6] px-5 py-2.5 font-semibold text-white hover:bg-[#0A6B60] mb-8"
        >
          ⬇ Download as PDF
        </a>

        <div className="space-y-6">
          {sections.map((s) => (
            <section key={s.h}>
              <h2 className="text-lg font-bold mb-1">{s.h}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="text-[15px] leading-relaxed text-zinc-700 mb-2">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        <p className="mt-10 text-xs text-zinc-400">
          These terms are a plain-English agreement prepared by PawPoints. If
          anything is unclear, ask us before agreeing — support@pawpoints.co.nz.
        </p>
      </main>
    </div>
  );
}
