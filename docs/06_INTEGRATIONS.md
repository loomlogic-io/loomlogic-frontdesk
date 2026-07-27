# Integrations

## Integration principle

The product owns normalized business concepts. Providers supply capabilities.

Provider SDK objects must be mapped into internal types at the adapter boundary.

## Twilio

Responsibilities:

- phone-number search and provisioning;
- inbound and outbound call events;
- SMS;
- recordings;
- call forwarding/routing support;
- usage records;
- subaccount lifecycle.

Target production model:

- one Twilio subaccount per organization where feasible;
- phone numbers explicitly mapped to internal organizations;
- webhook events resolved through trusted provider ownership;
- usage reconciled per organization.

Initial development:

- define `TelephonyProvider` and `MessagingProvider`;
- implement mock adapters;
- implement signed development webhook fixtures;
- connect live Twilio only after the domain slice and tenant tests pass.

## ElevenLabs

Responsibilities:

- conversational voice agent;
- voice selection;
- agent configuration;
- call transcripts and analysis;
- post-call webhook events;
- tool invocations supported by approved configuration;
- human transfer when using a supported integration mode.

Architecture note:

ElevenLabs currently offers both native Twilio integration and a register-call approach. The native path is easier and supports transfers, while register-call provides greater Twilio control but may not support all transfer behavior. Do not lock the core domain to either path.

Define:

- `VoiceAgentProvider`;
- agent draft/publish/version operations;
- test-call operation;
- post-call event mapper;
- conversation analysis mapper.

Do not let ElevenLabs agent configuration become the sole source of truth. Store LoomLogic agent versions and publish state internally.

## Resend

Responsibilities:

- transactional email;
- email delivery status;
- inbound email later;
- templates;
- domain configuration.

Define `EmailProvider`.

Webhook processing must handle duplicates and delivery-state changes idempotently.

## Google Calendar

First calendar integration.

Responsibilities:

- OAuth connection;
- calendar selection;
- availability read;
- event create/update/cancel;
- external change notifications;
- sync status and conflict handling.

Define `CalendarProvider`.

The LoomLogic appointment record remains the domain source of intent, while external calendar state is synchronized and reconciled.

Do not request broader OAuth scopes than necessary.

## Microsoft Calendar

Planned after Google Calendar. It should implement the same `CalendarProvider` interface.

## OpenAI

Use the Responses API through an internal `AIModelProvider`.

Responsibilities:

- assistant conversation;
- structured output;
- typed tool proposals;
- summarization;
- classification;
- extraction;
- controlled reasoning tasks.

Model name must be configuration, not hard-coded throughout the application.

The OpenAI client is server-only.

The model receives only tenant-authorized, task-relevant data.

## Clerk

Responsibilities:

- authentication;
- sessions;
- Organizations;
- membership;
- roles and permissions;
- user and organization webhooks.

Use the current native Clerk/Supabase third-party authentication integration. Do not use the deprecated JWT-template integration.

Local projections:

- application user;
- organization;
- membership.

Clerk webhooks update projections idempotently.

## Supabase

Initial responsibilities:

- PostgreSQL;
- Row Level Security;
- Storage;
- optional Realtime;
- local development;
- migrations;
- database tests.

Supabase is an infrastructure provider, not the domain layer.

## Stripe

Planned after the core product works.

Responsibilities:

- subscriptions;
- plan entitlements;
- usage billing;
- invoices;
- customer portal.

Do not implement recovered-revenue percentage billing in the MVP.

## Workflow provider

Begin with a database outbox and simple worker abstraction.

Later integrate Inngest or equivalent for:

- delayed follow-up;
- retries;
- promise deadlines;
- waitlist matching;
- appointment reminders;
- outbound callbacks.

Define `WorkflowProvider` so domain services do not depend on provider-specific types.

## Observability

Planned providers may include:

- Sentry for application errors;
- structured server logging;
- OpenTelemetry-compatible traces;
- provider health dashboards.

Never send unredacted transcripts or secrets to observability providers.

## Provider interface example

```ts
export interface MessagingProvider {
  sendText(input: SendTextInput): Promise<SendTextResult>;
  getMessageStatus(input: GetMessageStatusInput): Promise<MessageStatusResult>;
}
```

The real interface should include:

- organization/provider connection context;
- idempotency key;
- correlation ID;
- safe error mapping;
- normalized status.

## Integration state machine

Each integration should have:

- disconnected;
- connecting;
- active;
- degraded;
- error;
- disabled.

Store:

- last successful operation;
- last error;
- required user action;
- provider account reference;
- safe configuration;
- credential reference.

## Failure policy

Provider failures must:

- return a typed domain-safe error;
- avoid partial state where possible;
- create retryable work when safe;
- expose actionable status;
- never leak provider secrets;
- preserve idempotency;
- avoid marking messages or appointments successful before confirmation.
