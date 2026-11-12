import { CLOUDINARY_CLOUD_NAME } from "./imageOptimization";
import { orderFolderPhotos, type FolderResource } from "./galleryLogic";

const PAGE_SIZE = 500;

interface FolderPage {
  resources: FolderResource[];
  next_cursor?: string;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error("Missing " + name + " (needed to list Cloudinary album folders)");
  return value;
}

async function fetchFolderPhotos(folder: string): Promise<string[]> {
  const credentials = requireEnv("CLOUDINARY_API_KEY") + ":" + requireEnv("CLOUDINARY_API_SECRET");
  const authorization = "Basic " + Buffer.from(credentials).toString("base64");
  const resources: FolderResource[] = [];
  let cursor: string | undefined;

  do {
    const query = new URLSearchParams({ asset_folder: folder, max_results: String(PAGE_SIZE) });
    if (cursor) query.set("next_cursor", cursor);
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/resources/by_asset_folder?${query}`,
      { headers: { Authorization: authorization } },
    );
    if (!response.ok) {
      throw new Error(`Cloudinary folder "${folder}": ${response.status} ${await response.text()}`);
    }
    const page = (await response.json()) as FolderPage;
    resources.push(...page.resources);
    cursor = page.next_cursor;
  } while (cursor);

  const photos = orderFolderPhotos(resources);
  if (photos.length === 0) throw new Error(`Cloudinary folder "${folder}" has no images`);
  return photos;
}

const folderCache = new Map<string, Promise<string[]>>();

/** URLs of every image in a Cloudinary folder, sorted by file name. One request per folder per process. */
export function listFolderPhotos(folder: string): Promise<string[]> {
  let photos = folderCache.get(folder);
  if (!photos) {
    photos = fetchFolderPhotos(folder);
    folderCache.set(folder, photos);
  }
  return photos;
}
