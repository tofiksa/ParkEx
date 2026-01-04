-- Analytics & feedback tables

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  path text,
  session_id text,
  props jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.analytics_events enable row level security;
-- Allow inserts from anyone (anon/auth); deny select by default.
create policy "analytics insert any" on public.analytics_events
  for insert with check (true);


create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  message text not null,
  rating int check (rating between 1 and 5),
  contact text,
  created_at timestamptz not null default now()
);

alter table public.feedback enable row level security;
create policy "feedback insert any" on public.feedback
  for insert with check (true);

