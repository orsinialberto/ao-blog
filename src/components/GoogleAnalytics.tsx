"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gtag } from "@/lib/gtag";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;
const COOKIE_CONSENT_KEY = "cookie-consent";

/**
 * Update consent state and initialize Google Analytics
 * Follows Google's Consent Mode v2 guidelines:
 * 1. Update consent state to 'granted' (consent update)
 * 2. Initialize gtag and config (if not already done)
 * 3. Load external gtag.js script
 * 
 * Reference: https://developers.google.com/tag-platform/security/guides/consent?consentmode=basic
 */
function initializeGoogleAnalytics(): void {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined") {
    return;
  }

  // Step 1: Update consent state to 'granted' (required by Consent Mode)
  // This must be done BEFORE loading the Google tag, and again if consent
  // was revoked and then given anew without a reload
  gtag('consent', 'update', {
    'analytics_storage': 'granted',
  });

  // Check if already initialized (prevent double loading)
  if (document.querySelector(`script[src*="gtag/js?id=${GA_MEASUREMENT_ID}"]`)) {
    return;
  }

  // Step 2: Queue init commands. Page views are sent manually (SPA), so the
  // automatic one is off; the current page is reported right away.
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, { send_page_view: false });
  sendPageView(window.location.pathname);

  // Step 3: Load external gtag.js script asynchronously
  // Equivalent to Google's first <script> tag with async attribute
  const externalScript = document.createElement("script");
  externalScript.async = true;
  externalScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(externalScript);
}

function sendPageView(path: string): void {
  gtag("event", "page_view", { page_path: path });
}

/**
 * Check if user has accepted cookies
 */
function hasConsented(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted";
}

/**
 * Google Analytics component
 * Implements Google Consent Mode v2: updates consent state and loads GA only after user consent
 * Tracks page views on route changes
 * 
 * Reference: https://developers.google.com/tag-platform/security/guides/consent?consentmode=basic
 */
export function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    // Only proceed if GA ID is available
    if (!GA_MEASUREMENT_ID) {
      return;
    }

    // Initialize GA if consent was already given
    if (hasConsented()) {
      initializeGoogleAnalytics();
    }

    // Listen for consent changes (from CookieBanner)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === COOKIE_CONSENT_KEY && e.newValue === "accepted") {
        initializeGoogleAnalytics();
      }
    };

    // Listen for custom consent event (in case storage event doesn't fire in same window)
    const handleConsentAccepted = () => {
      if (hasConsented()) {
        initializeGoogleAnalytics();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cookie-consent-accepted", handleConsentAccepted);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cookie-consent-accepted", handleConsentAccepted);
    };
  }, []);

  // Track page views on route changes (the first page is sent on initialization)
  const lastPath = useRef(pathname);
  useEffect(() => {
    if (!GA_MEASUREMENT_ID || !pathname || pathname === lastPath.current) {
      return;
    }
    lastPath.current = pathname;
    if (hasConsented()) {
      sendPageView(pathname);
    }
  }, [pathname]);

  return null;
}
