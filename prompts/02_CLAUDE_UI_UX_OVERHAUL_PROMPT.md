# Claude Code Prompt — LoomLogic UI/UX Overhaul

You are acting as a senior product designer, senior UI/UX designer, and senior frontend engineer.

Your task is to redesign and implement the authenticated LoomLogic Front Desk OS application so it feels like a premium, mature, enterprise-grade SaaS product built by a top-tier product design agency.

This is not a greenfield mockup. Phase 0 and Phase 1 have already been implemented. You must work with the current repository, preserve the backend and existing product flows, and improve the UI/UX around the actual application state.

## Mandatory first step: inspect before editing

Before changing any code:

1. Inspect the complete repository tree.
2. Read `AGENTS.md`, `README.md`, every file in `/docs`, `PHASE_0_COMPLETION.md` if present, `PHASE_1_COMPLETION.md` if present, and every relevant prompt in `/prompts`.
3. Inspect the current routes, layouts, authentication and organization switching, Supabase queries and services, current components, Tailwind configuration, shadcn/ui components, design tokens, test setup, loading/empty/error states, and responsive behavior.
4. Run the application locally if possible.
5. Audit the current UI and identify weak visual hierarchy, generic admin-template patterns, inconsistent spacing, weak typography, poor information density, unclear actions, confusing navigation, duplicated components, missing states, accessibility issues, responsive issues, and backend-connected screens that must not be broken.
6. Present a concise UI/UX audit, proposed design direction, page hierarchy, component architecture, files you expect to modify, implementation order, and risks to existing Phase 1 functionality.

Do not begin by replacing files blindly. Do not invent new routes or product features before understanding what is already implemented.

## Product context

LoomLogic is an AI Front Desk and Revenue Recovery operating system.

The product helps businesses answer or recover missed calls, manage conversations, track contacts, create and manage Recovery Cases, follow up with customers, recover lost bookings, assign tasks, track estimated recovered revenue, and review call and customer activity.

The UI must communicate that LoomLogic is an operational revenue-recovery platform, not a generic CRM and not just an AI phone assistant.

The core product concept is:

> A customer interaction remains active until it is booked, resolved, assigned, disqualified, opted out, or explicitly lost.

The most important business objects are Recovery Cases, Contacts, Conversations, Calls, Tasks, Follow-ups, Revenue attribution, Team activity, and AI-assisted actions.

## Non-negotiable constraints

### Protect the current backend

Do not rebuild the database, modify tenant isolation without explicit necessity, remove or weaken RLS, replace Clerk, replace Supabase, change provider abstractions, rename database columns casually, modify migrations already applied, bypass application services, insert direct database queries into visual components, break existing tests, replace working functionality with static mockups, hard-code fake metrics where real data already exists, create a second implementation of existing business logic, expose service-role credentials, or trust client-supplied organization IDs.

If a UI change requires a backend adjustment, explain why before making it, keep it minimal, and preserve the existing architecture.

### Preserve real flows

Existing Phase 1 flows must continue to work:

- authentication;
- organization selection;
- dashboard data;
- contact creation and viewing;
- conversation viewing;
- missed-call ingestion;
- Recovery Case creation;
- case assignment;
- follow-up drafting;
- approval;
- mock message execution;
- case resolution;
- recovered-value updates;
- tenant isolation.

Do not replace working data with fake front-end state.

### Avoid generic design

Do not produce a basic shadcn dashboard, a card wall, a clone of Linear, Stripe, or Apple, excessive glassmorphism, neon gradients, oversized rounded cards everywhere, excessive animations, decorative charts without meaning, generic AI sparkle icons, a marketing landing page inside the app, meaningless lorem ipsum, or fake customer data presented as real.

## Design direction

The product should feel premium, calm, precise, trustworthy, operational, intelligent, modern, mature, highly usable, and visually distinct.

Use light mode as the primary experience, refined neutral surfaces, restrained accent color, purposeful borders, subtle depth, excellent typography, strong spacing rhythm, clear alignment, clean tables and timelines, meaningful status indicators, compact but readable operational density, clear empty states, and accessible interaction patterns.

The interface should look intentionally designed, not assembled from a component library.

## Primary UX hierarchy

The application should answer these questions immediately:

1. What revenue or customer opportunities are currently at risk?
2. What needs human attention?
3. What has LoomLogic recovered?
4. Which conversations are unresolved?
5. What action should the user take next?
6. What did the AI or system already do?
7. What happened after the original call?

The user should not have to interpret raw call logs before understanding the business outcome.

## Required application shell

### Desktop

