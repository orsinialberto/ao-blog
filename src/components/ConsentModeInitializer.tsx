"use client";

import { useEffect } from "react";
import { gtag } from "@/lib/gtag";

/**
 * Consent Mode Initializer
 * Sets default consent state before user interaction as per Google's guidelines
 * This must run before the consent banner and before any Google tags are loaded
 * 
 * Reference: https://developers.google.com/tag-platform/security/guides/consent?consentmode=basic
 */
export function ConsentModeInitializer() {
  useEffect(() => {
    // Set default consent state (all denied) before user interaction
    // This is required by Google's Consent Mode v2
    gtag('consent', 'default', {
      'ad_user_data': 'denied',
      'ad_personalization': 'denied',
      'ad_storage': 'denied',
      'analytics_storage': 'denied',
      'wait_for_update': 500,
    });
  }, []);

  return null;
}
