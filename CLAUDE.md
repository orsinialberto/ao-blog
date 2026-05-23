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

**Translated fields** (localized per file): `title`, `description`, `content`, `duration`, `map.points[].description`, `motorcycle`, `motoRegions`.

**Common fields** (identical across language files): `slug`, `date`, `endDate`, `coverImage`, `tags`, `location`, `coords`, `gallery`, `heroTitleVariant`, `totalKilometers`, `motoAlpinePasses`, `motoOnly`, `timeline[].city/km/gpx`, `map.gpx/kml/kmz/points[].name/lat/lng/kind`.

Parsing and caching logic is in `src/lib/travels.ts`. In-memory cache (`travelCache`) is keyed by locale and populated lazily.

Mandatory frontmatter fields: `title`, `date`, `description`, `coverImage`. Missing any of these throws at build time.

#### Image mosaic in Markdown content

Consecutive inline images in the Markdown body are automatically grouped into mosaic layouts by `wrapImageMosaics()` in `src/lib/travels.ts`:
- 1 image → `img-mosaic-single`
- 2 images → `img-mosaic-pair`
- 3+ images → `img-mosaic-trio` (top row 2, overflow below)

#### Motorcycle-specific frontmatter

- `featuredPasses` — array of `{ name, elevationM }` objects; displayed as highlight cards on the route map. Legacy single-object form `featuredPass` is also supported and normalized to an array.
- `motoAlpinePasses` — integer count of passes for aggregate stats.

### Two content sections

- `/viaggi` — general travel archive. Includes all travels where `motoOnly` is not `true`.
- `/viaggi-in-moto` — motorcycle-only section. Includes travels tagged `moto`.

Travels with `motoOnly: true` appear exclusively in `/viaggi-in-moto` and are excluded from the home highlights, general archive, map, and gallery.

### Home page stats

`getTravelStats()` aggregates stats shown on the home page. Countries and continents pull from two sources: travel `location`/`tags` fields **and** `src/config/visitedCities.ts` (a static list of cities with `country`/`continent`). Continent tags are validated against `src/config/continents.ts`.

### Map components

Maps use **Leaflet** + **react-leaflet**, which require browser APIs. The pattern used throughout:
- `*Client.tsx` — actual Leaflet component (e.g. `TravelMapClient.tsx`)
- `*Lazy.tsx` — wraps the client component with `next/dynamic` + `ssr: false`
- Server component imports only the `*Lazy` wrapper

GPX/KMZ/KML track files live in `public/tracks/` and are served as static assets. URLs are resolved via `src/lib/trackFileUrl.ts` and parsed client-side in `src/lib/gpxTrackClient.ts`. If a `timeline` has per-day `gpx` fields, they are collected into `map.gpxSegments` automatically in `parseTravelFromFile`.

### Images

Images are hosted on Cloudinary. Use `optimizeCloudinaryUrl()` from `src/lib/imageOptimization.ts` when rendering cover images. `next/image` is configured with `unoptimized: true` (required for static export).

### Development principles (from AGENTS.md)

- Keep it simple — avoid overengineering.
- Remove unused code.
- Write code that is easy to read, not clever.
- Prefer clarity over optimization.
- Fail fast and loudly.
- Keep functions small and focused.
