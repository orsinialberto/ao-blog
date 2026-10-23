declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Defines window.gtag if missing.
 * gtag.js only recognises commands pushed as `arguments` objects, not arrays,
 * so a rest-parameter version would be silently ignored.
 */
export function ensureGtag(): void {
  window.dataLayer = window.dataLayer || [];
  if (window.gtag) return;
  window.gtag = function () {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
}

export function gtag(...args: unknown[]): void {
  ensureGtag();
  window.gtag!(...args);
}

/** Stops measurement and deletes the Google Analytics cookies (_ga, _ga_<ID>). */
export function revokeAnalyticsConsent(): void {
  if (window.gtag) {
    window.gtag("consent", "update", { analytics_storage: "denied" });
  }
  const host = window.location.hostname;
  for (const entry of document.cookie.split("; ")) {
    const name = entry.split("=")[0];
    if (!name.startsWith("_ga")) continue;
    for (const domain of [host, `.${host}`]) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`;
    }
  }
}
