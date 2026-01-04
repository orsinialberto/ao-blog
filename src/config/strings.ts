/**
 * Centralized string configuration
 * All application strings organized by namespace for easy internationalization
 */

import type { SupportedLocale } from "./locales";

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
      gallery: "GALLERIA",
      about: "CHI SONO",
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
      photoGallery: "Galleria Foto",
      about: "Chi Sono",
    },
  },
  components: {
    tagFilter: {
      allTravels: "Tutti i viaggi",
    },
    travelGallery: {
      fullGallery: "Galleria completa",
      close: "Chiudi",
    },
    masonryGallery: {
      close: "Chiudi",
      previousPhoto: "Foto precedente",
      nextPhoto: "Foto successiva",
    },
    sectionHeader: {
      latestPublications: "Ultime pubblicazioni",
      seeAll: "Vedi tutti",
      photoGallery: "Galleria fotografica",
      seeAllPhotos: "Vedi tutte le foto",
    },
    aboutPreview: {
      title: "Metto lo zaino, seguo la strada e via...",
      description1:
        "Ciao sono Alberto, e da qualche anno ho scoperto che la mia felicità pesa più o meno quanto uno zaino. Cammino, viaggio in moto, esploro quando posso e come posso.",
      description2:
        "Scrivo questo blog per fermare un po' di quella libertà che il viaggio regala, per ricordarmi ciò che ho visto e condividere ciò che mi è rimasto dentro.",
      aboutLink: "Chi sono",
    },
  },
  pages: {
    about: {
      title: "Chi sono",
      description: "Chi sono, perché ho aperto questo diario e come contattarmi.",
      heading: "Ciao, sono Alberto",
      sectionLabel: "Chi sono",
      travelCompanions: "Compagni di viaggio",
      contacts: "Contatti",
    },
  },
} as const;

/**
 * Type-safe string accessor
 * Usage: strings.navigation.menu
 */
export type Strings = typeof strings;

/**
 * Get string by path (for future i18n implementation)
 * @param locale - The locale to use (currently only 'it' is implemented)
 * @param path - Dot-separated path to the string (e.g., 'navigation.menu')
 */
export function getString(
  locale: SupportedLocale,
  path: string
): string | undefined {
  // For now, only Italian is implemented
  // This function will be expanded when i18n is fully implemented
  const keys = path.split(".");
  let value: any = strings;

  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = value[key as keyof typeof value];
    } else {
      return undefined;
    }
  }

  return typeof value === "string" ? value : undefined;
}
