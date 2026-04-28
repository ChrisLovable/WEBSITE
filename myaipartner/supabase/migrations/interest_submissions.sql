create extension if not exists pgcrypto;
create extension if not exists citext;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'interest_submission_status') then
    create type interest_submission_status as enum (
      'new',
      'reviewing',
      'qualified',
      'proposal_sent',
      'won',
      'lost',
      'archived'
    );
  end if;
end $$;

create table if not exists interest_submissions (
  id uuid primary key default gen_random_uuid(),
  submitted_at timestamptz not null default now(),
  first_name text not null,
  last_name text not null,
  full_name text generated always as (trim(coalesce(first_name,'') || ' ' || coalesce(last_name,''))) stored,
  email citext not null,
  phone text not null,
  company text not null,
  industry text not null,
  service_required text not null,
  description text not null,
  outcome text,
  ai_maturity text,
  challenge text,
  consulting_priority text,
  decision_stakeholders text,
  tech_stack text,
  current_process text,
  tools_involved text,
  process_frequency text,
  automation_volume text,
  automation_urgency text,
  app_type text[] default '{}',
  app_users text,
  expected_users text,
  deployment_preference text,
  compliance_needs text,
  features text[] default '{}',
  website_type text,
  website_status text,
  website_objective text,
  website_ai_features text,
  website_requirements text,
  training_size text,
  technical_level text,
  training_format text,
  training_objective text,
  training_topics text,
  speaking_audience text,
  speaking_topic text,
  speaking_format text,
  speaking_size text,
  speaking_date text,
  speaking_outcome text,
  ediscovery_matter text,
  ediscovery_sources text,
  ediscovery_volume text,
  ediscovery_urgency text,
  ediscovery_output text,
  ediscovery_stakeholders text,
  ediscovery_questions text,
  market_focus text,
  market_competitor_count text,
  market_reporting_cadence text,
  market_report_format text,
  market_signals text,
  other_details text,
  start_date text,
  budget_range text,
  ideal_completion_date text,
  intended_users text,
  additional text,
  status interest_submission_status not null default 'new',
  priority smallint not null default 3,
  owner text,
  notes_internal text,
  source_page text default '/interest',
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  user_agent text,
  ip_address inet,
  raw_payload jsonb not null default '{}'::jsonb
);

create index if not exists idx_interest_submissions_submitted_at
  on interest_submissions (submitted_at desc);
create index if not exists idx_interest_submissions_status
  on interest_submissions (status);
create index if not exists idx_interest_submissions_service
  on interest_submissions (service_required);
create index if not exists idx_interest_submissions_email
  on interest_submissions (email);
create index if not exists idx_interest_submissions_company
  on interest_submissions (company);
create index if not exists idx_interest_submissions_raw_payload_gin
  on interest_submissions using gin (raw_payload);

create table if not exists interest_option_catalog (
  id bigserial primary key,
  category text not null,
  value text not null,
  label text not null,
  section text,
  sort_order int default 0,
  is_active boolean not null default true,
  unique (category, value)
);

create or replace view vw_interest_summary_daily as
select
  date_trunc('day', submitted_at) as day,
  count(*) as submissions,
  count(*) filter (where status = 'new') as new_count,
  count(*) filter (where status in ('qualified','proposal_sent','won')) as pipeline_count
from interest_submissions
group by 1
order by 1 desc;

create or replace view vw_interest_summary_service as
select
  service_required,
  count(*) as submissions,
  count(*) filter (where status = 'new') as new_count,
  count(*) filter (where status = 'won') as won_count
from interest_submissions
group by 1
order by submissions desc;

create or replace view vw_interest_recent as
select
  id,
  submitted_at,
  full_name,
  email,
  phone,
  company,
  industry,
  service_required,
  status,
  priority
from interest_submissions
order by submitted_at desc;

alter table interest_submissions enable row level security;
alter table interest_option_catalog enable row level security;

drop policy if exists "anon_insert_interest_submissions" on interest_submissions;
create policy "anon_insert_interest_submissions"
  on interest_submissions
  for insert
  to anon
  with check (true);

drop policy if exists "deny_anon_select_interest_submissions" on interest_submissions;
create policy "deny_anon_select_interest_submissions"
  on interest_submissions
  for select
  to anon
  using (false);

drop policy if exists "anon_select_interest_option_catalog" on interest_option_catalog;
create policy "anon_select_interest_option_catalog"
  on interest_option_catalog
  for select
  to anon
  using (true);

