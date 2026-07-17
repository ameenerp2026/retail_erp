---
name: streamys-frontend
description: >-
  Streamys retail ERP frontend standards — DRY, scalable module structure,
  typography, responsive layout, Figma design-to-code, React Query data layer,
  and shared UI patterns. Use when building or editing frontend pages,
  components, modules, styles, routes, or when implementing Figma designs in
  retail_erp/frontend.
---

# Streamys Frontend Standards

Apply this skill for all work under `frontend/`. Prefer existing shared pieces over new one-offs.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 (`index.css` `@theme` + utility classes)
- React Router, TanStack Query, Axios
- Ant Design only for dense tables (`ReusableTable`); prefer Tailwind elsewhere
- Icons: `lucide-react`

## Scalable folder structure

```
src/
  modules/<Domain>/          # feature modules (Organization, Finance, dashboard, auth)
    pages/                   # route-level screens only
    components/              # domain-specific UI
  components/shared/         # cross-module UI (tables, cards, filters, drawers)
  components/forms/          # form fields + zod schemas
  config/                    # nav, card configs, filter field defs
  hooks/                     # reusable hooks
  services/                  # API clients (one file per domain)
  types/                     # shared domain types
  mocks/                     # DEV mock data only
  layouts/                   # shell (Sidebar, TopBar, DashBoardLayout)
```

**Rules**
- One page file per route; keep pages thin (compose components + hooks).
- Domain components stay under `modules/<Domain>/components/`.
- If used by 2+ modules → move to `components/shared/` or `hooks/`.
- Config maps (icons, colors, filter fields) live in `config/`, not inline in JSX.

## Data layer (mock vs API) — required pattern

```
Page / Component
  → useQuery({ queryFn: someService.method })
    → services/someService.ts
      → fromMockOrApi(MOCK_*, () => apiClient.get(...))
        → mocks/*.mock.ts     when VITE_USE_MOCKS=true
        → real backend        when VITE_USE_MOCKS=false
```

**Rules**
1. **Never import `@/mocks/*` from pages or components.** Only services may import mocks.
2. Put all sample/domain values in `src/mocks/<domain>.mock.ts`.
3. Every service method uses `fromMockOrApi` from `services/dataSource.ts`.
4. Toggle with env (see `frontend/.env.example`):
   - `VITE_USE_MOCKS=true` → mocks (DEV default)
   - `VITE_USE_MOCKS=false` → real API via `VITE_API_BASE_URL`
5. When adding a backend endpoint later: keep the service method signature; only fill the API branch — UI stays unchanged.

### New feature checklist
- [ ] Add types in `types/`
- [ ] Add `MOCK_*` in `mocks/`
- [ ] Add/extend `services/*Service.ts` with `fromMockOrApi`
- [ ] Wire UI with `useQuery` + service (no hardcoded arrays)

## DRY checklist (required)

Before adding code, check:

1. **Layout / padding** — use `page-shell`, `page-header`, `page-title`, `page-subtitle`, `page-actions`, `section-card`, `section-title`, `stat-value` from `index.css`. Do not re-add `p-6 bg-slate-50 min-h-screen` on pages (layout already pads).
2. **Tables** — `ReusableTable` + column factory functions (`getXColumns`).
3. **Status** — `StatusTag` only; extend `StatusType` in `StatusTags.tsx` when needed.
4. **Stats** — reuse `StatCards` / `SimpleStatCard` / domain `*StatCards` with `config/*CardConfig`.
5. **Filters** — `FilterBar` + `config/filterConfig` or a local filter bar when Figma needs custom controls (status tabs). Extract shared bits if duplicated.
6. **Data** — `services/*` + `useQuery` + `fromMockOrApi` (never hardcode lists in UI).
7. **Types** — define in `types/`; do not duplicate interfaces in page files.

## Typography scale (do not inflate)

| Role | Class / size |
|------|----------------|
| Body | 14px (global) |
| Page title | `page-title` → `text-lg` |
| Page subtitle | `page-subtitle` → `text-xs` / `sm:text-sm` |
| Section title | `section-title` → `text-sm` |
| Stat value | `stat-value` → `text-xl` |
| Table / labels | `text-sm` / `text-xs` |

Font: **Plus Jakarta Sans** only (via `--font-sans`). No Inter/Manrope/ad-hoc `font-['...']`.

## Responsive / mobile

**Required:** follow [streamys-mobile](../streamys-mobile/SKILL.md) for every UI screen.

- Shell: mobile drawer sidebar + sticky top bar (already in layouts).
- Pages: stack headers (`page-header`), wrap actions, `overflow-x-auto` on tables.
- Grids: `grid-cols-1` / `2` → `lg:` / `xl:` for wide layouts.
- Side panels: stack under table on `< xl`.
- Mobile-first only — never ship desktop-only layouts.

## Design-to-code (Figma)

1. Load Figma design-to-code skill; call `get_design_context` with `skillNames: "figma-design-to-code"`.
2. Treat output as reference — adapt to Streamys stack and shared components.
3. Match Streamys tokens: brand `#043793`, surface `#F1F5F9`, Plus Jakarta, standard type scale (Figma may show larger Inter sizes — downscale to our scale).
4. Reuse icons from `lucide-react` when glyphs match; otherwise download Figma assets for commit.

## Page template

```tsx
export default function ExamplePage() {
  const { data = [], isLoading } = useQuery({ queryKey: ['example'], queryFn: exampleService.list })
  if (isLoading) return <div className="page-shell text-sm text-slate-500">Loading...</div>

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1 className="page-title">Title</h1>
          <p className="page-subtitle">One-line description</p>
        </div>
        <div className="page-actions">{/* primary actions */}</div>
      </div>
      {/* stats → filters → table / content */}
    </div>
  )
}
```

## Anti-patterns

- Copy-pasting card/table markup instead of shared components
- Hardcoded mock arrays inside page components (use `mocks/` + service)
- Importing `@/mocks` from UI files
- Fixed `ml-72` / desktop-only layouts in new screens
- Oversized titles (`text-2xl`+ for page titles, `text-3xl` for KPI numbers)
- Mixing UI libraries for the same pattern (e.g. custom table + Ant table for same screen)
- Scattering `VITE_USE_MOCKS` checks inside components (keep them only in services via `fromMockOrApi`)

## Related reference

- Routes: `src/routes/routes.tsx`
- Nav tabs: `src/config/navigationConfig.tsx`
- Global styles: `src/index.css`
