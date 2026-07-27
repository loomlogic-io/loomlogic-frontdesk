begin;

create extension if not exists pgtap with schema extensions;

select plan(15);

insert into public.organizations (id, clerk_org_id, name, slug)
values
  ('10000000-0000-4000-8000-000000000001', 'org_phase0_a', 'Phase 0 Organization A', 'phase-0-a'),
  ('20000000-0000-4000-8000-000000000002', 'org_phase0_b', 'Phase 0 Organization B', 'phase-0-b');

insert into public.users (id, clerk_user_id, primary_email, display_name)
values
  ('30000000-0000-4000-8000-000000000003', 'user_phase0_a', 'user-a@example.invalid', 'Test User A'),
  ('40000000-0000-4000-8000-000000000004', 'user_phase0_b', 'user-b@example.invalid', 'Test User B'),
  ('50000000-0000-4000-8000-000000000005', 'user_phase0_inactive', 'inactive@example.invalid', 'Inactive Test User');

insert into public.organization_members (
  id,
  organization_id,
  user_id,
  clerk_membership_id,
  role,
  status
)
values
  (
    '60000000-0000-4000-8000-000000000006',
    '10000000-0000-4000-8000-000000000001',
    '30000000-0000-4000-8000-000000000003',
    'membership_phase0_a',
    'owner',
    'active'
  ),
  (
    '70000000-0000-4000-8000-000000000007',
    '20000000-0000-4000-8000-000000000002',
    '40000000-0000-4000-8000-000000000004',
    'membership_phase0_b',
    'owner',
    'active'
  ),
  (
    '80000000-0000-4000-8000-000000000008',
    '10000000-0000-4000-8000-000000000001',
    '50000000-0000-4000-8000-000000000005',
    'membership_phase0_inactive',
    'member',
    'inactive'
  );

insert into public.audit_logs (
  id,
  organization_id,
  actor_type,
  actor_user_id,
  action,
  target_type,
  source,
  request_id
)
values
  (
    '90000000-0000-4000-8000-000000000009',
    '10000000-0000-4000-8000-000000000001',
    'system',
    null,
    'phase0.fixture.created',
    'organization',
    'system',
    'request-phase0-a'
  ),
  (
    'a0000000-0000-4000-8000-00000000000a',
    '20000000-0000-4000-8000-000000000002',
    'system',
    null,
    'phase0.fixture.created',
    'organization',
    'system',
    'request-phase0-b'
  );

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"user_phase0_a","role":"authenticated","org_id":"org_phase0_a"}',
  true
);

select is(
  (select count(*)::integer from public.organizations),
  1,
  'Organization A can read only its own organization row'
);

select is(
  (select clerk_org_id from public.organizations limit 1),
  'org_phase0_a',
  'Organization A reads the expected organization'
);

select is(
  (select count(*)::integer from public.audit_logs),
  1,
  'Organization A can read only its own tenant audit row'
);

select is(
  (
    select count(*)::integer
    from public.organizations
    where clerk_org_id = 'org_phase0_b'
  ),
  0,
  'Organization A cannot read Organization B'
);

select throws_ok(
  $$
    insert into public.audit_logs (
      organization_id,
      actor_type,
      actor_user_id,
      action,
      target_type,
      source,
      request_id
    )
    values (
      '20000000-0000-4000-8000-000000000002',
      'user',
      '30000000-0000-4000-8000-000000000003',
      'cross_tenant.insert',
      'organization',
      'user',
      'request-cross-tenant'
    )
  $$,
  '42501',
  'new row violates row-level security policy for table "audit_logs"',
  'Organization A cannot insert a tenant record for Organization B'
);

select is_empty(
  $$
    update public.organizations
    set name = 'Forbidden update'
    where id = '20000000-0000-4000-8000-000000000002'
    returning id
  $$,
  'Organization A cannot update Organization B'
);

select is_empty(
  $$
    delete from public.organizations
    where id = '20000000-0000-4000-8000-000000000002'
    returning id
  $$,
  'Organization A cannot delete Organization B'
);

select lives_ok(
  $$
    insert into public.audit_logs (
      organization_id,
      actor_type,
      actor_user_id,
      action,
      target_type,
      source,
      request_id
    )
    values (
      '10000000-0000-4000-8000-000000000001',
      'user',
      '30000000-0000-4000-8000-000000000003',
      'same_tenant.insert',
      'organization',
      'user',
      'request-same-tenant'
    )
  $$,
  'An active member can insert a constrained audit row for the active tenant'
);

select is_empty(
  $$
    update public.audit_logs
    set action = 'forbidden.audit.update'
    where organization_id = '10000000-0000-4000-8000-000000000001'
    returning id
  $$,
  'Authenticated users cannot update append-only audit rows'
);

select set_config(
  'request.jwt.claims',
  '{"sub":"user_phase0_b","role":"authenticated","o":{"id":"org_phase0_b","rol":"owner"}}',
  true
);

select is(
  (select clerk_org_id from public.organizations limit 1),
  'org_phase0_b',
  'Compact Clerk o.id claim resolves Organization B'
);

select set_config(
  'request.jwt.claims',
  '{"sub":"user_phase0_a","role":"authenticated"}',
  true
);

select is(
  (select count(*)::integer from public.organizations),
  0,
  'No active organization claim is denied'
);

select set_config(
  'request.jwt.claims',
  '{"sub":"user_phase0_inactive","role":"authenticated","org_id":"org_phase0_a"}',
  true
);

select is(
  (select count(*)::integer from public.organizations),
  0,
  'Inactive membership is denied'
);

select set_config(
  'request.jwt.claims',
  '{"sub":"user_phase0_a","role":"authenticated","org_id":"org_unknown"}',
  true
);

select is(
  (select count(*)::integer from public.organizations),
  0,
  'Unknown organization claim is denied'
);

select set_config(
  'request.jwt.claims',
  '{"sub":"user_phase0_a","role":"authenticated","org_id":"org_phase0_a","o":{"id":"org_phase0_b"}}',
  true
);

select is(
  (select clerk_org_id from public.organizations limit 1),
  'org_phase0_a',
  'Standard org_id claim takes precedence over compact fallback'
);

reset role;

select is(
  (
    select count(*)::integer
    from public.organizations
    where id = '20000000-0000-4000-8000-000000000002'
      and name = 'Phase 0 Organization B'
  ),
  1,
  'Denied cross-tenant mutations leave Organization B unchanged'
);

select * from finish();

rollback;
