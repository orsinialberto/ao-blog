export const CONTINENT_TAGS = [
  "Europa",
  "Asia",
  "Africa",
  "America",
  "Nord America",
  "Sud America",
  "Oceania",
  "Antartide",
] as const;

export type ContinentTag = typeof CONTINENT_TAGS[number];

export function isContinentTag(tag: string): tag is ContinentTag {
  return CONTINENT_TAGS.includes(tag as ContinentTag);
}

