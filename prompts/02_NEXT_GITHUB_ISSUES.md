# Suggested GitHub Issue Sequence

Create these as separate issues after Phase 0 and Phase 1 prompts are available.

## Issue 1 — Bootstrap application foundation

Use `prompts/00_CODEX_BOOTSTRAP_PROMPT.md`.

## Issue 2 — Implement recovery vertical slice

Use `prompts/01_CODEX_VERTICAL_SLICE_PROMPT.md`.

## Issue 3 — Twilio connection model

Deliver:

- Twilio integration settings;
- secure credential strategy;
- subaccount provisioning decision;
- phone-number mapping;
- webhook verification;
- call event normalization;
- provider fixture contract tests.

No ElevenLabs yet.

## Issue 4 — Live missed-call ingestion

Deliver:

- real Twilio missed/abandoned call ingestion;
- idempotent domain processing;
- integration health;
- replay UI for failed events;
- usage events;
- staging test number.

## Issue 5 — SMS recovery

Deliver:

- live SMS adapter;
- consent and opt-out;
- quiet hours;
- message status webhooks;
- retry;
- spend caps;
- message templates;
- audit.

## Issue 6 — Service catalog and local scheduling

Deliver:

- services;
- staff eligibility;
- availability rules;
- local appointments;
- double-booking prevention;
- appointment states;
- recovery-case linking.

## Issue 7 — Google Calendar integration

Deliver:

- OAuth;
- calendar selection;
- availability sync;
- create/reschedule/cancel;
- webhook notifications;
- reconciliation;
- token encryption.

## Issue 8 — ElevenLabs agent adapter

Deliver:

- agent draft;
- version;
- publish;
- test;
- post-call events;
- transcript mapping;
- tool interface;
- transfer-strategy decision.

## Issue 9 — AI voice booking flow

Deliver:

- knowledge;
- contact identification;
- service selection;
- availability;
- booking tool;
- transfer;
- failure recovery.

## Issue 10 — Promise tracker

Deliver:

- promise extraction/manual creation;
- deadlines;
- ownership;
- escalation;
- evidence;
- queue and audit.

## Issue 11 — Durable Recovery Autopilot

Deliver:

- workflow provider;
- delayed steps;
- retries;
- quiet hours;
- approval policy;
- dead-letter operations;
- opt-out.

## Issue 12 — Operations copilot read mode

Deliver:

- assistant threads;
- OpenAI Responses API;
- tenant-authorized retrieval;
- citations to internal records;
- no mutation tools.

## Issue 13 — Operations copilot approval tools

Deliver:

- typed tools;
- action requests;
- approval UI;
- execution;
- idempotency;
- audit;
- evaluation tests.
