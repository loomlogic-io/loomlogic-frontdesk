create extension if not exists pgcrypto with schema extensions;

create schema if not exists app_private;

revoke all on schema app_private from public;
revoke all on schema app_private from anon;
grant usage on schema app_private to authenticated;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

comment on function public.set_updated_at() is
  'Maintains updated_at in UTC for mutable application records.';

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  clerk_org_id text not null unique,
  name text not null check (char_length(name) between 1 and 160),
  slug text not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{0,98}[a-z0-9]$' or slug ~ '^[a-z0-9]$'),
  status text not null default 'active'
    check (status in ('active', 'inactive', 'suspended')),
  time_zone text not null default 'UTC',
  locale text not null default 'en-CA',
  currency_code text not null default 'CAD'
    check (currency_code ~ '^[A-Z]{3}$'),
  onboarding_state text not null default 'workspace_created'
    check (onboarding_state in ('workspace_created', 'in_progress', 'complete')),
  settings jsonb not null default '{}'::jsonb
    check (jsonb_typeof(settings) = 'object'),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.users (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null unique,
  primary_email text,
  display_name text,
  avatar_url text,
  status text not null default 'active'
    check (status in ('active', 'inactive')),
  last_seen_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  user_id uuid not null references public.users(id) on delete restrict,
  clerk_membership_id text not null unique,
  role text not null
    check (role in ('owner', 'admin', 'manager', 'member', 'viewer')),
  status text not null default 'active'
    check (status in ('active', 'inactive')),
  job_title text,
  permissions jsonb not null default '{}'::jsonb
    check (jsonb_typeof(permissions) = 'object'),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, user_id),
  unique (organization_id, id)
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  actor_type text not null
    check (actor_type in ('user', 'system', 'webhook', 'ai')),
  actor_user_id uuid references public.users(id) on delete restrict,
  action text not null check (char_length(action) between 1 and 160),
  target_type text not null check (char_length(target_type) between 1 and 100),
  target_id uuid,
  source text not null
    check (source in ('user', 'system', 'webhook', 'ai')),
  request_id text not null check (char_length(request_id) between 8 and 128),
  ip_hash text,
  user_agent text,
  metadata jsonb not null default '{}'::jsonb
    check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default timezone('utc', now())
);

create index organization_members_organization_id_idx
  on public.organization_members (organization_id);
create index organization_members_user_id_idx
  on public.organization_members (user_id);
create index organization_members_tenant_status_idx
  on public.organization_members (organization_id, status);
create index audit_logs_tenant_created_at_idx
  on public.audit_logs (organization_id, created_at desc);
create index audit_logs_actor_user_id_idx
  on public.audit_logs (actor_user_id);
create index audit_logs_target_idx
  on public.audit_logs (organization_id, target_type, target_id);

create trigger organizations_set_updated_at
before update on public.organizations
for each row execute function public.set_updated_at();

create trigger users_set_updated_at
before update on public.users
for each row execute function public.set_updated_at();

create trigger organization_members_set_updated_at
before update on public.organization_members
for each row execute function public.set_updated_at();

create or replace function app_private.prevent_organization_id_change()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.organization_id <> old.organization_id then
    raise exception 'organization_id is immutable'
      using errcode = '23514';
  end if;
  return new;
end;
$$;

revoke all on function app_private.prevent_organization_id_change() from public;

create trigger organization_members_organization_id_immutable
before update of organization_id on public.organization_members
for each row execute function app_private.prevent_organization_id_change();

create or replace function app_private.prevent_audit_mutation()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'audit logs are append-only'
    using errcode = '55000';
end;
$$;

revoke all on function app_private.prevent_audit_mutation() from public;

create trigger audit_logs_append_only
before update or delete on public.audit_logs
for each row execute function app_private.prevent_audit_mutation();

