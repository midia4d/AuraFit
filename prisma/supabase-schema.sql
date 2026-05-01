-- ============================================================
-- AuraFit Supabase Schema
-- Execute este SQL no SQL Editor do Supabase
-- (Dashboard → SQL Editor → New query → Cole e execute)
-- ============================================================

-- ── Enable UUID extension ──────────────────────────────────

create extension if not exists "pgcrypto";

-- ── user_profiles ──────────────────────────────────────────

create table if not exists public.user_profiles (
  id            uuid primary key default gen_random_uuid(),
  device_id     text unique not null,
  goal          text not null default 'maintenance',
  level         text not null default 'beginner',
  weight        numeric,
  height        numeric,
  name          text,
  streak        integer not null default 0,
  xp            integer not null default 0,
  weekly_goal   integer not null default 5,
  last_workout_date text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.user_profiles enable row level security;

-- Allow any client with anon key to read/write their own row (by device_id)
create policy "device_owner_all" on public.user_profiles
  for all using (true) with check (true);

-- ── workout_logs ───────────────────────────────────────────

create table if not exists public.workout_logs (
  id               uuid primary key default gen_random_uuid(),
  device_id        text not null,
  muscle_group     text not null,
  exercises        jsonb not null default '[]',
  xp_earned        integer not null default 0,
  duration_minutes integer not null default 0,
  logged_at        timestamptz not null default now()
);

alter table public.workout_logs enable row level security;

create policy "device_owner_all" on public.workout_logs
  for all using (true) with check (true);

create index if not exists workout_logs_device_id_idx on public.workout_logs (device_id);
create index if not exists workout_logs_logged_at_idx  on public.workout_logs (logged_at desc);

-- ── sleep_logs ─────────────────────────────────────────────

create table if not exists public.sleep_logs (
  id        uuid primary key default gen_random_uuid(),
  device_id text not null,
  hours     numeric not null,
  quality   text not null default 'good',
  logged_at timestamptz not null default now()
);

alter table public.sleep_logs enable row level security;

create policy "device_owner_all" on public.sleep_logs
  for all using (true) with check (true);

create index if not exists sleep_logs_device_id_idx on public.sleep_logs (device_id);

-- ── mood_logs ──────────────────────────────────────────────

create table if not exists public.mood_logs (
  id         uuid primary key default gen_random_uuid(),
  device_id  text not null,
  energy     integer not null check (energy between 1 and 10),
  motivation integer not null check (motivation between 1 and 10),
  logged_at  timestamptz not null default now()
);

alter table public.mood_logs enable row level security;

create policy "device_owner_all" on public.mood_logs
  for all using (true) with check (true);

create index if not exists mood_logs_device_id_idx on public.mood_logs (device_id);

-- ── updated_at trigger ─────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_user_profiles_updated_at
  before update on public.user_profiles
  for each row execute procedure public.set_updated_at();
