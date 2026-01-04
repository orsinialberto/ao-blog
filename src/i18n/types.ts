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
      gallery: string;
      about: string;
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
      photoGallery: string;
      about: string;
    };
  };
  components: {
    tagFilter: {
      allTravels: string;
    };
    cookieBanner: {
      title: string;
      description: string;
      moreInfo: string;
      reject: string;
      accept: string;
      rejectAriaLabel: string;
      acceptAriaLabel: string;
    };
    travelStats: {
      countriesVisited: string;
      continentsVisited: string;
      kilometersWalked: string;
      brokenShoes: string;
    };
    travelTimeline: {
      stagesLabel: string;
    };
    travelNavigationCard: {
      comingSoon: string;
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
      seeAll: string;
      photoGallery: string;
      seeAllPhotos: string;
    };
    heroSection: {
      title: string;
      subtitle: string;
      imageAlt: string;
    };
    aboutPreview: {
      title: string;
      description1: string;
      description2: string;
      aboutLink: string;
      imageAlt: string;
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
  };
  pages: {
    about: {
      title: string;
      description: string;
      heading: string;
      sectionLabel: string;
      travelCompanions: string;
      contacts: string;
      bio1: string;
      bio2: string;
      bio3: string;
      companion1: string;
      companion2: string;
      companion3: string;
      profileImageAlt: string;
    };
    travels: {
      title: string;
      description: string;
      archiveLabel: string;
      heading: string;
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
