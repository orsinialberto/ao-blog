"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "@/i18n/hooks";
import { LocalizedLink } from "./LocalizedLink";
import { revokeAnalyticsConsent } from "@/lib/gtag";

const COOKIE_CONSENT_KEY = "cookie-consent";
/** Dispatched by the footer link to let the visitor change their choice. */
export const OPEN_COOKIE_BANNER_EVENT = "open-cookie-banner";

type CookieConsent = "accepted" | "rejected" | null;

export function CookieBanner() {
  const t = useTranslations();
  const [showBanner, setShowBanner] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY) as CookieConsent;
    
    if (consent) return;

    // Timers keep setState out of the effect body; the delay lets the fade-in animate
    const showTimer = setTimeout(() => setShowBanner(true), 0);
    const fadeTimer = setTimeout(() => setIsVisible(true), 100);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(fadeTimer);
    };
  }, []);

  useEffect(() => {
    const open = () => {
      setShowBanner(true);
      setTimeout(() => setIsVisible(true), 100);
    };
    window.addEventListener(OPEN_COOKIE_BANNER_EVENT, open);
    return () => window.removeEventListener(OPEN_COOKIE_BANNER_EVENT, open);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 300);
    
    // Dispatch custom event to notify GoogleAnalytics component
    // This ensures immediate initialization even in the same window
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("cookie-consent-accepted"));
    }
  };

  const handleReject = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "rejected");
    revokeAnalyticsConsent();
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 300);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transform transition-all duration-300 ease-in-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
      role="dialog"
      aria-label={t.components.cookieBanner.title}
    >
      <div className="bg-white border-t border-gray-200 shadow-lg">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1 space-y-2">
              <p className="text-sm font-semibold text-brand-primary">
                {t.components.cookieBanner.title}
              </p>
              <p className="text-sm text-brand-muted">
                {t.components.cookieBanner.description}{" "}
                <LocalizedLink
                  href="/privacy"
                  className="text-brand-accent underline hover:text-brand-accent/80"
                >
                  {t.components.cookieBanner.privacyPolicy}
                </LocalizedLink>
                .
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                onClick={handleReject}
                className="px-6 py-2 text-sm font-semibold text-white bg-brand-accent hover:bg-brand-accent/90 rounded-lg transition-colors whitespace-nowrap"
                aria-label={t.components.cookieBanner.rejectAriaLabel}
              >
                {t.components.cookieBanner.reject}
              </button>
              <button
                onClick={handleAccept}
                className="px-6 py-2 text-sm font-semibold text-white bg-brand-accent hover:bg-brand-accent/90 rounded-lg transition-colors whitespace-nowrap"
                aria-label={t.components.cookieBanner.acceptAriaLabel}
              >
                {t.components.cookieBanner.accept}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

