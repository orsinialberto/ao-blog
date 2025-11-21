# Specifiche Progetto: Sito Diario di Viaggio Personale

## Obiettivo del Progetto
Creare un sito web personale per documentare viaggi, itinerari e foto senza utilizzare piattaforme come Wordpress. Il sito deve essere moderno, veloce e facilmente gestibile.

## Stack Tecnologico

### Framework e Librerie
- **Next.js 14+** (App Router) con TypeScript
- **Tailwind CSS** per lo styling
- **React** 18+
- **gray-matter** per parsing frontmatter Markdown
- **remark** e **remark-html** per rendering Markdown
- **next/image** per ottimizzazione immagini

### Hosting
- **Vercel** (deployment automatico da GitHub)

### Gestione Contenuti
- File Markdown per gli articoli di viaggio
- Immagini nella cartella `public/images`
- Nessun database richiesto (static site generation)

## Struttura del Progetto

```
my-travel-blog/
├── public/
│   └── images/
│       └── travels/
│           ├── [slug]/
│           │   ├── cover.jpg
│           │   ├── photo-1.jpg
│           │   └── photo-2.jpg
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx (homepage)
│   │   ├── viaggi/
│   │   │   ├── page.tsx (lista viaggi)
│   │   │   └── [slug]/
│   │   │       └── page.tsx (singolo viaggio)
│   │   └── about/
│   │       └── page.tsx
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── TravelCard.tsx
│   │   ├── TravelGallery.tsx
│   │   └── TagFilter.tsx
│   ├── lib/
│   │   └── travels.ts (funzioni per leggere Markdown)
│   └── content/
│       └── travels/
│           ├── giappone-2024.md
│           └── islanda-2023.md
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Formato File Markdown

Ogni viaggio deve essere un file `.md` nella cartella `src/content/travels/` con questo formato:

```markdown
---
title: "Titolo del Viaggio"
slug: "giappone-2024"
date: "2024-03-15"
endDate: "2024-03-29"
description: "Breve descrizione del viaggio"
coverImage: "/images/travels/giappone-2024/cover.jpg"
tags: ["Asia", "Cultura", "Natura"]
location: "Giappone"
duration: "14 giorni"
---

# Introduzione

Contenuto principale del viaggio scritto in Markdown...

## Giorno 1: Tokyo

Descrizione della prima tappa...

## Galleria Fotografica

![Descrizione foto](/images/travels/giappone-2024/photo-1.jpg)
```

## Funzionalità Richieste

### Fase 1 - Funzionalità Base (MVP)

#### Homepage
- Hero section con titolo del blog e breve presentazione
- Griglia responsive delle ultime 6 viaggi (card con immagine cover, titolo, data, breve descrizione)
- Link a pagina "Tutti i Viaggi"

#### Pagina Lista Viaggi (`/viaggi`)
- Griglia di tutte le card dei viaggi
- Ordinamento per data (più recenti prima)
- Sistema di tag visibili su ogni card
- Filtro per tag (click su un tag mostra solo viaggi con quel tag)

#### Pagina Singolo Viaggio (`/viaggi/[slug]`)
- Header con immagine cover, titolo, data, durata, location
- Tag del viaggio
- Contenuto dell'articolo renderizzato da Markdown
- Galleria fotografica responsive
- Pulsanti "Viaggio Precedente" e "Viaggio Successivo"

#### Pagina About (`/about`)
- Sezione di presentazione personale
- Motivazione del blog
- Contatti/social (opzionale)

#### Navigation
- Header fisso con logo/nome del blog
- Menu di navigazione: Home, Viaggi, About
- Footer con copyright e link essenziali

#### Design
- Design responsivo (mobile-first)
- Palette colori moderni e leggibili
- Tipografia pulita e leggibile
- Hover effects e transizioni fluide
- Ottimizzazione immagini automatica con next/image

### Fase 2 - Funzionalità Avanzate (Opzionali)

#### Ricerca
- Barra di ricerca per titolo, descrizione o tag
- Risultati in tempo reale

#### Mappa Interattiva
- Integrazione con Leaflet o Mapbox
- Pin sui luoghi visitati
- Click sul pin apre il viaggio correlato

#### Galleria Avanzata
- Lightbox per visualizzare immagini a schermo intero
- Navigazione tra foto con frecce
- Swipe su mobile

#### Performance
- Lazy loading delle immagini
- Static generation per tutte le pagine
- Ottimizzazione SEO con metadata

#### Social Features
- Pulsanti di condivisione social
- Open Graph tags per preview su social media

## Requisiti Tecnici

### Performance
- Lighthouse score > 90 su tutte le metriche
- First Contentful Paint < 1.5s
- Time to Interactive < 3s

### SEO
- Metadata appropriati su ogni pagina
- Sitemap.xml generato automaticamente
- robots.txt configurato
- URL semantici e clean

### Accessibilità
- Semantic HTML
- Alt text su tutte le immagini
- Contrasto colori WCAG AA compliant
- Navigazione da tastiera funzionante

### Responsività
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

## Libreria di Utility da Implementare

### `src/lib/travels.ts`

Funzioni necessarie:

```typescript
// Legge tutti i viaggi dalla cartella content/travels
async function getAllTravels(): Promise<Travel[]>

