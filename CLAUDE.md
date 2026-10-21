# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Static export to /out (Next.js output: 'export')
npm run lint     # ESLint
```

There are no automated tests.

## Architecture

A personal travel blog built with **Next.js 16** (static export), **TypeScript**, **Tailwind CSS**, and **React 19**. All pages are statically generated at build time. `trailingSlash: true` is set — all URLs end with `/`.

### Routing and i18n

Routes live under `src/app/[locale]/`. Supported locales are `it` (default) and `en`, defined in `src/config/locales.ts`. Every page receives a `locale` param from the URL.

- Server components use `getTranslations(locale)` from `src/i18n/` for UI strings.
- UI strings live in `src/i18n/messages/it.json` and `en.json`.
- Navigation links use `createLocalizedPath()` from `src/lib/i18n/routing.ts` to prepend the locale segment.
- The `LocalizedLink` component wraps `next/link` with locale awareness.

Every `[locale]/[slug]/page.tsx` must export `generateStaticParams` that iterates all locales × all slugs (see `src/app/[locale]/viaggi/[slug]/page.tsx` for the pattern).

### Content

Travel entries are Markdown files in `src/content/travels/`. Naming convention:
- `[slug].md` → Italian (default)
- `[slug].en.md` → English

**Translated fields** (localized per file): `title`, `description`, `content`, `duration`, `map.points[].description`.

**Common fields** (identical across language files): `slug`, `date`, `endDate`, `coverImage`, `tags`, `location`, `coords`, `gallery`, `heroTitleVariant`, `totalKilometers`, `timeline[].city/km/gpx`, `map.gpx/kml/kmz/points[].name/lat/lng/kind`.

Parsing and caching logic is in `src/lib/travels.ts`. In-memory cache (`travelCache`) is keyed by locale and populated lazily.

Mandatory frontmatter fields: `title`, `date`, `description`, `coverImage`. Missing any of these throws at build time.

#### Image mosaic in Markdown content

Consecutive inline images in the Markdown body are automatically grouped into mosaic layouts by `wrapImageMosaics()` in `src/lib/travels.ts`:
- 1 image → `img-mosaic-single`
- 2 images → `img-mosaic-pair`
- 3+ images → `img-mosaic-trio` (top row 2, overflow below)

### Home page stats

`getTravelStats()` aggregates stats shown on the home page. Countries and continents pull from two sources: travel `location`/`tags` fields **and** `src/config/visitedCities.ts` (a static list of cities with `country`/`continent`). Continent tags are validated against `src/config/continents.ts`.

### Map components

Maps use **MapLibre GL** + **react-map-gl**, which require browser APIs. The pattern used throughout:
- `*Client.tsx` — actual Leaflet component (e.g. `TravelMapClient.tsx`)
- `*Lazy.tsx` — wraps the client component with `next/dynamic` + `ssr: false`
- Server component imports only the `*Lazy` wrapper

GPX/KMZ/KML track files live in `public/tracks/` and are served as static assets. URLs are resolved via `src/lib/trackFileUrl.ts` and parsed client-side in `src/lib/gpxTrackClient.ts`. If a `timeline` has per-day `gpx` fields, they are collected into `map.gpxSegments` automatically in `parseTravelFromFile`.

### On the road

`/[locale]/on-the-road/` is a macOS Maps-style window (`src/components/maps/`): a full-bleed MapLibre map with floating panels (saved places, routes, passes, info carousel of bikes).

- State lives in the URL: `?view=`, `?route=`, `?place=`. With a static export there is no server-side `searchParams`, so `MapsPanels` and `MapCanvas` read them client-side with `useSearchParams`; unknown values mean "nothing selected". `config/on-the-road-nav.ts` is the list and allow-list of views.
- **`MapCanvas` must never remount:** it is the first child of `MapsWindow`, has its own `Suspense`, no `key`, and no prop derived from the URL. It imports `maplibre-gl` lazily inside its effect, so hooks that need the library take it as an argument.
- MapLibre's worker is copied out of `node_modules` into `public/maplibre/` by `scripts/copy-maplibre-worker.mjs` (run at `predev`/`prebuild`; the folder is gitignored and ignored by eslint) and `MapCanvas` calls `setWorkerUrl`. Without it Turbopack breaks the worker URL and the map is half drawn (no vector tiles, no tracks).
- Tiles come from OpenFreeMap (`src/config/map.ts`), no API key. The OSM/OpenFreeMap attribution must stay visible. If the map fails before first load, a translated `mapError` line replaces it.
- Routes live in `src/data/routes/` (one module per trip, `satisfies Route`, coordinates `[lon, lat]`, registered in `index.ts`). **Adding a trip**: `npm run track:import <file> <slug>` writes `<slug>.track.json` (simplified), then write `<slug>.ts` (`trackFrom()`, `slug`, `km`, `places`), add one import in `index.ts`, and add `onTheRoad.routes.<slug>` to **both** `it.json` and `en.json`. Routes and bikes are typed `Record<string, ...>`, so the compiler cannot see a missing translation; `assertOnTheRoadTranslations()` (`src/components/maps/assertTranslations.ts`, called from the page's `generateStaticParams`) fails the build naming the missing key and locale.
- Bikes for the Info carousel are in `src/config/bikes.ts`; each needs `onTheRoad.bikes.<id>.{name,caption,text}` in both message files.
- Message strings use `{km}`, `{m}`, `{name}` placeholders, substituted by `fill()` in `src/components/maps/format.ts`.
- Styles are at the end of `src/app/globals.css`; MapLibre overrides are scoped under `.maps-window` so `TravelDetailMapClient` is unaffected. Tailwind 4 is loaded with `@config` (`tailwind.config.ts` is kept) plus `@utility container`.

### Images

Images are hosted on Cloudinary. Use `optimizeCloudinaryUrl()` from `src/lib/imageOptimization.ts` when rendering cover images. `next/image` is configured with `unoptimized: true` (required for static export).

### Development principles (from AGENTS.md)

- Keep it simple — avoid overengineering.
- Remove unused code.
- Write code that is easy to read, not clever.
- Prefer clarity over optimization.
- Fail fast and loudly.
- Keep functions small and focused.
