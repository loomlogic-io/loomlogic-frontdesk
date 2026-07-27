# UI and UX System

## Design objective

The application should feel designed by a senior B2B product team: premium, calm, fast, precise, and trustworthy.

It should not look like:

- a generic admin template;
- a neon AI dashboard;
- an oversized collection of cards;
- a glassmorphism experiment;
- a clone of Linear, Stripe, or Apple;
- a marketing page forced into an operations product.

## Experience principles

1. Immediate operational clarity.
2. Revenue and unresolved work are visible before vanity metrics.
3. Dense information remains readable.
4. Important states are understandable without relying on color alone.
5. Every page has purposeful empty, loading, error, and success states.
6. Actions are predictable and reversible where possible.
7. AI actions visibly show what will happen before execution.
8. Mobile supports triage; desktop supports full operations.

## Visual direction

- Light mode first.
- Neutral surfaces with restrained accent use.
- Clear hierarchy through typography, spacing, and borders.
- Soft elevation only where layers need separation.
- Rounded corners used consistently, not excessively.
- Motion limited to orientation, feedback, and state transitions.
- Strong data-table and timeline design.
- Use one coherent icon library.
- Avoid decorative stock illustrations in the authenticated product.

## Design tokens

Define tokens for:

- typography scale;
- spacing;
- radius;
- border;
- shadow;
- surface levels;
- content colors;
- semantic states;
- chart colors;
- motion duration and easing;
- focus ring.

Do not hard-code arbitrary values across components.

## Typography

Use a high-quality sans-serif available through the chosen web-font system or a system stack.

- clear distinction between page title, section title, label, body, metadata, and code/identifier;
- tabular numerals for operational metrics;
- readable line lengths;
- avoid very light weights for functional text.

## App shell

Desktop:

- left navigation;
- top workspace bar;
- organization switcher;
- global search/command access;
- notification/status area;
- persistent assistant entry point;
- main content region;
- optional contextual detail panel.

Mobile:

- compact top bar;
- bottom or drawer navigation;
- triage-focused lists;
- full-screen detail views;
- no horizontal table dependency without an alternative layout.

## Navigation

Initial navigation:

- Overview
- Inbox
- Calls
- Recovery
- Contacts
- Calendar
- Tasks
- Assistant
- Analytics
- AI Receptionist
- Knowledge
- Integrations
- Team
- Settings

Phase 0 may show disabled “Coming later” items only when useful. Do not create fake functional screens.

## Core screens

### Overview

Hierarchy:

1. recovered outcome summary;
2. open cases requiring attention;
3. recent recovery activity;
4. call and booking trends;
5. team and integration exceptions.

Do not lead with total calls alone.

### Inbox

- split-view on desktop;
- filters and saved views;
- clear channel icon and status;
- unread/attention state;
- contact and context;
- latest summary;
- next action;
- value at risk;
- assignee;
- fast keyboard navigation.

### Conversation detail

- customer header;
- unresolved objective;
- case state and next action;
- chronological timeline;
- transcript/recording panel;
- linked appointments, tasks, and promises;
- internal notes;
- AI summary;
- action composer.

### Recovery queue

Use an operational table or grouped list with:

- contact;
- reason;
- source;
- value at risk;
- age;
- next action;
- due time;
- assignee;
- status;
- confidence or attribution when relevant.

### Contact detail

- identity and channels;
- consent state;
- open cases;
- upcoming appointments;
- outstanding promises;
- complete timeline;
- notes and tags;
- duplicate warning.

### Assistant

- conversational workspace;
- cited internal records;
- proposed actions displayed as structured cards;
- approval panel;
- execution results;
- activity history;
- clear boundary between suggestion and completed action.

## Component requirements

Build reusable components for:

- app shell;
- navigation;
- page header;
- metric;
- status badge;
- operational table;
- filter bar;
- timeline;
- activity item;
- empty state;
- error state;
- skeleton;
- confirmation dialog;
- approval card;
- contact identity;
- phone/email display;
- value display;
- relative and absolute time;
- command palette;
- integration health;
- audio player shell;
- transcript segment.

Use shadcn/ui primitives where useful, but redesign composition and spacing so the app does not feel like an unmodified component library.

## Data states

Every data surface must define:

- initial loading;
- refresh loading;
- empty;
- no filter results;
- permission denied;
- provider disconnected;
- partial data;
- stale data;
- error with retry;
- success confirmation.

## Forms

- labels remain visible;
- errors appear near fields;
- preserve input after server errors;
- distinguish optional fields;
- prevent duplicate submission;
- use optimistic updates only when rollback is safe;
- confirm destructive actions;
- support keyboard operation;
- show organization time zone for scheduled actions.

## AI interface rules

- Never imply a proposed action has executed.
- Display tool name in user-friendly language.
- Show affected records.
- Show message recipients and content before sending.
- Show risk/approval requirement.
- Require explicit approval for MVP mutations.
- Display execution status and errors.
- Preserve an audit link or action reference.

## Accessibility

- WCAG 2.2 AA target;
- semantic heading order;
- skip links;
- visible focus;
- no color-only status;
- labels for icons;
- screen-reader announcements for async changes;
- reduced-motion support;
- sufficient touch targets;
- captions or transcript alternatives for audio.

## Demo data

Demo fixtures should feel realistic but must be clearly labeled as demo data.

Do not use real customer names, phone numbers, recordings, or copied transcripts.
