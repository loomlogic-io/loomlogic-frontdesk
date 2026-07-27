# AGENTS.md

These instructions apply to the entire repository.

## Mission

Build LoomLogic Front Desk OS as a secure, multi-tenant, self-serve AI front-desk and revenue-recovery platform. Prioritize reliable business outcomes over flashy demos.

## Required reading order

Before changing code, read:

1. `README.md`
2. `docs/00_PRODUCT_VISION.md`
3. `docs/01_PRODUCT_REQUIREMENTS.md`
4. `docs/02_ARCHITECTURE.md`
5. `docs/03_DATA_MODEL.md`
6. `docs/04_SECURITY_AND_TENANCY.md`
7. `docs/05_UI_UX_SYSTEM.md`
8. `docs/06_INTEGRATIONS.md`
9. `docs/07_BUILD_ROADMAP.md`
10. `docs/08_TESTING_AND_QUALITY.md`
11. `docs/09_ENGINEERING_DECISIONS.md`

If documents conflict, this file wins, followed by the document with the more specific scope.

## Working method

- Inspect the repository before planning changes.
- State the implementation plan before editing.
- Work in small, reviewable vertical slices.
- Do not attempt the entire roadmap in one task.
- Do not silently change architecture.
- Record material assumptions or architecture changes in `docs/09_ENGINEERING_DECISIONS.md`.
- Prefer completing one end-to-end path over creating many disconnected placeholders.
- Do not delete documentation to simplify implementation.
- Do not create fake integrations that appear production-ready. Label mocks and fixtures clearly.
- Never claim a test passed unless it was actually run.
- At completion, report changed files, commands run, tests run, known limitations, and recommended next task.

## Git discipline

- Do not rewrite or amend existing commits.
- Keep changes scoped to the requested phase.
- Use conventional commit messages when asked to commit.
- Never commit `.env`, credentials, recordings, customer data, or generated secrets.
- Keep `.env.example` current and free of real values.

## Architecture rules

- Use a modular monolith.
- Keep domain logic out of React components and route handlers.
- Route handlers authenticate, validate, call services, and map responses.
- Database access goes through explicit repository or service modules.
- Integrations are accessed through provider interfaces and adapters.
- Server-only modules must use the `server-only` guard where appropriate.
- Use strict TypeScript. Avoid `any`; document unavoidable exceptions.
- Validate all untrusted input with Zod or an equivalent schema library.
- All time values are stored in UTC and rendered in the organization time zone.
- Monetary amounts are stored as integer minor units plus ISO currency code.
- Phone numbers are normalized to E.164 when possible.
- Use UUID primary keys for internal domain records. Store provider IDs separately.
- Every tenant-owned record has a non-null `organization_id`.
- Every mutable table has `created_at` and `updated_at`.
- Prefer soft deletion or lifecycle status for business records that require history.

## Security rules

- Never trust `organization_id` supplied by a browser request.
- Derive the active organization from verified Clerk session claims.
- Verify organization membership on every server mutation.
- Enforce tenant boundaries again with Supabase RLS.
- Never use the Supabase service role in browser code.
- Webhooks must verify provider signatures before processing.
- Webhook handlers must be idempotent and persist raw event metadata.
- Do not log access tokens, passwords, full payment details, sensitive transcript contents, or provider secrets.
- Record privileged and AI-initiated actions in immutable audit logs.
- Do not implement financial transactions, medical diagnosis, or banking workflows in the MVP.

## UI rules

- Build a premium, calm, high-trust SaaS interface.
- Avoid generic template dashboards, excessive gradients, glass everywhere, novelty cursors, and animation without purpose.
- Prioritize hierarchy, readability, keyboard navigation, responsive behavior, empty states, loading states, errors, and accessibility.
- Use design tokens and reusable components rather than one-off styling.
- Light mode is primary. Dark mode may be supported but must not block initial delivery.
- Never use placeholder lorem ipsum in user-facing screens. Use realistic demo fixtures clearly marked as demo data.

## Database and migration rules

- All schema changes are migrations in `supabase/migrations`.
- Migrations are append-only after they have been applied to a shared environment.
- Enable RLS on every tenant-owned table before exposing it.
- Add indexes supporting foreign keys, common filters, ordering, and RLS predicates.
- Use database constraints for invariants, not only application validation.
- Add comments for unusual policies, triggers, or security-sensitive functions.
- Avoid placing core business logic in vendor-specific database features when ordinary PostgreSQL works.

## Testing requirements

For relevant changes, run:

- formatting check
- lint
- TypeScript typecheck
- unit tests
- database/RLS tests
- production build
- Playwright smoke tests when UI flows change

A task is not complete if tenant isolation is untested.

## Definition of done

A feature is complete only when:

- authorization and tenant isolation are handled;
- input validation exists;
- loading, empty, success, and error states exist;
- audit implications are considered;
- tests cover critical behavior;
- documentation and environment examples are updated;
- no secrets or customer data are included;
- the production build succeeds.
