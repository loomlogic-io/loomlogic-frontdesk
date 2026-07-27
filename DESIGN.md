# LoomLogic Resolve Design System

## Theme

LoomLogic uses a light-first, restrained product theme for teams working throughout the
day in mixed office lighting. Surfaces remain quiet so unresolved work, ownership, and
risk states receive attention. Dark mode is deferred until it can be tested without
delaying the primary experience.

## Color

All application colors use OKLCH semantic tokens. The primary seed is violet at hue 279,
used selectively for active navigation, focus, and primary actions. Neutral surfaces have
near-zero chroma. Semantic status colors must pair an icon or label with color.

```css
:root {
  --background: oklch(1 0 0);
  --surface: oklch(0.975 0.004 279);
  --surface-strong: oklch(0.945 0.008 279);
  --foreground: oklch(0.205 0.018 279);
  --muted-foreground: oklch(0.46 0.018 279);
  --border: oklch(0.89 0.009 279);
  --primary: oklch(0.445 0.206 279.1);
  --primary-hover: oklch(0.39 0.19 279.1);
  --primary-foreground: oklch(0.99 0 0);
  --success: oklch(0.46 0.12 154);
  --warning: oklch(0.58 0.13 74);
  --danger: oklch(0.51 0.18 28);
}
```

## Typography

Use one product sans-serif family across headings, navigation, controls, and body copy.
The initial implementation uses a native system sans-serif stack to avoid a remote font
dependency. Use a compact fixed type scale, tabular numerals for operational values,
balanced headings, and a maximum prose line length of 70 characters.

## Shape and elevation

- Controls: 8px radius.
- Panels and substantial containers: 12px radius.
- Pills are reserved for compact status and metadata.
- Prefer borders, spacing, and surface contrast over broad shadows.
- Never nest decorative cards.

## Layout

The desktop shell uses a persistent 264px navigation rail and a compact workspace bar.
Mobile collapses navigation into a top-level drawer while preserving direct access to the
current organization and user controls. Content is capped at 1440px and uses page-specific
density rather than a universal card grid.

## Components

Interactive elements include default, hover, focus, active, disabled, and loading behavior
where relevant. Loading surfaces use shape-matched skeletons. Empty states explain what
will populate the surface and which phase or action enables it. Error states use plain
language and expose a safe retry or navigation path.

## Motion

Motion is limited to 150-200ms state feedback for menus, hover, focus, and navigation
transitions. No orchestrated page entrance animations. `prefers-reduced-motion` removes
non-essential transitions.

## Content

Do not fabricate business metrics, provider health, customer records, transcripts, or
recovered revenue. Synthetic Phase 1 records must be marked as demo, use fictional contact
details, and keep mock-provider execution visually explicit. Operational metrics must be
computed from authoritative tenant-scoped records.
