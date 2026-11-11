# Galleria fotografica — design

Data: 2026-11-11

## Perché

L'autore sta per caricare circa 400 foto pesanti, tutte appartenenti a viaggi già sul blog. La pagina `/galleria` attuale (`MasonryGallery`) non regge: all'apertura scarica tutte le foto per misurarne l'altezza, rende tre layout insieme (mobile/tablet/desktop) e salta mentre carica. L'obiettivo è una raccolta di foto "tipo Flickr" — raccolte da sfogliare, foto da ingrandire — ma disegnata nello stile del sito: carta, matita, scrittura a mano, oggetti fotografici disegnati (rullino, pellicola, polaroid) che si animano.

## Obiettivi

1. `/galleria/` mostra le raccolte, una per viaggio, come rullini disegnati.
2. `/galleria/[slug]/` mostra tutte le foto di un viaggio su strisce di pellicola disegnata che scorrono; ogni foto si apre ingrandita.
3. Una sezione in homepage porta alla galleria: un filo con polaroid disegnate che dondolano, con dentro foto vere.
4. Regge 400+ foto senza scaricarle tutte e senza layout che saltano.

## Non obiettivi

- Nessun database, nessun backend: il sito resta export statico.
- Nessuna paginazione.
- Nessuna foto "sciolta" fuori da un viaggio (tutte appartengono a un viaggio).
- La galleria dentro la pagina del viaggio (`TravelGallery` in `TravelTabs`) non cambia.
- Niente didascalie, EXIF, date per foto, ricerca, tag.

## Anti-obiettivi (fallimento anche se funziona)

- Il disegno che si "rompe" in movimento: corda spezzata, buchi bianchi, pezzi di disegno che si staccano.
- Foto storte o decentrate rispetto alla cornice disegnata, mollette che finiscono sotto la foto.
- Pagine affollate di testo: nella pagina raccolta solo titolo e anno.
- Pagina che scarica centinaia di foto originali.

## Vincoli

- Next.js 16 export statico, `trailingSlash: true`, locali `it` / `en`. Ogni nuova `[locale]/.../[slug]/page.tsx` esporta `generateStaticParams` su locali × slug.
- Testi UI in `src/i18n/messages/it.json` e `en.json`, entrambi.
- Foto su Cloudinary; URL trasformati con `optimizeCloudinaryUrl()` / `f_auto,q_auto`.
- Principi del repo: semplice, niente codice inutilizzato, fallire forte.
- Rispettare `prefers-reduced-motion` (come già fa il sito, es. `.hand-underline`).

## Decisioni prese

### Hosting e dati (decise con l'autore)

- **Cloudinary resta.** Niente database. Le foto si caricano già ridimensionate (lato lungo ~3000px, JPEG ~q85).
- **Raccolta = viaggio.** La fonte resta il campo `gallery` del frontmatter (lista di URL Cloudinary, identica nei file `.md` e `.en.md`). Una raccolta esiste solo per i viaggi con `gallery` non vuoto.
- **Mia scelta:** nessun manifest con le dimensioni delle foto. Tutte le miniature stanno in cornici a proporzione fissa (`object-fit: cover`), quindi le dimensioni non servono per il layout; il visore mostra la foto intera a dimensione naturale.

### Indice `/galleria/` — rullini (deciso con l'autore)

