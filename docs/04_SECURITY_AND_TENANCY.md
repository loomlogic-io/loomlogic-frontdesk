# Security and Tenancy

## Security posture

This document defines minimum engineering controls. It is not a legal compliance certification.

The MVP must be safe enough to handle ordinary business contact and call information. It must not claim banking, healthcare, PCI, SOC 2, HIPAA, or other certification without completed legal, technical, and audit work.

## Identity

- Clerk is the identity provider.
- Clerk Organizations represent tenant memberships.
- Organization membership is required for application access.
- Supabase trusts Clerk through the current native third-party authentication integration.
- Do not use the deprecated shared-secret/JWT-template approach.
- Synchronize only needed user and membership metadata into Postgres.
- Treat Clerk webhook data as untrusted until signature verification succeeds.

## Tenant context

The active tenant is derived from the verified Clerk session.

Never trust:

- URL organization IDs;
- hidden form fields;
- request JSON;
- local storage;
- client component state

as authorization evidence.

A request may contain an organization identifier for routing or lookup, but the server must compare it with the verified active organization and membership.

## Defense in depth

Every tenant-sensitive operation must pass:

1. authentication;
2. active organization resolution;
3. application permission check;
4. input validation;
5. tenant-scoped repository query;
6. PostgreSQL RLS;
7. audit logging for meaningful mutations.

## Row Level Security

- Enable RLS on every tenant-owned table.
- Deny by default.
- Read the Clerk organization claim from the verified JWT.
- Resolve that external organization ID to the internal `organizations.id`.
- Use stable helper functions for policy readability.
- Test both allowed and denied behavior.
- Add indexes used by policy predicates.
- Service-role access is limited to trusted server workflows and still requires explicit organization scoping in application code.

A draft helper may support both standard and compressed Clerk organization claim forms, but Codex must inspect actual local session tokens and official current integration guidance before finalizing the claim path.

## Cross-tenant relational integrity

Ordinary foreign keys do not guarantee that two rows share an organization.

Use one of these strategies where appropriate:

- composite unique key `(organization_id, id)` and composite foreign keys;
- constraints/triggers for complex cases;
- repository checks plus tests when database constraints are impractical.

Prefer database enforcement for high-risk relationships such as:

- calls to conversations;
- cases to contacts;
- appointments to services and locations;
- messages to conversations;
- promises to cases;
- AI actions to threads.

## Secrets

- Store secrets in environment variables or an approved secret manager.
- Never put secrets in organization settings JSON.
- Never expose provider secrets to browser bundles.
- Use separate credentials per environment.
- Rotate webhook signing secrets and provider credentials.
- Encrypt stored OAuth refresh tokens and sensitive integration credentials.
- Keep `.env.example` placeholders only.

## Webhooks

Each provider webhook handler must:

- read the raw request body when required by the signature algorithm;
- verify timestamp and signature;
- reject invalid signatures;
- protect against replay;
- persist provider event ID and payload hash;
- deduplicate;
- acknowledge quickly;
- process asynchronously;
- update status and error details;
- support safe replay.

Do not infer a tenant from caller-supplied fields without validating the receiving phone number, provider account/subaccount, or integration ownership.

## Twilio isolation

Target architecture:

- platform parent account;
- a Twilio subaccount per organization when operationally feasible;
- organization-owned phone numbers mapped explicitly;
- usage and events reconciled by subaccount and phone number;
- provider credentials stored server-side;
- provider status visible in the organization settings.

A shared development account may be used locally with fixtures, but production design must prevent one organization from controlling another's numbers or records.

## Recordings and transcripts

- Recording policy is configurable by organization and jurisdiction.
- Store consent state with the call.
- Access to recordings requires a specific permission.
- Use short-lived signed URLs.
- Do not place public recordings in the application.
- Support configurable retention and deletion.
- Plan for redaction.
- Avoid storing secrets, payment-card authentication data, or sensitive credentials in transcripts.
- Never include full transcript bodies in logs or analytics events.

## AI safety and authorization

AI models can:

- retrieve tenant-authorized context prepared by the application;
- propose typed actions;
- summarize and draft;
- invoke explicitly registered tools.

AI models cannot:

- execute arbitrary SQL;
- call provider APIs directly;
- choose an organization;
- bypass approval;
- modify role or billing permissions;
- access service-role credentials;
- view data not retrieved through authorized services.

Every AI tool defines:

- input schema;
- output schema;
- permission;
- risk class;
- approval policy;
- idempotency behavior;
- audit behavior;
- rate limit;
- allowed data fields.

## Approval policy

Initial action levels:

- `read`;
- `draft`;
- `execute_with_approval`;
- `prohibited`.

Later, selected actions may support `preauthorized_execute` with organization-defined limits.

Examples:

- read open cases: read;
- draft a reply: draft;
- send one reply: execute with approval;
- bulk message all contacts: prohibited in MVP;
- change tenant roles: prohibited;
- delete recordings: explicit privileged workflow.

## Logging

Use structured logs with:

- request/correlation ID;
- route or job name;
- organization ID when safe;
- provider;
- event ID;
- status;
- duration;
- sanitized error code.

Do not log:

- tokens;
- secrets;
- authorization headers;
- complete raw transcripts;
- full message bodies by default;
- full phone or email values when a hash or partial value is sufficient.

## Audit

Audit important actions including:

- login-sensitive support actions where available;
- member invitation and role changes;
- integration connections;
- phone-number provisioning;
- recording access or deletion;
- recovery status changes;
- appointment creation and cancellation;
- AI action approval and execution;
- data export and deletion;
- configuration publication.

Audit logs should be append-only for ordinary users.

## Rate limiting and abuse controls

Apply rate limits to:

- authentication-adjacent endpoints;
- webhook endpoints after signature verification;
- AI assistant requests;
- message sending;
- outbound calls;
- search endpoints;
- file uploads;
- invite flows.

Add organization-level quotas and provider spend guards before outbound automation.

## Support access

Do not implement unrestricted admin impersonation.

Future support access should use:

- explicit reason;
- least privilege;
- time-limited grant;
- visible banner;
- audit trail;
- optional customer approval;
- no silent access to recordings.

## Required tenant isolation tests

At minimum:

1. User A in Organization A can read A records.
2. User A cannot read Organization B records.
3. User A cannot insert a B record by changing `organization_id`.
4. User A cannot update or delete B records.
5. An inactive membership cannot access data.
6. Switching active Organizations changes visible data safely.
7. Service-role jobs still scope every query by organization.
8. Signed URLs cannot expose cross-tenant storage objects.
9. Search and count endpoints respect organization scope.
10. AI tools cannot reference records outside the active organization.
