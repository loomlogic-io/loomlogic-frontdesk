# Claude Code Prompt — LoomLogic Public Landing Page First

You have already audited the LoomLogic repository and reviewed the UI/UX and motion specifications.

This task is the first design implementation checkpoint.

## Scope decision

Implement the **public LoomLogic marketing landing page first**.

Do not redesign the authenticated application yet.

Do not redesign the Recovery queue, Overview dashboard, Inbox, Contacts, Tasks, or Settings in this task.

After the public landing page is reviewed and approved, the next task will be the custom sign-in and sign-up experience, followed by the authenticated application shell.

## Product

LoomLogic is an AI Front Desk and Revenue Recovery operating system.

It helps appointment-driven and lead-driven businesses:

- answer calls when the front desk cannot;
- recover missed and abandoned calls;
- book appointments automatically;
- follow up with unresolved callers;
- manage contacts and conversations;
- track Recovery Cases;
- enforce callbacks and promises;
- show estimated, confirmed, and verified recovered revenue.

The strongest positioning is not “AI phone assistant.”

The category is:

> AI Front Desk and Revenue Recovery Platform

The core message is:

> Turn missed calls into booked business.

The landing page must make the business outcome immediately understandable.

## Mandatory repository review

Before editing:

1. Inspect the current public routes.
2. Inspect the existing root page and layouts.
3. Inspect the current font, Tailwind, shadcn, token, and motion setup.
4. Read:
   - `AGENTS.md`;
   - `docs/00_PRODUCT_VISION.md`;
   - `docs/01_PRODUCT_REQUIREMENTS.md`;
   - `docs/05_UI_UX_SYSTEM.md`;
   - `prompts/02_CLAUDE_UI_UX_OVERHAUL_PROMPT.md`;
   - `prompts/03_CLAUDE_VISUAL_MOTION_GUIDELINES.md`.
5. Identify reusable visual components already created.
6. Confirm that the public page can be changed without affecting Clerk, Supabase, RLS, tenant isolation, or Phase 1 business flows.

Before implementation, summarize:

- the proposed landing-page visual direction;
- section hierarchy;
- motion system;
- routes and files to modify;
- components to create;
- backend and authentication flows that will remain untouched.

Then proceed.

## Non-negotiable constraints

Do not:

- change the database;
- change Supabase migrations;
- change RLS;
- replace Clerk;
- alter Organization handling;
- modify Phase 1 business logic;
- expose authenticated application data publicly;
- place service-role credentials in frontend code;
- create fake customer logos presented as real;
- invent performance claims;
- use fake testimonials as though they are real;
- add pricing unless the current product strategy already defines approved pricing;
- redesign authenticated product pages in this task;
- implement dark mode;
- create an oversized animation-heavy marketing site that harms performance.

The page must work without authentication.

Primary CTA routes must use the existing sign-up or demo/contact route rather than inventing broken destinations.

## Visual direction

The landing page should feel like it was designed by a senior product and brand studio.

It should feel:

- premium;
- highly polished;
- precise;
- confident;
- sophisticated;
- modern;
- operational;
- calm;
- high-trust;
- distinctive.

It should not feel:

- like a generic AI startup template;
- like a shadcn demo;
- like a purple-gradient AI landing page;
- like an Apple clone;
- like a Linear clone;
- like a Webflow template;
- excessively futuristic;
- playful or cartoonish;
- overloaded with glassmorphism;
- filled with meaningless dashboard cards.

Use a light-mode-only design.

Recommended visual language:

- warm or refined off-white page background;
- dark charcoal typography;
- one controlled primary accent;
- thin borders;
- carefully layered surfaces;
- sophisticated spacing;
- strong typography;
- real product storytelling;
- large but restrained product mockups;
- subtle dimensionality;
- small moments of motion;
- premium editorial composition.

## Brand direction

Use LoomLogic as the visible master brand.

Product descriptor:

**AI Front Desk & Revenue Recovery**

Possible supporting line:

> Answer every opportunity. Recover the ones your team misses.

Do not change the legal or product name throughout the repository without instruction.

Do not call it “Resolve” as the primary public brand unless that is already approved in the repository. LoomLogic should remain the customer-facing name.

## Landing-page objectives

The page must answer within the first screen:

1. What is LoomLogic?
2. Who is it for?
3. What costly problem does it solve?
4. What does it do after a call is missed?
5. What is the primary action the visitor should take?

The visitor should understand:

- LoomLogic can answer calls;
- LoomLogic can recover calls staff miss;
- LoomLogic books and follows up;
- LoomLogic keeps working after the call;
- LoomLogic shows the business outcome and recovered value.

## Page architecture

Build the following hierarchy, adapting it only where the repository or content requires.

