-- Request access form submissions for institutions
create table if not exists institution_request_access (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text,
  institution text,
  message text,
  created_at timestamptz not null default now(),
  created_date date
);

-- backfill created_date for existing rows and ensure not null
update institution_request_access set created_date = created_at::date where created_date is null;
alter table institution_request_access alter column created_date set not null;

create unique index if not exists idx_institution_request_access_email_created on institution_request_access (lower(email), created_date);
