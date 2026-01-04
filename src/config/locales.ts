/**
 * Supported locales configuration
 * Used for internationalization setup
 */
export const supportedLocales = ["it", "en"] as const;

export type SupportedLocale = (typeof supportedLocales)[number];

export const defaultLocale: SupportedLocale = "it";

export const localeConfig = {
  it: {
    code: "it",
    name: "Italiano",
    nativeName: "Italiano",
  },
  en: {
    code: "en",
    name: "English",
    nativeName: "English",
  },
} as const;
