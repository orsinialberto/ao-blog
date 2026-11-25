/** Header navigation: the AO logo leads to the hub, Home scrolls up when already home. */

export function hubUrl(locale: string): string {
  return locale === "en" ? "https://albertorsini.it/en/" : "https://albertorsini.it/";
}

type Click = {
  button: number;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
};

/** True for a plain click on Home while on the home page: scroll up instead of navigating. */
export function staysOnPage(cleanPath: string, click: Click): boolean {
  const onHome = cleanPath === "/" || cleanPath === "";
  const modified = click.metaKey || click.ctrlKey || click.shiftKey || click.altKey;
  return onHome && click.button === 0 && !modified;
}
