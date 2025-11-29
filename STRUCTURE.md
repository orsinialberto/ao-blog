# Documentazione Struttura Progetto

## Panoramica

Questo è un blog di viaggi personale costruito con **Next.js 16** (App Router), **TypeScript** e **Tailwind CSS**. Il sito utilizza la generazione statica (Static Site Generation) per massimizzare le performance e può essere deployato su qualsiasi hosting statico.

**URL di produzione**: https://albertorsini.it

## Stack Tecnologico

### Core
- **Next.js 16.0.3** - Framework React con App Router
- **React 19.2.0** - Libreria UI
- **TypeScript 5** - Type safety e sviluppo

### Styling
- **Tailwind CSS 3.4.18** - Utility-first CSS framework
- **Google Fonts** - Font personalizzati:
  - Geist (sans-serif principale)
  - Geist Mono (monospace)
  - Comforter (display/titoli)
  - Klee One (body alternativo)
  - Poiret One (decorativo)

### Contenuti
- **gray-matter** - Parsing frontmatter YAML da Markdown
- **remark** - Processore Markdown
- **remark-html** - Conversione Markdown → HTML
- **remark-breaks** - Supporto line breaks

### Mappe
- **Leaflet 1.9.4** - Libreria mappe open-source
- **react-leaflet 5.0.0** - Wrapper React per Leaflet
- **@tmcw/togeojson** - Conversione GPX/KML/KMZ → GeoJSON
- **jszip** - Estrazione file KMZ

### Build & Deploy
- **Static Export** (`output: 'export'`) - Generazione sito statico
- **Vercel** - Hosting e deployment automatico

## Struttura Directory

```
blog/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Layout root con Header/Footer
│   │   ├── page.tsx                  # Homepage (/)
│   │   ├── globals.css               # Stili globali Tailwind
│   │   ├── favicon.ico               # Favicon
│   │   ├── about/
│   │   │   └── page.tsx              # Pagina "Chi sono" (/about)
│   │   └── viaggi/                   # Sezione viaggi
│   │       ├── page.tsx              # Lista tutti i viaggi (/viaggi)
│   │       └── [slug]/                # Route dinamica
│   │           └── page.tsx           # Dettaglio singolo viaggio
│   │
│   ├── components/                    # Componenti React riutilizzabili
│   │   ├── Header.tsx                 # Header sticky con navigazione
│   │   ├── Footer.tsx                 # Footer
│   │   ├── TravelCard.tsx             # Card per griglia viaggi
│   │   ├── TravelGallery.tsx         # Galleria fotografica
│   │   ├── TravelMap.tsx              # Mappa globale (wrapper)
│   │   ├── TravelDetailMap.tsx        # Mappa dettaglio viaggio (wrapper)
│   │   ├── TravelTimeline.tsx         # Timeline città/tappe
│   │   ├── TagFilter.tsx              # Componente filtro tag
│   │   ├── TravelsListClient.tsx      # Lista client-side con filtri
│   │   └── map/                       # Componenti mappa Leaflet
│   │       ├── TravelMapClient.tsx    # Mappa globale (client)
│   │       ├── TravelMapLazy.tsx      # Lazy wrapper mappa globale
│   │       ├── TravelDetailMapClient.tsx  # Mappa dettaglio (client)
│   │       ├── TravelDetailMapLazy.tsx    # Lazy wrapper mappa dettaglio
│   │       └── markerIcon.ts          # Icone marker personalizzate
│   │
│   ├── lib/                           # Utility e logica business
│   │   ├── travels.ts                 # Parsing Markdown, cache, filtri
│   │   ├── dates.ts                   # Formattazione date
│   │   └── paths.ts                   # Utility path (withBasePath)
│   │
│   └── content/                       # Contenuti Markdown
│       └── travels/                    # File .md per ogni viaggio
│           ├── cambogia-2025.md
│           ├── cammino-dei-borghi-silenti-2025.md
│           ├── fishermens-trail-2024.md
│           └── italia-on-the-road-2024.md
│
├── public/                            # Asset statici
│   ├── images/                        # Immagini
│   │   ├── home-hero.jpg              # Hero homepage
│   │   └── profile.jpg                 # Foto profilo
│   ├── tracks/                        # File tracce GPS
│   │   ├── cammino-dei-borghi-silenti.gpx
│   │   ├── fishermen-trail.gpx
│   │   └── italia-on-the-road.kmz
│   └── [altri asset SVG, favicon, ecc.]
│
├── out/                               # Build statico generato (gitignored)
│
├── package.json                       # Dipendenze e scripts
├── tsconfig.json                      # Configurazione TypeScript
├── tailwind.config.ts                 # Configurazione Tailwind
├── next.config.ts                     # Configurazione Next.js
├── postcss.config.js                  # Configurazione PostCSS
├── eslint.config.mjs                  # Configurazione ESLint
├── PROJECT_SPECS.md                   # Specifiche progetto originali
└── README.md                          # README standard Next.js
```

