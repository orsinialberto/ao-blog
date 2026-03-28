"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useLocale, useTranslations } from "@/i18n/hooks";
import { removeLocaleFromPath, addLocaleToPath } from "@/lib/i18n/routing";
import { supportedLocales, localeConfig, type SupportedLocale } from "@/config/locales";

interface LanguageSwitcherProps {
  /**
   * Whether the header is transparent (affects styling)
   */
  isTransparent?: boolean;
}

/**
 * LanguageSwitcher component
 * Allows users to switch between available locales while preserving the current path and query parameters
 * Uses a globe icon with a dropdown menu
 *
 * @example
 * ```tsx
 * <LanguageSwitcher isTransparent={true} />
 * ```
 */
export function LanguageSwitcher({ isTransparent = false }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentLocale = useLocale();
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /**
   * Get the path without locale prefix
   */
  const pathWithoutLocale = removeLocaleFromPath(pathname || "/");

  /**
   * Get query string if present
   */
  const queryString = searchParams.toString();
  const fullQueryString = queryString ? `?${queryString}` : "";

  /**
   * Close dropdown when clicking outside
   */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  /**
   * Close dropdown on Escape key
   */
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  /**
   * Handle language switch
   * Navigates to the same page in the selected language, preserving query params
   */
  const handleLanguageSwitch = (newLocale: SupportedLocale) => {
    if (newLocale === currentLocale) {
      setIsOpen(false);
      return;
    }

    // Create new path with the selected locale
    const newPath = addLocaleToPath(pathWithoutLocale, newLocale);
    const fullPath = `${newPath}${fullQueryString}`;

    // Navigate to the new path
    router.push(fullPath);
    setIsOpen(false);

    // Store preference in localStorage for future visits
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("preferredLocale", newLocale);
      } catch (error) {
        // Ignore localStorage errors (e.g., in private browsing)
        console.warn("Failed to save locale preference:", error);
      }
    }
  };

  /**
   * Get aria label for language menu item
   */
  const getAriaLabel = (locale: SupportedLocale): string => {
    if (locale === "it") {
      return t.components.languageSwitcher.switchToItalian;
    }
    return t.components.languageSwitcher.switchToEnglish;
  };

  const textColor = isTransparent ? "text-white" : "text-brand-muted";
  const borderColor = isTransparent ? "border-white/30" : "border-brand-outline-variant";
  const hoverBg = isTransparent ? "hover:bg-white/20" : "hover:bg-brand-surface";
  const activeBg = isTransparent ? "bg-white/10" : "bg-brand-surface";
  const bgColor = isTransparent ? "bg-black/40 backdrop-blur-sm" : "bg-brand-background";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Globe Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t.components.languageSwitcher.language}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`
          flex items-center justify-center
          rounded-lg p-2 transition-colors
          ${textColor}
          ${isOpen ? activeBg : `bg-transparent ${hoverBg}`}
        `}
      >
        {/* Globe SVG Icon */}
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          <path d="M2 12h20" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`
            absolute right-0 z-50 mt-2 min-w-[140px] rounded-lg border shadow-lg
            ${bgColor}
            ${borderColor}
          `}
          role="menu"
          aria-label={t.components.languageSwitcher.language}
        >
          {supportedLocales.map((locale) => {
            const isActive = locale === currentLocale;
            const localeName = localeConfig[locale].nativeName;

            return (
              <button
                key={locale}
                onClick={() => handleLanguageSwitch(locale)}
                role="menuitem"
                aria-label={getAriaLabel(locale)}
                aria-current={isActive ? "true" : "false"}
                className={`
                  w-full px-4 py-2 text-left text-sm font-medium transition-colors
                  first:rounded-t-lg last:rounded-b-lg
                  focus:outline-none
                  ${textColor}
                  ${isActive ? activeBg : hoverBg}
                  ${isActive ? "cursor-default font-semibold" : "cursor-pointer"}
                `}
                disabled={isActive}
              >
                {localeName}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
