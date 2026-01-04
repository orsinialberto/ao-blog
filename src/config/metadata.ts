import { strings } from "./strings";

export const siteMetadata = {
  title: {
    default: strings.common.siteName,
    template: `%s · ${strings.common.siteName}`,
  },
  description:
    "Itinerari, foto e appunti di viaggio raccontati attraverso un sito veloce e moderno.",
  url: "https://albertorsini.it",
  locale: "it-IT",
};

