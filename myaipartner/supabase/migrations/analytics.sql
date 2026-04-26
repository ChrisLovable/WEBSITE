-- Analytics events table
create table if not exists analytics_events (
  id uuid default gen_random_uuid() primary key,
  session_id text not null,
  event_type text not null,
  page text not null,
  element text,
  metadata jsonb default '{}',
  duration_ms integer,
  created_at timestamptz default now()
);

-- Analytics sessions table
create table if not exists analytics_sessions (
  id text primary key,
  started_at timestamptz default now(),
  last_seen_at timestamptz default now(),
  page_count integer default 0,
  country text,
  device text,
  browser text,
  referrer text,
  is_returning boolean default false
);

-- Indexes for fast dashboard queries
create index if not exists analytics_events_created_at on analytics_events(created_at desc);
create index if not exists analytics_events_event_type on analytics_events(event_type);
create index if not exists analytics_events_page on analytics_events(page);
create index if not exists analytics_sessions_started_at on analytics_sessions(started_at desc);

-- Enable RLS but allow anonymous inserts (tracking)
alter table analytics_events enable row level security;
alter table analytics_sessions enable row level security;

create policy "Allow anonymous inserts on events" on analytics_events
  for insert to anon with check (true);

create policy "Allow anonymous inserts on sessions" on analytics_sessions
  for insert to anon with check (true);

create policy "Allow anonymous updates on sessions" on analytics_sessions
  for update to anon using (true);

-- Dashboard reads use service role key (server-side only)

