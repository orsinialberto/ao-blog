/**
 * Client-side i18n hooks
 * Use these hooks in client components (marked with 'use client')
 */

"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import type { SupportedLocale } from "@/config/locales";
import { getLocaleFromPath } from "@/lib/i18n/routing";
import { getTranslations } from "./index";
import type { Translations } from "./types";

/**
 * React hook for getting the current locale from the URL pathname
 * Extracts locale from the current route (e.g., '/en/about' -> 'en')
 *
 * @returns The current locale from the URL
 *
 * @example
 * ```tsx
 * 'use client';
 * import { useLocale } from '@/i18n/hooks';
 *
 * export function MyComponent() {
 *   const locale = useLocale();
 *   return <div>Current locale: {locale}</div>;
 * }
 * ```
 */
export function useLocale(): SupportedLocale {
  const pathname = usePathname();
  return useMemo(() => getLocaleFromPath(pathname), [pathname]);
}

/**
 * React hook for accessing translations in client components
 * Automatically uses the current locale from the URL
 * Use this hook in client components (marked with 'use client')
 *
 * @param locale - Optional locale override. If not provided, uses locale from URL
 * @returns Type-safe translations object
 *
 * @example
 * ```tsx
 * 'use client';
 * import { useTranslations } from '@/i18n/hooks';
 *
 * export function MyComponent() {
 *   const t = useTranslations();
 *   return <button>{t.navigation.close}</button>;
 * }
 * ```
 */
export function useTranslations(
  locale?: SupportedLocale
): Translations {
  const currentLocale = useLocale();
  const targetLocale = locale || currentLocale;
  
  // Memoize translations to avoid recreating the object on every render
  return useMemo(() => getTranslations(targetLocale), [targetLocale]);
}
