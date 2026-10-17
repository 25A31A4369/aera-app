# AERA — Find Shade. Find Relief.

Mobile-first app that helps outdoor workers find drinking water, shade and rest spots, and see how recently each place was confirmed.

## Stack

TanStack Start (React 19, TypeScript), Tailwind CSS v4, Lovable Cloud (Postgres + Auth, Supabase-compatible).

## Local setup

```bash
bun install
bun run dev        # http://localhost:8080
```

## Environment variables (`.env`)

Only public, browser-safe values are needed:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

Never put a service-role key or database password in frontend code or `VITE_` variables.

## Database, RLS and demo data

Schema lives in the applied migration (`drizzle/migrations/`). Tables: `profiles`, `facilities`, `facility_reports`, `saved_facilities`.

- RLS is enabled on every table.
- `profiles`: readable/editable only by the owner. Auto-created on sign-up.
- `facilities`: public read; no client writes.
- `facility_reports`: public read; insert only by signed-in users with `user_id = auth.uid()`; no update/delete. A trigger blocks repeat reports by the same user on the same place within 2 minutes, and bumps `last_confirmed_at` on "Still Available".
- `saved_facilities`: users read/insert/delete only their own rows; unique `(user_id, facility_id)`.
- Demo seed: 4 fictional facilities and sample reports with `is_demo = true`, shown in the UI with a **DEMO DATA** label. Seed times are relative to when the migration ran, so the "recent" demo items naturally become stale after 24 hours.

## Trust status (`src/lib/trust.ts`)

`FRESHNESS_HOURS = 24` (configurable).

- Mixed recent reports → **Status Uncertain**
- Only negative recent reports → **Status Uncertain**
- Only positive recent reports, or confirmation within window → **Recently Confirmed**
- Otherwise → **Needs Reconfirmation**
  Every badge shows its reason; community reports are never presented as independent verification.

## GitHub & deployment

Connect GitHub from the Lovable editor (Connectors → GitHub). Publish from the Lovable editor. The app is also deployable to any Cloudflare-Workers-compatible host with the env vars above.

## Manual test checklist

- [ ] Explore loads, search and filters work, DEMO DATA labels visible
- [ ] "Use location" — allow and deny both show a clear message
- [ ] Facility page shows "Not confirmed" for unknown fields and the trust reason
- [ ] Sign up → confirmation email → sign in; forgot password → reset link → new password
- [ ] Save / unsave persists after refresh; appears in Saved
- [ ] Submit report → appears in history and Profile; second report within 2 min is rejected
- [ ] Signed out: Save/Report prompt for sign-in
