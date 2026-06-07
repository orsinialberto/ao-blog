/**
 * i18n utility functions and hooks
 * Provides type-safe translation access for server and client components
 */

import type { SupportedLocale } from "@/config/locales";
import { defaultLocale } from "@/config/locales";
import type { TranslationMessages, Translations } from "./types";

// Import translation messages
import itMessages from "./messages/it.json";
import enMessages from "./messages/en.json";

/**
 * Translation messages map
 * Maps locale codes to their translation objects
 */
const messages: Record<SupportedLocale, TranslationMessages> = {
  it: itMessages as TranslationMessages,
  en: enMessages as TranslationMessages,
};

/**
 * Get translations for a specific locale
 * Use this function in server components and server-side code
 *
 * @param locale - The locale to get translations for
 * @returns Type-safe translations object for the specified locale
 *
 * @example
 * ```tsx
 * // In a server component
 * export default function Page({ params }: { params: { locale: string } }) {
 *   const t = getTranslations(params.locale as SupportedLocale);
 *   return <h1>{t.common.siteName}</h1>;
 * }
 * ```
 */
export function getTranslations(
  locale: SupportedLocale = defaultLocale
): Translations {
  return messages[locale] || messages[defaultLocale];
}

// Note: useTranslations hook is exported from './hooks' for client components
// Import it from '@/i18n/hooks' in client components

// Re-export types for convenience
export type { TranslationMessages, Translations } from "./types";
