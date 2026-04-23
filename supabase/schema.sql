-- ============================================================
-- ClientPro — Supabase Schema
-- Safe to re-run: drops existing policies before recreating
-- ============================================================

-- Users
create table if not exists users (
  id          bigserial primary key,
  username    text        not null unique,
  name        text        not null,
  email       text        not null unique,
  password    text        not null,
  role        text        not null default 'Employee' check (role in ('Admin','Manager','Employee')),
  created_at  timestamptz not null default now()
);

insert into users (username, name, email, password, role) values
  ('admin',    'Admin User',    'admin@clientpro.com',    '$2b$10$/G6e7n0Ic49V2kjYOK2Lf.1vlcnz0elXAwo.KUHhqAFxsp4vVmbze', 'Admin'),
  ('manager',  'Manager User',  'manager@clientpro.com',  '$2b$10$Xo5.CBmdDa8yLvlc4r7n3uaRCinoxAHOLD1oPjPx89CNHVtfhYcvi',  'Manager'),
  ('employee', 'Employee User', 'employee@clientpro.com', '$2b$10$iI6JunHQqDGgCzOxmyKMJe5qwH5wcsHRW0ejG2XCE6RYL/Jmofo.6', 'Employee')
on conflict (username) do nothing;

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

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create or replace trigger clients_updated_at  before update on clients  for each row execute function update_updated_at();
create or replace trigger projects_updated_at before update on projects for each row execute function update_updated_at();
create or replace trigger invoices_updated_at before update on invoices for each row execute function update_updated_at();

-- ── RLS ──────────────────────────────────────────────────────
alter table users          enable row level security;
alter table clients        enable row level security;
alter table projects       enable row level security;
alter table communications enable row level security;
alter table invoices       enable row level security;

-- Drop existing policies before recreating
drop policy if exists "allow_all_users"          on users;
drop policy if exists "allow_all_clients"        on clients;
drop policy if exists "allow_all_projects"       on projects;
drop policy if exists "allow_all_communications" on communications;
drop policy if exists "allow_all_invoices"       on invoices;

create policy "allow_all_users"          on users          for all using (true) with check (true);
create policy "allow_all_clients"        on clients        for all using (true) with check (true);
create policy "allow_all_projects"       on projects       for all using (true) with check (true);
create policy "allow_all_communications" on communications for all using (true) with check (true);
create policy "allow_all_invoices"       on invoices       for all using (true) with check (true);
