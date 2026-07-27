# Data Model

## Conventions

- PostgreSQL is the source of truth.
- Internal IDs are UUIDs.
- Every tenant-owned table includes `organization_id uuid not null`.
- Provider identifiers use separate text columns with unique constraints scoped appropriately.
- Time is stored as `timestamptz` in UTC.
- Monetary values use integer minor units and an ISO currency code.
- Phone numbers use normalized E.164 where possible, while preserving raw input when useful.
- Status columns use constrained text or PostgreSQL enums only when migration trade-offs are understood.
- Use `jsonb` only for provider payloads, flexible metadata, and versioned configuration—not as a substitute for relational modeling.
- Every mutable record has `created_at` and `updated_at`.
- Add `created_by_user_id` or actor metadata where business accountability matters.
- Audit records are append-only.

## Identity and tenant tables

### organizations

- id
- clerk_org_id
- name
- slug
- status
- time_zone
- locale
- currency_code
- onboarding_state
- settings
- created_at
- updated_at

### users

Application profile synchronized from Clerk.

- id
- clerk_user_id
- primary_email
- display_name
- avatar_url
- status
- last_seen_at
- created_at
- updated_at

### organization_members

Local authorization and profile projection.

- id
- organization_id
- user_id
- clerk_membership_id
- role
- status
- job_title
- permissions
- created_at
- updated_at

Clerk remains the identity/membership authority. Local rows support joins, domain metadata, and auditable policy decisions.

### locations

- id
- organization_id
- name
- address fields
- phone
- time_zone
- status
- created_at
- updated_at

### business_hours

- id
- organization_id
- location_id
- day_of_week
- opens_at
- closes_at
- is_closed
- valid_from
- valid_until

## Customer and conversation tables

### contacts

- id
- organization_id
- first_name
- last_name
- display_name
- preferred_language
- time_zone
- lifecycle_status
- consent_status
- metadata
- created_at
- updated_at
- deleted_at

### contact_channels

- id
- organization_id
- contact_id
- type: phone or email
- normalized_value
- display_value
- is_primary
- is_verified
- consent_status
- created_at
- updated_at

Unique constraints should reduce duplicates within an organization without preventing shared family or business contact information where legitimate.

### conversations

- id
- organization_id
- contact_id
- primary_channel
- status
- subject
- summary
- assigned_member_id
- last_activity_at
- is_demo
- created_at
- updated_at

### conversation_participants

- id
- organization_id
- conversation_id
- participant_type
- contact_id
- user_id
- external_identifier

### messages

- id
- organization_id
- conversation_id
- contact_id
- recovery_case_id
- provider
- provider_message_id
- idempotency_key
- direction
- channel
- status
- recipient
- body
- sent_at
- delivered_at
- failed_at
- error_code
- metadata
- created_at
- updated_at

Phase 1 permits only the `mock` provider. A database trigger rejects `approved`,
`sending`, or `sent` states without a corresponding approved action. Recipient and
message content become immutable after approval.

## Telephony tables

### phone_numbers

- id
- organization_id
- location_id
- provider
- provider_phone_number_id
- e164_number
- friendly_name
- capabilities
- routing_mode
- status
- created_at
- updated_at

### calls

- id
- organization_id
- conversation_id
- contact_id
- phone_number_id
- provider
- provider_call_id
- direction
- status
- from_number
- to_number
- started_at
- answered_at
- ended_at
- duration_seconds
- disposition
- routing_outcome
- agent_version_id
- summary
- intent
- sentiment
- recording_consent_state
- metadata
- created_at
- updated_at

### call_events

Immutable ordered provider and normalized events.

- id
- organization_id
- call_id
- provider_event_id
- event_type
- sequence
- occurred_at
- payload
- created_at

### recordings

- id
- organization_id
- call_id
- provider
- provider_recording_id
- storage_reference
- duration_seconds
- mime_type
- retention_until
- redaction_status
- access_classification
- created_at
- deleted_at

### transcript_segments

- id
- organization_id
- call_id
- sequence
- speaker_type
- speaker_label
- text
- started_at_offset_ms
- ended_at_offset_ms
- confidence
- redaction_status
- created_at

### voicemails

- id
- organization_id
- call_id
- conversation_id
- contact_id
- recording_id
- status
- summary
- urgency
- assigned_user_id
- created_at
- updated_at

## Revenue recovery tables

### recovery_cases

- id
- organization_id
- location_id
- contact_id
- conversation_id
- source_call_id
- reference
- category
- reason
- status
- urgency
- assigned_member_id
- estimated_value_minor
- currency_code
- attribution_level
- next_action_type
- next_action_due_at
- resolution_type
- lost_reason
- opened_at
- resolved_at
- created_at
- updated_at

Phase 1 uses one unique `(organization_id, source_call_id)` to prevent duplicate Recovery
Cases for one missed call. Every relationship uses a composite tenant foreign key.

### recovery_case_events

Append-only case history.

- id
- organization_id
- recovery_case_id
- event_type
- actor_type
- actor_user_id
- source_type
- source_id
- description
- metadata
- occurred_at
- created_at

### revenue_attributions

