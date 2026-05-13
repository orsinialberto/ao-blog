/**
 * Type definitions for i18n translations
 * Provides type safety for translation keys and values
 */

import type { SupportedLocale } from "@/config/locales";

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
      motorcycleTravels: string;
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
      motorcycleTravels: string;
      photoGallery: string;
    };
  };
  components: {
    tagFilter: {
      allTravels: string;
    };
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
    heroSection: {
      label: string;
      titleLine1: string;
      titleLine2: string;
      cta: string;
      imageAlt: string;
    };
    onTheRoadSection: {
      eyebrow: string;
      title: string;
      description: string;
      cta: string;
      imageAlt: string;
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
    motoTravel: {
      sectionLabel: string;
      kmRidden: string;
      countriesVisited: string;
      mountainPasses: string;
      tiresConsumed: string;
      totalDistance: string;
      duration: string;
      motorcycle: string;
      regions: string;
      routeTitle: string;
      routeSubtitle: string;
      downloadTrack: string;
      downloadTrackLoading: string;
      downloadTrackError: string;
      featuredPassLabel: string;
      elevation: string;
      notSpecified: string;
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
    motorcycleTravels: {
      title: string;
      description: string;
      heading: string;
      subtitle: string;
      badge: string;
      viewAllRelated: string;
      readFullStory: string;
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
}

/**
 * Type-safe translation accessor
 * Provides nested object access with full type safety
 */
export type Translations = TranslationMessages;

/**
 * Helper type to extract nested keys from translation object
 * Used for type-safe path access
 */
export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

/**
 * Translation key path type
 * Represents all valid dot-separated paths to translation strings
 */
export type TranslationKey = NestedKeyOf<TranslationMessages>;
