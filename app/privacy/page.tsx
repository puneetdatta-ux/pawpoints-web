import Link from "next/link";

export const metadata = { title: "Privacy Policy" };

export default function Privacy() {
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
        <h1 className="text-4xl font-extrabold mb-2">Privacy Policy</h1>
        <p className="text-sm text-zinc-500 mb-10">
          Last updated: May 2026
        </p>

        <Section title="Who we are">
          <p>
            PawPoints is a mobile application operated from Auckland, New Zealand,
            that lets dog walkers earn rewards at participating cafés. This
            policy explains what personal information we collect, how we use it,
            and your rights under the New Zealand Privacy Act 2020.
          </p>
          <p className="mt-3">
            Contact for any privacy enquiry: <a className="text-[#1D9E75] underline" href="mailto:support@pawpoints.co.nz">support@pawpoints.co.nz</a>.
          </p>
        </Section>

        <Section title="Information we collect">
          <p>When you use PawPoints we collect:</p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li><strong>Account data:</strong> email address, name, phone number (optional), and your profile photo if you upload one.</li>
            <li><strong>Dog information:</strong> dog name, breed, and age — used to set breed-appropriate walk targets.</li>
            <li><strong>Walk data:</strong> GPS location, distance, duration, and a verification photo taken at the end of each walk.</li>
            <li><strong>Device data:</strong> a push notification token tied to your device, used to deliver in-app notifications.</li>
            <li><strong>Redemption history:</strong> which rewards you redeemed at which partner café, and when.</li>
            <li><strong>Social activity:</strong> friend connections within the app and any comments you post on shared walks.</li>
          </ul>
        </Section>

        <Section title="How we use it">
          <ul className="list-disc pl-6 space-y-2">
            <li>To run the core service — track walks, award points, generate redemption codes, and confirm them at cafés.</li>
            <li>To match your dog&apos;s walks to a breed-appropriate target (using the breed and age you provide).</li>
            <li>To send push notifications about friend requests, accepted friendships, and shared walk photos. You can disable these in your device settings at any time.</li>
            <li>To detect and prevent fraudulent redemptions.</li>
            <li>To improve the app (aggregated and de-identified usage data only).</li>
          </ul>
          <p className="mt-3">We do <strong>not</strong> sell your personal information to third parties.</p>
        </Section>

        <Section title="Where your data is stored">
          <p>
            We use Supabase as our backend provider. Your data is stored on
            Supabase&apos;s infrastructure (currently in their default region,
            which may be outside New Zealand). Supabase is a third-party
            processor bound by their own privacy commitments —{" "}
            <a href="https://supabase.com/privacy" className="text-[#1D9E75] underline" target="_blank" rel="noopener noreferrer">supabase.com/privacy</a>.
          </p>
          <p className="mt-3">
            Push notifications are delivered via Expo&apos;s push service.
            Walk photos are stored in Supabase Storage.
          </p>
        </Section>

        <Section title="Who can see your data">
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>You:</strong> can see all of your own data inside the app at any time.</li>
            <li><strong>Friends (within PawPoints):</strong> can see your name, dog name, and any walks/photos you share with them.</li>
            <li><strong>Partner cafés:</strong> see only your redemption code and the reward being claimed — not your account, walk history, or any other personal information.</li>
            <li><strong>PawPoints administrators:</strong> can access account and redemption records for fraud review and customer support.</li>
          </ul>
        </Section>

        <Section title="Your rights">
          <p>Under the New Zealand Privacy Act 2020 you can:</p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>Request a copy of the personal information we hold about you.</li>
            <li>Ask us to correct anything that&apos;s wrong.</li>
            <li>Ask us to delete your account and personal data.</li>
            <li>Withdraw consent at any time by uninstalling the app and emailing us to confirm deletion.</li>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, email{" "}
            <a className="text-[#1D9E75] underline" href="mailto:support@pawpoints.co.nz">support@pawpoints.co.nz</a>.
            We&apos;ll respond within 20 working days.
          </p>
        </Section>

        <Section title="Data retention">
          <p>
            We keep your account data for as long as your account is active.
            If you request deletion, we remove your personal data within 30 days,
            except where we are legally required to retain certain records
            (such as financial transactions linked to café redemptions).
          </p>
        </Section>

        <Section title="Children">
          <p>
            PawPoints is intended for users aged 13 and over. We do not
            knowingly collect personal information from children under 13.
            If you believe a child has provided information to us, please
            contact us immediately so we can delete it.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            We may update this policy from time to time. Material changes will
            be announced in the app and via email. The &quot;Last updated&quot; date at
            the top reflects the most recent version.
          </p>
        </Section>

        <Section title="How to complain">
          <p>
            If you&apos;re not satisfied with how we handle a privacy concern,
            you can complain to New Zealand&apos;s Office of the Privacy
            Commissioner at{" "}
            <a href="https://www.privacy.org.nz" className="text-[#1D9E75] underline" target="_blank" rel="noopener noreferrer">privacy.org.nz</a>.
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