// Legge un singolo viaggio per slug
async function getTravelBySlug(slug: string): Promise<Travel>

// Ottiene tutti i tag unici
function getAllTags(): string[]

// Filtra viaggi per tag
function getTravelsByTag(tag: string): Travel[]

// Ordina viaggi per data
function sortTravelsByDate(travels: Travel[]): Travel[]
```

### Interfacce TypeScript

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
  content: string // HTML renderizzato
}
```

## Comandi di Sviluppo

```bash
# Setup iniziale
npx create-next-app@latest my-travel-blog --typescript --tailwind --app
cd my-travel-blog
npm install gray-matter remark remark-html

# Sviluppo locale
npm run dev

# Build per produzione
npm run build

# Deploy su Vercel
# Connetti repository GitHub a Vercel (auto-deploy)
```

## Configurazioni Necessarie

### `next.config.js`
```javascript
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}
```

### `tailwind.config.ts`
- Configurare palette colori personalizzata
- Font personalizzati se necessario
- Breakpoints responsive

## Note Implementative

1. **Parsing Markdown**: Utilizzare gray-matter per estrarre frontmatter e remark per convertire Markdown in HTML
2. **Immagini**: Sempre usare `next/image` per ottimizzazione automatica
3. **Routing**: Sfruttare App Router di Next.js per generazione statica delle pagine
4. **Styling**: Utilizzare utility classes di Tailwind, creare componenti riutilizzabili
5. **Git**: Committare frequentemente, ignorare `node_modules` e `.next`

## Esempio di Primo Viaggio

Creare subito un file di esempio `src/content/travels/esempio.md` per testare il sistema:

```markdown
---
title: "Viaggio di Prova"
slug: "esempio"
date: "2024-01-15"
description: "Questo è un viaggio di esempio per testare il sistema"
coverImage: "/images/travels/esempio/cover.jpg"
tags: ["Test", "Europa"]
location: "Italia"
duration: "3 giorni"
---

# Introduzione

Questo è un articolo di prova per verificare che il sistema funzioni correttamente.

## Primo giorno

Descrizione del primo giorno del viaggio...
```

## Priorità di Sviluppo

1. ✅ Setup progetto Next.js con TypeScript e Tailwind
2. ✅ Implementare funzioni di lettura Markdown (`src/lib/travels.ts`)
3. ✅ Creare componenti base (Header, Footer, TravelCard)
4. ✅ Implementare Homepage con griglia viaggi
5. ✅ Implementare pagina lista viaggi
6. ✅ Implementare pagina singolo viaggio
7. ✅ Aggiungere sistema di filtri per tag
8. ✅ Implementare pagina About
9. ✅ Ottimizzare performance e SEO
10. 🔄 Deploy su Vercel

## Risorse Utili

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Markdown Guide](https://www.markdownguide.org/)
- [Vercel Deployment](https://vercel.com/docs)

---

**Note finali**: Questo documento deve servire come riferimento completo per sviluppare il progetto. Seguire le specifiche nell'ordine indicato per costruire progressivamente il sito. Testare ogni funzionalità prima di passare alla successiva.