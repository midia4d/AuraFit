-- ============================================================
-- AuraFit Supabase Schema V2 — Admin + SaaS Platform
-- Execute no SQL Editor do Supabase APÓS o schema V1
-- ============================================================

-- ── ADMIN USERS (link to Supabase Auth) ──────────────────────

create table if not exists public.admin_users (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  name       text,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create policy "admin_self_read" on public.admin_users
  for select using (auth.uid() = id);

-- ── EXERCISES LIBRARY (editable by admin) ────────────────────

create table if not exists public.exercises (
  id                text primary key,
  name              text not null,
  name_en           text not null,
  muscle_group      text not null,
  muscles_worked    text,
  muscles_worked_en text,
  description       text,
  description_en    text,
  difficulty        text not null default 'intermediate',
  image_url         text,
  is_active         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

alter table public.exercises enable row level security;

create policy "public_read_exercises" on public.exercises
  for select using (is_active = true);

create policy "admin_all_exercises" on public.exercises
  for all using (
    auth.uid() in (select id from public.admin_users)
  ) with check (
    auth.uid() in (select id from public.admin_users)
  );

create index if not exists exercises_muscle_group_idx on public.exercises (muscle_group);

-- ── DIET PLANS (admin-created) ────────────────────────────────

create table if not exists public.diet_plans (
  id             uuid primary key default gen_random_uuid(),
  created_by     uuid references public.admin_users(id),
  name           text not null,
  name_en        text,
  goal           text not null default 'maintenance',
  is_premium     boolean not null default false,
  total_calories integer,
  protein_g      integer,
  carbs_g        integer,
  fats_g         integer,
  description    text,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table public.diet_plans enable row level security;

create policy "public_read_free_diets" on public.diet_plans
  for select using (is_premium = false and is_active = true);

create policy "all_read_diets_for_premium" on public.diet_plans
  for select using (
    is_active = true and (
      is_premium = false
      or auth.uid() in (select id from public.admin_users)
    )
  );

create policy "admin_all_diets" on public.diet_plans
  for all using (
    auth.uid() in (select id from public.admin_users)
  ) with check (
    auth.uid() in (select id from public.admin_users)
  );

create index if not exists diet_plans_goal_idx on public.diet_plans (goal, is_active);

-- ── DIET MEALS (meals within a plan) ─────────────────────────

create table if not exists public.diet_meals (
  id          uuid primary key default gen_random_uuid(),
  plan_id     uuid not null references public.diet_plans(id) on delete cascade,
  meal_type   text not null,
  name        text not null,
  name_en     text,
  calories    integer,
  protein_g   integer,
  carbs_g     integer,
  fats_g      integer,
  foods       jsonb not null default '[]',
  foods_en    jsonb not null default '[]',
  sort_order  integer not null default 0
);

alter table public.diet_meals enable row level security;

create policy "read_meals_via_plan" on public.diet_meals
  for select using (
    exists (
      select 1 from public.diet_plans dp
      where dp.id = plan_id and dp.is_active = true
    )
  );

create policy "admin_all_meals" on public.diet_meals
  for all using (
    auth.uid() in (select id from public.admin_users)
  ) with check (
    auth.uid() in (select id from public.admin_users)
  );

create index if not exists diet_meals_plan_idx on public.diet_meals (plan_id, sort_order);

-- ── WORKOUT PLANS (admin-created) ─────────────────────────────

create table if not exists public.workout_plans (
  id             uuid primary key default gen_random_uuid(),
  created_by     uuid references public.admin_users(id),
  name           text not null,
  name_en        text,
  level          text not null default 'beginner',
  goal           text,
  duration_weeks integer,
  is_premium     boolean not null default false,
  description    text,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table public.workout_plans enable row level security;

create policy "public_read_free_plans" on public.workout_plans
  for select using (is_premium = false and is_active = true);

create policy "admin_all_plans" on public.workout_plans
  for all using (
    auth.uid() in (select id from public.admin_users)
  ) with check (
    auth.uid() in (select id from public.admin_users)
  );

-- ── WORKOUT SESSIONS (days within a plan) ────────────────────

create table if not exists public.workout_sessions (
  id            uuid primary key default gen_random_uuid(),
  plan_id       uuid not null references public.workout_plans(id) on delete cascade,
  day_number    integer not null,
  name          text not null,
  name_en       text,
  muscle_groups text[] default '{}',
  rest_day      boolean not null default false
);

alter table public.workout_sessions enable row level security;

create policy "read_sessions_via_plan" on public.workout_sessions
  for select using (
    exists (
      select 1 from public.workout_plans wp
      where wp.id = plan_id and wp.is_active = true
    )
  );

create policy "admin_all_sessions" on public.workout_sessions
  for all using (auth.uid() in (select id from public.admin_users))
  with check (auth.uid() in (select id from public.admin_users));

-- ── SESSION EXERCISES ─────────────────────────────────────────

create table if not exists public.session_exercises (
  id           uuid primary key default gen_random_uuid(),
  session_id   uuid not null references public.workout_sessions(id) on delete cascade,
  exercise_id  text references public.exercises(id),
  sets         integer,
  reps         text,
  rest_seconds integer,
  notes        text,
  sort_order   integer not null default 0
);

alter table public.session_exercises enable row level security;

create policy "read_session_exercises" on public.session_exercises for select using (true);

create policy "admin_all_session_exercises" on public.session_exercises
  for all using (auth.uid() in (select id from public.admin_users))
  with check (auth.uid() in (select id from public.admin_users));

-- ── CHALLENGES (weekly / monthly) ────────────────────────────

create table if not exists public.challenges (
  id             uuid primary key default gen_random_uuid(),
  created_by     uuid references public.admin_users(id),
  title          text not null,
  title_en       text,
  description    text,
  description_en text,
  type           text not null default 'weekly',
  category       text not null default 'workout',
  goal_value     integer not null default 5,
  goal_unit      text not null default 'workouts',
  xp_reward      integer not null default 100,
  starts_at      timestamptz,
  ends_at        timestamptz,
  is_premium     boolean not null default false,
  is_active      boolean not null default true,
  banner_color   text default '#39FF14',
  created_at     timestamptz not null default now()
);

alter table public.challenges enable row level security;

create policy "public_read_challenges" on public.challenges
  for select using (is_premium = false and is_active = true);

create policy "admin_all_challenges" on public.challenges
  for all using (auth.uid() in (select id from public.admin_users))
  with check (auth.uid() in (select id from public.admin_users));

create index if not exists challenges_active_idx on public.challenges (is_active, ends_at);

-- ── CHALLENGE PARTICIPANTS ────────────────────────────────────

create table if not exists public.challenge_participants (
  id           uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  device_id    text not null,
  progress     integer not null default 0,
  completed    boolean not null default false,
  completed_at timestamptz,
  joined_at    timestamptz not null default now(),
  unique(challenge_id, device_id)
);

alter table public.challenge_participants enable row level security;

create policy "device_all_participants" on public.challenge_participants
  for all using (true) with check (true);

create policy "admin_read_participants" on public.challenge_participants
  for select using (auth.uid() in (select id from public.admin_users));

create index if not exists challenge_participants_challenge_idx on public.challenge_participants (challenge_id);
create index if not exists challenge_participants_device_idx   on public.challenge_participants (device_id);

-- ── USER SUBSCRIPTIONS (premium status, granted by admin) ────

create table if not exists public.user_subscriptions (
  id          uuid primary key default gen_random_uuid(),
  device_id   text not null unique,
  plan        text not null default 'free',
  starts_at   timestamptz,
  expires_at  timestamptz,
  granted_by  uuid references public.admin_users(id),
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.user_subscriptions enable row level security;

create policy "device_read_subscription" on public.user_subscriptions
  for select using (true);

create policy "admin_all_subscriptions" on public.user_subscriptions
  for all using (auth.uid() in (select id from public.admin_users))
  with check (auth.uid() in (select id from public.admin_users));

create index if not exists user_subscriptions_device_idx on public.user_subscriptions (device_id);

-- ── CUSTOM DIETS (personalized by admin for premium users) ───

create table if not exists public.custom_diets (
  id           uuid primary key default gen_random_uuid(),
  device_id    text not null,
  plan_id      uuid references public.diet_plans(id),
  custom_notes text,
  assigned_by  uuid references public.admin_users(id),
  assigned_at  timestamptz not null default now(),
  expires_at   timestamptz,
  is_active    boolean not null default true
);

alter table public.custom_diets enable row level security;

create policy "device_read_custom_diet" on public.custom_diets for select using (true);

create policy "admin_all_custom_diets" on public.custom_diets
  for all using (auth.uid() in (select id from public.admin_users))
  with check (auth.uid() in (select id from public.admin_users));

create index if not exists custom_diets_device_idx on public.custom_diets (device_id, is_active);

-- ── APP SETTINGS (global config) ─────────────────────────────

create table if not exists public.app_settings (
  key        text primary key,
  value      jsonb,
  updated_by uuid references public.admin_users(id),
  updated_at timestamptz not null default now()
);

alter table public.app_settings enable row level security;

create policy "public_read_settings" on public.app_settings for select using (true);

create policy "admin_all_settings" on public.app_settings
  for all using (auth.uid() in (select id from public.admin_users))
  with check (auth.uid() in (select id from public.admin_users));

-- ── Seed default app settings ─────────────────────────────────

insert into public.app_settings (key, value) values
  ('app_name',         '"AuraFit"'),
  ('maintenance_mode', 'false'),
  ('premium_features', '["advanced_diets","custom_workouts","weekly_challenges","monthly_challenges"]')
on conflict (key) do nothing;

-- ── Updated_at triggers for new tables ────────────────────────
-- (set_updated_at function already exists from schema v1)

create trigger set_exercises_updated_at
  before update on public.exercises
  for each row execute procedure public.set_updated_at();

create trigger set_diet_plans_updated_at
  before update on public.diet_plans
  for each row execute procedure public.set_updated_at();

create trigger set_workout_plans_updated_at
  before update on public.workout_plans
  for each row execute procedure public.set_updated_at();

create trigger set_user_subscriptions_updated_at
  before update on public.user_subscriptions
  for each row execute procedure public.set_updated_at();