### 1. Navigation

Create a polished sticky public navigation.

Include:

- LoomLogic wordmark or existing logo;
- Product;
- How it works;
- Use cases;
- Security or Reliability;
- Sign in;
- primary CTA.

The primary CTA should be one of:

- Start free;
- Create workspace;
- Get early access;
- Book a demo.

Use the route that currently works.

Navigation behavior:

- transparent or lightly integrated at the top;
- gains a subtle border/background after scroll;
- no heavy blur;
- compact and responsive;
- accessible mobile menu;
- no excessive navigation links.

Motion:

- 180–240ms surface transition on scroll;
- mobile drawer 220–280ms;
- focus remains correct;
- reduced motion supported.

### 2. Hero

The hero should be distinctive and immediately communicate the financial outcome.

Recommended content direction:

Eyebrow:

**AI Front Desk & Revenue Recovery**

Headline:

> Turn missed calls into booked business.

Supporting copy:

> LoomLogic answers when your team cannot, follows up with missed callers, books appointments, and tracks the revenue your business recovered.

Primary CTA:

- Start free, Create workspace, or Book a demo depending on the existing functional route.

Secondary CTA:

- See how recovery works;
- Watch the workflow;
- Explore the platform.

Add concise trust copy beneath the CTA, such as:

- Works with your existing business number;
- Built for front-desk teams;
- Every action stays visible and auditable.

Do not claim features that are not implemented or planned in repository documentation.

### Hero visual

Do not use a generic floating dashboard screenshot.

Create a product-led visual demonstrating a recovery event.

Possible composition:

1. An incoming call arrives.
2. The front desk does not answer.
3. LoomLogic creates a Recovery Case.
4. A follow-up is sent.
5. The customer books.
6. Recovered value is attributed.

Represent this as a layered, elegant interactive product scene using actual LoomLogic design language.

Possible elements:

- incoming call card;
- missed-call state;
- Recovery Case panel;
- message follow-up;
- booking confirmation;
- recovered revenue ledger entry.

The visual should feel like a real product experience, not an illustration.

Use sanitized fictional data clearly designed for demonstration.

Recommended animation sequence:

- call arrives;
- missed state appears;
- Recovery Case slides into view;
- follow-up status updates;
- appointment confirms;
- recovered amount appears.

Rules:

- sequence should complete in approximately 5–8 seconds;
- pause after completion;
- do not loop aggressively;
- allow reduced-motion static state;
- no excessive particles;
- no flashing;
- no sound;
- no fake live data.

### 3. Business problem section

Show the cost of ordinary front-desk failure.

Possible heading:

> A missed call is rarely just a missed call.

Explain that the caller may:

- choose another provider;
- abandon a booking;
- leave a voicemail that is never returned;
- request a callback that is forgotten;
- disappear after an unavailable appointment.

Use an editorial layout rather than another row of generic cards.

Possible visual:

- a vertical sequence of failure points;
- an unresolved call timeline;
- a split comparison between “traditional front desk” and “LoomLogic recovery.”

Avoid unverifiable statistics unless approved sources are added later.

### 4. Recovery workflow section

Create a visually strong explanation of the core workflow.

Suggested stages:

1. Capture
2. Understand
3. Recover
4. Book
5. Verify

Content:

- Capture missed or after-hours calls.
- Understand the caller’s intent and value.
- Follow up through the right channel.
- Book or assign the next action.
- Track the final business outcome.

Use a connected process visual.

On desktop:

- horizontally connected sequence or pinned storytelling layout.

On mobile:

- vertical sequence.

Motion:

- reveal one stage at a time;
- use subtle line or progress movement;
- no scroll hijacking;
- no long pinned section that traps the user;
- maintain normal page scrolling.

### 5. Product operating system section

Show that LoomLogic is more than a phone bot.

Introduce core modules:

- Unified Inbox
- Recovery Cases
- Contacts and conversations
- Booking and follow-up
- Promise tracking
- Recovered Revenue
- AI Operations Copilot

Do not create seven identical feature cards.

Use an editorial or tabbed product presentation.

Recommended approach:

- left-side feature navigation;
- right-side product preview;
- selecting a feature updates the preview;
- keyboard accessible;
- mobile becomes stacked content.

Animation:

- crossfade and 8–12px movement;
- 180–240ms;
- preserve layout size to avoid jumping.

Use actual current or planned product concepts from documentation.

### 6. Recovery Case spotlight

Create a dedicated section explaining the core differentiator.

Heading direction:

> The call ends. The recovery process does not.

Explain that a Recovery Case remains open until:

- booked;
- resolved;
- assigned;
- awaiting a known action;
- disqualified;
- opted out;
- or explicitly lost.

