## Design System

Use the rmx-prototyping skill's design tokens for exact values (color,
spacing, radius, typography) — no rounding or "close enough" Tailwind
classes. Uncovered component → extend in the system's spirit, don't invent
new values.

## Shared components — canonical, don't rewrite

`src/components/ui/`, `AppHeader.tsx`, `NavMenu.tsx` are canonical (source
for `shared-ui-kit/`). Always import them; never redefine inline.

- Don't touch these files as a side effect of unrelated work — call it out
  and make deliberate changes only.
- After an approved change, re-sync `shared-ui-kit/` (see its README).
