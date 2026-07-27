# Claude Code Prompt — LoomLogic Visual Design, Motion, and Interaction Specification

You have already completed the initial repository audit and UI/UX planning for LoomLogic Front Desk OS.

This prompt supplements the existing UI/UX overhaul brief. Apply it as the detailed visual, interaction, transition, and motion direction for the redesign.

Do not restart the product audit. Do not redesign the backend. Do not alter working Phase 1 logic. Use this specification to guide the frontend implementation.

---

# 1. Product feeling

LoomLogic should feel like a premium operational intelligence platform for businesses that cannot afford to lose customer opportunities.

The interface should communicate:

- clarity;
- urgency without anxiety;
- intelligence without gimmicks;
- confidence;
- precision;
- operational control;
- financial visibility;
- polished maturity.

The product should not feel playful, experimental, overly futuristic, or like a consumer AI chatbot.

The visual experience should feel closer to a premium financial operations platform, modern command center, or high-end B2B workflow system.

The design must remain human and approachable.

---

# 2. Core visual concept

Use the idea of an **intelligent operational workspace**.

Visual themes:

- calm neutral canvas;
- sharply organized operational content;
- restrained accent color;
- softly elevated work surfaces;
- fine borders;
- subtle visual depth;
- compact information density;
- clear status language;
- focused action areas;
- purposeful transitions.

The most visually important elements should be:

1. money or value recovered;
2. opportunities requiring attention;
3. unresolved customer intent;
4. next action;
5. overdue commitments;
6. customer context;
7. system or AI activity.

The application should visually emphasize outcomes rather than raw system activity.

---

# 3. Color system

## Base palette

Use a refined neutral foundation.

Suggested direction:

- warm white or very light neutral application background;
- slightly cooler white for interactive surfaces;
- soft gray borders;
- dark charcoal primary text rather than absolute black;
- medium neutral secondary text;
- very subtle tinted sections for grouping.

Avoid:

- pure black backgrounds in light mode;
- heavy blue-gray corporate templates;
- saturated purple gradients;
- excessive colored cards;
- rainbow status systems;
- neon colors.

## Accent

Choose one primary accent color and use it selectively.

Recommended direction:

- deep indigo;
- refined cobalt;
- dark teal;
- muted electric blue.

The accent should be used for:

- selected navigation;
- primary actions;
- active filters;
- focus rings;
- links;
- selected states;
- assistant actions;
- important chart emphasis.

Do not use the primary accent as the background of every major card.

## Semantic colors

Define semantic colors for:

- recovered or successful;
- attention;
- warning;
- urgent;
- failed;
- neutral;
- informational;
- awaiting customer;
- awaiting staff;
- booked;
- lost.

Semantic states must include:

- color;
- icon or shape;
- readable text label;
- optional subtle background;
- sufficient contrast.

Never communicate status through color alone.

## Revenue color

Recovered revenue may use a distinctive but restrained success treatment.

Examples:

- deep green text;
- pale green background;
- subtle upward indicator;
- verified icon;
- tabular numerals.

Avoid bright finance-app green across entire cards.

---

# 4. Surface hierarchy

Create clear surface levels.

## Level 0 — Application background

The quietest layer.

Use for:

- app canvas;
- page gutters;
- navigation separation;
- whitespace.

## Level 1 — Primary work surface

Used for:

- tables;
- inbox;
- main detail areas;
- recovery queue;
- timelines.

Properties:

- subtle border;
- minimal shadow or no shadow;
- consistent radius;
- strong internal spacing.

## Level 2 — Elevated contextual surface

Used for:

- side panels;
- popovers;
- command menu;
- assistant panel;
- approval panels;
- dialogs.

Properties:

- slightly stronger shadow;
- clearer separation;
- controlled elevation;
- no heavy floating-glass effect.

## Level 3 — Critical action surface

Used sparingly for:

- urgent recovery action;
- approval required;
- unresolved exception;
- destructive confirmation.

This layer should be visually distinctive without becoming alarming.

---

# 5. Typography system

Use a highly readable sans-serif with strong numeral quality.

If the repository already uses a suitable font, preserve it unless there is a clear reason to change.

Preferred qualities:

- refined;
- modern;
- neutral;
- high readability;
- strong tabular numerals;
- broad weight range.

## Hierarchy

### Display metric

Use for:

- recovered revenue;
- primary KPI;
- outstanding opportunity value.

Characteristics:

- large but not marketing-scale;
- tabular numerals;
- tight tracking;
- strong weight;
- restrained line height.

