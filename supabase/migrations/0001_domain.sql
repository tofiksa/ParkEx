-- Domain schema for ParkEx (users/roles, garages, bids, defaults)
-- Run in Supabase SQL editor or via supabase CLI migrations.

-- Extensions
create extension if not exists "pgcrypto";
create extension if not exists "citext";

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('buyer', 'seller')),
  first_name text not null,
  last_name text not null,
  email citext not null unique,
  phone text,
  address text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles select own" on public.profiles
  for select using (auth.uid() = id);

create policy "Profiles insert self" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Profiles update self" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Garages
create table if not exists public.garages (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  size text not null,
  address text not null,
  start_price numeric(12,2) not null check (start_price > 0),
  bid_end_at timestamptz not null default (now() + interval '30 days'),
  images text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists garages_owner_idx on public.garages(owner_id);
create index if not exists garages_bid_end_idx on public.garages(bid_end_at);

alter table public.garages enable row level security;

create policy "Garages select all" on public.garages
  for select using (true);

create policy "Garages insert owner" on public.garages
  for insert with check (auth.uid() = owner_id);

create policy "Garages update owner" on public.garages
  for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- Bids
create table if not exists public.bids (
  id uuid primary key default gen_random_uuid(),
  garage_id uuid not null references public.garages(id) on delete cascade,
  bidder_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric(12,2) not null check (amount > 0),
  created_at timestamptz not null default now()
);

create index if not exists bids_garage_idx on public.bids(garage_id);
create index if not exists bids_garage_amount_idx on public.bids(garage_id, amount desc);

alter table public.bids enable row level security;

create policy "Bids select all" on public.bids
  for select using (true);

create policy "Bids insert active listing" on public.bids
  for insert with check (
    auth.uid() = bidder_id
    and exists (
      select 1
      from public.garages g
      where g.id = garage_id
        and g.bid_end_at > now()
    )
  );

-- Storage bucket for garage images
insert into storage.buckets (id, name, public)
values ('garage-images', 'garage-images', true)
on conflict do nothing;

