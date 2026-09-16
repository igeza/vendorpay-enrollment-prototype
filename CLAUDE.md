## Design System

Check DESIGN.md before writing or editing any UI code. Use its exact values for
color, spacing, radius, and typography — never approximate or round a listed
number (e.g. use `padding: 16px`, not "roughly 16px" or a Tailwind class that's
close but not exact). If a component isn't covered here, extend in the system's
spirit per §10, not by inventing new values.

## Shared components — canonical source, don't casually rewrite

`src/components/ui/` (Button, Dropdown, DatePicker, Field, Controls,
MultiSelectDropdown, InfoTooltip) plus `src/components/AppHeader.tsx` and
`src/components/NavMenu.tsx` are the canonical, already-correct
implementation of the design system's core components and app chrome. This
is the source that `shared-ui-kit/` (exported for reuse in other projects)
is copied from.

- Always import from `src/components/ui/`, `AppHeader`, and `NavMenu` for
  anything they already cover. Never redefine a button/dropdown/date
  picker/header/nav menu/etc. inline elsewhere in the app.
- Don't edit files in this folder as a side effect of an unrelated task
  (e.g. while building a new page). If a real fix is needed here, call it
  out explicitly and make the change deliberately.
- After a deliberate, approved change to a component in this folder, re-run
  the sync into `shared-ui-kit/` (see `shared-ui-kit/README.md`) so other
  projects don't silently drift out of date.
