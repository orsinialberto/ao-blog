import type { ClotheslineDrawing } from "@/lib/clotheslineGeometry";

// Positions inside the gallery drawings, measured on the pixels (not by eye):
// PNG → BMP with `sips -s format bmp`, then alpha and luminance read with the Python standard library.

// Roll + film (roll.png, 1200×805, resized from the 2400×1610 original). All values in % of the drawing.
// Measured on the original: frame windows are the transparent areas inside the film borders
// (x 645–1000, 1032–1564, 1597–2126; y 500 to 875/878/877); the canister's right outline ends at x 634;
// the label is the transparent front face of the canister, x 267–494, y 389–982.
export const ROLL = {
  src: "/images/galleria/roll.png",
  width: 1200,
  height: 805,
  frames: [
    { left: 26.88, top: 31.06, width: 14.83, height: 23.35 },
    { left: 43.0, top: 31.06, width: 22.21, height: 23.54 },
    { left: 66.54, top: 31.06, width: 22.08, height: 23.48 },
  ],
  canEdge: 26.42,
  label: { left: 11.12, top: 24.16, width: 9.5, height: 36.89 },
};

// Straight film tile. Placeholder values from the prototype, for the 4-frame drawing:
// the two middle frames alternate as tiles (by slot parity) until the seamless tile arrives.
export const FILM_TILE = {
  src: "/images/galleria/film-tile.jpg",
  aspect: "578 / 737",
  tiles: [
    { size: "476.2% 208.3%", position: "36.2% 50%" },
    { size: "507.6% 208.3%", position: "61.8% 50%" },
  ],
  window: { left: 4.5, top: 22.1, width: 92, height: 56.2 },
  band: { top: 0.073, bottom: 0.937 },
};

// Clothesline with six polaroids (clothesline.png, 1200×350). Drawing pixels of the shipped file:
// the measurements on the 2400×700 original (see the design spec) divided by 2.
export const CLOTHESLINE: ClotheslineDrawing = {
  src: "/images/galleria/clothesline.png",
  width: 1200,
  height: 350,
  rope: [[0, 58], [120, 80.5], [240, 98.5], [360, 109], [480, 117.5], [600, 120.5], [720, 117], [840, 110], [960, 98.5], [1080, 81.5], [1200, 58]],
  ropeHalf: 5.5,
  polaroids: [
    {
      body: [71, 83, 215, 252],
      pegs: [{ x0: 145, x1: 179, top: 22 }],
      pivotX: 162,
      window: [[106.5, 93], [201.5, 104.5], [178, 231.5], [84, 216.5]],
      pegHoles: [[141.5, 97, 11, 7.5]],
      amp: 2.2,
      dur: 3.4,
    },
    {
      body: [253, 105, 424, 241],
      pegs: [{ x0: 361, x1: 381, top: 93 }], // paper clip
      pivotX: 371,
      window: [[265, 125], [401, 124], [406, 218], [269, 224.5]],
      pegHoles: [[368, 124, 8, 8.5]],
      amp: 1.8,
      dur: 3.9,
    },
    {
      body: [456, 117, 628, 295],
      pegs: [{ x0: 472, x1: 494, top: 48 }, { x0: 585, x1: 609, top: 56 }],
      pivotX: 540.5,
      window: [[471.5, 129.5], [608.5, 138], [604, 272], [467.5, 267.5]],
      pegHoles: [],
      amp: 0.6,
      dur: 4.6,
    },
    {
      body: [656, 114, 823, 263],
      pegs: [{ x0: 705, x1: 740, top: 48 }],
      pivotX: 722.5,
      window: [[666, 134], [778, 128.5], [786, 241.5], [673, 248.5]],
      pegHoles: [],
      amp: 2,
      dur: 3.6,
    },
    {
      body: [828, 104, 997, 235],
      pegs: [{ x0: 831, x1: 865, top: 86 }], // paper clip
      pivotX: 848,
      window: [[843, 119.5], [980.5, 114.5], [977.5, 215.5], [840.5, 212]],
      pegHoles: [[856, 118.5, 8.5, 9]],
      amp: 2,
      dur: 4.1,
    },
    {
      body: [1027, 76, 1159, 169],
      pegs: [{ x0: 1025, x1: 1042, top: 71 }, { x0: 1125, x1: 1141, top: 54 }], // paper clips
      pivotX: 1083,
      window: [[1036.5, 96], [1134.5, 80], [1143.5, 137.5], [1047.5, 155]],
      pegHoles: [],
      amp: 0.8,
      dur: 3.2,
    },
  ],
};
