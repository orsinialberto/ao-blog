import type { Metadata } from "next";
import { siteMetadata } from "./metadata";
import { strings } from "./strings";

/**
 * Page-specific metadata configuration
 * Centralized and type-safe metadata for all static pages
 * 
 * Note: Dynamic metadata (e.g., travel detail pages) are handled
 * via generateMetadata() functions in their respective page files.
 */

/**
 * Base metadata structure for static pages
 */
interface PageMetadataConfig {
  title: string;
  description: string;
}

/**
 * Metadata configuration for all static pages
 */
const pageMetadataConfig: Record<string, PageMetadataConfig> = {
  home: {
    title: strings.common.siteName,
    description: siteMetadata.description,
  },
  about: {
    title: strings.pages.about.title,
    description: strings.pages.about.description,
  },
  travels: {
    title: "Tutti i viaggi",
    description: "Archivio completo dei diari di viaggio con filtri per tag.",
  },
  gallery: {
    title: "Galleria Fotografica",
    description: "Tutte le foto dei miei viaggi raccolte in un'unica galleria fotografica",
  },
} as const;

/**
 * Helper function to generate Next.js Metadata object from page config
 * Applies the title template from siteMetadata
 */
function createPageMetadata(pageKey: keyof typeof pageMetadataConfig): Metadata {
  const config = pageMetadataConfig[pageKey];
  
  return {
    title: config.title,
    description: config.description,
  };
}

/**
 * Exported metadata objects for each page
 * These can be directly used in Next.js page metadata exports
 */
export const homePageMetadata: Metadata = createPageMetadata("home");
export const aboutPageMetadata: Metadata = createPageMetadata("about");
export const travelsPageMetadata: Metadata = createPageMetadata("travels");
export const galleryPageMetadata: Metadata = createPageMetadata("gallery");

/**
 * Type-safe accessor for page metadata config
 * Useful for programmatic access or future i18n implementation
 */
export function getPageMetadataConfig(pageKey: keyof typeof pageMetadataConfig): PageMetadataConfig {
  return pageMetadataConfig[pageKey];
}

/**
 * Type for page metadata keys
 */
export type PageMetadataKey = keyof typeof pageMetadataConfig;
