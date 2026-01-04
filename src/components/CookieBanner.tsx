"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "@/i18n/hooks";
import { LocalizedLink } from "./LocalizedLink";

const COOKIE_CONSENT_KEY = "cookie-consent";

type CookieConsent = "accepted" | "rejected" | null;

export function CookieBanner() {
  const t = useTranslations();
  const [showBanner, setShowBanner] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY) as CookieConsent;
    
    if (!consent) {
      setShowBanner(true);
      // Small delay for smooth animation
      setTimeout(() => setIsVisible(true), 100);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 300);
  };

  const handleReject = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "rejected");
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
      aria-label="Cookie consent banner"
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
                  href="/about"
                  className="text-brand-accent underline hover:text-brand-accent/80"
                >
                  {t.components.cookieBanner.moreInfo}
                </LocalizedLink>
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                onClick={handleReject}
                className="px-4 py-2 text-sm font-medium text-brand-muted hover:text-brand-primary transition-colors whitespace-nowrap"
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

