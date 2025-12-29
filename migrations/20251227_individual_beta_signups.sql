-- Individual beta signups table
create table if not exists individual_beta_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists idx_individual_beta_email_unique on individual_beta_signups (lower(email));

