# Testing and Quality

## Quality principle

The most dangerous bugs are not cosmetic. They are:

- cross-tenant data exposure;
- duplicate provider processing;
- incorrect automated contact;
- double booking;
- false success state;
- lost audit history;
- AI executing an unauthorized action.

Tests should prioritize these risks.

## Test layers

### Unit tests

Cover:

- domain state transitions;
- recovery eligibility;
- attribution rules;
- promise deadlines;
- phone/email normalization;
- permission evaluation;
- AI tool policy;
- provider event mapping;
- idempotency-key generation.

### Database tests

Cover:

- RLS allow and deny cases;
- cross-tenant foreign-key protection;
- constraints;
- idempotency uniqueness;
- audit immutability;
- status invariants;
- tenant-scoped search and counts.

Use Supabase local tooling and SQL/pgTAP-style tests where practical.

### Integration tests

Cover:

- route handler authentication;
- active organization resolution;
- repository scoping;
- development webhook signature verification;
- duplicate webhook delivery;
- application service plus database transaction;
- mock provider adapters.

### End-to-end tests

Initial Playwright flows:

1. unauthenticated user is redirected;
2. user creates or selects organization;
3. Organization A sees A fixtures;
4. user switches to Organization B and sees only B fixtures;
5. create contact;
6. simulate missed-call event;
7. open generated recovery case;
8. approve mock follow-up;
9. resolve case;
10. dashboard reflects outcome.

### Contract tests

Later provider adapters should use captured, sanitized fixtures and schema validation for:

- Twilio webhooks;
- ElevenLabs post-call events;
- Resend webhooks;
- Google Calendar events;
- Clerk webhooks.

## Required scripts

The repository should expose commands similar to:

- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm format`
- `pnpm format:check`
- `pnpm test`
- `pnpm test:watch`
- `pnpm test:e2e`
- `pnpm db:start`
- `pnpm db:stop`
- `pnpm db:reset`
- `pnpm db:test`
- `pnpm verify`

`pnpm verify` should run the appropriate non-interactive checks for CI.

## CI

GitHub Actions should:

- install with frozen lockfile;
- validate formatting;
- lint;
- typecheck;
- run unit tests;
- start or provision test database where practical;
- run database tests;
- build;
- run a small E2E smoke suite where reliable.

Do not expose production secrets to pull requests.

## Fixture rules

- No real customer data.
- No real phone numbers.
- No copied transcripts.
- Clearly mark demo data.
- Keep fixture timestamps deterministic where tests rely on time.
- Use factories for domain records.
- Sanitize provider payload fixtures.

## Time testing

Use an injectable clock for:

- overdue promises;
- recovery delays;
- quiet hours;
- appointment timing;
- retries;
- retention.

Avoid tests that depend on the wall clock without control.

## Idempotency tests

For every external event handler:

1. process event once;
2. process identical event again;
3. assert no duplicate business records;
4. assert safe status and audit history;
5. test out-of-order events when provider behavior allows it.

## Tenant test matrix

Test each meaningful operation as:

- member in correct tenant;
- member in wrong tenant;
- user with no active tenant;
- user with inactive membership;
- insufficient role;
- trusted system job with explicit tenant;
- malformed or forged tenant claim.

## AI evaluation

Before automatic execution:

- create representative user requests;
- expected tool choice;
- prohibited tool cases;
- cross-tenant reference attempts;
- ambiguous requests requiring clarification;
- approval requirement;
- tool failure recovery;
- prompt injection inside customer content.

The assistant must treat customer transcripts, emails, documents, and knowledge content as untrusted data, not instructions.

## Definition of a passing task

A Codex task should report:

- exact commands run;
- exact tests passed or failed;
- build result;
- limitations;
- migrations added;
- environment changes;
- unresolved security concerns.

A visually complete feature with no tenant tests is not complete.
