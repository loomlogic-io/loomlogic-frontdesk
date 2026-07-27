# Codex Prompt — Phase 1 Recovery Vertical Slice

Run this only after Phase 0 is complete and reviewed.

You are implementing the first complete business vertical slice for LoomLogic Front Desk OS.

## Mandatory repository review

Before editing:

1. Inspect the repository and git status.
2. Read `AGENTS.md`, `README.md`, every file in `/docs`, and `PHASE_0_COMPLETION.md`.
3. Inspect the existing migrations, RLS policies, generated database types, auth helpers, UI shell, tests, and CI.
4. Summarize the current implementation and identify any Phase 0 defects that would make Phase 1 unsafe.
5. Present a scoped plan.

Fix blocking foundation defects, but do not redesign the stack without recording an engineering decision.

## Objective

Implement the Phase 1 acceptance scenario from `docs/01_PRODUCT_REQUIREMENTS.md` using local fixtures and mock providers.

The completed slice must demonstrate:

missed-call event -> contact/conversation/call -> Recovery Case -> human review -> approved mock follow-up -> booked/resolved outcome -> recovered-value update.

## Scope

### Database

Add migrations for the minimum required records:

- contacts;
- contact_channels;
- conversations;
- calls;
- call_events;
- recovery_cases;
- recovery_case_events;
- tasks;
- messages;
- ai_action_requests or a simpler approval record consistent with the documented model;
- revenue_attributions;
- webhook_events;
- outbox_events if required.

Requirements:

- immutable organization ownership;
- cross-tenant relationship protection;
- constraints and indexes;
- RLS on every tenant table;
- idempotency constraints;
- audit logging for meaningful mutations;
- deterministic local seed/demo data.

### Domain and services

Implement explicit domain rules for:

- creating a missed-call Recovery Case;
- preventing duplicate case creation for the same source event;
- assigning and transitioning a case;
- drafting a follow-up;
- requiring approval before sending;
- executing through a mock `MessagingProvider`;
- marking booked/resolved;
- creating estimated/confirmed attribution without double counting.

Define safe state transitions. Reject invalid transitions.

### Development webhook

Create a development-only signed endpoint that accepts a normalized missed-call fixture.

Requirements:

- disabled in production;
- raw request validation;
- HMAC or equivalent signature verification;
- timestamp/replay protection;
- provider event idempotency;
- persisted webhook status;
- no trust in a client-supplied organization ID;
- tenant resolution through a development integration key or trusted phone-number mapping;
- quick acknowledgment and idempotent processing.

Do not label this endpoint as a Twilio production webhook.

### Mock messaging adapter

Implement a mock adapter that:

- uses the provider interface;
- records attempted sends;
- supports deterministic success and failure fixtures;
- enforces idempotency;
- never actually contacts a real phone number.

### UI

Implement polished, functional pages for:

- Overview;
- Inbox;
- Recovery queue;
- Recovery case detail;
- Contacts list;
- Contact detail;
- Conversation/call detail.

Requirements:

- real database data;
- pagination or a clear path to it;
- filters;
- loading, empty, error, and permission states;
- realistic demo fixtures marked as demo;
- responsive behavior;
- accessible interactions;
- no generic card wall;
- clear value-at-risk and next-action hierarchy.

### Approval flow

A user can:

1. open a Recovery Case;
2. draft a follow-up;
3. review recipient and message;
4. approve;
5. execute through the mock adapter;
6. see success/failure;
7. inspect the audit trail.

### Analytics

The Overview page should calculate from authoritative domain data:

- open Recovery Cases;
- cases requiring attention;
- mock follow-ups sent;
- booked or recovered outcomes;
- estimated recovered value.

Do not use hard-coded dashboard numbers.

## Required tests

Add and run:

- unit tests for state transitions and attribution;
- RLS tests for every new table;
- duplicate webhook event test;
- cross-tenant relationship test;
- approval-required test;
- mock provider idempotency test;
- E2E acceptance scenario;
- production build.

Explicitly test Organization B cannot discover Organization A data through list, detail, search, count, or mutation endpoints.

## Documentation

Update:

- data model if implementation differs;
- engineering decisions;
- README commands;
- environment example;
- `PHASE_1_COMPLETION.md`.

## Out of scope

Do not connect:

- live Twilio;
- live ElevenLabs;
- live Resend;
- Google Calendar;
- OpenAI;
- Stripe;
- Inngest.

Do not build:

- custom workflow canvas;
- production outbound calling;
- banking features;
- white-label portal;
- payments;
- multi-location analytics.

## Completion response

Report:

- end-to-end flow implemented;
- files and migrations;
- RLS model;
- commands and exact results;
- demo instructions;
- known limitations;
- one recommended GitHub-issue-sized next task for live Twilio ingestion.

If committing, use:

`feat: implement recovery case vertical slice`

Do not amend existing commits.
