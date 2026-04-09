"use client";

import * as togeojson from "@tmcw/togeojson";
import type { FeatureCollection, LineString, MultiLineString } from "geojson";

import { withBasePath } from "@/lib/paths";

function resolvePath(filePath: string): string {
  return filePath.startsWith("http") ? filePath : withBasePath(filePath);
}

export async function fetchGpxAsRouteFeatureCollection(
  url: string,
): Promise<FeatureCollection> {
  const trackPath = resolvePath(url);
  const response = await fetch(trackPath);
  if (!response.ok) {
    throw new Error(`GPX ${response.status}: ${url}`);
  }
  const xmlText = await response.text();
  const dom = new DOMParser().parseFromString(xmlText, "application/xml");
  const geojson = togeojson.gpx(dom) as FeatureCollection;
  const features = geojson.features.filter(
    (feature) =>
      feature.geometry &&
      feature.geometry.type !== "Point" &&
      feature.geometry.type !== "MultiPoint",
  );
  return { type: "FeatureCollection", features };
}

export function mergeRouteFeatureCollections(
  collections: FeatureCollection[],
): FeatureCollection {
  return {
    type: "FeatureCollection",
    features: collections.flatMap((c) => c.features),
  };
}

function latLngLinesFromFeatureCollection(
  fc: FeatureCollection,
): [number, number][][] {
  const lines: [number, number][][] = [];
  for (const f of fc.features) {
    const g = f.geometry;
    if (!g) continue;
    if (g.type === "LineString") {
      const pts = (g as LineString).coordinates.map(
        (c) => [c[1], c[0]] as [number, number],
      );
      if (pts.length) lines.push(pts);
    } else if (g.type === "MultiLineString") {
      for (const seg of (g as MultiLineString).coordinates) {
        const pts = seg.map((c) => [c[1], c[0]] as [number, number]);
        if (pts.length) lines.push(pts);
      }
    }
  }
  return lines;
}

/** One polyline per source GPX (e.g. per day), for a single `<trk>` with multiple `<trkseg>`. */
export function daySegmentsLatLngForDownload(
  fcs: FeatureCollection[],
): [number, number][][] {
  return fcs
    .map((fc) => latLngLinesFromFeatureCollection(fc).flat())
    .filter((seg) => seg.length > 0);
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildMergedGpxXml(
  daySegments: [number, number][][],
  trackName: string,
): string {
  const name = escapeXml(trackName);
  const trksegs = daySegments
    .map((pts) => {
      const inner = pts
        .map(([lat, lng]) => `    <trkpt lat="${lat}" lon="${lng}"/>`)
        .join("\n");
      return `  <trkseg>\n${inner}\n  </trkseg>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" xmlns="http://www.topografix.com/GPX/1/1">
  <trk><name>${name}</name>
${trksegs}
  </trk>
</gpx>`;
}
