# Environment and Setup

## Local prerequisites

Verified Phase 0 tools:

- Node.js 24 LTS (the supported production line as of 2026-07-27);
- pnpm 11.17.0 through Corepack;
- Git;
- Docker Desktop or a compatible container runtime;
- Supabase CLI 2.109.1 installed as a pinned development dependency;
- GitHub CLI optional;
- Codex CLI or VS Code extension.

Install the repository dependencies with:

```bash
corepack enable
pnpm install --frozen-lockfile
```

## Environment variables

Create `.env.example` with placeholders grouped by provider.

Expected groups:

### Application

- `NEXT_PUBLIC_APP_URL`
- `LOG_LEVEL`

### Clerk

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CLERK_WEBHOOK_SIGNING_SECRET`

### Supabase

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

The service role is server-only and should not be required for ordinary user requests.

### Development webhook signing

- `DEV_WEBHOOK_SIGNING_SECRET`

Use at least 32 random characters. The secret is server-only and signs the exact raw body
with the current Unix timestamp. The endpoint rejects signatures outside a five-minute
window and is unavailable when `NODE_ENV=production`.

### Future providers

- Twilio credentials
- ElevenLabs API key
- Resend API key
- Google OAuth client
- OpenAI API key
- workflow provider keys
- Sentry DSN

Do not add future provider variables until code uses them, except as commented documentation.

## Environment validation

Use a typed environment module:

- separate client-safe and server-only schemas;
- fail fast in server runtime when required values are missing;
- never import server schema into client bundles;
- allow test-specific safe defaults only in test setup.

## Supabase workflow

Local commands:

```bash
pnpm db:start
pnpm db:start:test
pnpm db:reset
pnpm db:types
pnpm db:test
pnpm db:stop
```

The first start downloads Supabase Docker images. `pnpm db:test` requires the local
stack to be running. `pnpm db:start:test` starts only PostgreSQL for CI and pgTAP;
use `pnpm db:start` for the complete local API and Studio.

## Phase 1 local Recovery demo

The deterministic seed creates two fully separate demo Organizations. Its external Clerk
identifiers are `org_demo_recovery` / `user_demo_recovery` and
`org_demo_other` / `user_demo_other`. These are projections, not authentication bypasses.
To use the authenticated UI, either create matching records for a real Clerk development
Organization and user or adjust local seed projections before resetting the database.

The development fixture endpoint requires the full local Supabase API because its trusted
server workflow uses the REST endpoint and service-role key:

```bash
pnpm db:start
pnpm db:reset
pnpm dev
pnpm fixture:missed-call
```

`tests/fixtures/development-missed-call.json` uses only fictional 555-range phone numbers.
The first request should return 202. Repeating it should return 200 and
`"duplicate": true`.

## Clerk and Supabase

Use the current native Clerk third-party authentication integration.

This repository is linked through Clerk CLI to application
`app_3H68VRv4yD6r4A1o49tDw4oI7U6`. To authenticate the CLI, refresh local development
keys without printing them, and verify the integration:

```bash
clerk auth login
clerk env pull --app app_3H68VRv4yD6r4A1o49tDw4oI7U6 --file .env.local
clerk doctor
```

`.env.local` and Clerk's host-only state are ignored by Git. Never place
`CLERK_SECRET_KEY` in client code.

The public Playwright smoke tests render Clerk auth state. Configure the
`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` GitHub Actions repository
secrets with development-instance values; do not use fabricated placeholder keys.

Manual dashboard and local steps:

1. create Clerk application;
2. enable Organizations and require membership for the application;
3. create development Organizations A and B and a development user for each;
4. activate the Clerk Supabase integration so session tokens include
   `"role": "authenticated"`;
5. in a hosted Supabase project, add Clerk under Authentication > Third-Party Auth
   using the Clerk domain;
6. for local Supabase, set `CLERK_DOMAIN` in the root `.env`, change
   `[auth.third_party.clerk].enabled` to `true`, and restart Supabase;
7. confirm a real session token includes `sub` and either `org_id` or compact `o.id`;
8. test Organization A and Organization B against the deployed RLS policies.

Do not implement the deprecated Clerk JWT-template method.

The committed local config keeps the Clerk issuer disabled so database-only work and
CI do not contact a fake placeholder issuer. Enabling it requires a real developer
Clerk domain; Supabase validates the issuer at startup.

## GitHub

Initial repository protections recommended after bootstrap:

- pull request required for main;
- CI required;
- no force pushes;
- secret scanning;
- Dependabot or equivalent;
- branch protection;
- CODEOWNERS later when team grows.

## Deployment

Initial web target: Vercel.

Use separate preview, staging, and production provider credentials.

Webhook providers must point only to stable environment URLs appropriate for the provider.

## Setup completion checklist

- application runs locally;
- sign-up and sign-in work;
- organization creation/selection works;
- Supabase local database runs;
- migrations apply from zero;
- generated types are current;
- tenant isolation tests pass;
- production build passes;
- `.env.example` is complete;
- no real secrets are tracked;
- CI passes.

## CI and E2E

GitHub Actions runs Node.js 24, installs with the frozen pnpm lockfile, starts local
Supabase, runs `pnpm verify`, installs Chromium, and executes the public Playwright
smoke suite. Store real Clerk development credentials only in GitHub Actions secrets
when enabling the authenticated E2E project.

The full authenticated Recovery Playwright scenario also requires
`E2E_RECOVERY_CASE_ID`, pointing to an unresolved case in the projected E2E
Organization. Without real Clerk configuration, that project is not registered and the
test is reported as credential-gated rather than passed.
