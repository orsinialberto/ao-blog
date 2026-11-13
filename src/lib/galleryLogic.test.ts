import { test } from "node:test";
import assert from "node:assert/strict";
import {
  stripCount,
  slotPhoto,
  emptyFrameIndex,
  frameSlot,
  trackShift,
  isOnFilmBand,
  parsePhotoParam,
  pickHomePhotos,
  orderFolderPhotos,
} from "./galleryLogic.ts";

test("stripCount", () => {
  assert.equal(stripCount(12, 5), 3); assert.equal(stripCount(15, 5), 3);
  assert.equal(stripCount(16, 5), 4); assert.equal(stripCount(3, 5), 1); assert.equal(stripCount(0, 5), 0);
});
test("slotPhoto wraps and leaves trailing frames empty", () => {
  assert.equal(slotPhoto(11, 12, 5), 11); assert.equal(slotPhoto(12, 12, 5), null);
  assert.equal(slotPhoto(14, 12, 5), null); assert.equal(slotPhoto(15, 12, 5), 0);
  assert.equal(slotPhoto(-1, 12, 5), null); assert.equal(slotPhoto(-4, 12, 5), 11);
});
test("emptyFrameIndex numbers the trailing frames and survives a full loop", () => {
  assert.equal(emptyFrameIndex(11, 12, 5), null); assert.equal(emptyFrameIndex(12, 12, 5), 0);
  assert.equal(emptyFrameIndex(14, 12, 5), 2); assert.equal(emptyFrameIndex(15, 12, 5), null);
  assert.equal(emptyFrameIndex(27, 12, 5), 0); assert.equal(emptyFrameIndex(-1, 12, 5), 2);
});
test("few photos: one strip, each photo once", () => {
  const shown = [0, 1, 2, 3, 4].map((k) => slotPhoto(frameSlot(0, 0, k, 5), 3, 5));
  assert.deepEqual(shown, [0, 1, 2, null, null]);
});
test("serpentine rows", () => {
  assert.deepEqual([0, 1, 2, 3, 4, 5].map((k) => frameSlot(0, 1, k, 5)), [10, 9, 8, 7, 6, 5]);
  assert.equal(frameSlot(2.4, 0, 0, 5), 2); assert.equal(frameSlot(2.4, 1, 5, 5), 7);
  assert.ok(Math.abs(trackShift(2.4, 0) + 0.4) < 1e-9); assert.ok(Math.abs(trackShift(2.4, 1) + 0.6) < 1e-9);
});
test("isOnFilmBand", () => {
  const band = { top: 0.073, bottom: 0.937 };
  assert.equal(isOnFilmBand(0.5, band), true); assert.equal(isOnFilmBand(0.05, band), false);
  assert.equal(isOnFilmBand(0.95, band), false);
});
test("parsePhotoParam", () => {
  assert.equal(parsePhotoParam("3", 12), 2); assert.equal(parsePhotoParam("12", 12), 11);
  for (const bad of [null, "", "0", "abc", "2.5", "13", "-1"]) assert.equal(parsePhotoParam(bad, 12), null);
});
test("pickHomePhotos", () => {
  const albums = [{ slug: "a", photos: ["a1", "a2"] }, { slug: "b", photos: [] }, { slug: "c", photos: ["c1"] }];
  assert.deepEqual(pickHomePhotos(albums, 6), [{ slug: "a", photo: "a1" }, { slug: "c", photo: "c1" }]);
  assert.equal(pickHomePhotos(albums, 1).length, 1);
});
test("orderFolderPhotos sorts images by file name and drops other files", () => {
  const resource = (display_name: string, resource_type = "image") => ({
    display_name,
    resource_type,
    secure_url: "https://x/" + display_name,
  });
  const listing = [resource("IMG_10"), resource("clip", "video"), resource("IMG_9"), resource("IMG_100")];
  assert.deepEqual(orderFolderPhotos(listing), ["https://x/IMG_9", "https://x/IMG_10", "https://x/IMG_100"]);
  assert.deepEqual(orderFolderPhotos([resource("IMG_1.heic")]), ["https://x/IMG_1.jpg"]);
});
