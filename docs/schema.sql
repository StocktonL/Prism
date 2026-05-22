-- PRISM Database Schema
-- Run this in Supabase SQL Editor (Database → SQL Editor → New query)
-- Run it top to bottom, all at once.

-- ─── Tables ───────────────────────────────────────────────────────────────────

create table if not exists practices (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  phone text,
  stripe_customer_id text,
  subscription_status text not null default 'trial',
  created_at timestamptz not null default now()
);

create table if not exists users (
  id uuid primary key references auth.users on delete cascade,
  practice_id uuid not null references practices(id) on delete cascade,
  email text not null,
  role text not null default 'staff',
  created_at timestamptz not null default now()
);

create table if not exists patients (
  id uuid primary key default gen_random_uuid(),
  practice_id uuid not null references practices(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  date_of_birth date,
  phone text,
  email text,
  insurance_carrier text,
  member_id text,
  group_number text,
  last_visit_date date,
  contact_lens_wearer boolean not null default false,
  last_frame_purchase date,
  last_frame_brand text,
  last_frame_model text,
  last_cl_order date,
  last_cl_brand text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists eligibility_checks (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients(id) on delete cascade,
  practice_id uuid not null references practices(id) on delete cascade,
  frame_allowance numeric(10,2),
  cl_allowance numeric(10,2),
  exam_copay numeric(10,2),
  deductible_met boolean,
  expiration_date date,
  plan_name text,
  checked_at timestamptz not null default now(),
  api_provider text,
  raw_response jsonb
);

create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  practice_id uuid not null references practices(id) on delete cascade,
  name text not null,
  type text not null,
  status text not null default 'draft',
  scheduled_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists campaign_messages (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns(id) on delete cascade,
  patient_id uuid not null references patients(id) on delete cascade,
  practice_id uuid not null references practices(id) on delete cascade,
  message_text text not null,
  channel text not null,
  status text not null default 'pending',
  sent_at timestamptz,
  delivered_at timestamptz,
  opened_at timestamptz,
  responded_at timestamptz,
  response_text text
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  practice_id uuid references practices(id) on delete set null,
  action text not null,
  resource_type text not null,
  resource_id uuid,
  ip_address text,
  created_at timestamptz not null default now()
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────

create index if not exists patients_practice_id_idx on patients(practice_id);
create index if not exists patients_insurance_carrier_idx on patients(insurance_carrier);
create index if not exists eligibility_checks_patient_id_idx on eligibility_checks(patient_id);
create index if not exists eligibility_checks_practice_id_idx on eligibility_checks(practice_id);
create index if not exists eligibility_checks_checked_at_idx on eligibility_checks(checked_at desc);
create index if not exists campaigns_practice_id_idx on campaigns(practice_id);
create index if not exists campaign_messages_campaign_id_idx on campaign_messages(campaign_id);
create index if not exists campaign_messages_practice_id_idx on campaign_messages(practice_id);
create index if not exists audit_logs_practice_id_idx on audit_logs(practice_id);
create index if not exists audit_logs_created_at_idx on audit_logs(created_at desc);

-- ─── Row Level Security ───────────────────────────────────────────────────────
-- HIPAA requirement: Practice A must never see Practice B's data.
-- Every PHI table gets RLS. The policy checks that the logged-in user
-- belongs to the same practice as the row they're trying to read/write.

alter table practices enable row level security;
alter table users enable row level security;
alter table patients enable row level security;
alter table eligibility_checks enable row level security;
alter table campaigns enable row level security;
alter table campaign_messages enable row level security;
alter table audit_logs enable row level security;

-- Helper function: returns the practice_id of the currently logged-in user
create or replace function current_practice_id()
returns uuid
language sql
stable
as $$
  select practice_id from users where id = auth.uid()
$$;

-- practices: users can only see/edit their own practice row
-- INSERT is allowed for any authenticated user (creating their practice at signup)
create policy "users see own practice"
  on practices for select
  using (id = current_practice_id());

create policy "users update own practice"
  on practices for update
  using (id = current_practice_id());

create policy "authenticated users can create a practice"
  on practices for insert
  with check (auth.uid() is not null);

-- users: users can see other users in the same practice
-- INSERT allowed only for own row (wiring auth user → practice at signup)
create policy "users see own practice users"
  on users for select
  using (practice_id = current_practice_id());

create policy "users can insert own row"
  on users for insert
  with check (id = auth.uid());

-- patients: full access scoped to practice
create policy "practice sees own patients"
  on patients for all
  using (practice_id = current_practice_id());

-- eligibility_checks: full access scoped to practice
create policy "practice sees own eligibility checks"
  on eligibility_checks for all
  using (practice_id = current_practice_id());

-- campaigns: full access scoped to practice
create policy "practice sees own campaigns"
  on campaigns for all
  using (practice_id = current_practice_id());

-- campaign_messages: full access scoped to practice
create policy "practice sees own campaign messages"
  on campaign_messages for all
  using (practice_id = current_practice_id());

-- audit_logs: read-only for the practice, inserts handled server-side
create policy "practice sees own audit logs"
  on audit_logs for select
  using (practice_id = current_practice_id());

-- ─── Auto-provision practice + user on signup ────────────────────────────────
-- When Supabase creates a new auth user, this trigger fires automatically
-- and creates the matching practice and user rows. It runs with security
-- definer (elevated privileges) so it bypasses RLS — no session needed.
-- Practice name and phone are passed as metadata from the signup form.

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_practice_id uuid;
begin
  insert into practices (name, email, phone, subscription_status)
  values (
    coalesce(new.raw_user_meta_data->>'practice_name', 'My Practice'),
    new.email,
    nullif(new.raw_user_meta_data->>'practice_phone', ''),
    'trial'
  )
  returning id into new_practice_id;

  insert into users (id, practice_id, email, role)
  values (new.id, new_practice_id, new.email, 'owner');

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ─── Auto-update updated_at on patients ──────────────────────────────────────

create or replace function update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger patients_updated_at
  before update on patients
  for each row execute function update_updated_at();

-- ─── Audit log trigger ────────────────────────────────────────────────────────
-- Automatically writes to audit_logs whenever PHI tables are touched.
-- This satisfies the HIPAA requirement for an audit trail.

create or replace function log_phi_access()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into audit_logs (user_id, practice_id, action, resource_type, resource_id)
  values (
    auth.uid(),
    coalesce(
      new.practice_id,
      old.practice_id
    ),
    tg_op,           -- INSERT, UPDATE, or DELETE
    tg_table_name,   -- patients, eligibility_checks, etc.
    coalesce(new.id, old.id)
  );
  return coalesce(new, old);
end;
$$;

create trigger audit_patients
  after insert or update or delete on patients
  for each row execute function log_phi_access();

create trigger audit_eligibility_checks
  after insert or update or delete on eligibility_checks
  for each row execute function log_phi_access();

create trigger audit_campaign_messages
  after insert or update or delete on campaign_messages
  for each row execute function log_phi_access();