Include a refined left sidebar, LoomLogic product identity, organization switcher, primary navigation, secondary navigation for settings and support, compact top bar, page title and contextual actions, global search or command entry, notification or system-status area, persistent AI assistant entry point, main content area, and optional contextual detail panel where appropriate.

### Mobile

Include compact top navigation, clear organization context, mobile navigation drawer or bottom navigation, triage-first layouts, full-screen detail views, touch-friendly actions, and no desktop-only tables without a usable mobile transformation.

Navigation should reflect the current implemented routes. Do not add non-functional items unnecessarily.

Suggested hierarchy, adjusted to the actual repo:

- Overview
- Inbox
- Recovery
- Contacts
- Calls
- Tasks
- Assistant
- Analytics
- Settings

Show future areas only if they are clearly disabled and useful for product orientation.

## Page requirements

### 1. Overview dashboard

This must not be a generic analytics dashboard.

Prioritize:

1. estimated or confirmed recovered revenue;
2. open Recovery Cases;
3. cases requiring attention;
4. recent recovered opportunities;
5. unanswered or abandoned call activity;
6. follow-up status;
7. operational exceptions.

Use real repository data.

Possible sections:

- Outcome summary: recovered value, bookings recovered, open opportunities, urgent cases, average time to response.
- Needs attention: contact, reason, age, value at risk, next action, due status, assignee.
- Recovery activity: missed call detected, case created, follow-up drafted, message approved, booking confirmed, recovered value attributed.
- Trends: recovered value over time, cases opened versus resolved, missed calls versus recovered outcomes.

Use charts only when they answer a real operational question.

### 2. Inbox

Build a high-quality operational inbox.

Desktop may use a split view with conversation list, active conversation, and contextual action panel.

The list should show contact, channel, latest summary, unresolved intent, status, assigned user, value at risk, timestamp, and attention state.

Useful views:

- All
- Needs attention
- Missed calls
- Recovery in progress
- Awaiting customer
- Awaiting staff
- Booked
- Resolved

Do not create filters that cannot be supported by existing data.

### 3. Recovery queue

This is one of the most important screens.

Use a refined operational table or grouped work queue showing contact, source, recovery reason, status, urgency, value at risk, age, next action, due time, and assignee.

Include filters, sorting, clear overdue states, quick assignment, safe quick status changes, and no unsupported bulk actions.

The screen should make it obvious which cases should be handled first.

### 4. Recovery Case detail

Suggested layout:

- Header: contact, status, urgency, estimated value, assignee, next action, primary actions.
- Main timeline: call received or missed, transcript or summary, case created, actions taken, messages drafted, approvals, messages sent, tasks, status changes, resolution, revenue attribution.
- Context panel: contact details, source interaction, linked conversation, linked tasks, current promise or next action, attribution details, audit information where appropriate.
- Action area: draft follow-up, assign case, change state, mark booked, mark resolved, mark lost, add task, add internal note.

All mutations must use existing services and authorization.

### 5. Contacts

Contacts list should show clear identity, primary phone or email, last activity, open Recovery Cases, upcoming appointment if available, assigned owner, lifecycle/status, and recovered or at-risk value when supported.

Contact detail should show profile summary, channels, consent state, open cases, conversation history, tasks, timeline, notes, linked calls, and recovered outcomes.

Avoid turning this into a generic sales CRM.

### 6. Conversation and call detail

Distinguish between raw interaction data, AI summary, customer intent, business outcome, Recovery Case, and next action.

Include call status, direction, duration, timestamps, transcript, recording shell if supported, AI summary, sentiment or intent only if real data exists, linked contact, linked Recovery Case, linked follow-up, and audit/activity timeline.

Transcript design must be highly readable.

### 7. Tasks

If tasks are implemented, redesign them into an operational task workspace with My tasks, Overdue, Today, Upcoming, and Completed views.

Link tasks visibly to contacts, cases, calls, and conversations.

### 8. Settings

Organize into General, Organization, Team, Business hours, Recovery settings, Integrations, Notifications, Security, and Billing if present.

Only implement sections backed by current functionality. Use clear placeholders for future settings rather than fake forms.

## Component system

Audit current components and create a coherent reusable system.

Likely components:

- AppShell
- SidebarNavigation
- WorkspaceSwitcher
- PageHeader
- SectionHeader
- MetricSummary
- OutcomeMetric
- StatusBadge
- PriorityBadge
- RecoveryStatus
- OperationalTable
- FilterBar
- SearchInput
- Timeline
- TimelineEvent
- ContactIdentity
- ChannelIcon
- ValueAtRisk
- Assignee
- EmptyState
- ErrorState
- LoadingSkeleton
- DetailPanel
- ActionPanel
- ApprovalCard
- AuditEvent
- TranscriptViewer
- ConversationListItem
- RecoveryCaseRow
- ResponsiveDataList
- CommandPalette
- MobileNavigation