### Page title

Characteristics:

- confident;
- medium-large;
- not oversized;
- concise.

### Section title

Characteristics:

- compact;
- clear;
- semibold;
- high contrast.

### Body

Characteristics:

- comfortable line height;
- readable at operational density;
- no overly small text.

### Metadata

Characteristics:

- smaller;
- muted;
- never too low contrast;
- reserved for timestamps, identifiers, and secondary facts.

### Labels

Characteristics:

- short;
- medium weight;
- consistent casing;
- avoid all caps except very small category labels.

## Numerals

Use tabular numerals for:

- money;
- durations;
- counts;
- dates in tables;
- percentages;
- phone values where useful.

---

# 6. Spacing and density

The interface should feel compact but not cramped.

Use a consistent spacing scale.

Suggested rhythm:

- 4px micro spacing;
- 8px compact spacing;
- 12px component spacing;
- 16px standard spacing;
- 24px section spacing;
- 32px major separation;
- 48px page-level separation.

Avoid random spacing values.

## Operational density

Tables and lists should support dense information while preserving:

- clear row separation;
- readable line height;
- aligned metadata;
- visible actions;
- sufficient click targets.

Use progressive disclosure instead of showing every field at once.

---

# 7. Border radius

Use a restrained radius system.

Suggested:

- small radius for controls;
- medium radius for cards and surfaces;
- larger radius only for major panels or assistant surfaces.

Avoid:

- pill-shaped everything;
- oversized rounded containers;
- inconsistent radius values;
- excessive soft-card appearance.

Status badges may use pill shapes where useful.

---

# 8. Shadows and depth

Shadows should be subtle and functional.

Use shadows for:

- floating panels;
- dialogs;
- command menu;
- assistant panel;
- dropdowns;
- sticky headers when content scrolls beneath.

Avoid:

- large blurry shadows on every card;
- layered shadows that make the UI feel soft or toy-like;
- shadows as the only means of separation.

Prefer borders and surface contrast for most layout separation.

---

# 9. Navigation behavior

## Sidebar

The sidebar should feel stable and calm.

Use:

- compact logo treatment;
- clear selected state;
- subtle hover background;
- concise labels;
- grouped navigation;
- secondary controls at the bottom;
- visible organization context.

Selected state should use:

- soft tinted background;
- accent indicator;
- stronger label weight;
- optional icon emphasis.

Do not use large animated pills for every item.

## Sidebar collapse

If collapse is supported:

- animate width smoothly;
- preserve icon alignment;
- fade labels;
- avoid layout snapping;
- show tooltips in collapsed mode;
- persist user preference.

Recommended duration:

- 180–240ms.

## Top bar

The top bar should remain visually light.

Include:

- page context;
- contextual actions;
- command/search entry;
- status;
- user controls.

Avoid duplicating navigation from the sidebar.

---

# 10. Motion philosophy

Motion should improve comprehension.

Every animation must serve one of these purposes:

1. show where an element came from;
2. show a change in state;
3. preserve spatial continuity;
4. confirm an action;
5. draw attention to a meaningful update;
6. reduce perceived loading time.

Do not animate for decoration.

The interface should still feel complete with reduced motion enabled.

---

# 11. Motion timing system

Create centralized motion tokens.

## Durations

Suggested values:

- instant feedback: 80–120ms;
- small hover or control transition: 120–160ms;
- standard component transition: 180–240ms;
- panel or drawer transition: 220–300ms;
- page-level continuity transition: 260–360ms;
- success confirmation: 300–500ms;
- skeleton shimmer cycle: 1.2–1.8s.

Avoid transitions longer than 500ms for ordinary operations.

## Easing

Use a small easing system.

Suggested:

- standard: cubic-bezier(0.2, 0, 0, 1);
- enter: cubic-bezier(0.16, 1, 0.3, 1);
- exit: cubic-bezier(0.4, 0, 1, 1);
- emphasized: cubic-bezier(0.22, 1, 0.36, 1).

Avoid springy or bouncy easing for operational UI.

A subtle spring may be used only for:

- command menu;
- assistant panel;
- drag interactions;
- lightweight success indicator.

Keep damping high and overshoot minimal.

---

# 12. Page transitions

Do not implement dramatic full-page animations.

Use subtle continuity.

Recommended page transition:

- content opacity from 0.92 to 1;
- vertical movement from 4–8px to 0;
- duration 180–240ms;
- preserve app shell;
- do not animate sidebar or global navigation on every route change.

