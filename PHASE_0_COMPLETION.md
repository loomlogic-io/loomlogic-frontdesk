# Phase 0 Completion Report

Date: 2026-07-27

## Scope

Phase 0 establishes a secure, testable modular-monolith foundation for LoomLogic Resolve.
It does not implement Phase 1 business objects or connect live telephony, voice,
messaging, email, calendar, AI, payment, or workflow providers.

## Implemented

- Next.js 16 App Router, React 19, strict TypeScript, pnpm, Tailwind CSS 4, ESLint,
  Prettier, and customized shadcn-style UI primitives.
- Clerk provider, current Next.js `proxy.ts` integration, resource-level route protection,
  sign-in, sign-up, mandatory Organization selection, Organization switcher, user menu,
  and server-only tenant resolver.
- Clerk-aware Supabase browser and server clients using access-token callbacks for the
  native third-party authentication flow.
- Organizations, users, organization memberships, and append-only audit logs in one
  append-only migration.
- Standard and compact Clerk Organization claim support isolated in
  `app_private.clerk_organization_id()`.
- Deny-by-default RLS, active-membership checks, immutable tenant IDs, indexes,
  constraints, and timestamp handling.
- Responsive application shell with Overview, Inbox, Recovery, Contacts, and Settings
  Phase 0 pages.
- Typed application errors, safe error mapping, request IDs, structured server logging
  with recursive sensitive-field redaction, loading states, empty states, not-found
  handling, and route error boundaries.
- Vitest unit tests, pgTAP tenant-isolation tests, Playwright smoke tests, and GitHub
  Actions CI.

## Architecture summary

The repository is a modular monolith. Server-rendered routes resolve identity and the
active Clerk Organization before rendering the protected shell. Database clients use the
Clerk session token, while PostgreSQL independently maps the verified external
Organization claim to an internal UUID and enforces membership through RLS. Business
domain modules will be added only when Phase 1 introduces their first real use case.

## Migration

- `supabase/migrations/20260727000100_phase_0_identity_and_tenancy.sql`

The migration creates `organizations`, `users`, `organization_members`, and `audit_logs`;
security helper functions; indexes; constraints; update triggers; audit immutability;
grants; and RLS policies.

## Validation results

The final local validation pass completed on Node.js 25.9.0 with pnpm 11.17.0. The
repository pins Node.js 24 LTS for development and CI; the newer local runtime therefore
remains a documented environment variance.

| Command                                 | Exact result                                                                                                                                                                                         |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm install --frozen-lockfile`        | Passed; the lockfile installed without mutation.                                                                                                                                                     |
| `pnpm peers check`                      | Passed; `No peer dependency issues found`.                                                                                                                                                           |
| `pnpm db:start:test`                    | Passed; the isolated local PostgreSQL service started.                                                                                                                                               |
| `pnpm db:reset`                         | Passed; the Phase 0 migration applied from zero and the empty seed completed.                                                                                                                        |
| `pnpm db:types`                         | Passed; generated `src/types/database.generated.ts` from the applied local schema.                                                                                                                   |
| `pnpm verify`                           | Passed with exit code 0.                                                                                                                                                                             |
| `pnpm format:check`                     | Passed; all included files matched Prettier style.                                                                                                                                                   |
| `pnpm lint`                             | Passed with no warnings or errors.                                                                                                                                                                   |
| `pnpm typecheck`                        | Passed with no TypeScript errors.                                                                                                                                                                    |
| `pnpm test`                             | Passed: 3 files, 9 tests.                                                                                                                                                                            |
| `pnpm db:test`                          | Passed: 1 file, 15 assertions, `Result: PASS`.                                                                                                                                                       |
| `pnpm build`                            | Passed; Next.js 16.2.12 compiled, typechecked, generated 9 static pages, and emitted the expected static/dynamic route map.                                                                          |
| `pnpm exec playwright install chromium` | Passed; installed Chromium and Chromium Headless Shell 151.0.7922.34 for Playwright 1.62.0.                                                                                                          |
| `pnpm test:e2e`                         | Passed: 2 public smoke tests across desktop and mobile Chromium; 1 real-Clerk protection test intentionally skipped.                                                                                 |
| Local browser inspection                | Passed for desktop and 390×844 mobile rendering; semantic navigation and heading were present, with no application console or runtime errors after Clerk was isolated to auth/protected route trees. |

Validation attempts that did not pass were retained during implementation rather than
misreported:

- The first Playwright attempt could not bind port 3000 inside the filesystem sandbox
  (`EPERM`). It was rerun with the required local-server permission.
- The next attempt could not launch because the pinned Playwright Chromium build was not
  installed. The browser was installed and the test was rerun.
- The first browser-enabled run was rejected by Clerk's hosted handshake because the
  configured value was an explicit placeholder, not a real Clerk instance. Public smoke
  coverage was separated from credential-dependent Clerk coverage; no authentication
  bypass was added.
- A first production-build attempt was unable to open Turbopack's internal worker port in
  the sandbox. The same build command passed when granted the required local process
  permission.
- An early pgTAP draft used an invalid data-modifying CTE shape. The assertion was
  corrected, the database was reset from zero, and the official Supabase test runner
  subsequently passed all 15 assertions.

## Manual configuration still required

1. Create a Clerk development application.
2. Enable Clerk Organizations and require workspace membership.
3. Activate Clerk's Supabase integration.
4. Add Clerk as a hosted Supabase third-party auth provider.
5. Set the real local `CLERK_DOMAIN`, enable the local Clerk provider in
   `supabase/config.toml`, and restart Supabase.
6. Copy real Clerk and Supabase development values into ignored environment files.
7. Create two Clerk development Organizations and exercise a real Organization switch
   against the hosted or local integration.
8. Add Clerk E2E credentials to CI secrets before enabling authenticated browser smoke
   coverage.

## Security assumptions

- Clerk remains the identity and membership authority.
- `sub` identifies the Clerk user. `org_id` or compact `o.id` identifies the active Clerk
  Organization.
- Organization and membership projections will be populated by a future verified,
  idempotent Clerk webhook or another trusted server workflow. Browser requests cannot
  create or modify those projections.
- The service-role key is optional in Phase 0, server-only, and unused by ordinary tenant
  requests.
- No platform-admin bypass exists.
- A Content Security Policy is deferred until real Clerk and deployment domains can be
  enumerated without breaking authentication; baseline frame, MIME, referrer, and
  permissions headers are enabled now.

## Known limitations

- A real Clerk issuer and development credentials are required to complete live sign-up,
  Organization switching, and authenticated Clerk Playwright coverage.
- The committed local Supabase config keeps third-party Clerk auth disabled until a real
  issuer domain is supplied because Supabase validates the issuer at startup.
- No Clerk projection webhook exists in Phase 0.
- No business data, live providers, dark mode, or Phase 1 recovery workflows exist.

## Recommended next task

Create one Phase 1 GitHub issue: implement the tenant-scoped Contact aggregate end to end,
including migration, composite tenant constraints, repository and service, validated
server mutation, audit record, loading/empty/error UI, unit tests, RLS tests, and a
Playwright create-contact flow. Do not add missed-call ingestion in the same issue.
