# Product Requirements

## Release target

The first sellable release proves that LoomLogic can recover an unanswered or incomplete customer interaction and turn it into a booked or human-owned outcome.

## Personas

### Business owner

Wants measurable revenue recovery, simple setup, clear oversight, and confidence that the AI will not damage customer relationships.

### Manager

Needs a queue of unresolved opportunities, team accountability, call quality information, and the ability to adjust rules.

### Front-desk team member

Needs a unified customer timeline, clear next actions, reliable handoffs, and fewer repetitive calls.

### Customer

Wants an immediate, natural, respectful response; correct information; easy booking; and no need to repeat context.

### Platform administrator

Needs tenant-safe support tools, provider status, usage, audit history, and controlled impersonation or support access only if later implemented.

## MVP functional requirements

### Authentication and workspace

- Sign up and sign in with Clerk.
- Every user must create or join an Organization.
- Users may belong to multiple Organizations.
- The active Organization controls all visible and mutable data.
- Initial roles: owner, admin, manager, member, viewer.
- Invite team members.
- Organization settings include name, time zone, locale, currency, and default business hours.

### Dashboard

Show:

- total calls;
- unanswered or abandoned calls;
- open Recovery Cases;
- appointments booked;
- estimated recovered value;
- cases requiring human attention;
- recent recovery activity;
- integration health;
- first-response and resolution trends.

The first development slice may use clearly labeled fixtures before live providers are connected.

### Unified inbox

- List calls, voicemails, SMS, email, and recovery events.
- Filter by status, channel, assignee, location, urgency, and date.
- Search contact name, phone, email, transcript summary, and case reference.
- Open a conversation detail workspace.
- Show call recording access only when authorized.
- Support assignment, notes, tags, and task creation.

### Contacts

- Create and update contacts.
- Detect likely duplicates by normalized phone and email.
- Store name, channels, preferred language, time zone, consent state, tags, custom fields, and lifecycle state.
- Show a unified chronological timeline.
- Never overwrite authoritative fields silently; preserve change history where necessary.

### Calls and voicemail

- Store provider identifiers, direction, start/end time, duration, status, routing outcome, recording metadata, transcript, summary, and extracted intent.
- Separate call, call events, recording, and transcript records.
- Support inbound, outbound, missed, abandoned, voicemail, transferred, and failed states.
- Record consent and recording policy metadata.

### Recovery Cases

A case must include:

- source interaction;
- contact;
- organization and optional location;
- category and reason;
- state;
- urgency;
- estimated value and currency;
- attribution level;
- assignee;
- next action and due date;
- resolution outcome;
- loss reason;
- complete activity history.

Initial states:

- new;
- engaging;
- qualified;
- awaiting_customer;
- awaiting_staff;
- booking_offered;
- booked;
- escalated;
- recovered;
- disqualified;
- opted_out;
- lost;
- closed.

### Promise Tracker

- Detect or manually create promises.
- Store owner, customer, due date, promised action, evidence requirement, status, and escalation policy.
- Notify before and after deadlines.
- Link promises to calls, conversations, contacts, and Recovery Cases.
- Keep immutable completion evidence references.

### Appointments

- Store service, staff, location, start/end, time zone, source, status, external calendar ID, estimated value, and confirmation state.
- Support booked, confirmed, completed, cancelled, no_show, and rescheduled.
- Prevent double booking.
- Keep provider sync state and errors.
- External calendar integration arrives after the local appointment domain is stable.

### Tasks

- Create, assign, prioritize, complete, and comment.
- Link to contacts, conversations, cases, appointments, and promises.
- Support due dates and overdue filters.

### AI operations copilot

Initial release mode:

- read and summarize organization data;
- draft messages and actions;
- propose typed tool calls;
- require user approval before mutations.

Later modes:

- pre-authorized automatic actions within policy limits.

The model must never receive unrestricted database access.

### Audit log

Record:

- actor;
- organization;
- action;
- target type and ID;
- source: user, system, webhook, or AI;
- before/after metadata where safe;
- request/correlation ID;
- timestamp;
- approval record where applicable.

Audit logs are append-only from application roles.

## Self-serve onboarding requirements

1. Create workspace.
2. Select business category.
3. Configure locations and hours.
4. Connect or defer phone setup.
5. Add services and estimated values.
6. Import or enter business knowledge.
7. Connect or defer calendar.
8. Configure missed-call recovery policy.
9. Complete test scenarios.
10. Activate.

Onboarding must support saving progress and returning later.

## Recovery policy settings

- immediate SMS enabled;
- outbound callback enabled;
- number of attempts;
- allowed contact hours;
- delay between attempts;
- stop after customer response;
- opt-out handling;
- high-value threshold;
- escalation recipient;
- waitlist behavior;
- human approval requirement;
- channel priority;
- organization time zone.

## Non-functional requirements

### Security

- strict tenant isolation;
- least privilege;
- encrypted transport;
- secrets only server-side;
- signed webhook verification;
- idempotency;
- auditability;
- configurable retention;
- no sensitive information in logs.

### Performance targets

Initial targets, subject to measurement:

- common authenticated pages render useful content quickly with progressive loading;
- ordinary database reads use indexed tenant predicates;
- webhook acknowledgment occurs quickly after verification and persistence;
- long-running work executes asynchronously;
- UI remains usable with thousands of contacts and interactions through pagination.

### Availability and resilience

- provider failures do not corrupt domain state;
- retries are idempotent;
- integration errors are visible;
- raw webhook metadata is retained according to policy;
- critical workflows can be replayed safely;
- provider-specific outages do not block unrelated product areas.

### Accessibility

- target WCAG 2.2 AA;
- keyboard operable;
- visible focus;
- semantic markup;
- sufficient contrast;
- motion-reduction support;
- accessible forms, tables, dialogs, and status updates.

### Internationalization

- English first;
- architecture ready for French;
- store locale, time zone, and currency per organization;
- do not hard-code date, phone, or currency formats.

## Explicitly out of MVP scope

- bank core-system integrations;
- fund transfers or financial adjudication;
- medical diagnosis;
- full PBX replacement;
- SIP/BYOC;
- white-label reseller portal;
- multi-region data residency;
- custom workflow canvas;
- autonomous bulk outreach;
- payment-card entry by voice;
- advanced outbound campaigns;
- mobile apps;
- marketplace integrations.

## Acceptance scenario for first meaningful release

1. User signs up and creates an Organization.
2. User sees only that Organization's data.
3. User creates a contact.
4. A simulated missed-call event is ingested through an authenticated development webhook.
5. The event creates a conversation, call, and Recovery Case exactly once.
6. The dashboard updates.
7. A manager assigns the case and drafts a follow-up.
8. The user approves the action.
9. A mock messaging adapter records a sent message.
10. The case is marked booked or resolved.
11. The recovered-value ledger updates.
12. A second Organization cannot read or modify any record from the first.