When navigating between list and detail:

- preserve selected row state;
- highlight the active item;
- animate detail panel entrance if using split view;
- avoid blank flashes;
- use route-level loading skeletons.

Do not animate page height in a way that causes layout instability.

---

# 13. Panel and drawer transitions

## Detail panel

For contextual side panels:

- enter from right;
- translate 12–24px;
- opacity from 0 to 1;
- duration 220–280ms;
- backdrop only when interaction should be modal;
- preserve scroll position of underlying list.

## Assistant panel

The assistant should feel integrated, not like a generic chatbot.

Recommended:

- slide from right;
- subtle scale from 0.99 to 1;
- fade;
- 240–300ms;
- maintain conversation state when minimized;
- indicate pending action or approval without pulsing continuously.

## Mobile drawer

- slide from edge;
- use direct spatial movement;
- 220–280ms;
- dim backdrop;
- lock background scroll;
- support swipe dismissal only if implementation remains accessible and reliable.

---

# 14. Hover states

Hover should be subtle and immediate.

Recommended treatments:

- 1–2% surface shift;
- slight border emphasis;
- icon color change;
- text color increase;
- subtle shadow only for genuinely elevated controls.

Avoid:

- large scale changes;
- bouncing;
- moving cards;
- dramatic glow;
- changing layout dimensions.

Rows should show:

- hover background;
- visible quick actions;
- unchanged row height;
- preserved text alignment.

---

# 15. Press and active states

Buttons and interactive controls should feel responsive.

Use:

- slight darkening or surface compression;
- optional scale to 0.98–0.99 for primary controls;
- 80–120ms;
- no exaggerated bounce.

For destructive actions:

- do not use playful press animation;
- prioritize clear confirmation and consequence.

---

# 16. Focus states

All interactive elements must have visible keyboard focus.

Use:

- consistent focus ring;
- semantic accent;
- sufficient contrast;
- offset where needed;
- no removal of browser focus without replacement.

Focus transitions may be 100–140ms.

Do not rely on shadows alone for focus.

---

# 17. Data loading states

## Skeletons

Skeletons should match the final layout.

Use:

- row-shaped skeletons for tables;
- timeline-shaped skeletons for activity;
- text-line skeletons for detail pages;
- metric skeletons matching numeral blocks;
- no generic large gray rectangles.

Skeleton animation should be subtle.

Avoid aggressive shimmer.

Respect reduced motion by using static placeholders.

## Progressive loading

Load the most important operational content first.

Suggested order:

1. page heading and context;
2. primary outcome metrics;
3. attention queue;
4. secondary charts;
5. activity timeline.

Do not block the entire page for one slow widget.

---

# 18. Empty states

Empty states should be purposeful.

Each empty state must explain:

- what the area represents;
- why it is empty;
- what action the user can take;
- whether the state is healthy or requires setup.

Examples:

### No Recovery Cases

“Nothing needs recovery right now.”

This should feel positive.

### No calls connected

“Connect a phone number to begin capturing missed calls.”

This should guide setup.

### No search results

“Nothing matches these filters.”

Offer clear filter reset.

Avoid decorative illustrations unless subtle and product-specific.

---

# 19. Error states

Errors should be calm, specific, and actionable.

Display:

- what failed;
- whether data is safe;
- what the user can do;
- retry;
- support reference or correlation ID when useful.

Avoid:

- generic “Something went wrong” as the only message;
- red full-screen alerts for minor widget failures;
- hiding errors as empty states.

Use partial failure handling.

If a chart fails, the recovery queue should still render.

---

# 20. Success states

Success feedback should be brief and meaningful.

Examples:

- follow-up approved;
- message sent;
- case assigned;
- booking recovered;
- case resolved.

Use:

- toast or inline confirmation;
- small icon transition;
- subtle check animation;
- clear resulting state.

Do not use confetti.

For recovered revenue, a subtle count-up or highlighted ledger entry may be appropriate.

Count-up rules:

- only for newly updated values;
- duration 300–500ms;
- do not animate every page load;
- respect reduced motion.

---

# 21. Status transitions

When a Recovery Case status changes:

- animate the badge or state label;
- update the timeline;
- briefly highlight the new timeline event;
- avoid reordering the whole page unexpectedly;
- keep action buttons stable during mutation;
- show pending state.

Suggested transition:

- fade/scale badge;
- 160–220ms;
- highlight new timeline item for 800–1200ms with a subtle background fade.