Show a high-quality case timeline.

Timeline example:

- 3:42 PM — Call missed
- 3:42 PM — Recovery Case created
- 3:43 PM — Follow-up drafted
- 3:44 PM — Message approved and sent
- 4:01 PM — Customer replied
- 4:03 PM — Appointment booked
- $280 — Estimated recovered value

Use subtle timeline reveal animation.

### 7. Recovered revenue section

This should visually demonstrate financial visibility.

Heading direction:

> See the business LoomLogic brought back.

Explain attribution levels:

- Estimated
- Confirmed
- Verified

Show:

- recovered value;
- source call;
- actions taken;
- booking outcome;
- evidence level.

Do not imply exact accounting accuracy without connected completion or payment systems.

Use “estimated recovered revenue” where appropriate.

### 8. Integrations section

Show the ecosystem in a restrained way.

Current/planned integrations may include:

- Twilio
- ElevenLabs
- Google Calendar
- Microsoft Calendar later
- Resend
- Supabase
- Clerk
- OpenAI

Do not imply every integration is already live in production.

Use labels such as:

- Built with;
- Designed to connect with;
- Integration roadmap;
- Available during rollout.

Follow repository truth.

Avoid a giant logo cloud.

### 9. Use cases

Use outcome-driven use cases rather than broad industry marketing.

Examples:

- Missed-call recovery
- After-hours booking
- Overflow call handling
- Callback enforcement
- Cancellation filling
- Quote or intake follow-up

You may mention representative industries such as automotive, home services, dental/wellness, professional services, and repair businesses, but do not build a separate page for every vertical in this task.

### 10. Reliability and control

Create a trust section covering:

- human approval;
- visible action history;
- tenant isolation;
- role-aware access;
- provider health;
- explicit escalation;
- human handoff;
- auditability.

Do not claim formal security certifications that do not exist.

Use factual wording such as:

- designed with tenant isolation;
- actions remain visible;
- sensitive operations require permission;
- human approval can be required.

### 11. Final CTA

End with a strong, simple CTA.

Suggested direction:

> Your next customer is already calling.

Supporting copy:

> Make sure the opportunity does not disappear when your team cannot answer.

Primary CTA routes to the working sign-up flow.

Secondary CTA may route to sign-in or contact/demo if implemented.

Avoid repeating a huge hero section exactly.

### 12. Footer

Include:

- LoomLogic;
- concise product description;
- Product;
- Company;
- Legal;
- Sign in;
- primary CTA;
- copyright.

Only link to pages that exist or create simple valid placeholder routes when explicitly approved.

Do not add fake social links or company addresses.

## Layout direction

Use a responsive max-width system with intentional variation.

Suggested:

- standard content width for text sections;
- wider product visualization sections;
- occasional full-width background bands;
- asymmetric editorial compositions;
- generous desktop gutters;
- comfortable mobile margins.

Avoid placing every section inside the same centered rectangle with three cards.

Use whitespace as a structural tool.

## Typography direction

Use the existing font if it meets the quality bar. Otherwise propose one production-safe replacement before changing it.

Hero headline:

- large but controlled;
- strong line breaks;
- high readability;
- no ultra-thin weight;
- no excessive gradient text.

Body copy:

- concise;
- readable;
- medium contrast;
- controlled line length.

Metrics:

- tabular numerals;
- clear hierarchy.

## Motion direction

Apply the repository motion specification.

Landing-page motion must remain subtle and performant.

Allowed:

- fade and short vertical movement;
- masked text or section reveal if restrained;
- product UI state transitions;
- timeline progression;
- nav surface transition;
- tab preview crossfade;
- subtle metric count-up once;
- hover feedback;
- parallax of no more than a few pixels when it adds depth.

Avoid:

- scroll hijacking;
- giant 3D scenes;
- cursor-following effects;
- continuous background movement;
- looping marquees everywhere;
- excessive blur;
- animated gradients across entire sections;
- long stagger sequences;
- movement that delays reading;
- animations longer than necessary.

### Timing

Use centralized motion tokens:

- hover: 120–160ms;
- component: 180–240ms;
- panel/menu: 220–280ms;
- section reveal: 240–360ms;
- hero product sequence step: 350–650ms;
- success confirmation: 300–500ms.

### Section reveals

Use restrained section reveals:

- opacity 0 to 1;
- translateY 8–16px;
- 240–360ms;
- trigger once;
- avoid animating every sentence separately;
- reduced-motion becomes immediate.

### Hero sequence

The hero product sequence should:

- use transform and opacity primarily;
- remain readable in its final state;
- stop or pause after completion;
- offer static rendering for reduced motion;
- avoid high CPU usage.

## Images and product previews

