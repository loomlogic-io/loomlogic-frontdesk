# LoomLogic Front Desk OS

Working product name: **LoomLogic Resolve**

LoomLogic is a self-serve AI front-desk and revenue-recovery platform for appointment-driven and lead-driven businesses. It answers or recovers missed calls, manages customer conversations, books appointments, follows up automatically, and tracks the business outcomes created by those actions.

## Product thesis

Most AI receptionists stop when the call ends. LoomLogic owns the unresolved outcome until it is booked, resolved, explicitly lost, or requires human action.

The first product is for ordinary businesses with front desks. A future financial-services edition may reuse selected platform modules, but it must be a separate product and deployment boundary.

## Repository status

This repository begins as a documentation-first project. Codex must read `AGENTS.md` and the documents in `/docs` before modifying code.

## Initial technology direction

- Next.js App Router with strict TypeScript
- React
- Tailwind CSS and shadcn/ui
- Clerk authentication and Organizations
- Supabase Postgres, Storage, Realtime, and local development tooling
- Native Clerk third-party authentication integration with Supabase
- OpenAI Responses API behind an auditable tool gateway
- Twilio for telephony and SMS
- ElevenLabs for conversational voice agents
- Resend for transactional and inbound email
- Google Calendar first, Microsoft Calendar later
- Inngest or an equivalent durable workflow provider after the core vertical slice
- Vercel for the initial web deployment
- GitHub Actions for CI

Use current stable package versions at implementation time and pin them.

## Start here

1. Read `AGENTS.md`.
2. Read `docs/00_PRODUCT_VISION.md`.
3. Read `docs/01_PRODUCT_REQUIREMENTS.md`.
4. Read `docs/02_ARCHITECTURE.md`.
5. Read `docs/03_DATA_MODEL.md`.
6. Read `docs/04_SECURITY_AND_TENANCY.md`.
7. Read `docs/05_UI_UX_SYSTEM.md`.
8. Read `docs/06_INTEGRATIONS.md`.
9. Read `docs/07_BUILD_ROADMAP.md`.
10. Execute `prompts/00_CODEX_BOOTSTRAP_PROMPT.md`.
11. After Phase 0 is reviewed, execute `prompts/01_CODEX_VERTICAL_SLICE_PROMPT.md`.

## Non-negotiable principles

- Tenant isolation is enforced in PostgreSQL Row Level Security, not only in UI code.
- The browser never receives service-role credentials or provider secrets.
- Every external webhook is authenticated, persisted, deduplicated, and processed idempotently.
- AI models do not directly access the database or third-party APIs.
- AI actions execute only through typed tools with authorization, validation, audit logging, and approval policies.
- The product is outcome-driven. Calls are inputs; recovery cases, appointments, promises, and verified outcomes are the core domain.
- Do not build microservices prematurely.
- Do not build the banking edition in the MVP.
