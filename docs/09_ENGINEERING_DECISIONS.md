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

## 2026-07-27 — Phase 0 runtime and package baseline

Decision:

Use Node.js 24 LTS and pnpm 11.17.0. Pin Next.js 16.2.12, React 19.2.8, Clerk 7.6.1, Supabase JS 2.110.9, Tailwind CSS 4.3.3, Vitest 4.1.10, and Playwright 1.62.0 in the lockfile. Use ESLint 9.39.5 and TypeScript 6.0.3 because the newer major releases are not yet compatible with the current Next.js lint dependency graph.

Reason:

The project should use current stable framework releases without accepting known peer-dependency conflicts. Node.js 24 is the current supported LTS line; Node.js 25 is end-of-life.

## 2026-07-27 — Generated Supabase types and explicit clients

Decision:

Use Supabase-generated TypeScript database types with explicit Clerk-aware browser and server clients. Application modules will access PostgreSQL through repository or service boundaries as business features arrive.

Reason:

This keeps Phase 0 small, provides schema type safety, and avoids prematurely selecting a query builder before real repository use cases exist.

## 2026-07-27 — Isolated Clerk organization claim lookup

Decision:

Read the active Clerk Organization from `org_id`, falling back to the compact `o.id` claim, inside the single SQL function `app_private.clerk_organization_id()`.

Reason:

Current official Supabase guidance documents both Clerk token forms. Isolating the lookup keeps RLS policies readable and gives future claim-format changes one tested migration point.

## 2026-07-27 — Test stack

Decision:

Use Vitest with jsdom for unit tests, Playwright with Clerk's official testing helpers for browser flows, and Supabase CLI pgTAP tests for database isolation.

Reason:

These tools cover pure authorization logic, rendered route behavior, and database-enforced tenant boundaries at the layers where failures would occur.

## 2026-07-27 — Light-first product UI foundation

Decision:

Use Tailwind CSS 4 with customized shadcn-style owned components, Phosphor icons, OKLCH semantic tokens, a system font stack, and restrained state-only motion.

Reason:

The interface needs a calm, accessible operations register without a remote font dependency or an unmodified admin-template appearance.

## 2026-07-27 — Trusted development missed-call ingestion

Decision:

Use a development-only HMAC-signed normalized fixture endpoint. Resolve the internal
tenant through an active, server-controlled receiving-number mapping and process records
with a server-only administrative client whose repository calls remain explicitly
tenant-scoped.

Reason:

Phase 1 needs a realistic ingestion boundary without misrepresenting a local fixture as a
production Twilio integration. Signature verification, replay protection, persisted
receipt state, deterministic IDs, and database uniqueness establish the behavior expected
from a future production adapter.

## 2026-07-27 — Concrete approval record before the AI action gateway

Decision:

Use `action_approvals` for the Phase 1 `send_follow_up` action. Members can draft and
request approval; owner, admin, or manager roles can approve. RLS, transition triggers,
immutable reviewed message content, and the application service all enforce the boundary.

Reason:

The slice needs a complete human-review control but has no AI provider or general tool
gateway yet. A focused record avoids speculative framework code while preserving an
auditable path to the documented `ai_action_requests` model.

## 2026-07-27 — Local mock messaging and attribution precedence

Decision:

Route approved Phase 1 sends through an in-process `MessagingProvider` mock that records
idempotent attempts and deterministic success/failure results. Treat verified,
confirmed, and estimated attribution as precedence levels and count only the highest
current level for each Recovery Case.

Reason:

No live customer may be contacted in Phase 1, and estimated and confirmed value records
must not be summed as separate revenue.

## 2026-07-27 — Clerk CLI linkage and themed root provider

Decision:

Link the repository to Clerk application `app_3H68VRv4yD6r4A1o49tDw4oI7U6` with the
Clerk CLI. Render one `ClerkProvider` inside the root `<body>`, apply Clerk UI's shadcn
theme, and use signed-in/signed-out controls on the public entry while retaining
resource-level authentication and tenant authorization.

Reason:

One root provider prevents nested Clerk contexts and lets the landing page show the
correct account state. Resource boundaries and PostgreSQL RLS remain the authorization
controls; provider placement does not make protected routes public.

## 2026-07-27 — Audited transitive dependency overrides

Decision:

Pin patched transitive `postcss`, `sharp`, and `uuid` releases through pnpm overrides
until Next.js, Clerk UI, and their nested packages widen or update their dependency
ranges. Revalidate installation, peer compatibility, unit tests, and the production build
whenever these overrides change.

Reason:

The upstream dependency graph otherwise resolves versions covered by published security
advisories even though patched releases are available. Explicit, reviewed overrides keep
the committed lockfile auditable without waiting for unrelated upstream releases.

The full development audit also reports `GHSA-mh99-v99m-4gvg` through ESLint 9's
`minimatch` 3 dependency. The patched `brace-expansion` major is API-incompatible with
that chain, and Next's current lint plugin set does not yet declare ESLint 10 support.
Production dependencies are unaffected. Keep the advisory visible and remove this
temporary exception only through a compatible upstream lint-toolchain update; do not
force the patched major into `minimatch` 3.

## Open decisions

Record final decisions before implementation reaches the relevant phase:

- Twilio subaccount provisioning timing;
- ElevenLabs native Twilio versus register-call strategy;
- workflow provider;
- observability provider;
- encryption strategy for OAuth/provider credentials;
- initial industry template;
- French launch timing;
- subscription plans and usage limits.