Use product UI composition before stock photography.

If photography is introduced later, it should show real business front-desk environments rather than generic AI imagery.

For this task:

- prioritize product visualization;
- use sanitized fictional customer data;
- avoid AI-generated people unless specifically approved;
- avoid generic headset receptionist photos;
- avoid robot imagery.

## Responsive design

Test:

- 375px
- 768px
- 1024px
- 1280px
- 1440px
- 1728px

Mobile requirements:

- hero remains concise;
- CTA remains visible;
- product sequence becomes a static or simplified vertical flow;
- navigation becomes an accessible drawer;
- tabbed sections become stacked or horizontally scrollable only when accessible;
- no tiny dashboard screenshots;
- no clipped animations;
- no uncontrolled horizontal overflow.

## Accessibility

Target WCAG 2.2 AA.

Requirements:

- semantic landmarks;
- one clear H1;
- correct heading order;
- keyboard-accessible navigation;
- accessible mobile menu;
- visible focus;
- sufficient contrast;
- reduced motion;
- no autoplay media with sound;
- meaningful button labels;
- decorative elements hidden from assistive technology;
- product animation content understandable without motion.

## Performance

The public page should be fast.

Requirements:

- use Server Components where appropriate;
- keep Client Components isolated;
- lazy-load below-the-fold heavy visuals;
- avoid unnecessary animation dependencies;
- optimize icons and images;
- no layout shift;
- stable dimensions for product previews;
- respect Next.js image and font optimization;
- avoid loading authenticated application code into the public page unnecessarily.

Do not add a large animation library if CSS handles the need.

If an animation library is already present, use it selectively.

## SEO and metadata

Implement or refine:

- page title;
- meta description;
- Open Graph title and description;
- canonical URL strategy;
- structured heading hierarchy;
- meaningful link text;
- social preview placeholder support;
- product-focused metadata.

Suggested title direction:

`LoomLogic — AI Front Desk & Revenue Recovery`

Suggested description direction:

`LoomLogic answers missed and after-hours calls, follows up with customers, books appointments, and helps businesses recover opportunities before they disappear.`

Do not add unsupported claims.

## Custom authentication direction

Do not redesign authentication screens in this task.

However, the landing page visual system must be designed so the next task can create fully custom LoomLogic sign-in and sign-up pages that feel like a continuation of the same public brand.

Ensure:

- shared tokens;
- shared typography;
- shared logo treatment;
- shared button system;
- shared motion;
- shared background and surface language.

## Implementation sequence

### Stage A — Landing page foundation

- public layout;
- navigation;
- tokens needed by the public brand;
- typography;
- button variants;
- section container system;
- motion utilities;
- responsive framework.

### Stage B — Hero

- copy;
- CTA;
- product recovery sequence;
- reduced-motion version;
- responsive version.

### Stage C — Problem and workflow

- business problem;
- Capture/Understand/Recover/Book/Verify flow;
- section transitions.

### Stage D — Product system

- module presentation;
- Recovery Case spotlight;
- recovered revenue;
- integrations.

### Stage E — Trust and conversion

- reliability;
- use cases;
- final CTA;
- footer.

### Stage F — QA

- mobile;
- tablet;
- desktop;
- keyboard;
- reduced motion;
- Lighthouse-oriented performance review;
- lint;
- typecheck;
- tests;
- build.

Work through the stages in reviewable commits or checkpoints.

## Required deliverables

Create or update:

- public homepage;
- public layout;
- landing-page components;
- public design tokens;
- motion utilities;
- responsive navigation;
- SEO metadata;
- tests where practical.

Create:

`LANDING_PAGE_COMPLETION.md`

Include:

- visual direction;
- section hierarchy;
- components created;
- motion used;
- reduced-motion behavior;
- responsive review;
- accessibility;
- performance considerations;
- routes changed;
- backend/auth flows preserved;
- commands run;
- exact results;
- known limitations;
- next recommended task: custom authentication pages.

## Testing

Run:

- formatter;
- lint;
- typecheck;
- unit/component tests where present;
- relevant Playwright checks;
- production build.

Manually inspect:

- `/`;
- `/sign-in`;
- `/sign-up`;
- at least one authenticated route to confirm it remains unchanged.

The sign-in and sign-up pages do not need visual redesign in this task, but their routes must remain functional.

## Completion report

At completion, report:

1. files changed;
2. sections implemented;
3. product copy used;
4. motion and interaction system;
5. responsive behavior;
6. accessibility;
7. performance decisions;
8. exact commands and results;
9. authenticated behavior verified unchanged;
10. recommended next task for custom Clerk authentication UI.

If committing, use:

`feat: design LoomLogic public landing page`

Do not amend existing commits.
