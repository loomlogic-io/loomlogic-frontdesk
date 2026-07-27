# LoomLogic Front Desk OS

Working product name: **LoomLogic Resolve**

LoomLogic is a self-serve AI front-desk and revenue-recovery platform for appointment-driven and lead-driven businesses. It answers or recovers missed calls, manages customer conversations, books appointments, follows up automatically, and tracks the business outcomes created by those actions.

## Product thesis

Most AI receptionists stop when the call ends. LoomLogic owns the unresolved outcome until it is booked, resolved, explicitly lost, or requires human action.

The first product is for ordinary businesses with front desks. A future financial-services edition may reuse selected platform modules, but it must be a separate product and deployment boundary.

## Repository status

Phase 0 established the secure engineering foundation. Phase 1 now adds the first
complete local Recovery vertical slice:

- Next.js App Router, React, strict TypeScript, Tailwind, and customized shadcn-style primitives;
- Clerk authentication with Organizations required for application access;
- Clerk-aware Supabase browser and server clients using native third-party authentication;
- tenant-owned Contact, Conversation, Call, Recovery Case, Task, Message, Approval,
  Attribution, Webhook, Outbox, and mock-attempt records;
- composite tenant constraints, immutable ownership, append-only history, RLS helpers,
  manager-only approval, and tenant-isolation tests;
- a signed development-only missed-call endpoint resolved through a trusted demo
  receiving-number mapping;
- an approval-gated local messaging adapter that never contacts a real recipient;
- database-backed Overview, Inbox, Recovery, Contact, and conversation/call views;
- Vitest, Playwright, pgTAP, and GitHub Actions.

No live telephony, voice, messaging, email, calendar, AI, payment, or workflow provider is
connected.

## Local requirements

- Node.js 24 LTS (see `.nvmrc`);
- pnpm 11.17.0 through Corepack;
- Docker Desktop or a compatible running Docker daemon;
- a Clerk development instance with Organizations enabled;
- a Supabase project for hosted environments. The Supabase CLI supplies local PostgreSQL.

The local machine used for bootstrap had Node.js 25 installed. It can run the project, but Node.js 25 is end-of-life; contributors should use Node.js 24 LTS.

## Local setup

```bash
corepack enable
pnpm install --frozen-lockfile
cp .env.example .env.local
```

Replace all placeholder Clerk values. For database-only local work, keep
`[auth.third_party.clerk].enabled = false` in `supabase/config.toml`. To test native
Clerk/Supabase authentication locally:

1. activate Clerk's Supabase integration;
2. set `CLERK_DOMAIN` in a root `.env` file to the Clerk issuer domain without a protocol;
3. change `[auth.third_party.clerk].enabled` to `true`;
4. restart the local Supabase stack.

Never commit `.env` or `.env.local`.

Start and reset the local database:

```bash
pnpm db:start
pnpm db:reset
```

Copy the local publishable key printed by `pnpm db:start` into `.env.local`, then run:

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Phase 1 demo fixture

Add `DEV_WEBHOOK_SIGNING_SECRET` and the local Supabase service-role key to the ignored
`.env.local`, then run the application and send the deterministic synthetic fixture:

```bash
pnpm fixture:missed-call
```

The first request returns HTTP 202 and creates the Contact, Conversation, missed Call,
Recovery Case, estimated Attribution, Task, Outbox record, and audit/event history.
Sending the same fixture again returns HTTP 200 with `duplicate: true` and does not create
a second case. The endpoint is `/api/webhooks/development/missed-call`; it requires the
`x-loomlogic-timestamp` and `x-loomlogic-signature` HMAC headers, trusts no browser
Organization ID, and returns 404 in production.

After signing into a Clerk Organization whose external IDs are projected into the local
seed, open `/app/recovery`, select the unresolved demo case, save a follow-up for
approval, approve the local mock send as a manager, and mark the outcome booked.

## Validation

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm db:test
pnpm build
pnpm test:e2e
```

`pnpm verify` runs formatting, lint, typecheck, unit tests, database tests, and the
production build. Start Supabase and reset to the deterministic seed first. Authenticated Clerk E2E coverage additionally
requires `E2E_CLERK_USER_EMAIL`, `E2E_CLERK_ORGANIZATION_NAME`, and
`E2E_RECOVERY_CASE_ID` for the full Recovery acceptance flow; the ordinary
Playwright suite always checks the public entry on desktop and mobile. Real
unauthenticated-route protection and authenticated shell coverage run only with a valid
Clerk development instance. Because the public entry now renders Clerk auth state, CI
must provide valid development values through the
`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` repository secrets; fake
placeholder keys are intentionally unsupported. CI uses `pnpm db:start:test` to start PostgreSQL only;
ordinary local development uses the full `pnpm db:start` stack.

## Project structure

- `src/app`: public, authentication, organization-selection, and protected app routes;
- `src/components`: customized UI, shared states, and the application shell;
- `src/lib`: auth, database, environment, error, logging, request, and utility boundaries;
- `src/modules/recovery`: domain rules, validation, repositories, services, actions, and
  presentation helpers for the Recovery vertical slice;
- `src/modules/integrations`: typed provider contracts and local-only adapters;
- `supabase/migrations`: append-only PostgreSQL migrations;
- `supabase/tests`: pgTAP RLS and tenant-isolation tests;
- `tests/unit` and `tests/e2e`: Vitest and Playwright suites;
- `PRODUCT.md` and `DESIGN.md`: compact product and visual context derived from `/docs`.

## Initial technology direction

- Next.js App Router with strict TypeScript
- React
- Tailwind CSS and shadcn/ui
- Clerk authentication and Organizations
- Supabase Postgres, Storage, Realtime, and local development tooling
- Native Clerk third-party authentication integration with Supabase
- OpenAI Responses API behind an auditable tool gateway
- Twilio for telephony and SMS
- ElevenLabs for conversational voice agents
- Resend for transactional and inbound email
- Google Calendar first, Microsoft Calendar later
- Inngest or an equivalent durable workflow provider after the core vertical slice
- Vercel for the initial web deployment
- GitHub Actions for CI

Use current stable package versions at implementation time and pin them.

## Start here

1. Read `AGENTS.md`.
2. Read `docs/00_PRODUCT_VISION.md`.
3. Read `docs/01_PRODUCT_REQUIREMENTS.md`.
4. Read `docs/02_ARCHITECTURE.md`.
5. Read `docs/03_DATA_MODEL.md`.
6. Read `docs/04_SECURITY_AND_TENANCY.md`.
7. Read `docs/05_UI_UX_SYSTEM.md`.
8. Read `docs/06_INTEGRATIONS.md`.
9. Read `docs/07_BUILD_ROADMAP.md`.
10. Review `PHASE_0_COMPLETION.md` and `PHASE_1_COMPLETION.md`.

## Non-negotiable principles

- Tenant isolation is enforced in PostgreSQL Row Level Security, not only in UI code.
- The browser never receives service-role credentials or provider secrets.
- Every external webhook is authenticated, persisted, deduplicated, and processed idempotently.
- AI models do not directly access the database or third-party APIs.
- AI actions execute only through typed tools with authorization, validation, audit logging, and approval policies.
- The product is outcome-driven. Calls are inputs; recovery cases, appointments, promises, and verified outcomes are the core domain.
- Do not build microservices prematurely.
- Do not build the banking edition in the MVP.
