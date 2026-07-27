begin;

create extension if not exists pgtap with schema extensions;

select plan(41);

insert into public.users (id, clerk_user_id, primary_email, display_name)
values (
  '99000000-0000-4000-8000-000000000009',
  'user_demo_viewer',
  'viewer@example.invalid',
  'Demo Viewer'
);

insert into public.organization_members (
  id,
  organization_id,
  user_id,
  clerk_membership_id,
  role,
  status
)
values (
  '99000000-0000-4000-8000-000000000010',
  '11000000-0000-4000-8000-000000000001',
  '99000000-0000-4000-8000-000000000009',
  'membership_demo_viewer',
  'viewer',
  'active'
);

insert into public.users (id, clerk_user_id, primary_email, display_name)
values (
  '99000000-0000-4000-8000-000000000011',
  'user_demo_member',
  'member@example.invalid',
  'Demo Member'
);

insert into public.organization_members (
  id,
  organization_id,
  user_id,
  clerk_membership_id,
  role,
  status
)
values (
  '99000000-0000-4000-8000-000000000012',
  '11000000-0000-4000-8000-000000000001',
  '99000000-0000-4000-8000-000000000011',
  'membership_demo_member',
  'member',
  'active'
);

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"user_demo_recovery","role":"authenticated","org_id":"org_demo_recovery"}',
  true
);

select is((select count(*)::integer from public.phone_numbers), 1, 'A reads only its phone-number mapping');
select is((select count(*)::integer from public.contacts), 2, 'A reads only its contacts');
select is((select count(*)::integer from public.contact_channels), 2, 'A reads only its contact channels');
select is((select count(*)::integer from public.conversations), 2, 'A reads only its conversations');
select is((select count(*)::integer from public.calls), 2, 'A reads only its calls');
select is((select count(*)::integer from public.call_events), 2, 'A reads only its call events');
select is((select count(*)::integer from public.recovery_cases), 2, 'A reads only its Recovery Cases');
select is((select count(*)::integer from public.recovery_case_events), 3, 'A reads only its case events');
select is((select count(*)::integer from public.tasks), 1, 'A reads only its tasks');
select is((select count(*)::integer from public.messages), 1, 'A reads only its messages');
select is((select count(*)::integer from public.action_approvals), 1, 'A reads only its approvals');
select is((select count(*)::integer from public.revenue_attributions), 2, 'A reads only its attributions');
select is((select count(*)::integer from public.webhook_events), 2, 'A reads only its webhook receipts');
select is((select count(*)::integer from public.outbox_events), 1, 'A reads only its outbox events');
select is((select count(*)::integer from public.mock_message_attempts), 1, 'A reads only its mock attempts');

select is(
  (
    select count(*)::integer
    from public.contacts
    where id = 'b1000000-0000-4000-8000-000000000001'
  ),
  0,
  'A cannot discover B contact detail'
);

select is(
  (
    select count(*)::integer
    from public.recovery_cases
    where id = 'f3000000-0000-4000-8000-000000000003'
  ),
  0,
  'A cannot discover B Recovery Case detail'
);

select is(
  (
    select count(*)::integer
    from public.messages
    where organization_id = '22000000-0000-4000-8000-000000000002'
  ),
  0,
  'A cannot discover B messages'
);

select throws_ok(
  $$
    insert into public.contacts (
      organization_id,
      display_name,
      consent_status
    )
    values (
      '22000000-0000-4000-8000-000000000002',
      'Forged tenant contact',
      'unknown'
    )
  $$,
  '42501',
  'new row violates row-level security policy for table "contacts"',
  'A cannot insert a B contact by forging organization_id'
);

