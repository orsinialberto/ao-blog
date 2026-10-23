// Mascot illustrations for the home page and travel stories (public/images/bears/). Sizes are the intrinsic pixel size of each file.
export const BEARS = {
  wave: { src: "/images/bears/bear-wave.webp", width: 740, height: 691 },
  rest: { src: "/images/bears/bear-rest.webp", width: 754, height: 507 },
  hiker: { src: "/images/bears/bear-hiker.webp", width: 900, height: 618 },
  tent: { src: "/images/bears/bear-tent.webp", width: 900, height: 576 },
  // standing and beer share the same crop, so they can be crossfaded in place
  standing: { src: "/images/bears/bear-standing.webp", width: 550, height: 690 },
  beer: { src: "/images/bears/bear-beer.webp", width: 550, height: 690 },
  // travel story bears (Sellaronda), all 560px tall so they show at the same size; throw1 and throw2 share one canvas, so they can be crossfaded in place
  pretzel: { src: "/images/bears/bear-pretzel.webp", width: 676, height: 560 },
  ski: { src: "/images/bears/bear-ski.webp", width: 463, height: 560 },
  // the snowplough skier hit by the snowball, drawn on the same baseline as ski but on a wider canvas
  skiHit: { src: "/images/bears/bear-ski-hit.webp", width: 681, height: 467 },
  snowboard: { src: "/images/bears/bear-snowboard.webp", width: 581, height: 560 },
  throw1: { src: "/images/bears/bear-throw-1.webp", width: 606, height: 560 },
  throw2: { src: "/images/bears/bear-throw-2.webp", width: 606, height: 560 },
} as const;

export type BearName = keyof typeof BEARS;
