# Realtime Decision (TASK-001)

## Goals
- Near-realtime bid updates on listing detail (≈1s lag target).
- Single auth surface (reuse app auth), minimal extra infra, mobile-first friendly.
- Works with Supabase/Postgres row-level security and event-driven design.

## Options
1) **Supabase Realtime (Postgres CDC)**
   - Pros: Same auth (Supabase JWT), respects RLS, zero extra SDK, fits hexagonal adapter story, no dual-identity problems, fewer secrets.
   - Cons: Latency tied to replication (usually sub-second), requires enabling replication on tables; needs channel naming and presence limits.
2) **Firebase Realtime/Firestore**
   - Pros: Battle-tested realtime; good mobile SDKs.
   - Cons: Dual auth surface (Google/Firebase vs Supabase), extra billing/project, RLS not shared, duplicate data syncing or triggers; more ops and complexity.

## Decision
- **Choose Supabase Realtime** for bidding channels; avoid Firebase to keep auth and policy unified and reduce moving parts.

## PoC Plan
1) Enable replication for `bids` table in Supabase.
2) Server: ensure RLS policies allow select/insert for authenticated users with role-based constraints (buyers can bid; sellers read).
3) Client: subscribe via `supabase.channel('bids:<listingId>')` with a `postgres_changes` filter on `bids` table scoped to listing_id.
4) Emit events on insert/update; update UI state with highest bid ordering.
5) Measure latency (two browser sessions) and ensure disconnect/reconnect handling; set presence off for now (optional later).

## Risks / Mitigations
- **Latency spikes**: keep payloads small; index `bids(listing_id, created_at)`; consider optimistic UI for local feedback.
- **Policy gaps**: test RLS for both roles; block bids after deadline at DB and service layer.
- **Throughput**: set sensible channel per-listing; paginate historical bids via REST/RPC, use realtime only for new events.

## Instrumentation
- Add metrics: bid event RTT, subscription errors, reconnects.
- Add logs: subscription lifecycle, policy failures.

