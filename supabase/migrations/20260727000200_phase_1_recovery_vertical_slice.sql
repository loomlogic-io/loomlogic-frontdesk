create or replace function app_private.can_mutate_tenant(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    app_private.is_active_member(target_organization_id)
    and exists (
      select 1
      from public.organization_members
      where organization_members.organization_id = target_organization_id
        and organization_members.user_id = app_private.current_user_id()
        and organization_members.status = 'active'
        and organization_members.role in ('owner', 'admin', 'manager', 'member')
    );
$$;

revoke all on function app_private.can_mutate_tenant(uuid) from public;
grant execute on function app_private.can_mutate_tenant(uuid) to authenticated;

comment on function app_private.can_mutate_tenant(uuid) is
  'Allows ordinary tenant mutations for active non-viewer members.';

create or replace function app_private.can_approve_tenant(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    app_private.is_active_member(target_organization_id)
    and exists (
      select 1
      from public.organization_members
      where organization_members.organization_id = target_organization_id
        and organization_members.user_id = app_private.current_user_id()
        and organization_members.status = 'active'
        and organization_members.role in ('owner', 'admin', 'manager')
    );
$$;

revoke all on function app_private.can_approve_tenant(uuid) from public;
grant execute on function app_private.can_approve_tenant(uuid) to authenticated;

comment on function app_private.can_approve_tenant(uuid) is
  'Defense-in-depth authorization for customer-contact approval mutations.';

create or replace function app_private.prevent_append_only_mutation()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception '% is append-only', tg_table_name
    using errcode = '55000';
end;
$$;

revoke all on function app_private.prevent_append_only_mutation() from public;

create table public.phone_numbers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  provider text not null check (provider in ('development_fixture')),
  provider_phone_number_id text not null,
  e164_number text not null check (e164_number ~ '^\+[1-9][0-9]{7,14}$'),
  friendly_name text not null check (char_length(friendly_name) between 1 and 100),
  status text not null default 'active' check (status in ('active', 'inactive')),
  is_demo boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, id),
  unique (provider, provider_phone_number_id),
  unique (e164_number)
);

create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  first_name text,
  last_name text,
  display_name text not null check (char_length(display_name) between 1 and 200),
  preferred_language text not null default 'en',
  time_zone text,
  lifecycle_status text not null default 'active'
    check (lifecycle_status in ('active', 'inactive', 'do_not_contact')),
  consent_status text not null default 'unknown'
    check (consent_status in ('unknown', 'granted', 'denied', 'revoked')),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  is_demo boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz,
  unique (organization_id, id)
);

create table public.contact_channels (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  contact_id uuid not null,
  type text not null check (type in ('phone', 'email')),
  normalized_value text not null check (char_length(normalized_value) between 3 and 320),
  display_value text not null check (char_length(display_value) between 3 and 320),
  is_primary boolean not null default false,
  is_verified boolean not null default false,
  consent_status text not null default 'unknown'
    check (consent_status in ('unknown', 'granted', 'denied', 'revoked')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, id),
  unique (organization_id, type, normalized_value),
  foreign key (organization_id, contact_id)
    references public.contacts (organization_id, id) on delete restrict
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  contact_id uuid not null,
  primary_channel text not null check (primary_channel in ('phone', 'sms', 'email')),
  status text not null default 'open' check (status in ('open', 'waiting', 'resolved')),
  subject text not null check (char_length(subject) between 1 and 240),
  summary text,
  assigned_member_id uuid,
  last_activity_at timestamptz not null,
  is_demo boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, id),
  foreign key (organization_id, contact_id)
    references public.contacts (organization_id, id) on delete restrict,
  foreign key (organization_id, assigned_member_id)
    references public.organization_members (organization_id, id) on delete restrict
);