select lives_ok(
  $$
    insert into public.messages (
      id,
      organization_id,
      conversation_id,
      contact_id,
      recovery_case_id,
      provider,
      idempotency_key,
      direction,
      channel,
      status,
      recipient,
      body,
      metadata
    )
    values (
      '9a000000-0000-4000-8000-000000000001',
      '11000000-0000-4000-8000-000000000001',
      'd1000000-0000-4000-8000-000000000001',
      'a1000000-0000-4000-8000-000000000001',
      'f1000000-0000-4000-8000-000000000001',
      'mock',
      'phase1-unapproved-draft',
      'outbound',
      'sms',
      'draft',
      '+15550101420',
      'This deterministic draft must not send without approval.',
      '{"demo":true}'
    )
  $$,
  'An active non-viewer member can draft a same-tenant follow-up'
);

select throws_ok(
  $$
    update public.messages
    set
      status = 'sent',
      sent_at = '2026-07-27T12:00:00Z',
      provider_message_id = 'forbidden-unapproved-send'
    where id = '9a000000-0000-4000-8000-000000000001'
  $$,
  '23514',
  'approved follow-up action required before message send',
  'Database rejects a follow-up send without approval'
);

select lives_ok(
  $$
    insert into public.action_approvals (
      id,
      organization_id,
      recovery_case_id,
      message_id,
      requested_by_user_id,
      action_type,
      status,
      idempotency_key
    )
    values (
      '9b000000-0000-4000-8000-000000000001',
      '11000000-0000-4000-8000-000000000001',
      'f1000000-0000-4000-8000-000000000001',
      '9a000000-0000-4000-8000-000000000001',
      '33000000-0000-4000-8000-000000000003',
      'send_follow_up',
      'pending',
      'phase1-pending-approval'
    )
  $$,
  'An active member can request approval for a same-tenant draft'
);

select throws_ok(
  $$
    update public.action_approvals
    set
      status = 'succeeded',
      approved_by_user_id = '33000000-0000-4000-8000-000000000003',
      approved_at = '2026-07-27T12:00:00Z',
      executed_at = '2026-07-27T12:00:01Z'
    where id = '9b000000-0000-4000-8000-000000000001'
  $$,
  '23514',
  'invalid approval status transition',
  'Database rejects skipping approval execution states'
);

select set_config(
  'request.jwt.claims',
  '{"sub":"user_demo_member","role":"authenticated","org_id":"org_demo_recovery"}',
  true
);

select is_empty(
  $$
    update public.action_approvals
    set
      status = 'approved',
      approved_by_user_id = '99000000-0000-4000-8000-000000000011',
      approved_at = '2026-07-27T12:00:00Z'
    where id = '9b000000-0000-4000-8000-000000000001'
    returning id
  $$,
  'An ordinary member cannot approve customer contact'
);

select set_config(
  'request.jwt.claims',
  '{"sub":"user_demo_other","role":"authenticated","org_id":"org_demo_other"}',
  true
);

select is(
  (
    select count(*)::integer
    from public.contacts
    where organization_id = '11000000-0000-4000-8000-000000000001'
  ),
  0,
  'B list query cannot discover A contacts'
);

select is(
  (
    select count(*)::integer
    from public.contacts
    where id = 'a1000000-0000-4000-8000-000000000001'
  ),
  0,
  'B detail query cannot discover a known A contact ID'
);

select is(
  (
    select count(*)::integer
    from public.contacts
    where display_name ilike '%Maya%'
  ),
  0,
  'B search query cannot discover A contact names'
);

select is(
  (select count(*)::integer from public.contacts),
  1,
  'B count query returns only B records'
);

select is_empty(
  $$
    update public.contacts
    set display_name = 'Forbidden cross-tenant update'
    where id = 'a1000000-0000-4000-8000-000000000001'
    returning id
  $$,
  'B cannot update A contact'
);

select is_empty(
  $$
    delete from public.recovery_cases
    where id = 'f1000000-0000-4000-8000-000000000001'
    returning id
  $$,
  'B cannot delete A Recovery Case'
);

