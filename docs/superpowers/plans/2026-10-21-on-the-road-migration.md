# On The Road Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the blog's current "on the road" (home banner + `/viaggi-in-moto` + moto frontmatter) with the macOS-Maps-style window from `/Users/albertoorsini/dev/ao-board`, served at `/[locale]/on-the-road/`.

**Architecture:** Three sequential phases, each on its own branch off `main`, each ending with a green `npm run lint && npm run build`. Phase 1 upgrades the blog's stack to match ao-board (no on-the-road change). Phase 2 deletes everything on-the-road related. Phase 3 ports the Maps window, adapting it to static export (`useSearchParams` on the client instead of server `searchParams`) and to the blog's own i18n (`getTranslations(locale)` + `LocalizedLink`, not `next-intl`).

**Tech Stack:** Next 16.3.0, React 19.2.8, Tailwind 4, MapLibre GL 6.3, `react-map-gl` (blog's existing map components; see Task 1 risk), static export (`output: 'export'`, `trailingSlash: true`).

**Spec:** No spec doc. The decisions below were agreed in conversation on 2026-10-21; source of truth for the ported code is `/Users/albertoorsini/dev/ao-board` (its `CLAUDE.md` section "The Maps window" explains every non-obvious constraint).

## Global Constraints

- Project has **no automated tests**. Verification per task = `npm run lint`, `npm run build`, plus the greps / manual browser checks named in the task. Do not add a test framework.
- Blog default locale is `it`; locales `it`/`en`; all URLs end with `/`.
- Static export: no server `searchParams`, no `proxy.ts`/middleware, no `next-intl`. `generateStaticParams` must iterate all locales.
- Maps `MapCanvas` must **never remount**: first child of the window, no `key`, no prop derived from the URL (ao-board constraint, keep it).
- Place ids unique across all routes; coordinates are `[lon, lat]`.
- Every new translation key goes into **both** `src/i18n/messages/it.json` and `en.json` and into `src/i18n/types.ts`.
- Code style (CLAUDE.md / AGENTS.md): simple, small functions, remove unused code, fail loudly.
- Commit after each task. Commit messages end with `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Decisions (agreed)

1. Old on-the-road removed entirely; only the Header button stays, pointing to `/on-the-road/`.
2. Travels tagged `moto` but not `motoOnly` stay in `/viaggi` as normal travels (tag stays, moto-only fields/stats go). The 5 `motoOnly` travels (10 files) are deleted.
3. Home loses the on-the-road banner; no replacement banner. Entry point = Header (and Footer quick link).
4. New page keeps ao-board's look (window + floating panels), rendered inside the blog layout (Header + Footer stay).
5. Content = ao-board's: 15 routes, passes/POI, bikes carousel.
6. Phase 1 (upgrade) is a separate branch/commit series.

## Review Focus

- Static export: `/it/on-the-road/?view=routes&route=<slug>` must work on a statically served build (query read client-side); an unknown `?route=`/`?place=`/`?view=` value must resolve to "nothing selected", not crash.
- Direct load of `/en/on-the-road/` with JS slow: page must not be blank (Suspense fallback / map error line).
- Tailwind 4 regressions on existing pages: default border color, `ring`, `shadow-sm/rounded-sm` rename, custom `container` config, `font-*` custom families.
- MapLibre 6 worker under Turbopack: tracks and vector layers missing (half-drawn map) if `public/maplibre/` is not copied before dev/build.
- Existing blog maps (`TravelDetailMapClient`) after MapLibre 4→6 bump.
- Dangling references after deletion: any import of `components/moto/*`, `getMoto*`, `MotoFeaturedPass`, `onTheRoadSection`, `motorcycleTravels`, `/viaggi-in-moto`.

---

# PHASE 1 — Stack upgrade (branch `chore/upgrade-stack`)

### Task 1: Next, React, MapLibre bump

**Files:**
- Modify: `package.json`, `package-lock.json`
- Modify (only if build demands): `src/components/map/TravelDetailMapClient.tsx`, `src/components/moto/MotoTravelMapPreview.tsx` (the latter is deleted in Phase 2, so fix minimally)

**Interfaces:**
- Produces: blog builds on `next@16.3.0`, `react@19.2.8`, `react-dom@19.2.8`, `eslint-config-next@16.3.0`, `maplibre-gl@^6.3.0`.

- [ ] **Step 1:** `git switch -c chore/upgrade-stack`
- [ ] **Step 2:** `npm i next@16.3.0 react@19.2.8 react-dom@19.2.8 maplibre-gl@^6.3.0 && npm i -D eslint-config-next@16.3.0`
- [ ] **Step 3:** Check `react-map-gl@^8.1.0` peer deps accept maplibre-gl 6 (`npm ls maplibre-gl react-map-gl`). If it does not, STOP and report to the user: the options are bumping `react-map-gl` or porting blog maps off it — that is a decision for them.
- [ ] **Step 4:** `npm run lint && npm run build` → Expected: both pass.
- [ ] **Step 5:** `npm run dev`, open `/it/viaggi/<a slug with a map>/` and `/it/viaggi-in-moto/<slug>/`: map renders with track and markers. If tracks/vector layers are missing, that's the Turbopack worker bug — deferred to Task 8 (worker copy script), note it and move on only if webpack build (`npm run build`) renders them.
- [ ] **Step 6:** Commit `chore: bump next, react and maplibre-gl`.

### Task 2: Tailwind 3 → 4

**Files:**
- Modify: `package.json`; delete `autoprefixer`/`postcss` devDeps if unused afterwards
- Create: `postcss.config.mjs` with `{ plugins: { "@tailwindcss/postcss": {} } }`
- Modify: `src/app/globals.css` (replace `@tailwind base/components/utilities` with `@import "tailwindcss";` and add `@config "../../tailwind.config.ts";`)
- Keep: `tailwind.config.ts` (loaded through `@config`; migrating tokens into `@theme` is out of scope and would widen the blast radius)

**Interfaces:**
- Produces: Tailwind 4 pipeline able to host ao-board's `@theme` tokens and utilities (`color-mix`, `@container`, `@starting-style`) added in Phase 3 to the same `globals.css`.

- [ ] **Step 1:** `npm i -D tailwindcss@^4 @tailwindcss/postcss@^4` ; `npx @tailwindcss/upgrade --dry-run` is NOT available → run `npx @tailwindcss/upgrade` on the branch and review the diff; keep only: `globals.css` import line, `postcss.config.mjs`, class renames it applied in `src/**`. Revert anything that moves tokens out of `tailwind.config.ts`.
- [ ] **Step 2:** In `globals.css` add the v3-compat border rule from the Tailwind v4 upgrade guide so existing `border` utilities keep `currentColor`/gray default:
  ```css
  @layer base {
    *, ::after, ::before, ::backdrop, ::file-selector-button {
      border-color: var(--color-gray-200, currentColor);
    }
  }
  ```
- [ ] **Step 3:** `npm run lint && npm run build` → pass.
- [ ] **Step 4:** Visual regression pass in `npm run dev`, light check at 375px and 1280px, on: `/it/`, `/it/viaggi/`, one `/it/viaggi/<slug>/`, `/it/galleria/`, `/it/privacy/`, cookie banner, mobile Header menu. Compare against `git stash`/`main` in a second tab. Fix drift (usual suspects: `shadow-sm`→`shadow-xs`, `rounded-sm`→`rounded-xs`, `outline-none`→`outline-hidden`, `ring` default width 3px→1px, `container` centering from the JS config).
- [ ] **Step 5:** Commit `chore: migrate to tailwind 4`.

### Task 3: Merge phase 1

- [ ] **Step 1:** Ask the user to review the preview and approve; then `git switch main && git merge --no-ff chore/upgrade-stack`. (Do not merge without approval.)

---

# PHASE 2 — Remove old on-the-road (branch `refactor/remove-old-on-the-road`)

### Task 4: Delete routes, components, content

**Files:**
- Delete: `src/app/[locale]/viaggi-in-moto/` (2 pages), `src/components/moto/` (6 files), `src/components/home/OnTheRoadHomeSection.tsx`
- Delete: the 10 `motoOnly` content files: `milano-cogolo-2025`, `milano-turchino-faiallo-2025`, `passi-svizzeri-2024`, `passo-san-marco-2024`, `passo-del-rombo-pasubio-2025` (each `.md` and `.en.md`) in `src/content/travels/`
- Delete: any `public/tracks/*` and Cloudinary-free assets referenced **only** by those travels (find with `grep -rn "<filename>" src` before deleting each)
- Modify: `src/app/[locale]/page.tsx` (remove import and `<OnTheRoadHomeSection />`)

**Interfaces:**
- Produces: no remaining importer of `components/moto/*` or `OnTheRoadHomeSection`.

- [ ] **Step 1:** `git switch -c refactor/remove-old-on-the-road`
- [ ] **Step 2:** `git rm -r` the paths above; remove the home section from `page.tsx`.
- [ ] **Step 3:** Orphan-track check: for each deleted travel, list its `gpx`/`kml`/`kmz` names (from `git show HEAD:<file>`), delete from `public/tracks/` those not referenced by any remaining `.md`.
- [ ] **Step 4:** Do not build yet (lib still exports moto helpers; Task 5 finishes). Commit `refactor: remove moto routes, components and moto-only travels`.

### Task 5: Strip moto from lib, i18n, shared components

**Files:**
- Modify: `src/lib/travels.ts` — remove `MotoFeaturedPass`, `motorcycle`, `motoRegions`, `featuredPasses`/`featuredPass` parsing (`parseOneFeaturedPass`, `parseFeaturedPasses`), `motoAlpinePasses`, `motoOnly`, `MOTO_TAG`, `isMotoTravel`, `getMotoTravels`, `MotoTravelStats`, `getMotoTravelStats`, `getMotoTravelBySlug`; `isListedInTravelArchive` becomes unnecessary (all travels listed) → remove it and make `getTravelsForArchive` return all sorted travels (update its callers); fix the header doc comment
- Modify: `src/lib/itineraryAccordion.ts` — remove `hasMotoItineraryAccordionItems` (delete the file if nothing else is left)
- Modify: `src/app/[locale]/viaggi/[slug]/page.tsx` — related pool always `getTravelsForArchive`-based; drop `getMotoTravels`/`motoOnly` branch
- Modify: `src/components/RelatedWaypoints.tsx` — drop the "detail base" prop if only moto used it
- Modify: `src/components/TravelTabs.tsx` — drop the "map not repeated in Itinerary" prop if only moto used it
- Modify: `src/components/Header.tsx` — `isActive` special case for `/viaggi-in-moto` removed; link `{ href: "/on-the-road", label: t.navigation.links.onTheRoad }`
- Modify: `src/components/Footer.tsx` — quick link → `/on-the-road` with `t.footer.quickLinks.onTheRoad`
- Modify: `src/i18n/types.ts`, `messages/it.json`, `messages/en.json` — remove `components.onTheRoadSection`, `components.motoTravel`, `pages.motorcycleTravels` (whichever namespace holds it); rename `navigation.links.motorcycleTravels` → `onTheRoad`, `footer.quickLinks.motorcycleTravels` → `onTheRoad` (values: it "On the road", en "On the road")
- Modify: remaining `src/content/travels/*.md` — remove frontmatter keys `motorcycle`, `motoRegions`, `featuredPass(es)`, `motoAlpinePasses`, `motoOnly` (`grep -ln` first; keep tag `moto`)
- Modify: `CLAUDE.md` — delete "Two content sections", moto frontmatter notes, `motoOnly` rules, and `*Client`/`*Lazy` Leaflet wording stays only if still true; update "Common/Translated fields" lists

**Interfaces:**
- Produces: `t.navigation.links.onTheRoad: string`, `t.footer.quickLinks.onTheRoad: string` (consumed by Task 11).

- [ ] **Step 1:** Make the edits above. Pattern: remove symbol, then `npx tsc --noEmit` and fix each reported importer.
- [ ] **Step 2:** `grep -rniE "moto|viaggi-in-moto|onTheRoadSection" src CLAUDE.md` → Expected: only the `moto` tag in content frontmatter and, in `Header`/`Footer`, nothing named "moto". Investigate every other hit.
- [ ] **Step 3:** `npm run lint && npm run build` → pass. Header/Footer link to `/on-the-road/` which 404s until Phase 3 (acceptable on this branch only).
- [ ] **Step 4:** Browser check: `/it/`, `/it/viaggi/` (previously moto-tagged non-`motoOnly` travels still appear, no `motoOnly` ones), one remaining moto-tagged travel detail page renders without moto widgets.
- [ ] **Step 5:** Commit `refactor: remove moto fields, stats and i18n`. Ask user to approve, then merge to `main`.

---

# PHASE 3 — Port the Maps window (branch `feat/on-the-road-maps`)

### Task 6: Copy data, config and static assets

**Files (create, copied from `/Users/albertoorsini/dev/ao-board`, same relative paths unless noted):**
- `src/data/routes/*` (15 route `.ts`, 15 `.track.json`, `index.ts`, `track.ts`, `types.ts`)
- `src/config/bikes.ts`, `src/config/map.ts`, `src/config/on-the-road-nav.ts`
- `src/lib/track.ts` (no name collision with the blog's `gpxTrackClient.ts` / `trackFileUrl.ts`)
- `src/lib/cloudinary.ts` → only `cloudinaryUrlFromPath(path: string, width: number): string` is used by maps; copy that function (and the base-URL constant it needs) into `src/lib/imageOptimization.ts` next to `optimizeCloudinaryUrl`. The bike photos live in ao-board's Cloudinary account: keep ao-board's cloud name from `src/config/gallery.ts`, do not substitute the blog's (`dx6hrvg6l`).
- `scripts/copy-maplibre-worker.mjs`, `scripts/import-track.mjs`
- `public/moto-sticker.png` (used by `useStickerRide`); NOT `on-the-road-plate.png`, `cork-board.webp`, `notebook.webp`, `world-map.webp`

**Interfaces:**
- Produces: `ROUTES`, `ALL_PLACES`, `findRoute(slug?: string): Route | undefined`, `findPlace(id?: string): Place | undefined` from `@/data/routes`; `bikes: Bike[]`; `findView(value?: string): OnTheRoadView | undefined`, `ON_THE_ROAD_VIEWS`; `MAP_STYLE_URL`, `MAP_INITIAL_VIEW`, `MAP_ZOOM_RANGE`, `TRACK_PAINT`, `RIDE_DURATION_MS`; `cloudinaryUrlFromPath`.

- [ ] **Step 1:** `git switch -c feat/on-the-road-maps`; copy files with `cp -R`/`cp` (not retyped).
- [ ] **Step 2:** `package.json` scripts: add `"predev": "node scripts/copy-maplibre-worker.mjs"`, `"prebuild": "node scripts/copy-maplibre-worker.mjs"`, `"track:import": "node scripts/import-track.mjs"`; add `/public/maplibre/` to `.gitignore`.
- [ ] **Step 3:** `npx tsc --noEmit` → pass for the new files (imports use `@/…`, which the blog's tsconfig already maps).
- [ ] **Step 4:** Commit `feat: add on-the-road route data, config and scripts`.

### Task 7: Translations

**Files:**
- Modify: `src/i18n/types.ts` — add top-level `onTheRoad` namespace typed from ao-board's `messages/en.json` `onTheRoad` object (copy its shape: `mapLabel`, `mapError`, `closePanel`, `nav: Record<OnTheRoadView, string>`, `routes: Record<RouteSlug, {…}>`, `bikes: Record<BikeId, {name, caption, text}>`, everything else in that object). `title` is not rendered anymore (ao-board spec) — drop it.
- Modify: `src/i18n/messages/it.json`, `en.json` — copy the `onTheRoad` object from the ao-board file of the same locale
- Not copied: `board.*`, `finder.*`, `gallery.*`, `localeSwitcher`

**Interfaces:**
- Consumes: `OnTheRoadView` (Task 6), route slugs from `ROUTES`, bike ids from `bikes`.
- Produces: `getTranslations(locale).onTheRoad` fully typed.

- [ ] **Step 1:** Copy the two objects; write the type; type `routes` as `Record<(typeof ROUTES)[number]["slug"], …>` so a missing route title fails the build (fail loud), same for `bikes` ids.
- [ ] **Step 2:** `npx tsc --noEmit` → pass.
- [ ] **Step 3:** Commit `feat: add on-the-road translations`.

### Task 8: Port components

**Files (create, copied from ao-board then adapted):**
- `src/components/maps/` — all 11 files (`MapCanvas.tsx`, `MapsWindow.tsx`, `MapsSidebar.tsx`, `MapsPanel.tsx`, `RouteList.tsx`, `PlaceList.tsx`, `InfoBlock.tsx`, `InfoCarousel.tsx`, `useRouteLayers.ts`, `useStickerRide.ts`, `icons.tsx`, `pin-glyphs.ts`)
- `src/components/window/WindowShell.tsx`, `TrafficLights.tsx`

**Adaptation rules (the only changes allowed):**
- `import { getTranslations } from 'next-intl/server'` + `await getTranslations('onTheRoad')` → `import { getTranslations } from "@/i18n"` + `const t = getTranslations(locale).onTheRoad`; components that were async server components now take a `locale: SupportedLocale` prop. Dynamic keys (`t(\`nav.${view}\`)`) become `t.nav[view]`, `t.routes[slug]`, `t.bikes[id]`.
- `import { Link } from '@/i18n/navigation'` → `LocalizedLink` from `@/components/LocalizedLink` (supports `?query` hrefs; hrefs stay `/on-the-road?view=…`, **add `scroll={false}` where ao-board's Link relied on no-scroll behavior**, check each).
- Server components that read `searchParams` (`RouteList` `selected`, `PlaceList` `selected`, `MapsSidebar` `active`, `MapsPanel`) are replaced by one client wrapper: `src/components/maps/MapsPanels.tsx` (`"use client"`), props `{ locale }`, reading `useSearchParams()` and computing `view = findView(params.get("view") ?? undefined)`, `route = findRoute(...)`, `place = findPlace(...)` — the same logic as ao-board's `page.tsx`, moved here. Sub-components that need only a selected id get it as a prop from this wrapper (keep them presentational).
- `MapsWindow` renders `<MapCanvas />` first with no URL-derived props and wraps `<MapsPanels />` in `<Suspense fallback={null}>` (required by `useSearchParams` under static export). It stays a server component taking `locale`.
- `WindowShell`: replace `h-dvh` / `md:h-[88dvh]` sizing with height relative to the blog header: outer `<div>` (not `<main>`, the blog layout already provides `<main>`) `h-[calc(100dvh-var(--header-height))] md:h-[calc(88dvh-var(--header-height)/2)]`; adjust until the window fits between Header and Footer without double scroll. The blog's `MainWrapper` adds `pt-[var(--header-height)] pb-16` for non-home pages; keep it.
- `TrafficLights` red dot: href `/` via `LocalizedLink` (home of the blog).
- Fonts: ao-board uses Noto Sans/Courier Prime; the blog's `font-body`/`font-label` apply. Do not add new fonts; swap any `font-sans`/`font-mono` usage for the blog's families if the look is off.
- `MapCanvas`: keep `import('maplibre-gl')` inside the effect and `setWorkerUrl('/maplibre/maplibre-gl-worker.mjs')` exactly as in ao-board. The blog's `trailingSlash`/`basePath` do not affect `public/` URLs.

**Interfaces:**
- Consumes: Tasks 6–7 exports.
- Produces: `MapsWindow({ locale }: { locale: SupportedLocale })` default export (server component) from `@/components/maps/MapsWindow`.

- [ ] **Step 1:** `cp` the files; apply the adaptation rules file by file.
- [ ] **Step 2:** `grep -rn "next-intl\|@/i18n/navigation\|searchParams" src/components/maps src/components/window` → Expected: no matches (except `useSearchParams` in `MapCanvas.tsx` and `MapsPanels.tsx`).
- [ ] **Step 3:** `npx tsc --noEmit && npm run lint` → pass.
- [ ] **Step 4:** Commit `feat: port maps window components`.

### Task 9: Styles

**Files:**
- Modify: `src/app/globals.css` — append from ao-board `src/app/globals.css` only the blocks the Maps window uses, in this order: `@theme` additions (rename to avoid collisions: `--color-panel`, `--color-panel-shadow`, `--color-pin-pass`, `--color-pin-pass-soft`, `--color-plate-blue`, `--color-board`, `--color-ink`, `--ease-out-strong`, `--ease-spring-*` as used), `.maplibregl-map` / `.maplibregl-ctrl-*` / `.maplibregl-popup*` overrides, `.panel-glass`, `.panel-enter`, `.window-enter`, `.row-press`, `.map-pin*`, `.moto-rider`, the `:has(> section[aria-labelledby='maps-panel-title'])` control-margin rules, and the `@starting-style` / `prefers-reduced-motion` blocks that belong to those classes
- Do NOT copy: `.board-item`, board grid/paper-grain `body::before`, `.react-photo-album*`, `.photo-fade`, `body` rules, `@theme` fonts, `--board-cell`

- [ ] **Step 1:** Read ao-board `globals.css` fully, copy only the blocks listed; check that `--color-board`/`--color-ink` do not clash with the blog's `brand-*` tokens (they don't today).
- [ ] **Step 2:** If Tailwind 4 `@theme` utilities (`bg-board`, `border-ink/15`, `text-ink-soft`, `bg-plate-blue`) are used by ported components, confirm they compile (they come from the `@theme` additions).
- [ ] **Step 3:** `npm run lint && npm run build` → pass.
- [ ] **Step 4:** Commit `feat: add maps window styles`.

### Task 10: Page

**Files:**
- Create: `src/app/[locale]/on-the-road/page.tsx` — `generateStaticParams` over `supportedLocales` (pattern: `src/app/[locale]/viaggi/[slug]/page.tsx`), `generateMetadata` (title/description from `t.onTheRoad`, alternates via `getAlternateLanguageLinks("/on-the-road")` as other pages do), default export renders `<MapsWindow locale={locale} />`
- Modify: `src/i18n/types.ts`, `it.json`, `en.json` — add `onTheRoad.metaTitle`, `onTheRoad.metaDescription`
- Modify (if exists): sitemap/robots generation to include `/on-the-road/`

**Interfaces:**
- Consumes: `MapsWindow({ locale })`.

- [ ] **Step 1:** Write the page following an existing page's metadata pattern (`src/app/[locale]/galleria/page.tsx`).
- [ ] **Step 2:** `npm run build` → Expected: `/it/on-the-road/` and `/en/on-the-road/` appear in the exported routes; `out/it/on-the-road/index.html` exists.
- [ ] **Step 3:** Commit `feat: add on-the-road page`.

### Task 11: End-to-end verification and docs

**Files:**
- Modify: `CLAUDE.md` — add "On the road" section: route `/[locale]/on-the-road/`, `?view=`/`?route=`/`?place=` read client-side (static export), `MapCanvas` never remounts, worker copy script (`public/maplibre/` gitignored), `src/data/routes/` + `npm run track:import` workflow with the `onTheRoad.routes.<slug>` rule, bikes config, tiles from OpenFreeMap + attribution must stay visible. Port the relevant paragraphs from ao-board's CLAUDE.md, trimmed.

- [ ] **Step 1:** `npm run build && npx serve out` (or `npx http-server out`): load `/it/on-the-road/`, `/en/on-the-road/`; map draws vector tiles and faint tracks (confirms the worker copy works in the static build).
- [ ] **Step 2:** In that static build, click through: sidebar → Routes → pick a route (URL gets `?view=routes&route=<slug>`, map flies and moto sticker rides, **map does not reset between clicks**), Passes → pick a pass (camera flies, no ride), Saved, Info carousel. Reload on a deep link `?view=routes&route=crocedomini`: selection restored.
- [ ] **Step 3:** Bad input: `?view=zzz`, `?route=zzz`, `?place=zzz` → no panel / nothing selected, no crash.
- [ ] **Step 4:** Responsive: 375px (bottom sheet + floating traffic lights pill), 768px, 1440px; Header and Footer visible and not overlapping the window.
- [ ] **Step 5:** Header button highlights on `/on-the-road/`; Footer quick link works; red traffic light goes to `/it/` and `/en/` respectively; language switcher keeps the query string (if it drops it, fix in `LanguageSwitcher.tsx` only if trivial, else report).
- [ ] **Step 6:** Block tiles: DevTools offline for `tiles.openfreemap.org` before first load → the translated `mapError` line shows, not a blank window.
- [ ] **Step 7:** `grep -rniE "viaggi-in-moto|next-intl" src package.json` → no matches. `npm run lint && npm run build` → pass.
- [ ] **Step 8:** Commit `docs: document on-the-road section`; ask user to review; merge to `main`.
