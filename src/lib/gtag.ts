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
