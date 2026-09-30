# PawPoints website (pawpoints.co.nz)

The marketing site, sign-up flows, merchant portal and founder admin tools for
PawPoints — the NZ dog-walking rewards app. The mobile app itself lives in a
separate repository; both share one Supabase project (database, auth, storage).

Last reviewed: 30 Sep 2026.

## Stack

- Next.js (App Router) + React + Tailwind, deployed on Vercel (production
  tracks `main`; every merge to `main` deploys www.pawpoints.co.nz)
- Supabase: Postgres + RLS, Auth (email/password with email confirmation),
  storage for photos
- Email: outbound founder alerts via Gmail SMTP (nodemailer); Supabase Auth
  sends its own confirmation/reset emails through the same SMTP account;
  store-code emails go via a `send-store-code` edge function (Resend)

## Public pages

| Route | What it is |
|---|---|
| `/` | Homepage: hero, how-it-works, Fair-Paw goals, business pitch, mascot gallery, Play Store links. Nav: "Log in" + "Join for free" |
| `/how-points-work` | Points-earning explainer |
| `/why-it-matters` | Mission page |
| `/gallery` | Featured mascot photo gallery (public bucket) |
| `/join-walker` | Walker sign-up: account + first dog metadata (server trigger builds profile/dog), email-link verification |
| `/join-merchant` | Merchant application: creates the account, files a `merchant_applications` row, requires viewing + agreeing to Merchant Terms (v1.1 recorded), email-link verification, triggers the founder alert |
| `/email-confirmed` | Landing page for the confirmation link: congratulations + Play Store QR + "iOS coming soon", celebration overlay |
| `/login`, `/forgot-password`, `/reset-password` | Auth pages |
| `/terms`, `/privacy`, `/merchant-terms`, `/delete-account` | Legal + account deletion |

Site-wide: `SiteCelebration` mounts an ambient celebration (confetti,
fireworks, Hugo running slow laps — 45 s/lap) on marketing pages only;
excluded on portal/admin/legal pages; honours `prefers-reduced-motion`.

## Signed-in areas

- `/account` (+ `/account/rewards`, `/account/friends`, `/account/photos`):
  walker's web account — points history, friends, photos.
- `/merchant`: merchant portal — owner views their business and proposes/edits
  rewards through owner-gated SECURITY DEFINER RPCs (`get_my_merchant`,
  `merchant_list_rewards`, `merchant_upsert_reward`,
  `merchant_set_reward_active`, reward message thread RPCs). Proposals land
  `approval='pending'`.
- `/admin/rewards`: founder-only review queue (gated by `app_admins` /
  `is_app_admin`), calls `admin_review_reward(p_id, p_verdict, p_message)`
  with verdicts approve / changes / reject.

## Email + approval pipelines

**Merchant application → live merchant**
1. `/join-merchant` signs the account up (link verification via
   `/auth/callback?next=/email-confirmed`), inserts the application with a
   client-generated id (RLS allows anon insert but not select), then POSTs
   `/api/applications/notify`.
2. `notify` (service role) re-reads the row, emails the founder every field
   plus an HMAC-signed Approve link, stamps `notified_at` (idempotent).
3. `/api/applications/approve` verifies the HMAC and calls the
   `admin_approve_application(app_id uuid) → jsonb` DB function
   (`supabase/admin_approve_application.sql`): merchants row (unique slug,
   5-digit store code), owner link in `merchant_operators`, trial
   `merchant_subscriptions` row, application marked approved, best-effort
   store-code email via the `send-store-code` edge function. Idempotent on
   re-click. PIN and address/lat/lng stay manual on purpose.

**Reward proposal → live reward**
1. A DB trigger (`reward_review_alert` → `public.notify_reward_review`,
   pg_net) POSTs to `/api/rewards/notify` with an `x-webhook-secret` header.
2. `notify` emails the founder the full offer (photo, description, terms,
   validity, 1,000-point wallet-cap warning) with signed Approve/Reject
   links; `review_notified_at` makes it idempotent.
3. `/api/rewards/review`: Approve is one click → live immediately; Reject
   shows a form demanding a reason, which is saved to the reward's message
   thread. The merchant's verdict email is sent by the
   `pp_notify_reward_verdict` DB trigger, so it fires identically from the
   email links, `/admin/rewards`, or the app.

Both flows detect already-registered emails on sign-up (Supabase's
anti-enumeration fake success: empty `identities`) and show a
"this email already has an account" message instead of waiting for an email
that will never come.

## Environment variables (Vercel)

| Var | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | optional overrides; public defaults are in `lib/supabase/config.ts` |
| `SUPABASE_SERVICE_ROLE_KEY` | server routes (bypasses RLS) — secret |
| `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, (`SMTP_HOST`, `SMTP_PORT`) | founder alert emails (Gmail app password) |
| `APPROVAL_SECRET` | HMAC key for approve/reject links |
| `REWARDS_WEBHOOK_SECRET` | shared secret the reward DB trigger sends in `x-webhook-secret` |

## Supabase config this site depends on

- Auth "Confirm signup" template uses `{{ .ConfirmationURL }}` (link flow)
- Redirect URLs include `https://www.pawpoints.co.nz/auth/callback` (+ non-www)
- SMTP configured (currently Gmail; Resend recommended long-term)
- `pg_net` extension + `reward_review_alert` trigger on `merchant_rewards`
- Function from `supabase/admin_approve_application.sql` applied
- Columns: `merchant_applications.status/approved_at/notified_at`,
  `merchant_rewards.review_notified_at`

## Developing

```bash
npm install
npm run dev        # http://localhost:3000
npx tsc --noEmit && npx eslint app lib && npm run build   # pre-push checks
```

See `AGENTS.md` for contributor/agent conventions (including: this Next.js
version has breaking changes — read `node_modules/next/dist/docs/` first).