Use current shadcn primitives where useful, but compose them into a custom LoomLogic design system.

Do not rewrite all primitives unless necessary.

## Design tokens

Create or refine centralized tokens for colors, surfaces, borders, text hierarchy, semantic status, spacing, radius, elevation, typography, chart colors, focus rings, and motion.

Avoid scattered arbitrary Tailwind values.

Use semantic tokens such as background, surface, elevated, border, muted, foreground, primary, success, warning, danger, information, attention, recovered, and unresolved.

Status must not depend on color alone.

## Typography

Use a refined, highly readable sans-serif through the existing font setup or a suitable production-safe font.

Requirements:

- strong page titles;
- restrained section headings;
- clear labels;
- readable body text;
- compact metadata;
- tabular numerals for metrics;
- good line-height;
- no excessively light functional text;
- no giant marketing headings inside operational screens.

## Interaction and motion

Use motion sparingly for sidebar transitions, detail panel opening, filter changes, success feedback, timeline updates, assistant panel, and skeleton-to-content transitions.

Avoid scroll-jacking, constant floating, excessive parallax, large page entrance animations, and movement that delays work.

Respect reduced-motion preferences.

## Responsive behavior

Test at minimum mobile, tablet, standard laptop, and wide desktop.

Tables should become stacked rows, cards, or focused lists on mobile. Do not rely on uncontrolled horizontal scrolling.

## Accessibility

Target WCAG 2.2 AA.

Include semantic landmarks, correct heading hierarchy, visible focus, keyboard navigation, accessible dialogs, screen-reader labels, accessible status messaging, sufficient contrast, non-color status cues, reduced motion, touch target sizing, accessible tables, and accessible transcript controls.

Do not remove accessibility behavior from shadcn/Radix primitives.

## Data and state handling

Use real backend data.

Every data screen must support initial loading, refresh loading, empty state, no search results, permission denied, server error, partial data, success feedback, and retry.

Do not hide errors behind empty states.

Do not use fake optimistic updates for high-risk status changes unless rollback is implemented.

## Implementation sequence

Work in this order unless the repository suggests a safer order:

1. Audit and foundations: current UI, tokens, typography, global styles, reusable layout.
2. Application shell: sidebar, top bar, organization switcher, mobile navigation, page headers, assistant entry.
3. Overview: outcome summary, attention queue, recovery activity, meaningful charts.
4. Recovery: queue, case detail, actions, timeline, attribution.
5. Inbox and conversations: list, split view, call details, transcript, linked case context.
6. Contacts and tasks: list, detail, operational task views.
7. Settings and polish: information architecture, states, responsive polish, accessibility, micro-interactions.
8. Validation: formatting, lint, typecheck, tests, production build, route review, regression fixes.

Do not attempt every screen in one uncontrolled pass. Keep changes reviewable.

## Testing requirements

After each major stage:

- run lint;
- run typecheck;
- run relevant tests;
- verify existing Phase 1 behavior;
- inspect mobile and desktop layouts.

Before completion:

- run the full repository verification command;
- run production build;
- run E2E flows;
- verify tenant isolation was not weakened;
- verify all primary routes;
- verify no real data was replaced by fixtures;
- verify no backend service was bypassed.

Do not claim tests passed unless they were actually run.

## Deliverables

Create:

1. the redesigned UI implementation;
2. reusable LoomLogic design-system components;
3. updated responsive layouts;
4. improved accessibility;
5. updated tests where UI behavior changes;
6. `UI_UX_OVERHAUL_COMPLETION.md`.

That completion file must include the audit summary, design direction, routes redesigned, component system created, files changed, backend flows preserved, tests run, responsive behavior tested, accessibility improvements, known limitations, and recommended next UI task.

Update `docs/09_ENGINEERING_DECISIONS.md` if you make material frontend architecture or design-system decisions.

## Completion response

At the end, report:

1. what was redesigned;
2. which existing flows were preserved;
3. files created or modified;
4. design-system decisions;
5. exact commands run;
6. exact test and build results;
7. remaining UI limitations;
8. screenshots or route-by-route review notes if available;
9. one recommended GitHub-issue-sized next step.

If committing, use:

`feat: redesign LoomLogic operations interface`

Do not amend existing commits.
