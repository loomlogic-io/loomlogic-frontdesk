# Phase 1 Completion Report

Date: 2026-07-27

## Scope

Phase 1 implements the first complete local Recovery vertical slice:

`signed missed-call fixture -> Contact / Conversation / Call -> Recovery Case -> human review -> approved mock follow-up -> booked outcome -> confirmed recovered value`

No live telephony, voice, SMS, email, calendar, AI, payment, or workflow provider is
connected.

## Implemented

- Tenant-owned Contact, Contact Channel, Conversation, Call, Call Event, Recovery Case,
  Recovery Event, Task, Message, Approval, Revenue Attribution, Webhook Event, Outbox
  Event, and mock-attempt tables.
- Composite `(organization_id, id)` relationship constraints, immutable tenant ownership,
  UTC timestamps, integer minor-unit money, E.164 validation, lifecycle constraints,
  append-only event/attribution/attempt records, indexes, and idempotency uniqueness.
- RLS on every Phase 1 tenant table. Active members can read their tenant; viewers cannot
  mutate; customer-contact approval is restricted to owner, admin, or manager at both the
  application and database layers.
- Database-enforced approval transitions and immutable reviewed message content.
- A non-production HMAC-signed missed-call endpoint with exact raw-body signing,
  five-minute replay protection, strict Zod validation, a 64 KiB limit, persisted receipt
  status, deterministic identifiers, and tenant resolution from a trusted demo receiving
  number.
- A typed `MessagingProvider` boundary and local mock adapter with database-backed
  idempotency, deterministic success/failure fixtures, safe failure records, and no
  external network call.
- Explicit Recovery state transitions, assignment, draft/review/approval, mock execution,
  booked outcome, and estimated-to-confirmed attribution precedence.
- Database-backed Overview, paginated/filterable Recovery, Inbox, and Contact pages;
  Recovery detail with action and audit history; Contact history; and combined
  Conversation/call detail.
- Synthetic two-tenant seed data using only reserved example domains and fictional
  555-range phone numbers. Demo records and mock execution are visibly labeled.

## Architecture and security model

The Phase 1 implementation remains a modular monolith. Route handlers and Server Actions
authenticate or verify a trusted webhook, validate untrusted input, call services, and map
safe responses. Domain rules do not live in React or route handlers. PostgreSQL access
goes through explicit query/command repositories.

Ordinary app requests derive the active external Organization and user from the verified
Clerk session, project them to internal UUIDs, use a Clerk token with Supabase, and remain
subject to RLS. Browser-supplied Organization IDs are never accepted.

The development webhook uses a server-only administrative client only after signature
verification. It derives the tenant from `phone_numbers`, scopes every repository lookup
to the derived internal Organization, and has explicit `service_role` table grants. The
service-role key is never exposed to browser code.

## Migrations and deterministic data

- `supabase/migrations/20260727000100_phase_0_identity_and_tenancy.sql`
- `supabase/migrations/20260727000200_phase_1_recovery_vertical_slice.sql`
- `supabase/seed.sql`
- `supabase/tests/phase_0_tenant_isolation.sql`
- `supabase/tests/phase_1_recovery_isolation.sql`

The Phase 1 pgTAP suite covers all 15 new tenant tables, Organization A/B list, detail,
search, count, mutation isolation, forged tenant IDs, missing active Organization,
cross-tenant foreign keys, viewer denial, ordinary-member approval denial, valid approval
progression, approval-required sends, immutable ownership, append-only history, and
duplicate webhook/case constraints.

## Validation results

The final clean validation used Node.js 25.9.0 and pnpm 11.17.0. The repository and CI
remain pinned to Node.js 24 LTS; the local Node version is a documented variance.