## Architettura e Pattern

### 1. Content Management

Il sistema di contenuti è basato su **file Markdown** con frontmatter YAML:

- **Posizione**: `src/content/travels/*.md`
- **Parsing**: `gray-matter` estrae frontmatter e contenuto
- **Rendering**: `remark` converte Markdown in HTML
- **Cache**: Cache in-memory per performance (singleton pattern)

#### Formato File Markdown

```markdown
---
title: "Titolo del Viaggio"
slug: "cambogia-2025"
date: "2025-06-02"
endDate: "2025-06-15"
description: "Breve descrizione"
coverImage: "https://res.cloudinary.com/..."
heroTitleVariant: "light" | "dark"
tags:
  - Cambogia
  - Asia
location: "Cambogia"
duration: "14 giorni"
totalKilometers: 1200
coords:
  lat: 13.3633
  lng: 103.8564
map:
  gpx: "/tracks/track.gpx"        # Opzionale
  kml: "/tracks/track.kml"         # Opzionale
  kmz: "/tracks/track.kmz"         # Opzionale
  points:                          # Opzionale
    - name: "Phnom Penh"
      lat: 11.5564
      lng: 104.9282
      description: "..."
timeline:                           # Opzionale
  - city: "Phnom Penh"
    km: 0
  - city: "Siem Reap"
    km: 300
gallery:                            # Opzionale
  - "https://res.cloudinary.com/..."
  - "https://res.cloudinary.com/..."

---

# Contenuto Markdown

Il contenuto del viaggio scritto in Markdown...
```

### 2. Routing e Generazione Statica

- **App Router**: Utilizza il nuovo App Router di Next.js 16
- **Static Generation**: Tutte le pagine sono pre-generate a build time
- **Dynamic Routes**: `/viaggi/[slug]` con `generateStaticParams()`
- **Metadata**: Metadata dinamiche per SEO (Open Graph, etc.)

### 3. Componenti

#### Server Components (default)
- Tutte le pagine (`page.tsx`)
- Layout (`layout.tsx`)
- Componenti che non richiedono interattività

#### Client Components (`"use client"`)
- `Header.tsx` - Menu mobile, navigazione attiva
- `TravelsListClient.tsx` - Filtri tag client-side
- Componenti mappa (`TravelMapClient`, `TravelDetailMapClient`)

#### Pattern Lazy Loading
- Mappe caricate on-demand con `dynamic()` import
- Wrapper `*Lazy.tsx` per evitare bundle size iniziale

### 4. Design System

#### Palette Colori (Tailwind)
```typescript
brand: {
  background: "#f7f7f5",    // Sfondo principale
  primary: "#0f172a",       // Testo principale
  secondary: "#334155",     // Testo secondario
  accent: "#14b8a6",        // Accenti (teal)
  muted: "#475569",         // Testo muted
}
```

