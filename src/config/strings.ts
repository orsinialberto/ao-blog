/**
 * Centralized string configuration
 * All application strings organized by namespace for easy internationalization
 */

/**
 * String structure organized by namespace
 */
export const strings = {
  common: {
    siteName: "Diario di Viaggio",
    copyright: "Tutti i diritti riservati",
  },
  navigation: {
    menu: "Menu",
    close: "Chiudi",
    links: {
      home: "HOME",
      travels: "VIAGGI",
      motorcycleTravels: "ON THE ROAD",
      gallery: "GALLERIA",
    },
  },
  footer: {
    navigation: "Navigazione",
    follow: "Seguimi",
    description:
      "Storie autentiche di viaggi zaino in spalla, trekking e avventure in moto. Scopri itinerari, consigli pratici e ispirazioni per il tuo prossimo viaggio.",
    followDescription:
      "Segui le mie avventure in tempo reale e scopri i miei itinerari.",
    quickLinks: {
      home: "Home",
      allTravels: "Tutti i Viaggi",
      motorcycleTravels: "On The Road",
      photoGallery: "Galleria Foto",
    },
  },
  components: {
    tagFilter: {
      allTravels: "Tutti i viaggi",
    },
    cookieBanner: {
      title: "Gestione dei Cookie",
      description:
        "Questo sito utilizza cookie tecnici per il funzionamento delle mappe e delle immagini. Continuando a navigare, accetti l'utilizzo di questi cookie.",
      moreInfo: "Maggiori informazioni",
      reject: "Rifiuta",
      accept: "Accetta",
      rejectAriaLabel: "Rifiuta i cookie",
      acceptAriaLabel: "Accetta i cookie",
    },
    travelStats: {
      countriesVisited: "Paesi visitati",
      continentsVisited: "Continenti visitati",
      kilometersWalked: "Percorsi a piedi",
      brokenShoes: "Paia di scarpe rotte",
    },
    travelTimeline: {
      stagesLabel: "Tappe del cammino",
    },
    travelNavigationCard: {
      comingSoon: "Arriverà presto.",
    },
    travelGallery: {
      fullGallery: "Galleria completa",
      close: "Chiudi",
      photoGallery: "Galleria fotografica",
      seeAll: "Vedi tutte",
      previousPhoto: "Foto precedente",
      nextPhoto: "Foto successiva",
      scrollThumbnailsBack: "Scroll thumbnails indietro",
      scrollThumbnailsForward: "Scroll thumbnails avanti",
    },
    masonryGallery: {
      close: "Chiudi",
      previousPhoto: "Foto precedente",
      nextPhoto: "Foto successiva",
      noPhotosAvailable: "Nessuna foto disponibile",
    },
    sectionHeader: {
      latestPublications: "Ultime pubblicazioni",
      seeAll: "Vedi tutti",
      photoGallery: "Galleria fotografica",
      seeAllPhotos: "Vedi tutte le foto",
    },
  },
} as const;

/**
 * Type-safe string accessor
 * Usage: strings.navigation.menu
 */
export type Strings = typeof strings;