select throws_ok(
  $$
    insert into public.conversations (
      organization_id,
      contact_id,
      primary_channel,
      status,
      subject,
      last_activity_at
    )
    values (
      '22000000-0000-4000-8000-000000000002',
      'a1000000-0000-4000-8000-000000000001',
      'phone',
      'open',
      'Forbidden cross-tenant relationship',
      '2026-07-27T12:00:00Z'
    )
  $$,
  '23503',
  null,
  'Composite foreign key rejects a B conversation linked to an A contact'
);

select is_empty(
  $$
    update public.webhook_events
    set status = 'failed'
    returning id
  $$,
  'Ordinary tenant members cannot mutate webhook receipts'
);

select set_config(
  'request.jwt.claims',
  '{"sub":"user_demo_viewer","role":"authenticated","org_id":"org_demo_recovery"}',
  true
);

select throws_ok(
  $$
    insert into public.contacts (
      organization_id,
      display_name,
      consent_status
    )
    values (
      '11000000-0000-4000-8000-000000000001',
      'Viewer cannot create',
      'unknown'
    )
  $$,
  '42501',
  'new row violates row-level security policy for table "contacts"',
  'Viewer membership cannot mutate tenant records'
);

select set_config(
  'request.jwt.claims',
  '{"sub":"user_demo_recovery","role":"authenticated"}',
  true
);

select is(
  (select count(*)::integer from public.recovery_cases),
  0,
  'A session without an active organization cannot read cases'
);

reset role;

select throws_ok(
  $$
    insert into public.webhook_events (
      organization_id,
      provider,
      provider_event_id,
      event_type,
      signature_verified,
      payload_hash,
      raw_payload,
      received_at
    )
    values (
      '11000000-0000-4000-8000-000000000001',
      'development_fixture',
      'dev-event-harbourview-001',
      'missed_call',
      true,
      repeat('c', 64),
      '{"demo":true}',
      '2026-07-27T12:00:00Z'
    )
  $$,
  '23505',
  null,
  'Duplicate provider event ID is rejected'
);

select throws_ok(
  $$
    insert into public.recovery_cases (
      organization_id,
      contact_id,
      conversation_id,
      source_call_id,
      reference,
      category,
      reason,
      status,
      urgency,
      estimated_value_minor,
      currency_code,
      opened_at
    )
    values (
      '11000000-0000-4000-8000-000000000001',
      'a1000000-0000-4000-8000-000000000001',
      'd1000000-0000-4000-8000-000000000001',
      'e1000000-0000-4000-8000-000000000001',
      'RC-DUPLICATE-001',
      'missed_call',
      'Duplicate source event',
      'new',
      'normal',
      1000,
      'CAD',
      '2026-07-27T12:00:00Z'
    )
  $$,
  '23505',
  null,
  'Duplicate Recovery Case for the same source call is rejected'
);

select throws_ok(
  $$
    update public.call_events
    set event_type = 'forbidden'
    where id = '11000000-1111-4111-8111-000000000001'
  $$,
  '55000',
  'call_events is append-only',
  'Call events are append-only'
);

select throws_ok(
  $$
    delete from public.recovery_case_events
    where id = '12000000-1111-4111-8111-000000000001'
  $$,
  '55000',
  'recovery_case_events is append-only',
  'Recovery Case events are append-only'
);

select throws_ok(
  $$
    update public.revenue_attributions
    set amount_minor = 1
    where id = '17000000-1111-4111-8111-000000000001'
  $$,
  '55000',
  'revenue_attributions is append-only',
  'Revenue attributions are append-only'
);

select throws_ok(
  $$
    update public.contacts
    set organization_id = '22000000-0000-4000-8000-000000000002'
    where id = 'a1000000-0000-4000-8000-000000000001'
  $$,
  '23514',
  'organization_id is immutable',
  'Contact organization ownership is immutable'
);

select is(
  (
    select count(*)::integer
    from public.contacts
    where id = 'a1000000-0000-4000-8000-000000000001'
      and organization_id = '11000000-0000-4000-8000-000000000001'
      and display_name = 'Maya Chen'
  ),
  1,
  'Denied mutations leave the A fixture unchanged'
);

select * from finish();

rollback;
