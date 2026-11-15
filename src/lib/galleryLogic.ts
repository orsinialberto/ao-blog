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

// Position of a ribbon slot among the empty trailing frames (0 for the first one), or null if it holds a photo.
export function emptyFrameIndex(slot: number, photoCount: number, perStrip: number): number | null {
  const ribbonLength = stripCount(photoCount, perStrip) * perStrip;
  const index = mod(slot, ribbonLength);
  return index < photoCount ? null : index - photoCount;
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

// Hover speed in frames per second for a mouse at xFraction (0 left, 1 right) of a row's strip.
// The film slides towards the side the mouse is on, faster near the edge, still in the middle.
// Even rows slide left as the offset grows, odd rows right: the sign follows the row.
export function hoverVelocity(xFraction: number, row: number, maxSpeed: number, deadZone: number): number {
  const fromCenter = Math.min(Math.max(xFraction, 0), 1) * 2 - 1;
  const strength = Math.max(Math.abs(fromCenter) - deadZone, 0) / (1 - deadZone);
  const toRight = fromCenter > 0 ? 1 : -1;
  return maxSpeed * strength * toRight * (row % 2 === 0 ? 1 : -1);
}

// Moves value towards target, covering the share of the gap an exponential ease of time
// constant tau (seconds) covers in dt: the same feel at any frame rate.
export function easeTowards(value: number, target: number, dt: number, tau: number): number {
  return target + (value - target) * Math.exp(-dt / tau);
}

// Speed (units per second) at the end of a drag, from its recent samples (time in ms, oldest first):
// the slope over the samples in the last windowMs, 0 if the finger stood still before letting go.
export function releaseVelocity(
  samples: { time: number; value: number }[],
  now: number,
  windowMs: number,
): number {
  const recent = samples.filter((sample) => now - sample.time <= windowMs);
  if (recent.length < 2) return 0;
  const first = recent[0];
  const last = recent[recent.length - 1];
  const elapsed = last.time - first.time;
  return elapsed > 0 ? ((last.value - first.value) * 1000) / elapsed : 0;
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

export interface FolderResource {
  resource_type: string;
  secure_url: string;
  display_name: string;
}

// Image URLs of a Cloudinary folder listing, by file name ("IMG_9" before "IMG_10").
// HEIC files are requested as JPEG, which browsers can show.
export function orderFolderPhotos(resources: FolderResource[]): string[] {
  return resources
    .filter((resource) => resource.resource_type === "image")
    .sort((a, b) => a.display_name.localeCompare(b.display_name, "en", { numeric: true }))
    .map((resource) => resource.secure_url.replace(/\.heic$/i, ".jpg"));
}
