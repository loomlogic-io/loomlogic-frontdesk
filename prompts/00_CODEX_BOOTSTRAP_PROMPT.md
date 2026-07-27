# Codex Prompt — Phase 0 Engineering Foundation

You are the senior staff engineer responsible for establishing the production-quality foundation of this repository.

## Mandatory first step

Before editing anything:

1. Inspect the complete repository tree.
2. Read `AGENTS.md`.
3. Read `README.md`.
4. Read every file in `/docs`.
5. Summarize:
   - the product being built;
   - non-negotiable security rules;
   - the proposed architecture;
   - the exact Phase 0 scope;
   - assumptions you must make;
   - risks or conflicts in the documents.
6. Present a concise implementation plan grouped into reviewable steps.

Do not begin implementation until you have performed that repository review in your response. Do not ask me to restate information already present in the repository.

## Objective

Implement **Phase 0 only** from `docs/07_BUILD_ROADMAP.md`: a secure, testable, polished engineering foundation for LoomLogic Front Desk OS.

Do not connect live Twilio, ElevenLabs, Resend, OpenAI, Google Calendar, Stripe, or workflow-provider APIs yet.

## Architecture requirements

Build a modular monolith using:

- Next.js App Router;
- React;
- strict TypeScript;
- pnpm;
- Tailwind CSS;
- shadcn/ui primitives where useful;
- Clerk authentication and Organizations;
- Supabase PostgreSQL with local CLI tooling;
- the current native Clerk third-party authentication integration for Supabase;
- Vitest or the best current stable equivalent for unit testing;
- Playwright for E2E smoke tests;
- GitHub Actions.

Use current stable package versions, pin them in the lockfile, and document the versions selected. Avoid experimental dependencies unless they are necessary and explicitly justified.

## Required implementation

### 1. Project scaffold

Create or normalize the Next.js application.

Configure:

- strict TypeScript;
- import aliases;
- ESLint;
- Prettier;
- Tailwind;
- accessible base styles;
- package scripts;
- deterministic lockfile;
- `.gitignore`;
- `.editorconfig`;
- `.env.example`;
- typed environment validation;
- server-only guards for privileged modules.

Do not disable TypeScript or ESLint rules simply to make checks pass.

### 2. Repository structure

Implement the initial directory structure from `docs/02_ARCHITECTURE.md`.

Create only modules required for Phase 0. Do not create dozens of empty placeholder files.

Add concise local README files only where a non-obvious boundary needs explanation.

### 3. Clerk authentication and Organizations

Implement:

- Clerk provider;
- middleware/proxy required by the current stable Clerk/Next.js integration;
- sign-in;
- sign-up;
- protected application routes;
- mandatory Organization creation or selection;
- organization switcher;
- server helper that resolves authenticated user and active organization;
- safe authorization errors.

Use Clerk Organizations as the identity membership authority.

Do not use deprecated Clerk/Supabase JWT templates.

### 4. Supabase foundation

Initialize Supabase local configuration.

Add migrations for:

- organizations;
- users;
- organization_members;
- audit_logs;
- any minimal support functions required for timestamps, tenant lookup, and RLS.

Add:

- database constraints;
- indexes;
- `updated_at` handling;
- RLS enabled by default;
- tenant helper functions;
- policies for authenticated tenant members;
- generated TypeScript database types;
- server and browser Supabase clients compatible with Clerk third-party auth.

The browser client must never use the service role.

Because Clerk JWT claim formats may evolve, inspect current official integration behavior and implement the organization-claim helper in one isolated SQL function. Document and test the exact claim path used.

### 5. Tenant-isolation tests

Create automated tests proving:

- Organization A can read its own row;
- Organization A cannot read Organization B;
- A user cannot insert, update, or delete a record under another organization;
- no active organization is denied;
- inactive membership is denied where applicable;
- application helpers do not trust client-supplied organization IDs.

Use local test identities or JWT fixtures that accurately match the integration.

### 6. Application shell

Create a polished, responsive authenticated shell:

- left navigation;
- top workspace bar;
- Organization switcher;
- user menu;
- page header;
- responsive mobile navigation;
- global status/notification placeholder;
- persistent assistant entry placeholder.

Create functional placeholder pages only for:

- Overview;
- Inbox;
- Recovery;
- Contacts;
- Settings.

These pages should clearly communicate that business features arrive in Phase 1. Do not fabricate live metrics.

Use the design direction in `docs/05_UI_UX_SYSTEM.md`. The result must not look like an unmodified admin template.

### 7. Error, logging, and request foundation

Add:

- typed application errors;
- safe error mapping;
- correlation/request ID helper;
- structured server logger with sensitive-field redaction;
- not-found and error boundaries;
- loading and empty states.

Do not log tokens, secrets, complete customer messages, or transcripts.

### 8. Testing and CI

Add:

- unit test setup;
- at least one meaningful unit test for tenant/auth helpers or environment validation;
- Playwright smoke test for protected-route behavior and the app shell;
- database/RLS tests;
- GitHub Actions workflow;
- `pnpm verify` running formatting check, lint, typecheck, unit tests, database tests where feasible, and build.

If local database tests cannot run in CI without additional services, configure them correctly rather than silently skipping them. Document any limitation.

### 9. Documentation

Update:

- `README.md` with exact local setup commands;
- `docs/10_ENVIRONMENT_AND_SETUP.md`;
- `docs/09_ENGINEERING_DECISIONS.md` with package/version and architecture choices;
- `.env.example`.

Add a `PHASE_0_COMPLETION.md` report containing:

- implemented work;
- architecture summary;
- migrations;
- commands;
- tests;
- manual dashboard steps for Clerk and Supabase;
- known limitations;
- next recommended task.

## Security constraints

- Never trust an organization ID from the client.
- Never expose a service-role key.
- Every tenant table must have RLS before use.
- Never create a policy equivalent to `using (true)` for tenant data.
- Never use authentication only as a UI guard.
- Never put provider secrets in committed files.
- Never implement platform-admin bypass logic in this phase.
- Never use real customer data.

## Quality constraints

- Prefer simple, explicit code.
- Do not add a general abstraction without two real uses, except required provider/security boundaries.
- Keep domain logic out of components and route handlers.
- Avoid `any`.
- Do not suppress failing tests.
- Do not mark work complete if build or tenant tests fail.
- Do not proceed into Phase 1.

## Completion response

At the end:

1. summarize the architecture established;
2. list every changed or created file by category;
3. list every command executed;
4. report exact test/build results;
5. identify manual configuration still required;
6. identify security assumptions;
7. recommend one GitHub-issue-sized next task.

If you can commit, use a conventional commit such as:

`chore: establish secure multi-tenant application foundation`

Do not amend existing commits.
