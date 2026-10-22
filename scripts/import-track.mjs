#!/usr/bin/env node
// Converts a raw GeoJSON/GPX-exported track into `src/data/routes/<slug>.track.json`:
// strips elevation/time, rounds to 5 decimals (~1.1m), and simplifies with
// Ramer-Douglas-Peucker so a multi-thousand-point GPS log becomes a track the
// map bundle can afford. Default tolerance (0.0001deg, ~9m at mid latitudes)
// sits below hairpin scale; raise it with --tolerance only if the file is too big.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { resolve } from 'node:path';

const DEFAULT_TOLERANCE = 0.0001;

function parseArgs(argv) {
  const [input, slug, ...rest] = argv;
  if (!input || !slug) {
    console.error('Usage: npm run track:import <path-to-geojson> <slug> [--tolerance 0.0001]');
    process.exit(1);
  }
  let tolerance = DEFAULT_TOLERANCE;
  const tIndex = rest.indexOf('--tolerance');
  if (tIndex !== -1) {
    tolerance = Number(rest[tIndex + 1]);
    if (!Number.isFinite(tolerance) || tolerance <= 0) {
      console.error(`--tolerance must be a positive number, got "${rest[tIndex + 1]}".`);
      process.exit(1);
    }
  }
  return { input, slug, tolerance };
}

/** Accepts the three shapes a real export takes: FeatureCollection (first
    LineString wins), Feature<LineString>, or a bare LineString geometry. */
function extractCoordinates(raw) {
  let node = raw;
  if (node.type === 'FeatureCollection') {
    node = node.features.find((f) => f.geometry?.type === 'LineString');
    if (!node) throw new Error('No LineString feature found in FeatureCollection.');
  }
  if (node.type === 'Feature') node = node.geometry;
  if (node.type !== 'LineString') throw new Error(`Expected a LineString, got "${node.type}".`);
  return node.coordinates.map(([lon, lat]) => [lon, lat]);
}

function validate(points, label) {
  if (points.length < 2) throw new Error(`${label} has ${points.length} point(s); need at least 2.`);
  points.forEach(([lon, lat], i) => {
    if (typeof lon !== 'number' || typeof lat !== 'number') {
      throw new Error(`${label} point ${i} is not a [lon, lat] pair: ${JSON.stringify(points[i])}.`);
    }
    if (lon < -180 || lon > 180 || lat < -90 || lat > 90) {
      throw new Error(`${label} point ${i} is out of range: [${lon}, ${lat}]. Check for a swapped [lat, lon] pair.`);
    }
  });
}

function perpendicularDistance(point, lineStart, lineEnd) {
  const [x, y] = point;
  const [x1, y1] = lineStart;
  const [x2, y2] = lineEnd;
  const dx = x2 - x1;
  const dy = y2 - y1;
  if (dx === 0 && dy === 0) return Math.hypot(x - x1, y - y1);
  const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy));
}

function simplify(points, tolerance) {
  if (points.length < 3) return points;
  let maxDistance = -1;
  let index = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const distance = perpendicularDistance(points[i], points[0], points[points.length - 1]);
    if (distance > maxDistance) {
      maxDistance = distance;
      index = i;
    }
  }
  if (maxDistance > tolerance) {
    const left = simplify(points.slice(0, index + 1), tolerance);
    const right = simplify(points.slice(index), tolerance);
    return left.slice(0, -1).concat(right);
  }
  return [points[0], points[points.length - 1]];
}

function round(points, decimals = 5) {
  const factor = 10 ** decimals;
  return points.map(([lon, lat]) => [Math.round(lon * factor) / factor, Math.round(lat * factor) / factor]);
}

const EARTH_RADIUS_M = 6_371_000;
const toRad = (deg) => (deg * Math.PI) / 180;
function haversine(a, b) {
  const dLat = toRad(b[1] - a[1]);
  const dLon = toRad(b[0] - a[0]);
  const la = toRad(a[1]);
  const lb = toRad(b[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la) * Math.cos(lb) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
}
function trackLengthKm(points) {
  let total = 0;
  for (let i = 1; i < points.length; i++) total += haversine(points[i - 1], points[i]);
  return total / 1000;
}

function main() {
  const { input, slug, tolerance } = parseArgs(process.argv.slice(2));
  const inputPath = resolve(input);
  if (!existsSync(inputPath)) {
    console.error(`No such file: ${inputPath}`);
    process.exit(1);
  }

  const raw = JSON.parse(readFileSync(inputPath, 'utf8'));
  const rawPoints = extractCoordinates(raw);
  validate(rawPoints, `${input} (raw)`);

  const simplified = simplify(rawPoints, tolerance);
  const rounded = round(simplified);
  validate(rounded, `${slug}.track.json`);

  const outputPath = resolve('src/data/routes', `${slug}.track.json`);
  const json = JSON.stringify(rounded);
  writeFileSync(outputPath, json + '\n');

  const rawKm = trackLengthKm(rawPoints);
  const simplifiedKm = trackLengthKm(rounded);
  const deltaPct = (((rawKm - simplifiedKm) / rawKm) * 100).toFixed(1);
  const diskKB = (json.length / 1024).toFixed(1);
  const gzipKB = (gzipSync(json).length / 1024).toFixed(1);

  console.log(`Wrote ${outputPath}`);
  console.log(`  tolerance:  ${tolerance}deg`);
  console.log(`  points:     ${rawPoints.length} -> ${rounded.length}`);
  console.log(`  length:     ${rawKm.toFixed(1)} km -> ${simplifiedKm.toFixed(1)} km (${deltaPct}% shorter)`);
  console.log(`  size:       ${diskKB} KB on disk, ${gzipKB} KB gzipped`);
  if (Number(deltaPct) > 2) {
    console.warn(
      `  warning: length shrank by more than 2% -- hairpins may be getting cut. Try a smaller --tolerance.`,
    );
  }
}

main();
