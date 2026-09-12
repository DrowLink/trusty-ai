-- ==========================================================
-- TRUSTY.bot™ — Intent Authorization Schema (Brex, Ramp & Slash)
-- ==========================================================

create extension if not exists "uuid-ossp";

-- 1. MANDATES TABLE (Confirmed Human Spending Boundaries)
create table if not exists public.mandates (
  id text primary key,
  title text not null,
  version text default 'v1.0 (Human Confirmed)' not null,
  status text default 'ACTIVE' not null, -- 'ACTIVE', 'DRAFT', 'REVOKED', 'EXHAUSTED'
  principal_name text not null,
  principal_role text not null,
  description text default '',
  budget_total numeric(12, 2) not null,
  budget_spent numeric(12, 2) default 0.00 not null,
  budget_reserved numeric(12, 2) default 0.00 not null,
  currency text default 'USD' not null,
  clearing_rail text not null, -- 'Brex', 'Ramp', 'Slash', 'Multi-Rail'
  card_identifier text default '',
  items_constraint jsonb not null default '{}'::jsonb,
  delivery_address jsonb not null default '{}'::jsonb,
  allowed_vendors jsonb not null default '[]'::jsonb,
  approvers jsonb not null default '[]'::jsonb,
  auto_approval_max numeric(12, 2) default 0.00 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone default timezone('utc'::text, now() + interval '30 days') not null
);

create index if not exists idx_mandates_status on public.mandates (status);
create index if not exists idx_mandates_clearing_rail on public.mandates (clearing_rail);

-- 2. APPROVAL_QUEUE TABLE (Intercepted REQUIRE_HUMAN Transactions)
create table if not exists public.approval_queue (
  id text primary key,
  mandate_id text references public.mandates(id) on delete set null,
  mandate_title text not null,
  agent_id text not null,
  agent_name text not null,
  requested_amount numeric(12, 2) not null,
  budget_limit numeric(12, 2) not null,
  clearing_rail text not null,
  vendor text not null,
  status text default 'PENDING_REVIEW' not null, -- 'PENDING_REVIEW', 'APPROVED_EXCEPTION', 'DECLINED', 'ADJUSTMENT_REQUESTED'
  mismatch_type text not null, -- 'QUANTITY_MISMATCH', 'SPEC_MISMATCH', 'DELIVERY_MISMATCH', 'VENDOR_MISMATCH', 'BUDGET_OVERFLOW'
  mismatch_severity text default 'HIGH' not null,
  reason text not null,
  cart_snapshot jsonb not null default '{}'::jsonb,
  criteria_checks jsonb not null default '[]'::jsonb,
  resolution_note text default '',
  resolved_at timestamp with time zone,
  resolved_by text default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_approval_queue_status on public.approval_queue (status);
create index if not exists idx_approval_queue_mandate on public.approval_queue (mandate_id);

-- 3. DECISIONS TABLE (Immutable Cryptographic Audit Trail)
create table if not exists public.decisions (
  id text primary key,
  mandate_id text,
  mandate_title text not null,
  agent_id text not null,
  agent_name text not null,
  decision text not null, -- 'APPROVED', 'DECLINED', 'HUMAN_REVIEW_RESOLVED'
  amount numeric(12, 2) not null,
  currency text default 'USD' not null,
  rail text not null,
  vendor text not null,
  cart_hash text not null,
  intent_match_ratio numeric(4, 2) default 1.00 not null,
  execution_status text not null, -- 'CONFIRMED_ON_RAIL', 'BLOCKED_PRE_PAYMENT', 'EXCEPTION_EXECUTED'
  criteria jsonb not null default '[]'::jsonb,
  proof_json jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_decisions_rail on public.decisions (rail);
create index if not exists idx_decisions_decision on public.decisions (decision);
create index if not exists idx_decisions_created_at on public.decisions (created_at desc);

-- RLS Policies
alter table public.mandates enable row level security;
alter table public.approval_queue enable row level security;
alter table public.decisions enable row level security;

-- Allow public read and upsert for MVP
create policy "Allow all access to mandates" on public.mandates for all using (true) with check (true);
create policy "Allow all access to approval_queue" on public.approval_queue for all using (true) with check (true);
create policy "Allow all access to decisions" on public.decisions for all using (true) with check (true);
