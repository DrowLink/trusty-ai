-- ==========================================================
-- TRUSTY.bot™ — Supabase PostgreSQL Database Schema
-- Ejecuta este script en el SQL Editor de tu panel de Supabase:
-- https://supabase.com/dashboard/project/_/sql
-- ==========================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. PROFILES TABLE (vinculada a auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  role text default 'user' not null,
  tier text default 'community' not null,
  audits_count int default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS en profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone." 
  on public.profiles for select using (true);

create policy "Users can update their own profile." 
  on public.profiles for update using (auth.uid() = id);

-- Trigger para crear perfil automáticamente al registrarse en Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, tier)
  values (new.id, new.email, 'community');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. AGENTS TABLE (Buró de reputación y crédito)
create table if not exists public.agents (
  id text primary key,
  name text not null,
  slug text not null,
  category text not null,
  source_ecosystem text not null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Índices de alto rendimiento
create index if not exists idx_agents_category on public.agents (category);
create index if not exists idx_agents_source_ecosystem on public.agents (source_ecosystem);
create index if not exists idx_agents_slug on public.agents (slug);

-- Habilitar RLS en agents
alter table public.agents enable row level security;

-- Políticas para agents:
-- 1. Cualquiera puede consultar los agentes del buró (lectura pública)
create policy "Agents are viewable by everyone" 
  on public.agents for select using (true);

-- 2. Inserción y actualización permitida para usuarios autenticados y clave de servicio/anon
create policy "Allow upsert for agents" 
  on public.agents for all using (true) with check (true);
