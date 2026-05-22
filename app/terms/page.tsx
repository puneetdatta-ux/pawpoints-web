import Link from "next/link";

export const metadata = { title: "Terms of Service" };

export default function Terms() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans">
      <header className="px-6 py-5 max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🐾</span>
          <span className="text-xl font-bold tracking-tight">PawPoints</span>
        </Link>
        <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-900">
          ← Back home
        </Link>
      </header>

      <main className="px-6 pb-20 max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-2">Terms of Service</h1>
        <p className="text-sm text-zinc-500 mb-10">
          Last updated: May 2026
        </p>

        <Section title="Acceptance">
          <p>
            By creating a PawPoints account or using the PawPoints mobile app
            (the &quot;Service&quot;), you agree to these Terms. If you don&apos;t agree, please
            don&apos;t use the Service.
          </p>
        </Section>

        <Section title="Who we are">
          <p>
            PawPoints is operated from Auckland, New Zealand. For any question
            about these Terms, email{" "}
            <a href="mailto:puneetdatta@gmail.com" className="text-[#1D9E75] underline">
              puneetdatta@gmail.com
            </a>.
          </p>
        </Section>

        <Section title="Eligibility">
          <ul className="list-disc pl-6 space-y-2">
            <li>You must be at least 13 years old to use PawPoints.</li>
            <li>You must own or be responsible for the dog(s) you log walks for.</li>
            <li>You must provide accurate information (your real name, your dog&apos;s real breed and age).</li>
          </ul>
        </Section>

        <Section title="Your account">
          <p>
            You&apos;re responsible for keeping your login credentials secure. Don&apos;t
            share your account. Tell us immediately if you suspect unauthorised
            access. We may suspend or close accounts that violate these Terms,
            engage in fraud, or harm other users.
          </p>
        </Section>

        <Section title="Points & rewards">
          <ul className="list-disc pl-6 space-y-2">
            <li>Points are earned by completing GPS-tracked walks with a verification photo at the end.</li>
            <li>Points have no cash value, are non-transferable, and cannot be combined across accounts.</li>
            <li>For redemption purposes, points are valid for 10 days from the date earned.</li>
            <li>We reserve the right to adjust the points formula, expiry window, and reward catalog at any time.</li>
          </ul>
        </Section>

        <Section title="Fair use & fraud">
          <ul className="list-disc pl-6 space-y-2">
            <li>Each walker may redeem a maximum of 2 rewards per day and 3 per week (Mon–Sun NZT).</li>
            <li>Walks must reflect genuine activity with your dog. Spoofed GPS, recycled photos, or fake account activity will result in points being voided and accounts being suspended.</li>
            <li>If a café partner reports suspicious activity tied to your account, we may pause redemption privileges while we investigate.</li>
          </ul>
        </Section>

        <Section title="Café partner terms">
          <p>
            If you sign up a café as a partner: you agree to honour valid
            PawPoints redemption codes shown by a walker before the code
            expires, subject to your normal trading conditions (opening hours,
            stock availability). Subscription terms and pricing are provided
            separately at signup.
          </p>
        </Section>

        <Section title="Privacy">
          <p>
            Our handling of your personal information is governed by our{" "}
            <Link href="/privacy" className="text-[#1D9E75] underline">
              Privacy Policy
            </Link>
            , which forms part of these Terms.
          </p>
        </Section>

        <Section title="Service availability">
          <p>
            We try to keep PawPoints available 24/7 but offer no uptime
            guarantee. We may suspend the Service for maintenance, upgrades,
            or to address security issues — usually with advance notice.
          </p>
        </Section>

        <Section title="No warranties">
          <p>
            The Service is provided &quot;as is&quot;. To the maximum extent
            permitted by NZ law, we exclude all implied warranties about
            availability, accuracy, fitness for purpose, and non-infringement.
            Nothing in these Terms limits any rights you have under the NZ
            Consumer Guarantees Act 1993 that cannot be lawfully excluded.
          </p>
        </Section>

        <Section title="Limitation of liability">
          <p>
            To the extent permitted by law, PawPoints is not liable for any
            indirect or consequential loss arising from your use of the Service,
            including loss of points, missed rewards, or any incident at a
            partner café. Our total liability is limited to the amount you have
            paid us in the last 12 months (which, for free walker accounts, is
            zero).
          </p>
        </Section>

        <Section title="Termination">
          <p>
            You can delete your account at any time by emailing{" "}
            <a href="mailto:puneetdatta@gmail.com" className="text-[#1D9E75] underline">
              puneetdatta@gmail.com
            </a>
            . We can suspend or terminate your account if you breach these
            Terms or engage in fraudulent activity. On termination, accrued
            but unredeemed points are forfeited.
          </p>
        </Section>

        <Section title="Changes to these terms">
          <p>
            We may update these Terms. Material changes will be announced in
            the app and via email at least 14 days before they take effect.
            Continued use after the effective date means you accept the
            updated Terms.
          </p>
        </Section>

        <Section title="Governing law">
          <p>
            These Terms are governed by the laws of New Zealand. Any dispute
            will be heard in the New Zealand courts.
          </p>
        </Section>

        <p className="mt-12 text-sm text-zinc-500">
          PawPoints · Auckland, New Zealand
        </p>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold mb-3 text-[#1D9E75]">{title}</h2>
      <div className="text-zinc-700 leading-relaxed">{children}</div>
    </section>
  );
}
