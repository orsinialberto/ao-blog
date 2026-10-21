/** Copies MapLibre's web worker next to the other public assets.
 *
 * MapLibre 6 no longer inlines its worker: it resolves it at runtime with
 * `new URL('./maplibre-gl-worker.mjs', import.meta.url)`. Turbopack rewrites
 * that expression while bundling the library, and gets it wrong — in a
 * production build `import.meta.url` is not an http(s) URL, so MapLibre falls
 * back to `new Worker('')`, which loads the HTML page as a script and kills the
 * worker on the spot. A dead worker means no vector tiles and no GeoJSON
 * tiling, i.e. an empty map with only the raster relief and the DOM markers
 * left standing — and no `error` event to notice it by.
 *
 * So the worker is served from `public/` instead and handed to MapLibre by
 * `setWorkerUrl` in `MapCanvas`. Both files are needed: the worker imports its
 * shared half by relative path, so the two have to sit in the same directory.
 *
 * Copied at `predev`/`prebuild` rather than committed, so the files can never
 * drift from the installed version. `public/maplibre/` is gitignored.
 */
import { copyFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const FILES = ['maplibre-gl-worker.mjs', 'maplibre-gl-shared.mjs'];

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const from = join(root, 'node_modules', 'maplibre-gl', 'dist');
const to = join(root, 'public', 'maplibre');

await mkdir(to, { recursive: true });
for (const file of FILES) {
  await copyFile(join(from, file), join(to, file));
}