create table public.calls (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  conversation_id uuid not null,
  contact_id uuid not null,
  phone_number_id uuid not null,
  provider text not null check (provider in ('development_fixture')),
  provider_call_id text not null,
  direction text not null check (direction in ('inbound', 'outbound')),
  status text not null
    check (status in ('missed', 'abandoned', 'completed', 'failed', 'voicemail')),
  from_number text not null check (from_number ~ '^\+[1-9][0-9]{7,14}$'),
  to_number text not null check (to_number ~ '^\+[1-9][0-9]{7,14}$'),
  started_at timestamptz not null,
  answered_at timestamptz,
  ended_at timestamptz,
  duration_seconds integer not null default 0 check (duration_seconds >= 0),
  disposition text,
  routing_outcome text,
  summary text,
  intent text,
  recording_consent_state text not null default 'not_recorded'
    check (recording_consent_state in ('not_recorded', 'unknown', 'granted', 'denied')),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  is_demo boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, id),
  unique (provider, provider_call_id),
  check (ended_at is null or ended_at >= started_at),
  foreign key (organization_id, conversation_id)
    references public.conversations (organization_id, id) on delete restrict,
  foreign key (organization_id, contact_id)
    references public.contacts (organization_id, id) on delete restrict,
  foreign key (organization_id, phone_number_id)
    references public.phone_numbers (organization_id, id) on delete restrict
);

create table public.call_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  call_id uuid not null,
  provider_event_id text not null,
  event_type text not null check (char_length(event_type) between 1 and 100),
  sequence integer not null check (sequence >= 0),
  occurred_at timestamptz not null,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object'),
  created_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, id),
  unique (provider_event_id),
  unique (organization_id, call_id, sequence),
  foreign key (organization_id, call_id)
    references public.calls (organization_id, id) on delete restrict
);

create table public.recovery_cases (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  contact_id uuid not null,
  conversation_id uuid not null,
  source_call_id uuid not null,
  reference text not null check (reference ~ '^RC-[A-Z0-9-]{6,32}$'),
  category text not null
    check (category in ('missed_call', 'abandoned_call', 'booking_rescue')),
  reason text not null check (char_length(reason) between 1 and 240),
  status text not null default 'new'
    check (
      status in (
        'new',
        'engaging',
        'qualified',
        'awaiting_customer',
        'awaiting_staff',
        'booking_offered',
        'booked',
        'escalated',
        'recovered',
        'disqualified',
        'opted_out',
        'lost',
        'closed'
      )
    ),
  urgency text not null default 'normal' check (urgency in ('low', 'normal', 'high')),
  assigned_member_id uuid,
  estimated_value_minor integer not null default 0 check (estimated_value_minor >= 0),
  currency_code text not null check (currency_code ~ '^[A-Z]{3}$'),
  attribution_level text not null default 'estimated'
    check (attribution_level in ('estimated', 'confirmed', 'verified')),
  next_action_type text,
  next_action_due_at timestamptz,
  resolution_type text
    check (
      resolution_type is null
      or resolution_type in ('booked', 'resolved', 'disqualified', 'opted_out', 'lost')
    ),
  lost_reason text,
  opened_at timestamptz not null,
  resolved_at timestamptz,
  is_demo boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, id),
  unique (organization_id, source_call_id),
  unique (organization_id, reference),
  check (
    (status not in ('booked', 'recovered', 'disqualified', 'opted_out', 'lost', 'closed'))
    or (resolved_at is not null and resolution_type is not null)
  ),
  check (status <> 'lost' or lost_reason is not null),
  foreign key (organization_id, contact_id)
    references public.contacts (organization_id, id) on delete restrict,
  foreign key (organization_id, conversation_id)
    references public.conversations (organization_id, id) on delete restrict,
  foreign key (organization_id, source_call_id)
    references public.calls (organization_id, id) on delete restrict,
  foreign key (organization_id, assigned_member_id)
    references public.organization_members (organization_id, id) on delete restrict
);

