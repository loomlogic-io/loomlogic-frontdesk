# Environment and Setup

## Local prerequisites

Codex should verify current official installation instructions before creating commands.

Expected tools:

- Node.js current supported LTS;
- pnpm;
- Git;
- Docker Desktop or compatible container runtime;
- Supabase CLI;
- GitHub CLI optional;
- Codex CLI or VS Code extension.

## Environment variables

Create `.env.example` with placeholders grouped by provider.

Expected groups:

### Application

- `NEXT_PUBLIC_APP_URL`
- `NODE_ENV`
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

Expected local commands:

1. initialize Supabase if needed;
2. start local services;
3. apply/reset migrations;
4. generate TypeScript database types;
5. run database tests;
6. stop local services.

Codex should add package scripts so contributors do not need to memorize raw commands.

## Clerk and Supabase

Use the current native Clerk third-party authentication integration.

Codex must document manual dashboard steps separately from code:

1. create Clerk application;
2. enable Organizations and require membership;
3. activate Clerk/Supabase integration;
4. add Clerk as third-party provider in Supabase;
5. confirm the session token includes the required authenticated role and organization claims;
6. test RLS with two Organizations.

Do not implement the deprecated Clerk JWT-template method.

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
