-- ============================================================
-- AI Spend Audit — Supabase Database Schema
-- Run this in your Supabase SQL editor
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ─── Audits Table ────────────────────────────────────────────
create table if not exists public.audits (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  tools            jsonb not null default '[]'::jsonb,
  team_size        int,
  use_case         text,
  current_monthly  numeric(10, 2),
  optimized_monthly numeric(10, 2),
  monthly_savings  numeric(10, 2),
  annual_savings   numeric(10, 2),
  recommendations  jsonb not null default '[]'::jsonb,
  summary          text,
  is_public        boolean not null default true
);

-- ─── Leads Table ─────────────────────────────────────────────
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  audit_id    uuid references public.audits(id) on delete set null,
  email       text not null,
  company     text,
  role        text,
  team_size   text,
  created_at  timestamptz not null default now()
);

-- ─── Indexes ─────────────────────────────────────────────────
create index if not exists idx_audits_created_at on public.audits(created_at desc);
create index if not exists idx_audits_monthly_savings on public.audits(monthly_savings desc);
create index if not exists idx_leads_audit_id on public.leads(audit_id);
create index if not exists idx_leads_email on public.leads(email);

-- ─── Row Level Security ──────────────────────────────────────
alter table public.audits enable row level security;
alter table public.leads enable row level security;

-- Audits: anyone can read public audits
create policy "Public audits are readable"
  on public.audits for select
  using (is_public = true);

-- Audits: only service role can insert/update/delete
create policy "Service role can manage audits"
  on public.audits for all
  using (auth.role() = 'service_role');

-- Leads: only service role can access
create policy "Service role can manage leads"
  on public.leads for all
  using (auth.role() = 'service_role');

-- ─── Comments ────────────────────────────────────────────────
comment on table public.audits is 'AI spend audit results, publicly shareable via UUID';
comment on table public.leads is 'Lead captures from audit results page (email + optional context)';
comment on column public.audits.tools is 'Array of AuditEntry objects (toolId, planId, seats, monthlySpend)';
comment on column public.audits.recommendations is 'Array of Recommendation objects from the audit engine';