create or replace function app_private.clerk_organization_id()
returns text
language sql
stable
set search_path = ''
as $$
  select coalesce(
    nullif(auth.jwt() ->> 'org_id', ''),
    nullif(auth.jwt() -> 'o' ->> 'id', '')
  );
$$;

comment on function app_private.clerk_organization_id() is
  'Isolated Clerk active Organization claim lookup. Supports standard org_id and compact o.id session claims documented by Supabase.';

create or replace function app_private.clerk_user_id()
returns text
language sql
stable
set search_path = ''
as $$
  select nullif(auth.jwt() ->> 'sub', '');
$$;

create or replace function app_private.current_organization_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select organizations.id
  from public.organizations
  where organizations.clerk_org_id = app_private.clerk_organization_id()
    and organizations.status = 'active'
  limit 1;
$$;

comment on function app_private.current_organization_id() is
  'Maps the verified external Clerk Organization ID to the internal UUID used by tenant records.';

create or replace function app_private.current_user_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select users.id
  from public.users
  where users.clerk_user_id = app_private.clerk_user_id()
    and users.status = 'active'
  limit 1;
$$;

create or replace function app_private.is_active_member(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    target_organization_id = app_private.current_organization_id()
    and exists (
      select 1
      from public.organization_members
      join public.users
        on users.id = organization_members.user_id
      where organization_members.organization_id = target_organization_id
        and organization_members.user_id = app_private.current_user_id()
        and organization_members.status = 'active'
        and users.status = 'active'
    );
$$;

revoke all on function app_private.clerk_organization_id() from public;
revoke all on function app_private.clerk_user_id() from public;
revoke all on function app_private.current_organization_id() from public;
revoke all on function app_private.current_user_id() from public;
revoke all on function app_private.is_active_member(uuid) from public;

grant execute on function app_private.clerk_organization_id() to authenticated;
grant execute on function app_private.clerk_user_id() to authenticated;
grant execute on function app_private.current_organization_id() to authenticated;
grant execute on function app_private.current_user_id() to authenticated;
grant execute on function app_private.is_active_member(uuid) to authenticated;

alter table public.organizations enable row level security;
alter table public.organizations force row level security;
alter table public.users enable row level security;
alter table public.users force row level security;
alter table public.organization_members enable row level security;
alter table public.organization_members force row level security;
alter table public.audit_logs enable row level security;
alter table public.audit_logs force row level security;

create policy organizations_select_active_members
on public.organizations
for select
to authenticated
using (app_private.is_active_member(id));

create policy users_select_self
on public.users
for select
to authenticated
using (
  clerk_user_id = app_private.clerk_user_id()
  and status = 'active'
);

create policy organization_members_select_active_tenant
on public.organization_members
for select
to authenticated
using (app_private.is_active_member(organization_id));

create policy audit_logs_select_active_tenant
on public.audit_logs
for select
to authenticated
using (app_private.is_active_member(organization_id));

create policy audit_logs_insert_current_user
on public.audit_logs
for insert
to authenticated
with check (
  app_private.is_active_member(organization_id)
  and actor_type = 'user'
  and source = 'user'
  and actor_user_id = app_private.current_user_id()
);

revoke all on public.organizations from anon;
revoke all on public.users from anon;
revoke all on public.organization_members from anon;
revoke all on public.audit_logs from anon;

grant select, insert, update, delete on public.organizations to authenticated;
grant select, insert, update, delete on public.users to authenticated;
grant select, insert, update, delete on public.organization_members to authenticated;
grant select, insert, update, delete on public.audit_logs to authenticated;

comment on table public.organizations is
  'Internal tenant projection. Clerk Organizations remain the membership authority.';
comment on table public.users is
  'Global application user projection keyed by external Clerk user ID.';
comment on table public.organization_members is
  'Tenant membership projection used for joins and defense-in-depth authorization.';
comment on table public.audit_logs is
  'Append-only record of privileged, system, webhook, and AI-initiated actions.';
