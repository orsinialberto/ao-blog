import { withBasePath } from "@/lib/paths";

/** Subset of map fields needed for static track download URL (no Node / fs). */
export type TrackFileMapFields = {
  gpx?: string;
  kml?: string;
  kmz?: string;
};

/** Public URL to download GPX/KML/KMZ track (same file used by the map when a single file is set). */
export function getTrackFileDownloadUrl(
  map?: TrackFileMapFields | null,
): string | undefined {
  const file = map?.gpx || map?.kml || map?.kmz;
  if (!file) return undefined;
  return file.startsWith("http") ? file : withBasePath(file);
}
