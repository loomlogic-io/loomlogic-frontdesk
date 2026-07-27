# Engineering Decisions

Use this file as a lightweight architecture decision record. Add dated entries; do not erase prior decisions without recording a superseding decision.

## 2026-07-27 — Modular monolith

Decision:

Start with one Next.js application and one PostgreSQL database with explicit domain modules.

Reason:

This minimizes operational complexity while preserving boundaries that can be extracted later.

## 2026-07-27 — SMB front desk first

Decision:

The first product serves ordinary appointment-driven and lead-driven businesses.

Reason:

It is compatible with self-serve onboarding and faster validation. Banking is a separate enterprise product line, not an MVP tenant type.

## 2026-07-27 — Supabase as temporary infrastructure

Decision:

Use Supabase for PostgreSQL, Storage, local development, RLS, and optional Realtime.

Reason:

It accelerates delivery. Core domain and repositories remain portable to standard PostgreSQL.

## 2026-07-27 — Clerk as identity provider

Decision:

Use Clerk authentication and Organizations, connected to Supabase through the current native third-party auth integration.

Reason:

Clerk provides B2B membership and active organization context. The old shared-secret/JWT-template integration is not permitted.

## 2026-07-27 — Tenant isolation in database and application

Decision:

All tenant-owned records include immutable `organization_id`; application authorization and PostgreSQL RLS both enforce isolation.

Reason:

UI-only tenant filters are insufficient.

## 2026-07-27 — Recovery Case as the core business aggregate

Decision:

Calls and messages create or update durable Recovery Cases when the desired business outcome remains unresolved.

Reason:

The product differentiates through resolution and measurable recovery, not call handling alone.

## 2026-07-27 — Provider abstraction

Decision:

Twilio, ElevenLabs, Resend, Google Calendar, OpenAI, storage, and workflows are accessed through typed adapters.

Reason:

Provider capabilities and requirements change. Domain logic must remain stable and testable.

## 2026-07-27 — AI tool gateway

Decision:

The operations copilot uses the OpenAI Responses API behind a typed, authorized, auditable tool gateway. Initial mutations require approval.

Reason:

The model must not directly access databases or provider credentials.

## 2026-07-27 — Database outbox before full workflow engine

Decision:

Use a transactional outbox for early event processing, then add a durable workflow provider for delayed and long-running work.

Reason:

This preserves consistency while avoiding premature workflow-platform complexity.

## Open decisions

Record final decisions before implementation reaches the relevant phase:

- exact Next.js and React versions;
- chosen test runner and browser test setup;
- database query approach: generated Supabase types, SQL layer, or a query builder;
- exact RLS helper claim path after inspecting Clerk session tokens;
- Twilio subaccount provisioning timing;
- ElevenLabs native Twilio versus register-call strategy;
- workflow provider;
- observability provider;
- encryption strategy for OAuth/provider credentials;
- initial industry template;
- French launch timing;
- subscription plans and usage limits.