create table public.recovery_case_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  recovery_case_id uuid not null,
  event_type text not null check (char_length(event_type) between 1 and 100),
  actor_type text not null check (actor_type in ('user', 'system', 'webhook')),
  actor_user_id uuid references public.users(id) on delete restrict,
  source_type text not null check (source_type in ('user', 'webhook', 'mock_provider', 'system')),
  source_id uuid,
  description text not null check (char_length(description) between 1 and 500),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  occurred_at timestamptz not null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, id),
  foreign key (organization_id, recovery_case_id)
    references public.recovery_cases (organization_id, id) on delete restrict
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  title text not null check (char_length(title) between 1 and 240),
  description text,
  status text not null default 'open' check (status in ('open', 'in_progress', 'completed', 'cancelled')),
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high')),
  assigned_member_id uuid,
  due_at timestamptz,
  contact_id uuid,
  conversation_id uuid,
  recovery_case_id uuid,
  created_by_user_id uuid references public.users(id) on delete restrict,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz,
  unique (organization_id, id),
  check (status <> 'completed' or completed_at is not null),
  foreign key (organization_id, assigned_member_id)
    references public.organization_members (organization_id, id) on delete restrict,
  foreign key (organization_id, contact_id)
    references public.contacts (organization_id, id) on delete restrict,
  foreign key (organization_id, conversation_id)
    references public.conversations (organization_id, id) on delete restrict,
  foreign key (organization_id, recovery_case_id)
    references public.recovery_cases (organization_id, id) on delete restrict
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  conversation_id uuid not null,
  contact_id uuid not null,
  recovery_case_id uuid not null,
  provider text not null check (provider in ('mock')),
  provider_message_id text,
  idempotency_key text not null check (char_length(idempotency_key) between 8 and 160),
  direction text not null check (direction in ('outbound')),
  channel text not null check (channel in ('sms')),
  status text not null default 'draft'
    check (status in ('draft', 'approved', 'sending', 'sent', 'failed')),
  recipient text not null check (recipient ~ '^\+[1-9][0-9]{7,14}$'),
  body text not null check (char_length(body) between 1 and 1000),
  sent_at timestamptz,
  failed_at timestamptz,
  error_code text,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, id),
  unique (organization_id, idempotency_key),
  check (status <> 'sent' or (sent_at is not null and provider_message_id is not null)),
  check (status <> 'failed' or failed_at is not null),
  foreign key (organization_id, conversation_id)
    references public.conversations (organization_id, id) on delete restrict,
  foreign key (organization_id, contact_id)
    references public.contacts (organization_id, id) on delete restrict,
  foreign key (organization_id, recovery_case_id)
    references public.recovery_cases (organization_id, id) on delete restrict
);

create table public.action_approvals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  recovery_case_id uuid not null,
  message_id uuid not null,
  requested_by_user_id uuid not null references public.users(id) on delete restrict,
  approved_by_user_id uuid references public.users(id) on delete restrict,
  action_type text not null check (action_type in ('send_follow_up')),
  risk_class text not null default 'customer_contact'
    check (risk_class in ('customer_contact')),
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'executing', 'succeeded', 'failed', 'rejected')),
  idempotency_key text not null check (char_length(idempotency_key) between 8 and 160),
  approved_at timestamptz,
  executed_at timestamptz,
  failure_code text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, id),
  unique (organization_id, message_id),
  unique (organization_id, idempotency_key),
  check (status not in ('approved', 'executing', 'succeeded') or approved_at is not null),
  check (status <> 'succeeded' or executed_at is not null),
  foreign key (organization_id, recovery_case_id)
    references public.recovery_cases (organization_id, id) on delete restrict,
  foreign key (organization_id, message_id)
    references public.messages (organization_id, id) on delete restrict
);

