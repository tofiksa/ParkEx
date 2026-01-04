# Domain Schema (TASK-004)

## Tables
- `profiles`: mirrors `auth.users` with role (`buyer`/`seller`), first/last name, email (citext), phone, address. RLS: select/insert/update self only.
- `garages`: garage listings with owner_id, title, description, size, address, start_price, `bid_end_at` default 30 days, images text[]. RLS: select all; insert/update owner.
- `bids`: bids per garage with bidder_id, amount, created_at. RLS: select all; insert only if bidder = auth.uid and listing is still open (`bid_end_at > now()`).
- App validation adds: no bidding on own listing; amount must be > max(start_price, current top).
- Storage bucket: `garage-images` (public) for listing assets.

## Defaults
- `bid_end_at` on garages defaults to `now() + interval '30 days'`.

## Policies
- Profiles: owner-only select/insert/update.
- Garages: public read; owner write.
- Bids: public read; insert only for authenticated user on active listings.

## Migration
- SQL at `supabase/migrations/0001_domain.sql` (run in Supabase SQL editor or via CLI).

