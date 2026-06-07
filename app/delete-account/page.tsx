import Link from "next/link";

export const metadata = { title: "Delete Your Account" };

export default function DeleteAccount() {
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
        <h1 className="text-4xl font-extrabold mb-2">Delete Your Account</h1>
        <p className="text-sm text-zinc-500 mb-10">
          PawPoints · SA Distribution Limited · Auckland, New Zealand
        </p>

        <Section title="Option 1 — Delete in the app (fastest)">
          <p>You can permanently delete your PawPoints account directly from the app:</p>
          <ol className="list-decimal pl-6 mt-3 space-y-2">
            <li>Open the PawPoints app and sign in.</li>
            <li>Go to the <strong>Settings</strong> tab.</li>
            <li>Scroll to the <strong>Danger Zone</strong> and tap <strong>Delete My Account</strong>.</li>
            <li>Confirm. Your account and associated data are deleted immediately.</li>
          </ol>
        </Section>

        <Section title="Option 2 — Request deletion by email">
          <p>
            If you can&apos;t access the app, email us from the address linked to
            your account and we&apos;ll process the deletion for you:
          </p>
          <p className="mt-3">
            <a className="text-[#1D9E75] underline" href="mailto:support@pawpoints.co.nz?subject=Account%20deletion%20request">
              support@pawpoints.co.nz
            </a>
          </p>
          <p className="mt-3">
            Please send the request from your registered email address so we can
            verify your identity. We&apos;ll confirm deletion within 30 days, and
            usually much sooner.
          </p>
        </Section>

        <Section title="What gets deleted">
          <p>When you delete your account, we permanently remove:</p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>Your profile (name, email, phone number, profile photo).</li>
            <li>Your dog&apos;s details (name, breed, age).</li>
            <li>Your walk history, GPS data, and verification photos.</li>
            <li>Your points balance and redemption history.</li>
            <li>Your friend connections and any comments you posted.</li>
            <li>Your device push-notification token.</li>
          </ul>
        </Section>

        <Section title="What we may retain">
          <p>
            We may retain a limited set of records where we are legally required
            to — for example, transaction records linked to partner business redemptions for
            financial and fraud-prevention purposes. These are kept only as long
            as the law requires and are not used for any other purpose. Crash and
            diagnostic reports are de-identified and are not linked to your
            account after deletion.
          </p>
        </Section>

        <Section title="Questions">
          <p>
            For anything about account deletion or your data, contact{" "}
            <a className="text-[#1D9E75] underline" href="mailto:support@pawpoints.co.nz">
              support@pawpoints.co.nz
            </a>
            . See our{" "}
            <Link href="/privacy" className="text-[#1D9E75] underline">Privacy Policy</Link>{" "}
            for full details on how we handle your information.
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
