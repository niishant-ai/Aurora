# 08 — Accessibility (WCAG 2.2 AA)

## Target
WCAG 2.2 AA for the prototype desks. This is a plan plus implemented controls, not a certification.

## Implemented
- Skip link to `#content`
- Landmark header, main, footer, nav
- `lang="en"` on `<html>`
- Focus visible at 2px on all interactive elements; no `outline: none` without a replacement
- Theme toggle and role switcher are real buttons with `aria-pressed` / `aria-expanded`
- Dialog (command palette) uses `role="dialog"`, `aria-modal`, Escape, and initial focus
- Search results expose a polite live count
- Status is text plus color
- Calendar events are buttons as well as drag sources; a date input reschedules without a pointer
- Passage selection is a checkbox pattern, not click-only divs
- Images have alt text; illustrative media says so
- Video is user-initiated, captioned by the passage underneath, no autoplay
- `prefers-reduced-motion` disables Lenis and transform animation
- `prefers-color-scheme` honored when theme is System
- Contrast: ink on canvas, muted at `#3e5566` on `#eef3f6`, button text reversed on deep accent
- Hit targets at least 40px on primary controls
- Forms have visible labels, not placeholder-only labels
- Errors are text next to the form, not color alone
- Drag-and-drop ingest also has a file input

## Known limits
- Schematic map is supplemented by a station list; the SVG is `aria-hidden` and the list is the accessible alternative
- External documentary clips do not ship audio description tracks
- Screen-reader testing in this sandbox is manual, not automated with a full axe CI run

## Keyboard map
- `/` focuses the header search
- `Ctrl/Cmd+K` opens the palette
- `Escape` closes dialogs and mobile nav
- Tab order follows visual order
