---
name: streamys-mobile
description: >-
  Mobile-first responsive UI rules for Streamys retail ERP. Enforces touch
  targets, stacking layouts, overflow handling, and mobile-safe patterns whenever
  building or editing pages, components, Figma designs, forms, tables, or
  dashboards under frontend/. Use for any UI design or implementation work.
---

# Streamys Mobile-Optimized UI

**Every screen must work on mobile first.** Desktop layouts are enhancements (`sm:` / `md:` / `lg:` / `xl:`), never the baseline. Apply this skill for all frontend UI work — new pages, Figma builds, polish, and refactors.

Also follow [streamys-frontend](../streamys-frontend/SKILL.md) for structure, data layer, and type scale.

## Non-negotiables

1. **Mobile is the default** — start at ~375px width; add breakpoints upward.
2. **No horizontal page scroll** — only intentional scroll regions (tables) may scroll sideways.
3. **Touch-friendly** — interactive targets ≥ 36px tall (`h-9` minimum; prefer `h-10` for primary CTAs).
4. **Readable without zoom** — use Streamys type scale; never shrink body below 12px for essential content.
5. **Figma desktop frames ≠ ship layout** — adapt wide Figma comps into stacked mobile layouts.

## Layout rules

| Pattern | Mobile (default) | Desktop enhancement |
|---------|------------------|---------------------|
| Page header | `page-header` stacks title above actions | `sm:flex-row` side-by-side |
| Actions | Wrap (`page-actions`); icon-only OK with `sm:inline` labels | Full labels visible |
| Stat cards | `grid-cols-2` | `lg:grid-cols-4` |
| Content grids | `grid-cols-1` | `md:grid-cols-2` / `xl:grid-cols-3` |
| Form fields | Single column | `sm:grid-cols-2` |
| Table + side panel | Stack panel under main content | `xl:grid-cols-[1fr_340px]` side-by-side |
| Filters / tabs | Wrap pills; full-width search first | Inline row on `lg:` |
| Wizard steppers | Wrap steps; shorten connectors | Horizontal center row |
| Modals / drawers | Full-width near edges; bottom sheet feel OK | Centered / side drawer |

Use existing shell: mobile drawer sidebar + sticky top bar. Do **not** add fixed `ml-72`, fixed widths > viewport, or desktop-only sidebars in new screens.

## Component checklist (run before finishing)

Copy and verify:

```
Mobile check:
- [ ] page-shell / page-header / page-actions used (no one-off full-page padding)
- [ ] No fixed widths that overflow < 375px (prefer w-full / max-w-* / min-w-0)
- [ ] Long text truncates or wraps (min-w-0 on flex children)
- [ ] Tables wrapped for horizontal scroll (ReusableTable already scrolls; avoid nesting that blocks it)
- [ ] Filter bars: search full-width on mobile, then tabs/actions wrap
- [ ] Primary buttons reachable without horizontal scroll
- [ ] Icons + short labels; hide verbose button text behind sm:inline when needed
- [ ] Cards/grids collapse to 1–2 columns on small screens
- [ ] Forms: one column by default; two columns only from sm/md up
- [ ] Side info panels stack below the form/table on < xl
- [ ] Safe tap targets (h-9+); no tiny icon-only hit areas without padding
- [ ] No hover-only critical actions (provide tap-visible controls)
```

## Tailwind patterns (prefer these)

```tsx
{/* Header */}
<div className="page-header">
  <div>
    <h1 className="page-title">…</h1>
    <p className="page-subtitle">…</p>
  </div>
  <div className="page-actions">…</div>
</div>

{/* Stats */}
<div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">…</div>

{/* Filters */}
<div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center">
  <div className="relative min-w-0 flex-1">{/* search */}</div>
  <div className="flex flex-wrap items-center gap-1.5">{/* pills */}</div>
</div>

{/* Form + aside */}
<div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_340px]">…</div>

{/* Flex child that must shrink */}
<div className="min-w-0 flex-1">…</div>
```

## Tables on mobile

- Always use `ReusableTable` (has `scroll={{ x: true }}`).
- Keep column content compact (`text-sm` / `text-xs`); avoid wide unbreakable strings.
- Prefer essential columns; hide low-priority columns only if the product already does — don’t invent a second mobile card list unless asked.
- Action icon groups: keep `gap-1.5` and padded buttons so they remain tappable.

## Touch & input

- Inputs: `h-9` or `h-10`, `text-sm` / `text-xs`, full width.
- Avoid `hover:` as the only way to reveal Edit/Delete — icons should be visible.
- Segmented controls / pills: allow `flex-wrap`; don’t force a single non-wrapping row.
- File dropzones: adequate vertical padding (`py-10`+) so they’re easy to tap.

## Figma → mobile adaptation

When implementing a desktop Figma frame:

1. Keep visual language (colors, hierarchy, components).
2. **Recompose** for narrow viewports: stack, wrap, collapse columns.
3. Downscale type to Streamys scale (Figma often shows larger Inter sizes).
4. Never copy absolute positioning or fixed pixel widths from Figma export.
5. Mentally verify at 375 / 768 / 1280 before marking done.

## Anti-patterns

- Desktop-only `grid-cols-4` / `flex-row` without a stacked mobile default
- `whitespace-nowrap` on primary page titles or long labels without truncation plan
- Fixed `w-[751px]`, `w-[1184px]`, or Figma frame widths in CSS
- Tiny click targets (`p-0` icons, `h-6` buttons)
- Critical controls only in `hidden sm:flex` with no mobile equivalent
- Nested overflow that traps the table and causes double scroll / clipped actions
- Relying on hover tooltips for meaning on touch devices

## Related

- Frontend standards: [streamys-frontend](../streamys-frontend/SKILL.md)
- Global utilities: `frontend/src/index.css` (`page-shell`, `page-header`, …)
- Shell: `frontend/src/layouts/` (drawer sidebar, sticky TopBar)
