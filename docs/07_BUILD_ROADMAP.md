# Build Roadmap

## Build strategy

Build one testable vertical slice at a time. Do not scaffold all future modules into empty pages.

## Phase 0 — Engineering foundation

Goal: a secure, testable repository that can support multi-tenant work.

Deliver:

- Next.js App Router application;
- strict TypeScript;
- package manager and pinned dependencies;
- Tailwind and shadcn/ui foundation;
- linting, formatting, typecheck, unit test, E2E smoke test;
- environment validation;
- Clerk authentication;
- Clerk Organizations required;
- native Clerk/Supabase third-party auth setup documentation;
- Supabase local configuration;
- initial organizations, users, memberships, and audit migrations;
- RLS helpers and isolation tests;
- server/browser Supabase clients;
- app shell and protected routes;
- GitHub Actions CI;
- safe error and logging foundation;
- realistic demo fixtures only in local development;
- architecture decision log updated.

Do not connect live Twilio, ElevenLabs, Resend, OpenAI, or Google APIs in Phase 0.

Exit criteria:

- two test organizations cannot access each other's data;
- sign-in and organization selection work;
- lint, typecheck, tests, and build pass;
- no secrets are committed;
- CI is green.

## Phase 1 — Recovery vertical slice

Goal: prove the core domain without external provider complexity.

Deliver:

- contacts;
- conversations;
- calls;
- recovery cases;
- tasks;
- audit events;
- dashboard;
- inbox;
- recovery queue;
- contact detail;
- conversation detail;
- local signed development webhook endpoint;
- idempotent simulated missed-call ingestion;
- mock messaging adapter;
- action approval record;
- drafted and approved follow-up;
- recovered-value attribution;
- RLS and E2E tests.

Exit scenario is defined in the PRD.

## Phase 2 — Live telephony ingestion

Goal: ingest real phone activity safely.

Deliver:

- Twilio connection;
- organization phone number mapping;
- verified webhooks;
- call lifecycle events;
- recordings metadata;
- voicemail;
- usage events;
- integration health;
- development and staging number provisioning;
- provider reconciliation job.

Start with inbound calls and missed-call events. Do not begin with broad outbound campaigns.

## Phase 3 — AI voice receptionist

Goal: handle calls and create structured outcomes.

Deliver:

- LoomLogic agent configuration;
- immutable agent versions;
- ElevenLabs adapter;
- business knowledge configuration;
- post-call analysis mapping;
- booking and transfer tool definitions;
- test-call lab;
- failure detection;
- publish and rollback;
- safe provider error handling.

## Phase 4 — Scheduling and messaging

Goal: complete the booking loop.

Deliver:

- local service catalog;
- Google Calendar OAuth;
- availability;
- booking;
- rescheduling;
- cancellations;
- confirmations;
- Resend transactional email;
- live Twilio SMS;
- waitlist;
- cancellation rescue;
- calendar reconciliation.

## Phase 5 — Recovery Autopilot

Goal: pursue unresolved cases automatically within policy.

Deliver:

- durable workflow provider;
- follow-up sequences;
- promise tracker;
- due-date escalation;
- channel policies;
- quiet hours;
- customer opt-out;
- retry and dead-letter controls;
- manager approval policies;
- AI failure recovery.

## Phase 6 — Operations copilot

Goal: allow users to operate the front desk through a secure assistant.

Deliver:

- OpenAI Responses API adapter;
- assistant threads;
- retrieval of tenant-authorized context;
- typed tool gateway;
- read/draft/approval action classes;
- approval UI;
- execution audit;
- assistant evaluation suite;
- prompt and tool versioning.

Do not provide unrestricted autonomous execution.

## Phase 7 — Analytics, billing, and self-serve maturity

Deliver:

- recovered revenue ledger;
- attribution confidence;
- funnel analytics;
- team metrics;
- Stripe billing;
- usage metering;
- plan limits;
- onboarding automation;
- integration diagnostics;
- export and deletion workflows;
- production readiness review.

## Phase 8 — Industry templates and platform expansion

Possible:

- automotive;
- home services;
- dental/wellness;
- legal intake;
- multi-location;
- partner/reseller;
- public API;
- Outlook Calendar;
- website voice/chat widget.

## Separate future initiative — LoomLogic Financial

Do not merge this into the SMB roadmap.

Potential shared concepts:

- resolution cases;
- promise tracking;
- audit;
- AI policy gateway;
- context continuity.

Required separate work:

- enterprise discovery;
- dedicated deployment;
- SSO/SCIM;
- contact-center adapters;
- financial regulatory review;
- secure customer authentication;
- non-transactional pilot;
- procurement and security documentation.