- id
- organization_id
- recovery_case_id
- appointment_id
- external_payment_reference
- level
- amount_minor
- currency_code
- confidence
- evidence_type
- evidence_reference
- attributed_at
- created_at

Never sum duplicate attribution records. Define one active attribution per case/outcome or use a clear supersession model.

### promises

- id
- organization_id
- contact_id
- recovery_case_id
- conversation_id
- owner_user_id
- source_type
- source_id
- promise_type
- description
- due_at
- status
- evidence_requirement
- completion_evidence
- completed_at
- escalation_policy
- created_at
- updated_at

## Scheduling and work tables

### services

- id
- organization_id
- location_id
- name
- description
- duration_minutes
- buffer_before_minutes
- buffer_after_minutes
- estimated_value_minor
- currency_code
- status
- created_at
- updated_at

### appointments

- id
- organization_id
- location_id
- contact_id
- service_id
- assigned_user_id
- recovery_case_id
- provider
- external_calendar_id
- external_event_id
- status
- starts_at
- ends_at
- time_zone
- confirmation_status
- source
- estimated_value_minor
- currency_code
- sync_status
- sync_error
- created_at
- updated_at

### tasks

- id
- organization_id
- title
- description
- status
- priority
- assigned_user_id
- due_at
- contact_id
- conversation_id
- recovery_case_id
- appointment_id
- promise_id
- created_by_user_id
- created_at
- updated_at
- completed_at

## Agent and knowledge tables

### ai_agents

- id
- organization_id
- name
- purpose
- status
- active_version_id
- created_at
- updated_at

### ai_agent_versions

Immutable published configuration versions.

- id
- organization_id
- ai_agent_id
- version_number
- status
- configuration
- provider
- provider_agent_id
- created_by_user_id
- created_at
- published_at

### knowledge_sources

- id
- organization_id
- type
- name
- source_url
- storage_reference
- status
- sync_status
- checksum
- last_synced_at
- created_at
- updated_at

### assistant_threads

- id
- organization_id
- user_id
- title
- status
- provider_conversation_id
- created_at
- updated_at

### assistant_messages

- id
- organization_id
- thread_id
- role
- content
- model
- usage_metadata
- created_at

### ai_action_requests

- id
- organization_id
- thread_id
- requested_by_user_id
- tool_name
- risk_class
- approval_policy
- arguments
- status
- approved_by_user_id
- approved_at
- expires_at
- created_at
- updated_at

### ai_action_executions

- id
- organization_id
- action_request_id
- idempotency_key
- status
- result
- error
- started_at
- completed_at
- created_at

### action_approvals

Phase 1 uses this smaller approval record for the concrete `send_follow_up` action rather
than introducing the full assistant action model before an AI provider exists.

- id
- organization_id
- recovery_case_id
- message_id
- requested_by_user_id
- approved_by_user_id
- action_type
- risk_class
- status
- idempotency_key
- approved_at
- executed_at
- failure_code
- created_at
- updated_at

Members may request approval. Only owner, admin, or manager projections may approve, and
database triggers enforce valid status transitions and immutable scope.

## Integration and operations tables

### integrations

- id
- organization_id
- provider
- type
- status
- encrypted_credential_reference
- configuration
- last_success_at
- last_error_at
- last_error_code
- created_at
- updated_at

Secrets should not be stored in plaintext JSON.

### webhook_events

- id
- organization_id nullable until safely resolved
- provider
- provider_event_id
- event_type
- signature_verified
- payload_hash
- raw_payload
- status
- attempt_count
- next_attempt_at
- received_at
- processed_at
- last_error
- created_at

Unique `(provider, provider_event_id)` when an authoritative ID exists. Otherwise use a safe provider-specific idempotency key.

### outbox_events

- id
- organization_id
- aggregate_type
- aggregate_id
- event_type
- payload
- status
- attempt_count
- available_at
- locked_at
- processed_at
- last_error
- created_at

### audit_logs

- id
- organization_id
- actor_type
- actor_user_id
- action
- target_type
- target_id
- source
- request_id
- ip_hash
- user_agent
- metadata
- created_at

### usage_events

- id
- organization_id
- provider
- metric
- quantity
- unit
- external_reference
- occurred_at
- metadata
- created_at

## Indexing baseline

Every tenant table should usually index:

- `organization_id`;
- `(organization_id, created_at desc)`;
- foreign keys used in tenant-scoped lists;
- provider IDs used by webhooks;
- status and due-date combinations used by queues.

Examples:

- recovery cases: `(organization_id, status, next_action_due_at)`;
- conversations: `(organization_id, last_activity_at desc)`;
- calls: `(organization_id, started_at desc)`;
- tasks: `(organization_id, assigned_user_id, status, due_at)`;
- promises: `(organization_id, status, due_at)`;
- contacts: normalized phone/email through contact channels.

## Required database invariants

- tenant foreign keys should not allow cross-organization relationships;
- appointment end must be after start;
- values cannot be negative unless a documented adjustment model exists;
- resolved cases require resolution data;
- lost cases require a loss reason;
- completed promises require completion time;
- provider event IDs are idempotent;
- AI action execution idempotency keys are unique;
- active agent versions belong to the same organization and agent;
- organization IDs cannot be changed after creation except through a controlled migration.
