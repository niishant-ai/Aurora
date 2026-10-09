# 05 — Design system

## Character
Editorial science, not a startup gradient collage. Think a Nature special issue set inside an ISRO control room: wide margins, a serif display, ice-cold neutrals, one aurora accent, amber only for citations.

Name: **AURORA**. Wordmark pairs a four-point star with Fraunces italics.

## Color (refined 2026 pass)
Tokens are `oklch()` and switched by `data-theme`. Ice blue `#0EA5E9` is reserved for glows and large display, not 12px labels, so body contrast stays at WCAG AA.

Light
- Canvas `#FAFBFC`
- Panel `rgba(255,255,255,0.86)`
- Ink `#0c1b2a`
- Muted `#3e5566`
- Line `#d4e0e8`
- Accent `#0f3d4c` (buttons) / link `#0b5f6a`
- Aurora `#0e7490`
- Citation `#9a3412`

Dark (OLED-friendly, not pure black so type does not bloom)
- Canvas `#071018`
- Panel `#0e1a27`
- Ink `#e7f0f6`
- Muted `#9aafc0`
- Line `#1d3346`
- Accent `#5eead4` with ink `#042f2e`
- Citation `#fdba74`

Tokens live as CSS variables switched by `data-theme` on `<html>`, mapped into Tailwind v4 via `@theme inline`.

## Typography
- Display: Fraunces
- UI: Inter
- Mono: JetBrains Mono
- Scale: 12 / 14 / 16 / 18 / 24 / 32 / 48 / 72
- Labels: 11px, semibold, 0.18–0.22em tracking, uppercase
- Numerals: `font-variant-numeric: tabular-nums`

## Spacing
4-based. Page gutter `clamp(1.25rem, 4vw, 4.5rem)`. Section rhythm 4.5–7rem. Cards radius 1.25–1.5rem. Pills fully rounded.

## Motion
- Ease-out expo `[0.22, 1, 0.36, 1]`
- Micro: 160–220ms
- Page: 350ms, 8px rise
- Hover: 2px lift, border warms toward accent
- Lenis lerp 0.085 for wheel smoothness
- GSAP ScrollTrigger for home section reveals only
- `prefers-reduced-motion`: Lenis off, transforms off, opacity snaps

## Components
Button, IconButton, Badge, Panel, Field, EmptyState, Skeleton, Toast, Passage, AssetCard, StatusPill, PolarMap, MonthGrid.

Focus ring is 2px accent, offset 3px, never removed.

## Imagery
Photography is full-bleed only in the hero and media cards. Reports use a quiet thumbnail, not a fake cover. Provenance is always visible: `Mock field report` or `Illustrative still`.

## Do / don't
- Do use one accent per view.
- Do keep citation markers visible, not hover-only.
- Don't use purple-on-white AI gradients.
- Don't hide state in color alone; pair with text.
