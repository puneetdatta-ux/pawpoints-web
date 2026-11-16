<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Working with Puneet (the founder)

Puneet often works from a phone, without a computer. When something can be
done either through a dashboard UI (Supabase, Vercel, etc.) or via SQL in
the Supabase SQL Editor, prefer giving SQL — paste-ready, one block, with a
verify query after it. Walk through remaining UI steps one at a time, not
as a batched list.

# Deploys (learned 2026-11-16)

- Pushing to `main` auto-deploys to pawpoints.co.nz via Vercel, but the push is
  NOT the deploy. After every push, verify the live page shows the change
  (e.g. `curl -s https://pawpoints.co.nz/privacy | grep "<new text>"`). A failed
  build keeps serving the old site and only emails Puneet.
- Vercel runs the full `npm run build` (type check + prerender of all pages).
  Validate with that exact command, never a compile-only build.
- The four site fonts are SELF-HOSTED in `app/fonts/` via `next/font/local`.
  Do not switch back to `next/font/google`: it downloads fonts from Google at
  build time, and one failed fetch (Hanken Grotesk, cold cache) killed two
  production deploys with 34 "module not found" errors.
- Keep builds free of anything fetched from the network at build time.