#### Font
- **Sans**: Geist (default)
- **Display**: Comforter (titoli hero)
- **Body**: Klee One (testi alternativi)
- **Decorative**: Poiret One

#### Utilities
- `shadow-card`: Ombra personalizzata per card
- `rounded-3xl`, `rounded-[40px]`: Bordi arrotondati
- Container responsive con padding

## Funzionalità Implementate

### Homepage (`/`)

**Componenti**:
- Hero section full-width con immagine di sfondo
- Highlights: ultimi 3 viaggi in griglia
- Mappa globale interattiva con tutti i viaggi
- CTA verso `/viaggi` e `/about`

**Caratteristiche**:
- Immagine hero ottimizzata con `next/image`
- Gradient overlay per leggibilità testo
- Animazioni fade-in
- Design responsive mobile-first

### Lista Viaggi (`/viaggi`)

**Componenti**:
- Header con titolo e descrizione
- `TravelsListClient`: griglia responsive di card
- `TagFilter`: filtri per tag (client-side)
- Ordinamento automatico per data (più recenti prima)

**Funzionalità**:
- Filtro per tag tramite query parameter `?tag=...`
- Navigazione tra viaggi
- Card con cover, metadata, tag cliccabili

### Dettaglio Viaggio (`/viaggi/[slug]`)

**Sezioni**:
1. **Hero**: Cover image con titolo e location
2. **Metadata**: Date, durata, location, km totali
3. **Tag**: Tag cliccabili per filtrare
4. **Timeline**: Timeline città/tappe (se presente)
5. **Contenuto**: Markdown renderizzato in HTML
6. **Galleria**: Grid di immagini (se presente)
7. **Mappa**: Mappa interattiva con punti/tracce (se presente)
8. **Navigazione**: Link viaggio precedente/successivo

**Generazione Statica**:
- `generateStaticParams()` pre-genera tutte le pagine
- Metadata dinamiche per SEO
- Open Graph tags per social sharing

### Pagina About (`/about`)

- Presentazione personale
- Motivazione del blog
- (Eventuali contatti/social)

### Componenti Comuni

#### Header
- Sticky header con backdrop blur
- Logo "Diario di Viaggio"
- Menu navigazione: Home, Viaggi, Chi sono
- Menu mobile hamburger
- Highlight pagina attiva

#### Footer
- Copyright e link essenziali

## Dettagli Tecnici

### Configurazione Next.js

```typescript
// next.config.ts
{
  output: 'export',              // Static export
  images: {
    unoptimized: true,           // Necessario per static export
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { hostname: 'res.cloudinary.com' }  // Cloudinary per immagini
    ]
  },
  trailingSlash: true,           // URL con trailing slash
  devIndicators: false
}
```

### Type Safety

**Interfacce principali** (`src/lib/travels.ts`):

```typescript
interface Travel {
  slug: string
  title: string
  date: string
  endDate?: string
  description: string
  coverImage: string
  tags: string[]
  location: string
  duration: string
  content: string              // HTML renderizzato
  gallery?: string[]
  coords?: TravelCoords
  heroTitleVariant: "light" | "dark"
  map?: TravelMapData
  totalKilometers?: number
  timeline?: TravelTimelineItem[]
}

interface TravelMapData {
  gpx?: string
  kml?: string
  kmz?: string
  points?: TravelMapPoint[]
}

interface TravelTimelineItem {
  city: string
  km?: number
}
```

**Parsing Type-Safe**:
- Validazione campi obbligatori
- Parsing sicuro di coordinate, numeri, array
- Default values per campi opzionali

### Performance

1. **Cache In-Memory**: Singleton pattern per viaggi
2. **Static Generation**: Tutte le pagine pre-generate
3. **Lazy Loading**: Mappe caricate on-demand
4. **Image Optimization**: `next/image` con formati moderni
5. **Code Splitting**: Automatico con Next.js

### SEO