create table public.revenue_attributions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  recovery_case_id uuid not null,
  level text not null check (level in ('estimated', 'confirmed', 'verified')),
  amount_minor integer not null check (amount_minor >= 0),
  currency_code text not null check (currency_code ~ '^[A-Z]{3}$'),
  confidence numeric(5, 4) check (confidence between 0 and 1),
  evidence_type text not null
    check (evidence_type in ('case_estimate', 'user_confirmed_booking', 'external_verification')),
  evidence_reference text,
  attributed_at timestamptz not null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, id),
  unique (organization_id, recovery_case_id, level),
  foreign key (organization_id, recovery_case_id)
    references public.recovery_cases (organization_id, id) on delete restrict
);

create table public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  provider text not null check (provider in ('development_fixture')),
  provider_event_id text not null,
  event_type text not null check (event_type in ('missed_call')),
  signature_verified boolean not null,
  payload_hash text not null check (char_length(payload_hash) = 64),
  raw_payload jsonb not null check (jsonb_typeof(raw_payload) = 'object'),
  status text not null default 'received'
    check (status in ('received', 'processing', 'processed', 'failed')),
  attempt_count integer not null default 0 check (attempt_count >= 0),
  received_at timestamptz not null,
  processed_at timestamptz,
  last_error_code text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, id),
  unique (provider, provider_event_id)
);

create table public.outbox_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  aggregate_type text not null check (char_length(aggregate_type) between 1 and 100),
  aggregate_id uuid not null,
  event_type text not null check (char_length(event_type) between 1 and 100),
  idempotency_key text not null check (char_length(idempotency_key) between 8 and 160),
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object'),
  status text not null default 'pending' check (status in ('pending', 'processing', 'processed', 'failed')),
  attempt_count integer not null default 0 check (attempt_count >= 0),
  available_at timestamptz not null,
  locked_at timestamptz,
  processed_at timestamptz,
  last_error_code text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, id),
  unique (organization_id, idempotency_key)
);

create table public.mock_message_attempts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  message_id uuid not null,
  idempotency_key text not null check (char_length(idempotency_key) between 8 and 160),
  outcome text not null check (outcome in ('succeeded', 'failed')),
  provider_message_id text,
  error_code text,
  attempted_at timestamptz not null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, id),
  unique (organization_id, idempotency_key),
  foreign key (organization_id, message_id)
    references public.messages (organization_id, id) on delete restrict
);

create or replace function app_private.require_message_approval()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status in ('approved', 'sending', 'sent') and not exists (
    select 1
    from public.action_approvals
    where action_approvals.organization_id = new.organization_id
      and action_approvals.message_id = new.id
      and action_approvals.action_type = 'send_follow_up'
      and action_approvals.status in ('approved', 'executing', 'succeeded')
  ) then
    raise exception 'approved follow-up action required before message send'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

revoke all on function app_private.require_message_approval() from public;

create trigger messages_require_approval
before insert or update of status on public.messages
for each row execute function app_private.require_message_approval();

create or replace function app_private.protect_approved_message_content()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if exists (
    select 1
    from public.action_approvals
    where action_approvals.organization_id = old.organization_id
      and action_approvals.message_id = old.id
      and action_approvals.status in ('approved', 'executing', 'succeeded')
  ) then
    raise exception 'approved message content is immutable'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

revoke all on function app_private.protect_approved_message_content() from public;

create trigger messages_protect_approved_content
before update of conversation_id, contact_id, recovery_case_id, channel, recipient, body
on public.messages
for each row execute function app_private.protect_approved_message_content();