---

# 22. Table and list motion

Rows should not jump.

When filters change:

- fade updated content;
- preserve table header;
- use skeleton rows if request is slow;
- avoid animating every row independently with large stagger.

If using stagger:

- 15–25ms between rows;
- maximum 5–8 visible rows;
- only on initial load;
- disable with reduced motion.

When a row is removed:

- fade and collapse within 180–240ms;
- maintain surrounding context.

When sorting:

- avoid complex physical row animations unless reliable;
- prioritize instant correctness.

---

# 23. Timeline motion

The timeline is central to LoomLogic.

Use motion to show newly created events.

New timeline event:

- fade in;
- move upward 4–6px;
- subtle highlight;
- 200–280ms;
- highlight fades over 800–1200ms.

Do not animate historical events on every visit.

The timeline should visually differentiate:

- customer action;
- staff action;
- AI action;
- system action;
- approval;
- failure;
- recovered outcome.

Use icon, label, and structure—not color alone.

---

# 24. Charts

Charts should feel editorial and operational.

Use:

- restrained colors;
- subtle grid lines;
- readable labels;
- useful tooltips;
- no 3D effects;
- no animation-heavy entrances;
- no decorative gradients unless extremely subtle.

Animation:

- line drawing or bar growth may occur once;
- 300–500ms;
- no repeated animation;
- respect reduced motion.

Charts must answer a question.

Examples:

- How much value was recovered?
- Are open cases being resolved?
- Which time periods create the most missed calls?
- What percentage of recovery attempts convert?

Do not use charts for values better represented in a table or metric.

---

# 25. Assistant interaction design

The AI assistant should feel like an operational copilot.

Do not make it look like a consumer chat bubble interface only.

The assistant must support structured action cards.

Each proposed action should show:

- action name;
- reason;
- affected customer;
- affected case;
- recipient;
- exact message or change;
- permission level;
- whether approval is required;
- cancel;
- edit;
- approve.

Motion:

- proposed action card enters with subtle fade and lift;
- approval reveals progress state;
- completion changes to confirmed state;
- failures remain visible with retry.

Never visually imply that an action executed before the backend confirms it.

---

# 26. Command palette

If a command palette exists or is added:

- open with fade and scale;
- maintain keyboard focus;
- support navigation and search;
- show recent contacts or actions only if backed by real data;
- group commands;
- display shortcuts;
- close cleanly;
- return focus to the trigger.

Recommended motion:

- scale 0.98 to 1;
- opacity 0 to 1;
- 160–220ms.

---

# 27. Notification behavior

Notifications should not become noisy.

Use categories:

- attention required;
- action completed;
- integration issue;
- assignment;
- overdue promise;
- system update.

Do not animate notification badges continuously.

A new critical notification may:

- appear with subtle scale/fade;
- show one restrained indicator;
- stop animating after acknowledgment.

---

# 28. Forms

Forms should feel structured and calm.

Use:

- visible labels;
- short supporting text;
- consistent control height;
- inline validation;
- preserved values after error;
- clear required and optional fields;
- logical grouping;
- sticky action footer for long forms where useful.

Transitions:

- validation messages fade/slide 2–4px;
- dependent fields reveal smoothly;
- do not animate form layout excessively.

Submission:

- disable duplicate submission;
- show pending state;
- preserve label width where possible;
- do not replace button text with an uncentered spinner only.

---

# 29. Dialogs and confirmation

Use dialogs for actions that require decision.

Dialog behavior:

- focused title;
- consequence;
- affected record;
- primary and secondary action;
- destructive actions clearly marked;
- keyboard accessible;
- focus trapped;
- restore focus on close.

Motion:

- backdrop fade 140–180ms;
- dialog fade and scale 0.98 to 1;
- 180–240ms;
- no bounce.

---

# 30. Audio and transcript experience

If call recording playback exists:

- compact audio player;
- clear play/pause;
- scrubber;
- elapsed and total time;
- playback speed;
- accessible labels;
- transcript synchronization only if reliable.

Transcript:

- clear speaker distinction;
- readable line length;
- timestamps;
- highlight currently playing segment if synchronized;
- search within transcript if supported;
- collapse metadata;
- no chat-bubble styling that wastes space.

Motion:

- current transcript highlight should transition subtly;
- avoid automatic scrolling that fights the user;
- only follow playback when user enables it or has not manually scrolled away.

---

# 31. Mobile behavior

Mobile is for triage and quick action.

Prioritize:

- urgent Recovery Cases;
- recent missed calls;
- assignments;
- customer lookup;
- callback or follow-up;
- status updates.

Avoid squeezing the full desktop layout.

Mobile patterns:

- stacked cards or rows;
- sticky primary actions;
- bottom sheets for filters;
- full-screen details;
- compact timeline;
- simplified metrics;
- collapsible sections.

Animations should be shorter on mobile where possible.

---

# 32. Responsive transitions

When layout changes across breakpoints:

- do not animate layout dramatically;
- preserve state;
- preserve selected conversation;
- avoid re-mounting entire screens unnecessarily;
- ensure sidebar-to-drawer transition remains coherent.

Do not rely on viewport resize animations for production use.

---

# 33. Dark mode

Dark mode is optional and should not block the redesign.

If implemented:

- build from semantic tokens;
- avoid pure black;
- preserve contrast;
- reduce shadow reliance;
- adjust chart and semantic colors;
- test all status states.

Do not create dark mode through simple inversion.

---

# 34. Performance constraints

Motion must not reduce application performance.

Prefer animating:

- opacity;
- transform.

Avoid frequent animation of:

- width;
- height;
- top;
- left;
- box-shadow;
- large filters;
- blur;
- background-position on large areas.

Use CSS transitions for simple interactions.

Use an animation library only where it adds clear value.

Do not add a heavy animation dependency solely for hover states.

If Framer Motion or Motion is already installed, use it selectively.

If no animation library exists, prefer CSS and Radix animations first.

Use lazy loading for heavy visual modules.

Avoid layout shift.

---

# 35. Reduced motion

Respect `prefers-reduced-motion`.

When reduced motion is enabled:

- remove page movement;
- remove stagger;
- remove chart drawing;
- remove count-up;
- remove shimmer;
- preserve instant or short fades where appropriate;
- keep all state changes understandable.

Create reusable reduced-motion utilities or variants.

---

# 36. Interaction consistency

Create reusable motion primitives or classes for:

- fade;
- fade-up;
- panel-in;
- dialog-in;
- list-update;
- status-change;
- success-confirmation;
- loading-skeleton.

Do not invent a different animation for every component.

Document motion tokens and patterns in the design system.

---

# 37. Recommended implementation structure

Consider creating or refining:

```text
src/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── motion/
│   ├── data-display/
│   ├── feedback/
│   └── domain/
├── styles/
│   ├── globals.css
│   ├── tokens.css
│   └── motion.css
└── lib/
    └── motion/
```

Possible reusable motion utilities:

- `FadeIn`
- `FadeUp`
- `PanelTransition`
- `Presence`
- `AnimatedNumber`
- `StatusTransition`
- `StaggerList`
- `ReducedMotionProvider`

Do not create abstractions that add complexity without repeated use.

---

# 38. Visual QA checklist

Review every implemented route for:

- visual hierarchy;
- alignment;
- spacing;
- typography;
- semantic color;
- focus states;
- hover states;
- active states;
- loading;
- empty;
- error;
- success;
- responsive layout;
- reduced motion;
- keyboard navigation;
- screen-reader labels;
- real data;
- preserved backend functionality.

Test at:

- 375px mobile;
- 768px tablet;
- 1280px laptop;
- 1440px desktop;
- 1728px wide desktop.

Check browser zoom at 200%.

---

# 39. Route-by-route visual review

For every route changed, provide a review note covering:

- objective of the page;
- primary hierarchy;
- interaction model;
- responsive treatment;
- motion used;
- empty/loading/error handling;
- accessibility;
- backend behavior preserved.

Do not complete the redesign without reviewing the product as a connected system.

---

# 40. Execution instruction

Apply this design and motion specification to the UI/UX implementation plan you already proposed.

Before editing, summarize:

1. the exact visual direction you will use;
2. the token changes;
3. the motion system;
4. the first components you will update;
5. the first route you will redesign;
6. how you will preserve current functionality;
7. how you will test responsiveness and reduced motion.

Then proceed in controlled stages.

Start with:

- design tokens;
- typography;
- surfaces;
- spacing;
- motion tokens;
- base interactive states;
- application shell.

Do not redesign every feature page at once.

After the first stage, stop and report:

- files changed;
- design tokens created;
- motion primitives created;
- shell changes;
- exact tests run;
- screenshots or visual review notes;
- remaining issues.

Do not continue to the next stage until the current stage is stable.

If committing, use:

`feat: establish LoomLogic visual and motion system`