- Ogni viaggio è il disegno **rullino + pellicola** (`Gemini_Generated_Image_wa15vj…-Photoroom.png`, PNG trasparente 2400×1610, tre fotogrammi trasparenti). Le foto stanno *dietro* il disegno, visibili attraverso i tre fotogrammi.
- **Titolo breve del viaggio scritto a mano in verticale sull'etichetta bianca del rullino** (font `font-hand`, legge dal basso in alto, `mix-blend-mode: multiply` per sembrare inchiostro), al massimo due colonne. I titoli veri arrivano a ~45 caratteri e non ci stanno, quindi (deciso con l'autore) si aggiunge al frontmatter un campo **`shortTitle`**, tradotto (va aggiunto ai campi tradotti in `src/lib/travels.ts` e in `CLAUDE.md`). È obbligatorio per i viaggi con `gallery`: se manca, la build fallisce nominando file e campo. **Mia scelta:** il builder propone i valori per tutti i viaggi esistenti (es. "Santiago", "Rota Vicentina", "Sellaronda") e li elenca all'autore da controllare.
- Sotto la pellicola, piccolo: anno · numero foto.
- **Animazione:** al passaggio del mouse la pellicola esce dal rullino (il disegno è usato due volte: il rullino fermo, la pellicola con le foto scorre da sotto il rullino) e le foto "si sviluppano" da negativo scuro (grayscale + brightness bassa) a colori.
- Su dispositivi senza hover, il rullino si apre quando entra nello schermo.
- Due rullini per riga su desktop.
- In testata: disegno della fotocamera (`Gemini_Generated_Image_fdt9dq…-Photoroom.png`), titolo "Galleria", conteggio totale foto e viaggi.
- **Mie scelte:** uno per riga su mobile; i tre fotogrammi mostrano le prime tre foto di `gallery`; ordine dei viaggi come l'archivio (più recente prima); click sul rullino → `/galleria/[slug]/`.

### Pagina raccolta `/galleria/[slug]/` — pellicole (deciso con l'autore)