create or replace function app_private.validate_action_approval_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.organization_id is distinct from old.organization_id
    or new.recovery_case_id is distinct from old.recovery_case_id
    or new.message_id is distinct from old.message_id
    or new.requested_by_user_id is distinct from old.requested_by_user_id
    or new.action_type is distinct from old.action_type
    or new.risk_class is distinct from old.risk_class
    or new.idempotency_key is distinct from old.idempotency_key
  then
    raise exception 'approval scope is immutable'
      using errcode = '23514';
  end if;

  if new.status is distinct from old.status
    and not (
      (old.status = 'pending' and new.status in ('approved', 'rejected'))
      or (old.status = 'approved' and new.status in ('executing', 'failed'))
      or (old.status = 'executing' and new.status in ('succeeded', 'failed'))
      or (old.status = 'failed' and new.status in ('approved', 'rejected'))
    )
  then
    raise exception 'invalid approval status transition'
      using errcode = '23514';
  end if;

  if old.status in ('pending', 'failed') and new.status = 'approved' then
    if new.approved_by_user_id is distinct from app_private.current_user_id()
      or new.approved_at is null
    then
      raise exception 'approval actor must match the current authorized user'
        using errcode = '23514';
    end if;
  elsif old.approved_by_user_id is not null
    and new.approved_by_user_id is distinct from old.approved_by_user_id
  then
    raise exception 'approval actor is immutable'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

revoke all on function app_private.validate_action_approval_update() from public;

create trigger action_approvals_validate_update
before update on public.action_approvals
for each row execute function app_private.validate_action_approval_update();

create index phone_numbers_tenant_status_idx
  on public.phone_numbers (organization_id, status);
create index contacts_tenant_created_at_idx
  on public.contacts (organization_id, created_at desc);
create index contacts_tenant_name_idx
  on public.contacts (organization_id, display_name);
create index contact_channels_contact_idx
  on public.contact_channels (organization_id, contact_id);
create index conversations_tenant_activity_idx
  on public.conversations (organization_id, last_activity_at desc);
create index conversations_contact_idx
  on public.conversations (organization_id, contact_id, last_activity_at desc);
create index calls_tenant_started_at_idx
  on public.calls (organization_id, started_at desc);
create index calls_conversation_idx
  on public.calls (organization_id, conversation_id, started_at desc);
create index call_events_call_idx
  on public.call_events (organization_id, call_id, sequence);
create index recovery_cases_queue_idx
  on public.recovery_cases (organization_id, status, next_action_due_at, created_at desc);
create index recovery_cases_contact_idx
  on public.recovery_cases (organization_id, contact_id, created_at desc);
create index recovery_case_events_case_idx
  on public.recovery_case_events (organization_id, recovery_case_id, occurred_at desc);
create index tasks_queue_idx
  on public.tasks (organization_id, status, due_at);
create index messages_conversation_idx
  on public.messages (organization_id, conversation_id, created_at desc);
create index action_approvals_case_idx
  on public.action_approvals (organization_id, recovery_case_id, created_at desc);
create index revenue_attributions_case_idx
  on public.revenue_attributions (organization_id, recovery_case_id, attributed_at desc);
create index webhook_events_tenant_received_idx
  on public.webhook_events (organization_id, received_at desc);
create index outbox_events_claim_idx
  on public.outbox_events (status, available_at)
  where status in ('pending', 'failed');
create index mock_message_attempts_message_idx
  on public.mock_message_attempts (organization_id, message_id, attempted_at desc);

create trigger phone_numbers_set_updated_at
before update on public.phone_numbers
for each row execute function public.set_updated_at();
create trigger contacts_set_updated_at
before update on public.contacts
for each row execute function public.set_updated_at();
create trigger contact_channels_set_updated_at
before update on public.contact_channels
for each row execute function public.set_updated_at();
create trigger conversations_set_updated_at
before update on public.conversations
for each row execute function public.set_updated_at();
create trigger calls_set_updated_at
before update on public.calls
for each row execute function public.set_updated_at();
create trigger recovery_cases_set_updated_at
before update on public.recovery_cases
for each row execute function public.set_updated_at();
create trigger tasks_set_updated_at
before update on public.tasks
for each row execute function public.set_updated_at();
create trigger messages_set_updated_at
before update on public.messages
for each row execute function public.set_updated_at();
create trigger action_approvals_set_updated_at
before update on public.action_approvals
for each row execute function public.set_updated_at();
create trigger webhook_events_set_updated_at
before update on public.webhook_events
for each row execute function public.set_updated_at();
create trigger outbox_events_set_updated_at
before update on public.outbox_events
for each row execute function public.set_updated_at();

