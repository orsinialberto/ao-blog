/**
 * Site metadata configuration
 * Provides multilingual metadata for SEO and Open Graph
 */

import type { SupportedLocale } from "./locales";
import { getTranslations } from "@/i18n";
import { supportedLocales } from "./locales";

/**
 * Get site metadata for a specific locale
 * Returns localized title, description, and other metadata
 *
 * @param locale - The locale to get metadata for
 * @returns Metadata object with localized strings
 */
export function getSiteMetadata(locale: SupportedLocale) {
  const t = getTranslations(locale);
  const lang = locale === "it" ? "it-IT" : "en-US";

  return {
    title: {
      default: t.metadata.title,
      template: `%s · ${t.metadata.title}`,
    },
    description: t.metadata.description,
    url: t.metadata.siteUrl,
    locale: lang,
  };
}

/**
 * Get all alternate language links for hreflang tags
 * Generates hreflang links for all supported locales
 *
 * @param pathname - The current pathname (without locale prefix)
 * @returns Array of alternate language links
 */
export function getAlternateLanguageLinks(pathname: string) {
  // Get base URL from translations (all locales should have the same URL)
  const baseUrl = getTranslations("it").metadata.siteUrl;
  const cleanPath = pathname.startsWith("/") ? pathname : `/${pathname}`;

  return supportedLocales.map((locale) => ({
    hreflang: locale === "it" ? "it-IT" : "en-US",
    href: `${baseUrl}/${locale}${cleanPath}`,
  }));
}

