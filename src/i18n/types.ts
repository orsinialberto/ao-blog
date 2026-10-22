import type { OnTheRoadView } from "@/config/on-the-road-nav";

/**
 * Type definitions for i18n translations
 * Provides type safety for translation keys and values
 */

/**
 * Translation messages structure
 * This type matches the JSON structure in messages/*.json files
 */
export interface TranslationMessages {
  common: {
    siteName: string;
    copyright: string;
    loading: string;
  };
  metadata: {
    title: string;
    description: string;
    siteUrl: string;
  };
  navigation: {
    menu: string;
    close: string;
    links: {
      home: string;
      travels: string;
      onTheRoad: string;
      gallery: string;
    };
  };
  footer: {
    navigation: string;
    follow: string;
    description: string;
    followDescription: string;
    quickLinks: {
      home: string;
      allTravels: string;
      onTheRoad: string;
      photoGallery: string;
    };
  };
  components: {
    cookieBanner: {
      title: string;
      description: string;
      privacyPolicy: string;
      reject: string;
      accept: string;
      rejectAriaLabel: string;
      acceptAriaLabel: string;
    };
    travelStats: {
      sectionLabel: string;
      countriesVisited: string;
      continentsVisited: string;
      kilometersWalked: string;
      brokenShoes: string;
    };
    travelTimeline: {
      stagesLabel: string;
      kilometers: string;
    };
    travelNavigationCard: {
      comingSoon: string;
      previousTravel: string;
      nextTravel: string;
    };
    travelDetailMap: {
      trackLabel: string;
    };
    travelGallery: {
      fullGallery: string;
      close: string;
      photoGallery: string;
      seeAll: string;
      previousPhoto: string;
      nextPhoto: string;
      scrollThumbnailsBack: string;
      scrollThumbnailsForward: string;
    };
    masonryGallery: {
      close: string;
      previousPhoto: string;
      nextPhoto: string;
      noPhotosAvailable: string;
    };
    sectionHeader: {
      latestPublications: string;
      latestPublicationsSubtitle: string;
      seeAll: string;
      photoGallery: string;
      seeAllPhotos: string;
    };
    aboutSection: {
      name: string;
      bio: string[];
    };
    heroSection: {
      label: string;
      subtitle: string;
      byline: string;
      titleLine1: string;
      titleLine2: string;
      cta: string;
      imageAlt: string;
    };
    onTheRoadHome: {
      title: string;
      cta: string;
      imageAlt: string;
    };
    heroQuote: {
      lines: string[];
      author: string;
      source: string;
    };
    travelMapSection: {
      title: string;
      description: string;
      journalCount: string;
      otherRegion: string;
    };
    galleryPreviewSection: {
      imageAlt: string;
    };
    languageSwitcher: {
      switchTo: string;
      switchToItalian: string;
      switchToEnglish: string;
      currentLanguage: string;
      language: string;
    };
    travelsList: {
      filteredByTag: string;
      noTravelsWithTag: string;
    };
    travelLogbook: {
      title: string;
      coordinates: string;
      location: string;
      duration: string;
      totalKilometers: string;
      tags: string;
    };
    travelTabs: {
      narrative: string;
      itinerary: string;
      gallery: string;
      stageFrom: string;
      stageTo: string;
      stageDistance: string;
      stageElevation: string;
    };
    relatedWaypoints: {
      title: string;
      subtitle: string;
      viewAll: string;
      journalLabel: string;
    };
  };
  pages: {
    travels: {
      title: string;
      description: string;
      archiveLabel: string;
      heading: string;
      subtitle: string;
    };
    gallery: {
      title: string;
      description: string;
      heading: string;
      statistics: string;
    };
    privacy: {
      title: string;
      description: string;
      heading: string;
      sectionLabel: string;
      lastUpdate: string;
      introduction: {
        title: string;
        text: string;
      };
      technicalCookies: {
        title: string;
        text: string;
        list1: string;
        list2: string;
      };
      analyticsCookies: {
        title: string;
        text: string;
        details: string;
        list1: string;
        list2: string;
        list3: string;
      };
      management: {
        title: string;
        text: string;
        details: string;
      };
      rights: {
        title: string;
        text: string;
        list1: string;
        list2: string;
        list3: string;
      };
      contacts: {
        title: string;
        text: string;
      };
    };
  };
  onTheRoad: {
    metaTitle: string;
    metaDescription: string;
    mapLabel: string;
    mapError: string;
    navLabel: string;
    closePanel: string;
    bikePrev: string;
    bikeNext: string;
    /** Contains the `{name}` placeholder. */
    bikeGoTo: string;
    infoCarouselLabel: string;
    /** Contains the `{km}` placeholder. */
    km: string;
    /** Contains the `{m}` placeholder. */
    metres: string;
    routesLabel: string;
    placesLabel: string;
    nav: Record<OnTheRoadView, string>;
    /** Keyed by route slug (`ROUTES` slugs are typed `string`, so not checked at build time). */
    routes: Record<string, string>;
    /** Keyed by bike id (`bikes` ids are typed `string`). */
    bikes: Record<string, { name: string; caption: string; text: string }>;
  };
}


/**
 * Type-safe translation accessor
 * Provides nested object access with full type safety
 */
export type Translations = TranslationMessages;
