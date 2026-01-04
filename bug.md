# Bug Log (SemVer + Conventional Commits)

Status codes: open | triaged | in_progress | fixed | closed | wontfix

| ID       | Title                 | Description / Repro steps                                      | Severity (S1–S4) | Status      | Reporter | Notes |
|----------|-----------------------|-----------------------------------------------------------------|------------------|-------------|----------|-------|
| BUG-000  | (reserve)             | Placeholder for first bug entry.                               | S4               | open        | -        | Use this as a template; add rows below. |
| BUG-001  | Tailwind PostCSS plugin missing | Running dev/build fails: “install @tailwindcss/postcss and update PostCSS config” from turbopack/postcss when processing `app/globals.css`. Repro: install deps per README, run `npm run dev` or `npm run build`; error about using `tailwindcss` directly as PostCSS plugin. | S2 | fixed | system | Resolved by downgrading Tailwind to v3, removing @tailwindcss/postcss, using standard postcss.config (tailwindcss+autoprefixer), and guarding Supabase env for build. |
| BUG-002  | Missing env example blocks setup | README step 5 says “copy env.example to .env.local”, but no env template exists in the repo (`.env.example` and `.env.local` both absent). Repro: run `ls .env*` or try `cp .env.example .env.local` in repo root—file missing. Without a template, Supabase keys and required vars are undocumented, blocking local setup. | S2 | open | assistant | Add an env example with required Supabase keys (URL, anon, service role, etc.) and defaults. |
| BUG-003  | `@/` alias unresolved – build fails across pages/APIs | `npm run build` fails with dozens of “Module not found: Can't resolve '@/lib/...’” for supabase clients, metrics, etc. (e.g., `app/api/bids/route.ts`, `app/(auth)/login/page.tsx`). Turbopack can't resolve the `@/` alias because `tsconfig.json` lacks `baseUrl`/`paths`, so every alias import breaks. | S1 | open | assistant | Add `compilerOptions.baseUrl: "."` and `paths` for `@/*` (and rerun build) to unblock dev/build/runtime. |

