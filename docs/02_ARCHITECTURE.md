# Architecture

## Architecture style

Use a **modular monolith** deployed as one Next.js application for the initial product.

This is intentional:

- one developer and Codex can move quickly;
- domain boundaries remain explicit;
- transactions are simpler;
- deployment and observability are manageable;
- modules can be extracted later when scale or compliance justifies it.

Do not introduce microservices, Kafka, Kubernetes, or multiple databases in the MVP.

## Proposed repository structure

```text
.
├── AGENTS.md
├── README.md
├── docs/
├── prompts/
├── public/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (marketing)/
│   │   ├── (dashboard)/
│   │   ├── api/
│   │   │   ├── webhooks/
│   │   │   └── internal/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   └── shared/
│   ├── modules/
│   │   ├── organizations/
│   │   ├── contacts/
│   │   ├── conversations/
│   │   ├── calls/
│   │   ├── recovery/
│   │   ├── appointments/
│   │   ├── promises/
│   │   ├── tasks/
│   │   ├── workflows/
│   │   ├── integrations/
│   │   ├── assistant/
│   │   ├── analytics/
│   │   ├── audit/
│   │   └── billing/
│   ├── lib/
│   │   ├── auth/
│   │   ├── db/
│   │   ├── env/
│   │   ├── logging/
│   │   ├── errors/
│   │   ├── validation/
│   │   └── utilities/
│   ├── styles/
│   └── types/
├── supabase/
│   ├── config.toml
│   ├── migrations/
│   ├── seed.sql
│   └── tests/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
└── package.json
```

## Module anatomy

Each business module should use a predictable shape when applicable:

```text
modules/recovery/
├── components/
├── schemas/
├── domain/
├── repositories/
├── services/
├── queries/
├── commands/
├── permissions/
├── mappers/
├── events/
└── tests/
```

Do not force empty folders. Create them when needed.

## Layer responsibilities

### UI layer

- React Server Components by default.
- Client Components only for interaction requiring browser state.
- No direct provider SDK calls.
- No business authorization decisions.
- Calls typed application services through server-side boundaries.

### Route handlers

- verify authentication or provider signature;
- resolve tenant context;
- validate input;
- call one application service;
- map known errors to safe responses;
- attach correlation IDs;
- never contain core domain logic.

### Application services

- orchestrate use cases;
- enforce authorization and policy;
- coordinate repositories and integrations;
- open transactions where necessary;
- emit domain/outbox events;
- create audit records.

### Domain layer

- state transitions;
- invariants;
- value objects;
- outcome and attribution rules;
- no React, HTTP, Clerk, Supabase client, or provider SDK dependency.

### Repository layer

- explicit queries;
- organization scoping;
- pagination;
- transaction support;
- mapping database records to domain types.

### Integration adapters

Expose interfaces such as:

- `TelephonyProvider`
- `VoiceAgentProvider`
- `MessagingProvider`
- `EmailProvider`
- `CalendarProvider`
- `AIModelProvider`
- `WorkflowProvider`

Provider SDK types must not leak into core domain types.

## Request flow

```text
Browser
  -> Clerk session verification
  -> active organization resolution
  -> authorization policy
  -> validated command/query
  -> application service
  -> repository
  -> Supabase Postgres with RLS
  -> audit/outbox event
  -> response
```

## Webhook flow

```text
Provider
  -> route handler
  -> raw body capture
  -> signature verification
  -> provider event normalization
  -> insert webhook_event with unique provider event key
  -> acknowledge
  -> asynchronous processor
  -> idempotent domain service
  -> audit/outbox
  -> integration status update
```

Never perform a long AI call inside the initial webhook acknowledgment path.

## Event and workflow approach

### Initial phases

Use a database outbox pattern:

- domain transaction writes business records and an `outbox_events` record;
- a worker or scheduled process claims pending events;
- processing is idempotent;
- failures are retried with backoff;
- poison events become visible in an operations view.

### Later phases

Adopt Inngest or an equivalent durable execution provider for:

- delayed recovery attempts;
- appointment reminders;
- promise escalation;
- outbound callbacks;
- long-running multi-step workflows.

The domain must not depend directly on Inngest types.

## AI assistant architecture

```text
User request
  -> assistant service
  -> retrieve tenant-authorized context
  -> OpenAI Responses API
  -> proposed typed tool call
  -> tool gateway
  -> authorization and policy evaluation
  -> approval requirement
  -> validated application command
  -> domain service
  -> audit record
  -> result returned to model/user
```

Tool execution classes:

- read;
- draft;
- execute_with_approval;
- preauthorized_execute;
- prohibited.

Initial release supports read, draft, and execute with approval.

## Caching

Use caching only for safe, stable, tenant-scoped data such as:

- organization settings;
- service catalog;
- business hours;
- published knowledge configuration;
- feature flags.

Never cache a cross-tenant query under a shared key. Include organization and authorization-sensitive dimensions in cache keys. Avoid caching mutable recovery queues unless invalidation is explicit.

## Portability from Supabase

Supabase is the initial backend, but the core should remain portable to standard PostgreSQL.

- use SQL migrations;
- avoid embedding business logic in Supabase-only client calls;
- wrap database access;
- keep storage behind an adapter;
- keep Realtime optional;
- never use Supabase Auth because Clerk is the identity provider;
- use native Clerk third-party authentication with Supabase;
- store Clerk IDs as external identifiers, not primary domain keys.

## Deployment environments

- local;
- preview;
- staging;
- production.

Each environment uses separate:

- Supabase project or local instance;
- Clerk application;
- provider credentials;
- webhook endpoints;
- encryption and signing secrets;
- storage buckets.

Never share production provider credentials with preview deployments.

## Future financial-services product

A future `LoomLogic Financial` product may reuse conceptual packages such as case management, audit, policy gateway, and promise tracking.

It must use separate:

- application surface;
- customer data boundary;
- deployment;
- identity and SSO configuration;
- provider adapters;
- retention policies;
- regulatory workflows;
- release controls.

Do not design the MVP around bank requirements, but avoid coupling core modules to a single industry.
