"use client";

import { useCallback, useState } from "react";

import { useTranslations } from "@/i18n/hooks";
import type { TravelMapData } from "@/lib/travels";
import { getTrackFileDownloadUrl } from "@/lib/trackFileUrl";
import {
  buildMergedGpxXml,
  daySegmentsLatLngForDownload,
  fetchGpxAsRouteFeatureCollection,
} from "@/lib/gpxTrackClient";

const buttonClassName =
  "inline-flex items-center rounded-full bg-brand-primary px-8 py-4 font-label text-xs font-bold uppercase tracking-widest text-white shadow-lg transition-transform hover:scale-[1.02] disabled:pointer-events-none disabled:opacity-60";

function DownloadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="mr-2 shrink-0"
      aria-hidden
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
  );
}

interface MotoTrackDownloadProps {
  map: TravelMapData;
  /** Used for the downloaded `.gpx` basename when merging segment files. */
  slug: string;
  trackTitle: string;
}

export function MotoTrackDownload({ map, slug, trackTitle }: MotoTrackDownloadProps) {
  const t = useTranslations();
  const m = t.components.motoTravel;
  const staticUrl = getTrackFileDownloadUrl(map);
  const segments = map.gpxSegments?.filter(Boolean) ?? [];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadMergedGpx = useCallback(async () => {
    if (segments.length === 0) return;
    setError(null);
    setLoading(true);
    try {
      const collections = await Promise.all(
        segments.map((path) => fetchGpxAsRouteFeatureCollection(path)),
      );
      const daySegs = daySegmentsLatLngForDownload(collections);
      if (daySegs.length === 0) {
        throw new Error("empty");
      }
      const xml = buildMergedGpxXml(daySegs, trackTitle);
      const blob = new Blob([xml], { type: "application/gpx+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slug}.gpx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError(m.downloadTrackError);
    } finally {
      setLoading(false);
    }
  }, [segments, slug, trackTitle, m.downloadTrackError]);

  if (staticUrl) {
    return (
      <a href={staticUrl} download className={buttonClassName}>
        <DownloadIcon />
        {m.downloadTrack}
      </a>
    );
  }

  if (segments.length > 0) {
    return (
      <div className="flex flex-col items-end gap-2">
        <button
          type="button"
          className={buttonClassName}
          onClick={() => void downloadMergedGpx()}
          disabled={loading}
          aria-busy={loading}
        >
          <DownloadIcon />
          {loading ? m.downloadTrackLoading : m.downloadTrack}
        </button>
        {error ? (
          <p className="max-w-xs text-right font-body text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  return null;
}
