# Task Board (SemVer + Conventional Commits)

Status codes: pending | in_progress | blocked | done

| ID       | Title                                                    | Description                                                                                           | Complexity | Status |
|----------|----------------------------------------------------------|-------------------------------------------------------------------------------------------------------|------------|--------|
| TASK-000 | Repo standards                                           | Enforce SemVer and Conventional Commit style (commitlint/config), release/versioning workflow docs.   | Low        | done    |
| TASK-001 | Realtime choice                                          | Decide Supabase Realtime vs Firebase; document rationale and PoC plan.                                | Medium     | done    |
| TASK-002 | Bootstrap app                                            | Init Next.js (App Router, TS, Biome), Vercel config, baseline page.                                   | Medium     | done        |
| TASK-003 | Supabase wiring                                          | Env template, client/server helpers, connectivity/health route.                                       | Medium     | done        |
| TASK-004 | Domain schema                                            | Migrations for users (roles), garages, bids, bid session with default 30d; storage buckets for images.| Medium-High| done        |
| TASK-005 | Auth flows                                               | Supabase auth + Google Identity; registration form (first, last, email, role required; phone/address optional). | High       | done        |
| TASK-006 | Seller listing flow                                      | Create garage listing (size, address/location, images, price, bid end with default 30d), storage via signed URLs. | High       | in_progress |
| TASK-007 | Buyer flows                                              | Browse listings, listing detail, join bidding; buyer profile showing active participations.           | Medium     | done        |
| TASK-008 | Bidding service                                          | Command/validation, prevent late/low bids, return highest bid; API integration.                       | High       | pending |
| TASK-009 | Realtime bids                                            | Live updates on listing detail (≤1s lag) using chosen realtime provider.                              | High       | pending |
| TASK-010 | Analytics & feedback                                     | Event taxonomy (auth, listing views, bids, CTA clicks), consent/opt-out, server-side collector, in-app feedback prompts, basic analytics dashboard. | Medium-High| pending |
| TASK-011 | Metrics & observability                                  | Prometheus-compatible metrics endpoint, structured logging, tracing hooks, example dashboards.        | Medium     | pending |
| TASK-012 | Mobile-first UX                                          | Responsive/mobile-first layouts with clear CTAs; accessibility pass.                                  | Medium     | pending |
| TASK-013 | Testing & CI                                             | Unit tests domain, integration/API, smoke for analytics/metrics; CI pipeline green.                   | Medium     | pending |
| TASK-014 | Design system setup                                      | Add Tailwind + shadcn/ui setup and cn helper baseline.                                                | Medium     | done        |
| TASK-015 | CI/CD versioning                                         | GitHub Actions for lint/build and release/versioning automation.                                      | Medium     | done    |

