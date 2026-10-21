/** One page of the Info carousel: a motorcycle that has been owned, shown as
 *  a photo, a caption and a short text. Order here is carousel order.
 *
 *  `image` is a `v<version>/<publicId>.<format>` path, the same shape
 *  `collections.ts` uses for its covers, and for the same reason: the asset
 *  carries no `library` tag (nor any collection tag), so it never appears in
 *  the gallery, and the page renders without querying Cloudinary.
 *
 *  `onTheRoad.bikes.<id>.{name,caption,text}` must exist in BOTH message
 *  files — nothing links `id` to the messages at compile time, so a missing
 *  key renders as the raw key, same contract as routes and collections. */
export type Bike = {
  id: string;
  image: string;
};

export const bikes: Bike[] = [
  { id: 'bike-2', image: 'v1787478189/minimoto-cfx1_jx1oi9.jpg' },
  { id: 'bike-3', image: 'v1787478189/hm-50-derapage_cobh6b.jpg' },
  { id: 'bike-4', image: 'v1787478189/ktm-125-exc_grceg3.jpg' },
  { id: 'bike-5', image: 'v1787478189/honda-cb650R_iaouoz.jpg' },
  { id: 'bike-6', image: 'v1787478189/mv-turismo-veloce-800_a6pa57.jpg' },
];
