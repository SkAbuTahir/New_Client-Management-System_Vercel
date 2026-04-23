-- ============================================================
-- ClientPro — Supabase Schema
-- Run this in: Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- Clients
create table if not exists clients (
  id          bigserial primary key,
  name        text          not null,
  email       text          not null,
  phone       text,
  company     text,
  address     text,
  status      text          not null default 'Active' check (status in ('Active','Inactive','Pending')),
  notes       text,
  created_at  timestamptz   not null default now(),
  updated_at  timestamptz   not null default now()
);

-- Projects
create table if not exists projects (
  id          bigserial primary key,
  name        text          not null,
  client_id   bigint        references clients(id) on delete set null,
  client_name text,
  description text,
  status      text          not null default 'Planning' check (status in ('Planning','In Progress','On Hold','Completed','Cancelled')),
  priority    text          not null default 'Medium'   check (priority in ('Low','Medium','High')),
  start_date  date,
  end_date    date,
  budget      numeric(12,2),
  progress    int           not null default 0 check (progress between 0 and 100),
  created_at  timestamptz   not null default now(),
  updated_at  timestamptz   not null default now()
);

-- Communications
create table if not exists communications (
  id          bigserial primary key,
  client_id   bigint        references clients(id) on delete set null,
  client_name text,
  type        text          not null check (type in ('Email','Phone','Meeting','SMS')),
  subject     text,
  notes       text,
  date        date          not null default current_date,
  follow_up   date,
  created_at  timestamptz   not null default now()
);

-- Invoices
create table if not exists invoices (
  id             bigserial primary key,
  invoice_number text          not null unique,
  client_id      bigint        references clients(id) on delete set null,
  client_name    text,
  project_id     bigint        references projects(id) on delete set null,
  project_name   text,
  amount         numeric(12,2) not null default 0,
  description    text,
  issue_date     date          not null default current_date,
  due_date       date,
  status         text          not null default 'Draft' check (status in ('Draft','Sent','Paid','Overdue','Cancelled')),
  notes          text,
  created_at     timestamptz   not null default now(),
  updated_at     timestamptz   not null default now()
);

-- Auto-update updated_at trigger
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create or replace trigger clients_updated_at  before update on clients  for each row execute function update_updated_at();
create or replace trigger projects_updated_at before update on projects for each row execute function update_updated_at();
create or replace trigger invoices_updated_at before update on invoices for each row execute function update_updated_at();

-- ── RLS ──────────────────────────────────────────────────────
-- Open policies for demo. In production: scope to auth.uid().
alter table clients        enable row level security;
alter table projects       enable row level security;
alter table communications enable row level security;
alter table invoices       enable row level security;

create policy "allow_all_clients"        on clients        for all using (true) with check (true);
create policy "allow_all_projects"       on projects       for all using (true) with check (true);
create policy "allow_all_communications" on communications for all using (true) with check (true);
create policy "allow_all_invoices"       on invoices       for all using (true) with check (true);
