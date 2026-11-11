// Pure gallery logic. Must not import anything (run directly by Node tests).

export const PER_STRIP_DESKTOP = 5;
export const PER_STRIP_MOBILE = 3;

export function stripCount(photoCount: number, perStrip: number): number {
  return Math.ceil(photoCount / perStrip);
}

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

// Photo index shown in a ribbon slot, or null for an empty trailing frame.
export function slotPhoto(slot: number, photoCount: number, perStrip: number): number | null {
  const ribbonLength = stripCount(photoCount, perStrip) * perStrip;
  const index = mod(slot, ribbonLength);
  return index < photoCount ? index : null;
}

// Unwrapped slot shown in frame k (0..perStrip) of a row; odd rows run right to left.
export function frameSlot(offset: number, row: number, k: number, perStrip: number): number {
  const base = Math.floor(offset);
  const rowStart = base + row * perStrip;
  return row % 2 === 0 ? rowStart + k : rowStart + perStrip - k;
}

// Horizontal shift of a row's track, in frames.
export function trackShift(offset: number, row: number): number {
  const frac = offset - Math.floor(offset);
  return row % 2 === 0 ? -frac : frac - 1;
}

export function isOnFilmBand(yFraction: number, band: { top: number; bottom: number }): boolean {
  return yFraction > band.top && yFraction < band.bottom;
}

// "3" (1-based) -> 2 (0-based); anything invalid -> null.
export function parsePhotoParam(value: string | null, photoCount: number): number | null {
  if (value === null || !/^[1-9]\d*$/.test(value)) return null;
  const number = Number(value);
  return number <= photoCount ? number - 1 : null;
}

export function pickHomePhotos(
  albums: { slug: string; photos: string[] }[],
  max: number,
): { slug: string; photo: string }[] {
  return albums
    .filter((album) => album.photos.length > 0)
    .slice(0, max)
    .map((album) => ({ slug: album.slug, photo: album.photos[0] }));
}

export function requireShortTitle(
  value: unknown,
  hasGallery: boolean,
  fileName: string,
): string | undefined {
  const title = typeof value === "string" ? value.trim() : "";
  if (title) return title;
  if (hasGallery) throw new Error("Missing shortTitle in " + fileName + " (required when gallery is set)");
  return undefined;
}
