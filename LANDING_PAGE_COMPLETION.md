# Landing Page Completion Report

Date: 2026-07-27

Scope: the public marketing landing page, per `prompts/04_CLAUDE_LANDING_PAGE_FIRST.md`,
plus the approved League Spartan and Montserrat typography across every route.

The marketing palette, radius, surfaces, and motion remain scoped to the public page. The
authenticated product keeps its existing violet semantic tokens, component radii, layout,
and information architecture until `prompts/02_CLAUDE_UI_UX_OVERHAUL_PROMPT.md` is
implemented as a separate slice.

## Visual direction

An editorial "operational ledger" register: a warm off-white canvas, dark charcoal ink,
thin rules, layered work surfaces, and one disciplined deep-indigo accent. Product UI
composition carries the storytelling instead of stock imagery, illustration, or a floating
dashboard screenshot.

The accent is deliberately **not** the application's violet (hue 279). A violet marketing
page falls into the "purple-gradient AI landing page" failure mode that
`prompts/03_CLAUDE_VISUAL_MOTION_GUIDELINES.md` §3 rules out, so the public brand uses
indigo (hue 264), one of that document's recommended directions.

Light mode only. No dark mode was implemented.

## Section hierarchy

1. Sticky public navigation
2. Hero + animated recovery sequence
3. Business problem — "A missed call is rarely just a missed call."
4. Recovery workflow — Capture / Understand / Recover / Book / Verify
5. Platform modules — tabbed explorer
6. Recovery Case spotlight — "The call ends. The recovery process does not."
7. Recovered revenue — estimated / confirmed / verified attribution
8. Integrations — honestly labelled connected vs. roadmap
9. Use cases — outcome-driven
10. Reliability and control
11. Final CTA (inverted ink band)
12. Footer

## Components created

| File                                                     | Purpose                                                              |
| -------------------------------------------------------- | -------------------------------------------------------------------- |
| `src/components/marketing/section.tsx`                   | `Section`, `Eyebrow`, `SectionHeading` container and type primitives |
| `src/components/marketing/reveal.tsx`                    | Single section-reveal motion primitive                               |
| `src/components/marketing/use-prefers-reduced-motion.ts` | Shared reduced-motion signal                                         |
| `src/components/marketing/site-header.tsx`               | Sticky nav, scroll surface transition, modal drawer                  |
| `src/components/marketing/brand-mark.tsx`                | Public LoomLogic wordmark                                            |
| `src/components/marketing/recovery-sequence.tsx`         | Seven-step hero product sequence                                     |
| `src/components/marketing/platform-explorer.tsx`         | Keyboard-accessible tabbed module presentation                       |
| `src/components/marketing/site-footer.tsx`               | Footer, real links only                                              |
| `src/styles/brand.css`                                   | Public brand token layer and motion primitives                       |

## Design tokens

`src/styles/brand.css` adds a `--brand-*` layer: canvas and surface levels, three ink
levels, two line weights, accent, success/attention/danger semantics, three radii, three
shadow levels, seven motion durations, and the four easings from `prompts/03` §11.

The brand layer is additive. `globals.css` imports the Tailwind theme names, while
`.brand-scope` applies the marketing canvas, ink, indigo accent, shape, focus, selection,
and motion rules only to the public tree. Application tokens remain unchanged.

## Typography

Two locally hosted Latin WOFF2 faces via `next/font/local`:

- **League Spartan Bold** (`--font-brand-display`) for titles and headings, at
  `letter-spacing: -0.035em`;
- **Montserrat** (`--font-brand-sans`) for body text, at 400 with 500/600 for labels and
  controls.

The font files and SIL Open Font License texts live under `src/assets/fonts`. They total
about 48 KB and require no build-time network request. Typography is the only visual
system adjustment applied globally; tabular numerals remain explicit through
`.brand-numeric` on marketing operational values.

## Motion

No animation library was added. `prompts/03` §34 prefers CSS where no library exists, and
none did. All motion is `opacity` and `transform` only.

