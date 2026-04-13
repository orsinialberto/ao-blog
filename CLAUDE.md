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

A personal travel blog built with **Next.js 16** (static export), **TypeScript**, **Tailwind CSS**, and **React 19**. All pages are statically generated at build time.

### Routing and i18n

Routes live under `src/app/[locale]/`. Supported locales are `it` (default) and `en`, defined in `src/config/locales.ts`. Every page receives a `locale` param from the URL.

- Server components use `getTranslations(locale)` from `src/i18n/` for UI strings.
- UI strings live in `src/i18n/messages/it.json` and `en.json`.
- Navigation links use `createLocalizedPath()` from `src/lib/i18n/routing.ts` to prepend the locale segment.
- The `LocalizedLink` component wraps `next/link` with locale awareness.

### Content

Travel entries are Markdown files in `src/content/travels/`. Naming convention:
- `[slug].md` → Italian (default)
- `[slug].en.md` → English

**Translated fields** (localized per file): `title`, `description`, `content`, `duration`, `map.points[].description`, `motorcycle`, `motoRegions`.

**Common fields** (identical across language files): `slug`, `date`, `endDate`, `coverImage`, `tags`, `location`, `coords`, `gallery`, `heroTitleVariant`, `totalKilometers`, `motoAlpinePasses`, `motoOnly`, `timeline[].city/km/gpx`, `map.gpx/kml/kmz/points[].name/lat/lng/kind`.

Parsing and caching logic is in `src/lib/travels.ts`. In-memory cache (`travelCache`) is keyed by locale and populated lazily.

### Two content sections

- `/viaggi` — general travel archive. Includes all travels where `motoOnly` is not `true`.
- `/viaggi-in-moto` — motorcycle-only section. Includes travels tagged `moto`.

Travels with `motoOnly: true` appear exclusively in `/viaggi-in-moto` and are excluded from the home highlights, general archive, map, and gallery.

### Map components

Maps use **Leaflet** + **react-leaflet**, which require browser APIs. The pattern used throughout:
- `*Client.tsx` — actual Leaflet component (e.g. `TravelMapClient.tsx`)
- `*Lazy.tsx` — wraps the client component with `next/dynamic` + `ssr: false`
- Server component imports only the `*Lazy` wrapper

GPX/KMZ/KML track files are resolved via `src/lib/trackFileUrl.ts` and `src/lib/gpxTrackClient.ts`. If a `timeline` has per-day `gpx` fields, they are collected into `map.gpxSegments` automatically in `parseTravelFromFile`.

### Images

Images are hosted on Cloudinary. Use `optimizeCloudinaryUrl()` from `src/lib/imageOptimization.ts` when rendering cover images. `next/image` is configured with `unoptimized: true` (required for static export).

### Development principles (from AGENTS.md)

- Keep it simple — avoid overengineering.
- Remove unused code.
- Write code that is easy to read, not clever.
- Prefer clarity over optimization.
- Fail fast and loudly.
- Keep functions small and focused.
