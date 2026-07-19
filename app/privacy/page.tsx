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
          Last updated: July 2026
        </p>

        <Section title="Who we are">
          <p>
            PawPoints is a mobile application operated from Auckland, New Zealand,
            that lets dog walkers earn rewards at participating local shops and cafés. This
            policy explains what personal information we collect, how we use it,
            and your rights under the New Zealand Privacy Act 2020 and, where
            applicable, the Australian Privacy Act 1988.
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
            <li><strong>Nearby cafés (on your device only):</strong> the Rewards screen uses your device&apos;s current location to sort cafés and partner businesses by distance. This matching happens <strong>entirely on your device</strong> — your location is never sent to our servers, stored, or shared for this feature.</li>
            <li><strong>Device data:</strong> a push notification token tied to your device, used to deliver in-app notifications.</li>
            <li><strong>Contacts (optional):</strong> if you choose to find friends from your phone&apos;s contacts, we send the contacts&apos; phone numbers to our server <strong>only to check who already uses PawPoints</strong>. The numbers are used for matching at that moment, are <strong>not stored</strong> on our servers, and your contacts&apos; names stay on your device.</li>
            <li><strong>Crash and diagnostic data:</strong> if the app crashes or hits an error, we collect a crash report (including device model, operating system version, and a technical stack trace) through our crash-reporting provider, Sentry, so we can fix the problem.</li>
            <li><strong>Redemption history:</strong> which rewards you redeemed at which partner business, and when.</li>
            <li><strong>Social activity:</strong> friend connections within the app and any comments you post on shared walks.</li>
          </ul>
        </Section>

        <Section title="How we use it">
          <ul className="list-disc pl-6 space-y-2">
            <li>To run the core service — track walks, award points, generate redemption codes, and confirm them at partner businesses.</li>
            <li>To match your dog&apos;s walks to a breed-appropriate target (using the breed and age you provide).</li>
            <li>To send push notifications about friend requests, accepted friendships, and shared walk photos. You can disable these in your device settings at any time.</li>
            <li>To show cafés and partner businesses near you, sorted by distance — computed on your device; your location does not leave your phone for this.</li>
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
            Walk photos are stored in Supabase Storage. Crash and diagnostic
            reports are processed by Sentry (
            <a href="https://sentry.io/privacy/" className="text-[#1D9E75] underline" target="_blank" rel="noopener noreferrer">sentry.io/privacy</a>
            ). These providers may store data outside New Zealand and Australia.
          </p>
        </Section>

        <Section title="Who can see your data">
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>You:</strong> can see all of your own data inside the app at any time.</li>
            <li><strong>Friends (within PawPoints):</strong> can see your name, dog name, and any walks/photos you share with them.</li>
            <li><strong>Partner businesses:</strong> see only your redemption code and the reward being claimed — not your account, walk history, or any other personal information.</li>
            <li><strong>PawPoints administrators:</strong> can access account and redemption records for fraud review and customer support.</li>
          </ul>
        </Section>

        <Section title="Mascot photos">
          <p>
            Our mascots, Hugo &amp; Daisy, are the founder&apos;s own fur babies —
            playing as the faces of PawPoints to celebrate happy, healthy walks
            for dogs and their humans. With the founder&apos;s consent, their walk
            photos are featured publicly on our website.
          </p>
          <p className="mt-3">
            This applies <strong>only</strong> to accounts we specifically
            designate as mascots. Your photos are <strong>never</strong> made
            public — your walk photos stay private to you and the friends you
            share them with, as described above.
          </p>
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

        <Section title="Australian users">
          <p>
            If you use PawPoints in Australia, the Australian Privacy Act 1988
            and the Australian Privacy Principles (APPs) also apply to how we
            handle your personal information. You have rights equivalent to those
            described above, including the right to access and correct your
            information and to make a complaint.
          </p>
          <p className="mt-3">
            If we cannot resolve a privacy complaint to your satisfaction, you
            may contact the Office of the Australian Information Commissioner at{" "}
            <a href="https://www.oaic.gov.au" className="text-[#1D9E75] underline" target="_blank" rel="noopener noreferrer">oaic.gov.au</a>.
          </p>
        </Section>

        <Section title="Data retention">
          <p>
            We keep your account data for as long as your account is active.
            If you request deletion, we remove your personal data within 30 days,
            except where we are legally required to retain certain records
            (such as financial transactions linked to partner business redemptions).
          </p>
        </Section>

        <Section title="Children">
          <p>
            PawPoints is intended for users aged 18 and over. We do not
            knowingly collect personal information from anyone under 18.
            If you believe someone under 18 has provided information to us,
            please contact us immediately so we can delete it.
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