create trigger call_events_append_only
before update or delete on public.call_events
for each row execute function app_private.prevent_append_only_mutation();
create trigger recovery_case_events_append_only
before update or delete on public.recovery_case_events
for each row execute function app_private.prevent_append_only_mutation();
create trigger revenue_attributions_append_only
before update or delete on public.revenue_attributions
for each row execute function app_private.prevent_append_only_mutation();
create trigger mock_message_attempts_append_only
before update or delete on public.mock_message_attempts
for each row execute function app_private.prevent_append_only_mutation();

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'phone_numbers',
    'contacts',
    'contact_channels',
    'conversations',
    'calls',
    'call_events',
    'recovery_cases',
    'recovery_case_events',
    'tasks',
    'messages',
    'action_approvals',
    'revenue_attributions',
    'webhook_events',
    'outbox_events',
    'mock_message_attempts'
  ]
  loop
    execute format(
      'create trigger %I before update of organization_id on public.%I for each row execute function app_private.prevent_organization_id_change()',
      table_name || '_organization_id_immutable',
      table_name
    );
  end loop;
end;
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'phone_numbers',
    'contacts',
    'contact_channels',
    'conversations',
    'calls',
    'call_events',
    'recovery_cases',
    'recovery_case_events',
    'tasks',
    'messages',
    'action_approvals',
    'revenue_attributions',
    'webhook_events',
    'outbox_events',
    'mock_message_attempts'
  ]
  loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('alter table public.%I force row level security', table_name);
    execute format('revoke all on public.%I from anon', table_name);
    execute format('grant select, insert, update, delete on public.%I to authenticated', table_name);
    execute format('grant select, insert, update, delete on public.%I to service_role', table_name);
    execute format(
      'create policy %I on public.%I for select to authenticated using (app_private.is_active_member(organization_id))',
      table_name || '_select_active_tenant',
      table_name
    );
  end loop;
end;
$$;

grant select, insert on public.audit_logs to service_role;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'contacts',
    'contact_channels',
    'conversations',
    'recovery_cases',
    'recovery_case_events',
    'tasks',
    'messages',
    'revenue_attributions'
  ]
  loop
    execute format(
      'create policy %I on public.%I for insert to authenticated with check (app_private.can_mutate_tenant(organization_id))',
      table_name || '_insert_active_member',
      table_name
    );
  end loop;
end;
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'contacts',
    'contact_channels',
    'conversations',
    'recovery_cases',
    'tasks',
    'messages'
  ]
  loop
    execute format(
      'create policy %I on public.%I for update to authenticated using (app_private.can_mutate_tenant(organization_id)) with check (app_private.can_mutate_tenant(organization_id))',
      table_name || '_update_active_member',
      table_name
    );
  end loop;
end;
$$;

create policy action_approvals_insert_active_member
on public.action_approvals
for insert
to authenticated
with check (
  app_private.can_mutate_tenant(organization_id)
  and requested_by_user_id = app_private.current_user_id()
  and approved_by_user_id is null
  and status = 'pending'
  and approved_at is null
  and executed_at is null
);

create policy action_approvals_update_approver
on public.action_approvals
for update
to authenticated
using (app_private.can_approve_tenant(organization_id))
with check (app_private.can_approve_tenant(organization_id));

comment on table public.phone_numbers is
  'Trusted receiving-number ownership mapping. Phase 1 contains development fixtures only.';
comment on table public.call_events is
  'Append-only normalized call lifecycle events.';
comment on table public.recovery_case_events is
  'Append-only human-readable history for a Recovery Case.';
comment on table public.action_approvals is
  'Explicit approval record required before a mock customer-contact action executes.';
comment on table public.webhook_events is
  'Verified, idempotent development webhook receipts. Never label these records as Twilio events.';
comment on table public.mock_message_attempts is
  'Deterministic local messaging attempts. This table does not represent delivery by a live provider.';
