// Mascot illustrations for the home page (public/images/bears/). Sizes are the intrinsic pixel size of each file.
export const BEARS = {
  wave: { src: "/images/bears/bear-wave.webp", width: 740, height: 691 },
  rest: { src: "/images/bears/bear-rest.webp", width: 754, height: 507 },
  hiker: { src: "/images/bears/bear-hiker.webp", width: 900, height: 618 },
  tent: { src: "/images/bears/bear-tent.webp", width: 900, height: 576 },
  // standing and beer share the same crop, so they can be crossfaded in place
  standing: { src: "/images/bears/bear-standing.webp", width: 550, height: 690 },
  beer: { src: "/images/bears/bear-beer.webp", width: 550, height: 690 },
} as const;

export type BearName = keyof typeof BEARS;
