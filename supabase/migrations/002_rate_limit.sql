-- ============================================================
-- AI Spend Audit — Rate Limiting Schema & RPC
-- Run this in your Supabase SQL editor
-- ============================================================

-- Create rate_limits table
create table if not exists public.rate_limits (
  ip          text primary key,
  count       int not null default 1,
  reset_at    timestamptz not null
);

-- Index for faster cleaning operations
create index if not exists idx_rate_limits_reset_at on public.rate_limits(reset_at);

-- Row Level Security
alter table public.rate_limits enable row level security;

-- Leads: only service role can access rate limits table
create policy "Service role can manage rate limits"
  on public.rate_limits for all
  using (auth.role() = 'service_role');

-- Create function to check and increment rate limit atomically
create or replace function check_rate_limit(
  client_ip text,
  max_requests int,
  window_seconds int
) returns boolean as $$
declare
  current_count int;
  current_reset timestamptz;
  now_time timestamptz := now();
begin
  -- Delete expired entries
  delete from public.rate_limits where reset_at < now_time;

  -- Atomic upsert: insert or increment
  insert into public.rate_limits (ip, count, reset_at)
  values (client_ip, 1, now_time + (window_seconds || ' seconds')::interval)
  on conflict (ip) do update
  set count = rate_limits.count + 1
  where rate_limits.count < max_requests
  returning count into current_count;

  -- If no row returned, limit was exceeded
  if current_count is null then
    return false;
  end if;

  return true;
end;
$$ language plpgsql security definer;

-- Comments
comment on table public.rate_limits is 'IP rate limiting tracking table';
comment on function check_rate_limit is 'Atomically check and increment the rate limit for a client IP';