| Pattern        | Behaviour                                                 |
| -------------- | --------------------------------------------------------- |
| Nav surface    | Border and background fade in past 8px scroll, 260ms      |
| Section reveal | Opacity 0→1, 12px rise, 320ms, once, IntersectionObserver |
| Hero sequence  | 7 steps × 850ms ≈ 6.2s total, then rests. No loop         |
| Tab change     | Colour transition 200ms, panel size held stable           |
| Hover / press  | 140ms colour, 1px active translate                        |

### Reduced motion

`usePrefersReducedMotion` uses `useSyncExternalStore` with a server snapshot of `true`, so
server-rendered markup assumes the accessible default.

Both `.brand-step` and `.brand-reveal` default to **visible**. Section reveals animate
only after an element enters the viewport; they are never held in a hidden off-screen
state. Consequences:

- without JavaScript, the complete page renders;
- with `prefers-reduced-motion: reduce`, every step and section is in its final state and
  all transitions are disabled;
- the hero sequence's final frame — a booked case with recorded value — is the static
  state, so no information is motion-dependent.

The post-implementation audit caught and fixed an earlier observer implementation that
left most sections blank in a headless full-page screenshot.

## Responsive review

Checked at 375, 768, 1280, 1440, and 1728px.

- **No horizontal overflow at any width** (asserted by comparing `scrollWidth` to
  `clientWidth`).
- 375px: single column; nav collapses to a modal drawer; hero CTAs stack; the sequence
  card becomes a vertical flow; platform tabs scroll horizontally.
- 768px: two-column problem and reliability grids; hero remains single column.
- 1280px+: full asymmetric two-column hero and spotlight; platform becomes a left rail
  plus panel.

Two defects were found and fixed during the visual pass:

1. The platform panel stretched to the tab column's height, leaving a large void. Tabs
   became compact single-line items and the panel now uses `self-start`.
2. The header CTA wrapped to two lines at 375px. Fixed with `whitespace-nowrap` and a
   responsive nav gap.

## Accessibility

- One `<h1>`; heading order verified as H1 → H2 → H3 with no skipped levels.
- Landmarks: 1 `header`, 1 `main`, 1 `footer`, 3 `nav` (public + two footer).
- Skip link is the first tab stop. Verified tab order: skip link → wordmark → Product →
  How it works → Use cases → Reliability → Sign in → Create workspace.
- The mobile drawer is a native `<dialog>` opened with `showModal()`, giving a real focus
  trap, Escape handling, and an inert background with no dependency. Focus returns to the
  trigger on close.
- The platform tablist implements the WAI-ARIA tabs pattern: roving `tabindex` plus Arrow,
  Home, and End handling, without which the other modules would have been
  keyboard-unreachable.
- Focus ring is a 2px solid accent outline with 3px offset, scoped to `.brand-scope`.
- Status is never colour alone — every state carries an icon and a text label.
- Touch targets are at least 44px in the drawer and on all primary CTAs.

## Content honesty

No testimonials, customer logos, certifications, usage numbers, conversion claims, or
revenue statistics were invented.

- The hero sequence and case timeline are labelled "Illustrative product sequence with
  sample data. Not a live workspace." and "Illustrative case with sample data."
- Sample phone numbers use the repository's reserved 555-01xx fiction range.
- Integrations are split into "Connected" (Clerk, Supabase) and "On the roadmap" (Twilio,
  ElevenLabs, Google Calendar, Resend, OpenAI), matching `docs/07_BUILD_ROADMAP.md`.
- Planned modules carry a "Planned" chip and an explicit "On the roadmap. Not available in
  the current release." note.
- The revenue section states that estimated and confirmed values are never summed and that
  verified value requires a connected system.
- Security wording avoids certification claims: "designed for tenant isolation".

## Routes and files

**Modified**

- `src/app/page.tsx` — rewritten as the landing page
- `src/app/layout.tsx` — font variable, metadata, Open Graph, canonical
- `src/styles/globals.css` — one `@import` line
- `tests/e2e/public-and-protection.spec.ts` — updated for the mandated copy

**Created**

- `src/styles/brand.css`
- `src/components/marketing/` (8 files)
- `LANDING_PAGE_COMPLETION.md`

## Typography applied to every page

- `/sign-in`, `/sign-up`, and `/organization` receive Montserrat through Clerk's supported
  `fontFamily` variable; their colors, radius, and flow remain unchanged.