- **In alto solo titolo del viaggio e anno.** Niente conteggio, link al racconto o altro. Il titolo usa lo stesso stile dei titoli di sezione della home: `font-hand` con `WigglyText` + `HandUnderline` (riusare `SectionHeader` con `label` = titolo e `subtitle` = anno, o lo stesso markup).
- **Strisce di pellicola dritta, a tutta larghezza (escono leggermente dai bordi), una per riga, 5 foto per striscia**, leggermente ruotate (±0,5°). Disegno: pellicola dritta `Gemini_Generated_Image_pvr9a4…jpg` — vedi "Asset" sotto: va rigenerato con 5 fotogrammi.
- Ogni foto sta in un fotogramma (`object-fit: cover`); le foto verticali risultano tagliate nel fotogramma, intere nel visore. L'autore lo sa e va bene.
- All'apertura le strisce "cadono" in posizione una dopo l'altra.
- **Scorrimento a serpentina (comportamento esatto voluto dall'autore):**
  - Tutte le foto del viaggio formano un unico nastro che percorre le righe a serpentina: riga 1 verso sinistra, riga 2 verso destra, riga 3 verso sinistra, ecc. Una foto che esce da un lato di una riga rientra dallo stesso lato nella riga sopra. Il nastro gira in loop (dopo l'ultima foto, la prima).
  - Il nastro avanza **solo mentre il mouse è sulla parte nera della pellicola** (bordo con le perforazioni e separatori tra fotogrammi).
  - Si ferma con il mouse **su una foto**, sulla carta bianca sopra/sotto la pellicola o tra le righe.
  - Click su una foto → visore.
  - Velocità del prototipo: ~0,45 fotogrammi/secondo.
  - **Mia scelta — numero di strisce:** `ceil(n / 5)` strisce, così a riposo ogni foto è visibile una volta (il prototipo ne aveva 3 fisse solo perché aveva 18 foto di prova). Gli slot avanzati nell'ultima striscia sono **fotogrammi vuoti** (pellicola non esposta, solo disegno); nel loop i fotogrammi vuoti viaggiano col nastro come separatore tra l'ultima e la prima foto. Nessuna foto appare due volte a schermo. Stessa regola su mobile con 3 per striscia.
  - **Mia scelta — il disegno si muove con le foto** (come nel prototipo approvato): ogni striscia è una fila di tessere-fotogramma ripetute che scorrono insieme alle foto. Per questo all'autore si chiede un asset diverso da quello indicato prima: **un singolo fotogramma di pellicola ripetibile** (vedi Asset). La striscia mobile da 3 usa la stessa tessera.
- **Visore:** foto intera, prev/next, chiusura con Esc. Riusare `src/components/Lightbox.tsx` (ha già prev/next, focus trap, footer).
- **Mie scelte:** su mobile (niente hover) le strisce hanno 3 foto e il nastro si trascina col dito, un tocco apre la foto; le strisce sotto la piega "cadono" quando entrano nello schermo; il visore aggiorna l'URL con `?foto=<n>` per condividere (con export statico va letto client-side, come `useSearchParams` in on-the-road); visore con bordo bianco da stampa, swipe su touch; miniature `w_400`, visore `w_2000`, `loading="lazy"` fuori dalle prime righe.

### Sezione homepage — polaroid sul filo (deciso con l'autore)

- Disegno: filo con sei polaroid vuote (`Gemini_Generated_Image_9fwx3b…-Photoroom.png`, PNG trasparente 2400×700). Dentro ogni polaroid una foto vera.
- Sotto il disegno: titolo scritto a mano con `HandUnderline` + bottone disegnato, stesso markup di `OnTheRoadHomeSection`. Testi segnaposto "I miei scatti" / "Apri la galleria" (da tradurre in `en`). Il bottone porta a `/galleria/`.
- **Animazioni:**
  - Il filo ondeggia piano, sempre (`translateY` ~1,5% + `rotate` ~0,35°, 5s).
  - Ogni polaroid dondola attorno al punto in cui la sua molletta stringe la corda, ognuna con ampiezza e durata proprie (sfasate, effetto vento); le due polaroid tenute da due mollette (3ª e 6ª) dondolano pochissimo.
  - Mouse sopra: il vento rinforza (dondolio più veloce).
  - Quando la sezione entra nello schermo le foto si sviluppano una dopo l'altra, da nero a colori.
- **Costruzione (vincolo duro, l'autore ha bocciato le versioni che rompono la corda):**
  - La corda è un unico livello statico rispetto al filo, ritagliato dal disegno lungo il percorso misurato della corda (banda ±11px).
  - Ogni polaroid è un livello che contiene: il corpo della polaroid ritagliato *sotto* la banda della corda, e le colonne delle sue mollette dalla cima della molletta fino al bordo inferiore della banda. Nessun altro pezzo di corda nei livelli che ruotano.
  - Il perno di rotazione è il punto della corda sotto la molletta (per due mollette: il punto medio).
  - La foto è ritagliata sulla forma esatta della finestra scura (quadrilatero, perché diverse polaroid sono ruotate, la 1ª di ~10°) e ha dei buchi dove una molletta/graffetta entra nella finestra, così la molletta del disegno resta **sopra** la foto (1ª, 2ª e 5ª polaroid). Prototipo: CSS `mask` con SVG `evenodd` (quadrilatero + buchi).
  - L'autore ritiene che centratura e mollette "si possono migliorare ancora": verificarle a occhio nel browser e rifinire.
- **Mie scelte:** sezione dopo `OnTheRoadHomeSection`; le sei foto sono la prima foto `gallery` dei sei viaggi più recenti che ne hanno una; click su una polaroid → raccolta di quel viaggio.

### Pagina attuale

- `MasonryGallery.tsx` e il suo uso in `galleria/page.tsx` vengono rimossi (e le stringhe i18n non più usate).

## Asset

Da copiare in `public/images/galleria/` (nomi a scelta del builder):

| Uso | File sorgente (in `~/Downloads/`) | Stato |
|---|---|---|
| Rullino + pellicola (indice) | `Gemini_Generated_Image_wa15vjwa15vjwa15-Photoroom.png` | pronto, trasparente |
| Fotocamera (testata indice) | `Gemini_Generated_Image_fdt9dqfdt9dqfdt9-Photoroom.png` | pronto, trasparente |
| Filo con polaroid (home) | `Gemini_Generated_Image_9fwx3b9fwx3b9fwx-Photoroom.png` | pronto, trasparente |
| Pellicola dritta (raccolta) | `Gemini_Generated_Image_pvr9a4pvr9a4pvr9.jpg` | **da rigenerare** a cura dell'autore: un solo fotogramma (da separatore a separatore) che si ripete senza giunture visibili, finestra trasparente, sfondo trasparente, senza numeri di bordo (si ripeterebbero) |

**Mia scelta:** si costruisce subito con il disegno a 4 fotogrammi come segnaposto, alternando i due fotogrammi centrali come tessere (numeri di bordo ripetuti) e fondendo lo sfondo carta con `mix-blend-mode: multiply`, foto sotto il disegno. Quando arriva la tessera trasparente si sostituisce l'immagine e si rimisura la finestra; le foto vanno *dietro* il disegno come nei rullini.

Le immagini sono grandi (2400px): servirle ridimensionate (es. ~1200px, WebP) è a discrezione del builder.

## Misure dei disegni

Le posizioni (fotogrammi, etichetta del rullino, corda, polaroid, mollette, finestre) vanno **misurate sui pixel** dei disegni, non a occhio: le versioni stimate a occhio sono state bocciate. Nel prototipo le misure sono state fatte convertendo il PNG in BMP (`sips -s format bmp`) e analizzando canale alfa e luminosità con Python standard library. Le misure vanno salvate come costanti commentate (es. `src/config/galleryDrawings.ts`), in coordinate del disegno, convertite in percentuali in CSS.

Misure già fatte sul filo con polaroid (2400×700, pixel):

- Corda: centro y ≈ 116 a x=0, 161 a x=240, 197 a x=480, 218 a x=720, 235 a x=960, 241 a x=1200, 234 a x=1440, 220 a x=1680, 197 a x=1920, 163 a x=2160, 116 circa a x=2400; spessore ~15px.

| # | Corpo (x0,y0,x1,y1) | Mollette (x0–x1, cima y) | Perno x | Finestra (angoli TL, TR, BR, BL) |
|---|---|---|---|---|
| 1 | 142,166,430,504 | 290–358, 44 | 324 | (213,186) (403,209) (356,463) (168,433) |
| 2 | 506,210,848,482 | 722–762, 186 (graffetta) | 742 | (530,250) (802,248) (812,436) (538,449) |
| 3 | 912,234,1256,590 | 944–988, 96 · 1170–1218, 112 | 1081 | (943,259) (1217,276) (1208,544) (935,535) |
| 4 | 1312,228,1646,526 | 1410–1480, 96 | 1445 | (1332,268) (1556,257) (1572,483) (1346,497) |
| 5 | 1656,208,1994,470 | 1662–1730, 172 (graffetta) | 1696 | (1686,239) (1961,229) (1955,431) (1681,424) |
| 6 | 2054,152,2318,338 | 2050–2084, 142 · 2250–2282, 108 (graffette) | 2166 | (2073,192) (2269,160) (2287,275) (2095,310) |

Mollette che entrano nella finestra (buchi nella foto): 1ª ~x 283–304 y 194–208; 2ª ~x 736–751 y 248–264; 5ª ~x 1712–1728 y 237–254.

Stime (non misurate) da verificare: rullino — fotogrammi a x ≈ 26.5–41.9%, 42.9–65.5%, 66.3–89.6%, y ≈ 30.5–55.3%; il rullino finisce a x ≈ 26.4%; etichetta a x ≈ 10.6–21%, y ≈ 25–60%.

## Prototipi

Bozze HTML cliccabili in `.superpowers/brainstorm/94853-1794428005/content/` (locali, non versionate; aggiungere `.superpowers/` a `.gitignore`):

- indice rullini: `gallery-rolls-v3.html`
- pagina raccolta: `album-page-v8.html` (serpentina, solo-parte-nera) + `album-page-v5.html` (titolo)
- home: `home-section-v6.html`

## Lasciato al builder

- Struttura dei componenti, nomi, divisione server/client (le animazioni e lo scorrimento sono client).
- Implementazione dell'animazione (CSS vs `requestAnimationFrame`), purché il comportamento sia quello descritto.
- Comportamento esatto con `prefers-reduced-motion` (mia proposta: niente dondolio/scorrimento automatico/caduta; rullini già aperti; foto già sviluppate).
- Accessibilità: `alt` delle foto (proposta: "Titolo viaggio — foto n"), elementi cliccabili come link/bottoni veri, navigazione da tastiera nel nastro.
- Metadati SEO delle nuove pagine.
