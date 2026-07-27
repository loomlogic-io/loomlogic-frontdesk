-- LOCAL DEVELOPMENT ONLY. Do not run against a shared or hosted environment.
--
-- Phase 0/1 have no Clerk projection webhook (see PHASE_0_COMPLETION.md "Known
-- limitations"), so the deterministic seed uses placeholder external identifiers:
--
--   organizations.clerk_org_id            = 'org_demo_recovery'
--   users.clerk_user_id                   = 'user_demo_recovery'
--   organization_members.clerk_membership_id = 'membership_demo_recovery'
--
-- A real Clerk session therefore resolves to no local Organization and every
-- authenticated route fails tenant resolution. This script projects your real
-- Clerk identifiers onto seeded Organization A ("Harbourview Auto Care (Demo)")
-- so the authenticated UI can be reviewed against real data.
--
-- It is NOT a migration. It writes only to the three identity projection columns
-- and touches no tenant-owned business record, no RLS policy, and no grant.
-- `pnpm db:reset` reverts it.
--
-- Usage:
--   psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres" \
--     -v clerk_org_id="'org_xxx'" \
--     -v clerk_user_id="'user_xxx'" \
--     -v clerk_membership_id="'orgmem_xxx'" \
--     -v primary_email="'you@example.com'" \
--     -v display_name="'Your Name'" \
--     -f scripts/local-project-clerk-identity.sql
--
-- Find the three Clerk IDs in the Clerk dashboard, or read them from a signed-in
-- session token: `org_id` (or compact `o.id`), `sub`, and the membership ID.
--
-- The membership role stays 'manager', which is what the Phase 1 approval flow
-- requires (see src/modules/recovery/domain/permissions.ts).

\set ON_ERROR_STOP on

begin;

update public.organizations
   set clerk_org_id = :clerk_org_id
 where id = '11000000-0000-4000-8000-000000000001';

update public.users
   set clerk_user_id = :clerk_user_id,
       primary_email = :primary_email,
       display_name  = :display_name
 where id = '33000000-0000-4000-8000-000000000003';

update public.organization_members
   set clerk_membership_id = :clerk_membership_id
 where id = '55000000-0000-4000-8000-000000000005';

-- Fail loudly rather than leaving a half-projected identity behind.
do $$
declare
  projected record;
begin
  select o.clerk_org_id,
         o.status        as organization_status,
         u.clerk_user_id,
         m.clerk_membership_id,
         m.role,
         m.status        as membership_status
    into projected
    from public.organizations o
    join public.organization_members m on m.organization_id = o.id
    join public.users u on u.id = m.user_id
   where o.id = '11000000-0000-4000-8000-000000000001';

  if projected.organization_status <> 'active' or projected.membership_status <> 'active' then
    raise exception 'Projection incomplete: organization/membership is not active (% / %)',
      projected.organization_status, projected.membership_status;
  end if;

  raise notice 'Projected Clerk identity: org=% user=% membership=% role=%',
    projected.clerk_org_id, projected.clerk_user_id,
    projected.clerk_membership_id, projected.role;
end;
$$;

commit;

-- Unresolved Recovery Case IDs for E2E_RECOVERY_CASE_ID and manual review.
select id, reference, status, urgency
  from public.recovery_cases
 where organization_id = '11000000-0000-4000-8000-000000000001'
   and status not in ('booked', 'recovered', 'disqualified', 'opted_out', 'lost', 'closed')
 order by created_at;
