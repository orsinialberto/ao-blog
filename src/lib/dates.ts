import { defaultLocale } from "@/config/locales";

/**
 * Maps locale code to Intl locale string
 * Converts "it" to "it-IT" for proper date formatting
 */
function getIntlLocale(locale?: string): string {
  if (locale) {
    return locale === "it" ? "it-IT" : locale;
  }
  return defaultLocale === "it" ? "it-IT" : defaultLocale;
}

/**
 * Formats a date string using the specified locale
 * @param date - Date string to format
 * @param locale - Optional locale code (defaults to configured default locale)
 * @param options - Optional Intl.DateTimeFormatOptions
 */
export function formatDate(
  date: string,
  locale?: string,
  options?: Intl.DateTimeFormatOptions
) {
  const intlLocale = getIntlLocale(locale);
  return new Date(date).toLocaleDateString(intlLocale, options ?? { dateStyle: "medium" });
}

/**
 * Formats a date range from start to end date
 * @param start - Start date string
 * @param end - Optional end date string
 * @param locale - Optional locale code (defaults to configured default locale)
 */
export function formatDateRange(start: string, end?: string, locale?: string) {
  if (!end) {
    return formatDate(start, locale, { dateStyle: "long" });
  }

  const startDate = formatDate(start, locale, { day: "2-digit", month: "short" });
  const endDate = formatDate(end, locale, { day: "2-digit", month: "short", year: "numeric" });

  return `${startDate} - ${endDate}`;
}

/** Month and year for travel list rows (e.g. "aprile 2024"). */
export function formatTravelMonthYear(date: string, locale?: string) {
  const intlLocale = getIntlLocale(locale);
  return new Date(date).toLocaleDateString(intlLocale, {
    month: "long",
    year: "numeric",
  });
}
