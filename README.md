# ParkEx Garage Marketplace

## Standards
- Versioning: SemVer (`MAJOR.MINOR.PATCH`).
- Commits: Conventional Commits; reference task/bug IDs when relevant (e.g., `feat(TASK-002): ...` or `fix(BUG-001): ...`).
- Lint/format: Biome (`npm run lint`, `npm run format`, `npm run check`).
- Hooks: Husky runs commitlint on `commit-msg`.
- Styling: TailwindCSS + shadcn/ui base config; `cn` helper in `lib/utils.ts`. Tailwind tokens/theme in `tailwind.config.ts`.
- CI/CD: GitHub Actions for lint+build (`.github/workflows/ci.yml`) and release/versioning via Release Please (`.github/workflows/release-please.yml`).
- Storage: bucket `garage-images` for uploads (signed URL endpoint `/api/storage/garage-upload-url`).

## Setup
1) Install deps: `npm install`
2) Enable hooks: `npm run prepare`
3) Utvikling: `npm run dev`
4) Bygg: `npm run build` og start: `npm run start`
5) Supabase env: kopier `env.example` til `.env.local` og fyll `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (service key kun på server).
6) Tester: `npm test` (Vitest, jsdom).

## Supabase wiring
- Klient: `lib/supabase/client.ts` bruker `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Server: `lib/supabase/server.ts` bruker `createServerClient` med cookies for App Router.
- Health endpoint: `GET /api/health` returnerer `{ status: "ok", timestamp }`.
- Domene/migrasjon: se `supabase/migrations/0001_domain.sql` og `docs/schema.md` (profiler, garasjer, bud, 30 dagers standard budfrist, RLS, storage bucket `garage-images`).
- Auth: Supabase auth med Google aktivert via `Auth` komponenter (pages `/login`, `/register`); profil-opprettelse via server action `app/(auth)/register/actions.ts` til `profiles`.
- Listings: Seller form på `/sell/new` (server action), API for opprettelse `/api/garages`; signed upload URL via `/api/storage/garage-upload-url`.
- Analytics: event collector `/api/analytics` (fields: name, path, sessionId, props) lagrer i `analytics_events` (RLS insert-all).
- Feedback: `/api/feedback` (message, optional rating 1-5, contact) lagrer i `feedback` (RLS insert-all).

## Commit message examples
- `feat(TASK-006): add seller listing form`
- `fix(BUG-001): prevent bids after deadline`

## Release notes
- Use SemVer; breaking changes bump MAJOR, backwards-compatible features bump MINOR, fixes bump PATCH.
- Capture notable changes per release in `CHANGELOG.md` (to be generated when release workflow is added).

