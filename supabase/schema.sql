-- Kallpa: esquema de base de datos para Supabase
-- Corre este archivo completo en Supabase Dashboard > SQL Editor > New query

-- 1. PERFILES
-- Extiende auth.users (Supabase ya maneja login anónimo automáticamente)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  initials text not null,
  carrera text,
  ciclo text,
  group_id uuid,
  created_at timestamptz default now()
);

-- 2. GRUPOS ("manchas")
create table if not exists groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  carrera text,
  ciclo text,
  created_at timestamptz default now()
);

alter table profiles
  add constraint fk_group foreign key (group_id) references groups(id) on delete set null;

-- 3. CHECK-INS
create table if not exists checkins (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references groups(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  mood text not null check (mood in ('bien', 'ok', 'cansada')),
  nota text,
  created_at timestamptz default now()
);

-- 4. MICRO-RETOS
create table if not exists challenges (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references groups(id) on delete cascade not null,
  titulo text not null,
  created_at timestamptz default now()
);

create table if not exists challenge_completions (
  challenge_id uuid references challenges(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  completed_at timestamptz default now(),
  primary key (challenge_id, user_id)
);

-- ROW LEVEL SECURITY
-- Para la demo del hackathon usamos políticas permisivas: cualquier usuario
-- autenticado (incluida sesión anónima) puede leer y escribir.
-- Para producción real, esto debería restringirse a "solo mi grupo".

alter table profiles enable row level security;
alter table groups enable row level security;
alter table checkins enable row level security;
alter table challenges enable row level security;
alter table challenge_completions enable row level security;

create policy "Cualquiera autenticado puede leer perfiles" on profiles
  for select using (auth.role() = 'authenticated');
create policy "Cualquiera autenticado puede crear su perfil" on profiles
  for insert with check (auth.uid() = id);
create policy "Cualquiera autenticado puede actualizar su perfil" on profiles
  for update using (auth.uid() = id);

create policy "Cualquiera autenticado puede leer grupos" on groups
  for select using (auth.role() = 'authenticated');
create policy "Cualquiera autenticado puede crear grupos" on groups
  for insert with check (auth.role() = 'authenticated');

create policy "Cualquiera autenticado puede leer check-ins" on checkins
  for select using (auth.role() = 'authenticated');
create policy "Cualquiera autenticado puede crear check-ins" on checkins
  for insert with check (auth.role() = 'authenticated');

create policy "Cualquiera autenticado puede leer retos" on challenges
  for select using (auth.role() = 'authenticated');
create policy "Cualquiera autenticado puede crear retos" on challenges
  for insert with check (auth.role() = 'authenticated');

create policy "Cualquiera autenticado puede leer completions" on challenge_completions
  for select using (auth.role() = 'authenticated');
create policy "Cualquiera autenticado puede marcar completions" on challenge_completions
  for insert with check (auth.role() = 'authenticated');

-- REALTIME
-- Activa la publicación de cambios en tiempo real para check-ins
alter publication supabase_realtime add table checkins;
alter publication supabase_realtime add table challenge_completions;
