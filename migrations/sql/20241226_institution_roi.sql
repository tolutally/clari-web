-- Institution ROI persistence + magic links

create table if not exists institution_roi_runs (
  id uuid primary key default gen_random_uuid(),
  request jsonb not null,
  result jsonb not null,
  narrative text,
  gate_passed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_institution_roi_runs_created_at
  on institution_roi_runs(created_at desc);

create table if not exists institution_roi_magic_links (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references institution_roi_runs(id) on delete cascade,
  email text not null,
  token_hash text not null,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_institution_roi_magic_links_run_id
  on institution_roi_magic_links(run_id);

create index if not exists idx_institution_roi_magic_links_token_hash
  on institution_roi_magic_links(token_hash);
