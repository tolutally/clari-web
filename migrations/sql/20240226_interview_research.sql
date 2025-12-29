-- Interview Research schema
create table if not exists interview_research_reports (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'QUEUED',
  company_name text not null,
  role_title text not null,
  interview_stage text not null,
  jd_text text not null,
  interview_email_text text,
  interviewer_urls text[] default '{}'::text[],
  interviewers jsonb not null default '[]'::jsonb,
  gate_passed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  ready_at timestamptz,
  error_text text
);

create index if not exists idx_ir_reports_status on interview_research_reports(status);
create index if not exists idx_ir_reports_created_at on interview_research_reports(created_at);

create table if not exists interview_research_sources (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references interview_research_reports(id) on delete cascade,
  source_type text not null,
  url text,
  title text,
  published_at timestamptz,
  fetched_at timestamptz not null default now(),
  raw_text text not null
);

create index if not exists idx_ir_sources_report_id on interview_research_sources(report_id);

create table if not exists interview_research_render (
  report_id uuid primary key references interview_research_reports(id) on delete cascade,
  preview_json jsonb not null default '{}'::jsonb,
  full_json jsonb not null default '{}'::jsonb,
  html text,
  pdf_url text
);

create table if not exists interview_research_magic_links (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references interview_research_reports(id) on delete cascade,
  email text not null,
  token_hash text not null,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_ir_magic_links_report_id on interview_research_magic_links(report_id);
create index if not exists idx_ir_magic_links_token_hash on interview_research_magic_links(token_hash);