| Command                              | Exact result                                                                                                                                                                                                                                                |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm db:reset`                      | Passed; both migrations applied from zero and deterministic Phase 1 seed data loaded.                                                                                                                                                                       |
| `pnpm db:types`                      | Passed; regenerated `src/types/database.generated.ts` from the local schema.                                                                                                                                                                                |
| `pnpm verify`                        | Passed with exit code 0 after resetting to the deterministic seed.                                                                                                                                                                                          |
| `pnpm format:check`                  | Passed; all included files matched Prettier style.                                                                                                                                                                                                          |
| `pnpm lint`                          | Passed with no warnings or errors.                                                                                                                                                                                                                          |
| `pnpm typecheck`                     | Passed with no TypeScript errors.                                                                                                                                                                                                                           |
| `pnpm test`                          | Passed: 7 test files, 23 tests.                                                                                                                                                                                                                             |
| `pnpm db:test`                       | Passed: 2 pgTAP files, 56 assertions, `Result: PASS`.                                                                                                                                                                                                       |
| `pnpm build`                         | Passed; Next.js 16.2.12 compiled, typechecked, generated 10 static pages, and emitted all expected dynamic Phase 1 routes.                                                                                                                                  |
| `pnpm test:e2e`                      | Passed: 2 public desktop/mobile Chromium tests; 1 real-Clerk route-protection test skipped because no real Clerk credentials were provided.                                                                                                                 |
| `pnpm fixture:missed-call` twice     | Passed against the actual local Next.js and Supabase REST stacks: first response HTTP 202 with `duplicate: false`; second response HTTP 200 with `duplicate: true`; both returned Recovery Case `066c1ae1-aefd-4a6e-8dcb-e28ad8a5d6ca` / `RC-A004D3E0BD86`. |
| Read-only PostgreSQL duplicate check | Passed: exactly 1 webhook event, 1 Call, 1 Recovery Case, and 1 Attribution existed after both requests.                                                                                                                                                    |
| `git diff --check`                   | Passed with no whitespace errors.                                                                                                                                                                                                                           |

The credential-gated authenticated Playwright acceptance scenario is implemented in
`tests/e2e/recovery-flow.authenticated.spec.ts`, but it was not executed because
`E2E_CLERK_USER_EMAIL`, `E2E_CLERK_ORGANIZATION_NAME`, and `E2E_RECOVERY_CASE_ID` were not
available. It is not reported as passed.

## Validation defects found and corrected

- The first real signed HTTP request returned HTTP 500 with PostgreSQL `42501`. The
  migration had enabled a server-only service-role client but had not granted that role
  table privileges. Explicit trusted-workflow grants were added, the database was rebuilt,
  and the route then returned 202 / 200 as expected.
- A defense-in-depth review found that ordinary member RLS could update approval rows
  directly even though application code required a manager. Dedicated manager approval
  RLS, immutable approval scope, valid transition enforcement, and reviewed-message
  immutability were added and tested.
- The first all-in-one `pnpm verify` after the HTTP check failed 11 deterministic seed
  count assertions because the successful fixture intentionally added a third Organization
  A record set. The database was reset to the documented seed and the identical
  verification command passed. No failed run is represented as passing.

## Demo instructions

1. Copy `.env.example` to ignored `.env.local` and provide real Clerk development values,
   the local Supabase publishable/service-role keys, and a `DEV_WEBHOOK_SIGNING_SECRET` of
   at least 32 characters.
2. Run `pnpm db:start` and `pnpm db:reset`.
3. Run `pnpm dev`.
4. Run `pnpm fixture:missed-call` twice to observe accepted and duplicate responses.
5. Project the real Clerk Organization/user IDs into local Organization A, sign in, and
   open `/app/recovery`.
6. Open the unresolved demo case, save the draft, review the recipient/body, approve the
   mock send as a manager, mark the case booked, then inspect the audit history and
   Overview recovered value.

## Known limitations

- Clerk identity and membership projection synchronization is not implemented. Real
  authenticated UI and E2E use require matching trusted projections.
- The authenticated Recovery Playwright scenario remains credential-gated and was not run
  in this environment.
- The missed-call endpoint is deliberately disabled in production and is not a Twilio
  webhook.
- Ingestion uses deterministic retryable writes but is not yet wrapped in one database
  transaction or dispatched through a durable workflow worker.
- The outbox is persisted but no outbox worker runs in Phase 1.
- The mock adapter records accepted local execution, not carrier delivery.
- Confirmed value is a user-confirmed booked outcome; no calendar or payment provider
  verifies it.

## Recommended next task

Create one GitHub issue: add production inbound Twilio missed-call ingestion behind the
existing normalized ingestion service. The issue should add a Twilio provider adapter,
verify the official request signature over the original request URL/body, resolve the
tenant only through a provisioned receiving-number mapping, map provider status events to
the normalized fixture contract, persist/deduplicate raw metadata, add contract and replay
tests, and keep all outbound calling/SMS disabled.