- Authenticated `/app` routes use Montserrat for UI text and League Spartan for headings,
  while retaining the existing product palette, shape, and layout.
- `Button`, navigation, filters, and the authenticated `Brand` component keep their
  pre-landing-page geometry and behavior.
- `StatusBadge` retains Claude's useful explicit tone map, but renders from the
  authenticated product's existing semantic tokens rather than marketing colors.

### StatusBadge behaviour change

`failed` previously shared the warning set with `new` and `pending`, and that set rendered
neutral foreground text — so a failed send was visually identical to a brand-new case.
`failed`, `rejected`, and `no_show` now carry a distinct danger tone. `qualified` and
`booking_offered`, which previously fell through to an unintended tone, are now explicit.

Covered by `tests/unit/status-badge.test.tsx` (6 tests), including an assertion that every
one of the 13 documented states resolves to an intentional tone.

## Backend and authenticated behaviour preserved

Untouched by the landing-page work: `supabase/migrations`, RLS policies, `src/lib/auth`,
`src/lib/db`, `src/lib/env`, provider abstractions, and `src/proxy.ts`.

Verified:

- `git diff src/app/(dashboard)/` contains only the separate follow-up idempotency fix,
  which is unrelated to this task and has no visual effect.
- `src/styles/globals.css` imports the public brand theme and applies only the approved
  global font variables; application colors and radii remain unchanged.
- `src/app/layout.tsx` loads committed local font assets and adds metadata.
- Route-protection code is unchanged; the live unauthenticated protection test remains
  gated by Clerk E2E identity variables.
- `/sign-in`, `/sign-up`, and `/organization` retain their flow and component theme apart
  from the approved Montserrat font.
- The landing page retains `ClerkProvider` and its signed-in/signed-out controls; the
  primary CTA routes to the real `/sign-up`.

## Commands run and exact results

| Command                                | Result                                                    |
| -------------------------------------- | --------------------------------------------------------- |
| `pnpm format:check`                    | Passed — all matched files use Prettier style             |
| `pnpm lint`                            | Passed — no warnings or errors                            |
| `pnpm typecheck`                       | Passed — no TypeScript errors                             |
| `pnpm test`                            | Passed — 9 files, 36 tests                                |
| `pnpm db:test`                         | Passed — 2 files, 56 tests, `Result: PASS`                |
| `pnpm build`                           | Passed — compiled in 3.0s; all 14 routes emitted          |
| `pnpm test:e2e`                        | Passed — 3 public tests; 1 Clerk-dependent test skipped   |
| Desktop Chrome and Pixel 7 screenshots | All sections rendered; no visible horizontal overflow     |
| Design detector                        | Passed — no remaining anti-pattern findings in changed UI |

`/` changed from a dynamic route to `○ (Static)` prerendered output, because Clerk state
now resolves client-side in the header.

React 19's hook rules shaped the motion implementation. Reduced-motion uses
`useSyncExternalStore`, section reveals use the Web Animations API only after
intersection, and the recovery sequence uses scheduled state updates.

## Known limitations

- No Open Graph image exists. Metadata therefore uses the ordinary `summary` card rather
  than claiming a large image asset.
- No authenticated route was visually inspected during the landing-page audit. Only the
  approved typography changes there; authenticated layout and component restyling remain
  future work.
- The Clerk card still reads "Sign in to My Application". That string is the application
  name in the Clerk dashboard, not a value in this repository; rename it there to
  "LoomLogic".
- The page is 7195px tall at 1440px. That is within reason for the mandated twelve
  sections but is worth reviewing for trimming.
- No pricing, contact, demo, or legal routes exist, so the footer links only to on-page
  anchors, `/sign-in`, and `/sign-up`.
- Authenticated Clerk E2E flows still require the documented Clerk identity variables.

## Recommended next task

Review and approve the public landing page. Then project real Clerk identifiers into the
local database and walk every authenticated route before beginning
`prompts/02_CLAUDE_UI_UX_OVERHAUL_PROMPT.md`.

After that: fully custom sign-in and sign-up screens using `<SignIn.Root>` /
`<SignUp.Root>` elements rather than themed hosted widgets.

**Do not begin either until the current design is approved.**