- Metadata dinamiche per ogni pagina
- Open Graph tags per social sharing
- Semantic HTML
- URL semantici e clean
- Sitemap (da implementare)

## Come Aggiungere un Nuovo Viaggio

1. **Crea file Markdown** in `src/content/travels/`:
   ```bash
   src/content/travels/mio-viaggio-2025.md
   ```

2. **Aggiungi frontmatter** con tutti i campi necessari:
   ```yaml
   ---
   title: "Mio Viaggio"
   slug: "mio-viaggio-2025"
   date: "2025-01-15"
   # ... altri campi
   ---
   ```

3. **Scrivi contenuto** in Markdown

4. **Aggiungi immagini**:
   - Cover image: URL Cloudinary o path locale
   - Gallery: array di URL immagini

5. **Build**: Il viaggio apparirà automaticamente dopo il build

## Scripts Disponibili

```bash
npm run dev      # Sviluppo locale (localhost:3000)
npm run build    # Build produzione (genera /out)
npm run start    # Server produzione (dopo build)
npm run lint     # Linting ESLint
```

## Deployment

Il progetto è configurato per **static export** e può essere deployato su:

- **Vercel** (raccomandato): Auto-deploy da GitHub
- **Netlify**: Drag & drop della cartella `out/`
- **GitHub Pages**: Push della cartella `out/`
- Qualsiasi hosting statico

### Build per Produzione

```bash
npm run build
# Genera cartella /out con sito statico completo
```

## Dipendenze Principali

### Production
- `next@16.0.3` - Framework
- `react@19.2.0` - UI library
- `react-dom@19.2.0` - React DOM
- `leaflet@1.9.4` - Mappe
- `react-leaflet@5.0.0` - React wrapper Leaflet
- `gray-matter@4.0.3` - Parsing frontmatter
- `remark@15.0.1` - Markdown processor
- `remark-html@16.0.1` - Markdown → HTML
- `@tmcw/togeojson@7.1.2` - GPX/KML → GeoJSON
- `jszip@3.10.1` - Estrazione KMZ

### Development
- `typescript@5` - TypeScript
- `tailwindcss@3.4.18` - CSS framework
- `eslint@9` - Linter
- `@types/*` - Type definitions

## Note Implementative

### Cache Pattern
La cache dei viaggi utilizza un pattern singleton:
- Prima lettura: parsing di tutti i file
- Letture successive: ritorna cache
- Reset cache: riavvio server/dev server

### Mappe
- **Lazy Loading**: Componenti mappa importati dinamicamente
- **Formati supportati**: GPX, KML, KMZ, punti manuali
- **Icone**: Marker personalizzati con `markerIcon.ts`
- **Styling**: CSS Leaflet importato solo nei componenti client

### Immagini
- **Locali**: `/public/images/...`
- **Remote**: Cloudinary (`res.cloudinary.com`)
- **Ottimizzazione**: `next/image` con formati AVIF/WebP
- **Static Export**: `unoptimized: true` necessario

## Estensioni Future Possibili

1. **Ricerca**: Full-text search nei contenuti
2. **Lightbox**: Galleria con lightbox per immagini
3. **Sitemap**: Generazione automatica `sitemap.xml`
4. **RSS Feed**: Feed RSS per subscription
5. **Analytics**: Integrazione Google Analytics/Vercel Analytics
6. **Comments**: Sistema commenti (es. Giscus)
7. **Related Posts**: Viaggi correlati per tag
8. **Sharing**: Pulsanti condivisione social
9. **Print Styles**: CSS per stampa articoli
10. **Dark Mode**: Toggle tema scuro/chiaro

## Risorse Utili

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Leaflet Documentation](https://leafletjs.com/)
- [React Leaflet](https://react-leaflet.js.org/)
- [Remark](https://remark.js.org/)
- [Vercel Deployment](https://vercel.com/docs)

---

**Ultimo aggiornamento**: Gennaio 2025
**Versione progetto**: 0.1.0

