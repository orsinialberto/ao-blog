// Pure geometry for the clothesline drawing. Must not import anything (run directly by Node tests).
// All inputs are in drawing pixels; clip paths come out in % of the drawing.

export type Pt = [number, number];

export interface Polaroid {
  body: [number, number, number, number]; // x0, y0, x1, y1
  pegs: { x0: number; x1: number; top: number }[];
  pivotX: number;
  window: [Pt, Pt, Pt, Pt]; // TL, TR, BR, BL
  pegHoles: [number, number, number, number][]; // x, y, width, height
  amp: number; // swing amplitude, degrees
  dur: number; // swing period, seconds
}

export interface ClotheslineDrawing {
  src: string;
  width: number;
  height: number;
  rope: Pt[]; // rope centre line, sorted by x
  ropeHalf: number; // half thickness of the rope band
  polaroids: Polaroid[];
}

const ROPE_STEP = 12;
const BODY_MARGIN = 8;
const BODY_BOTTOM_EXTRA = 12;

export function ropeY(rope: Pt[], x: number): number {
  if (x <= rope[0][0]) return rope[0][1];
  for (let i = 1; i < rope.length; i++) {
    const [x1, y1] = rope[i];
    if (x <= x1) {
      const [x0, y0] = rope[i - 1];
      return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
    }
  }
  return rope[rope.length - 1][1];
}

function polygon(d: ClotheslineDrawing, points: Pt[]): string {
  const pct = (n: number, total: number) => `${((n / total) * 100).toFixed(2)}%`;
  return `polygon(${points.map(([x, y]) => `${pct(x, d.width)} ${pct(y, d.height)}`).join(", ")})`;
}

// x positions from x0 to x1 every ROPE_STEP, always including x1.
function samples(x0: number, x1: number): number[] {
  const xs: number[] = [];
  for (let x = x0; x < x1; x += ROPE_STEP) xs.push(x);
  xs.push(x1);
  return xs;
}

export function ropeBandClipPath(d: ClotheslineDrawing): string {
  const xs = samples(0, d.width);
  const top: Pt[] = xs.map((x) => [x, ropeY(d.rope, x) - d.ropeHalf]);
  const bottom: Pt[] = xs.reverse().map((x) => [x, ropeY(d.rope, x) + d.ropeHalf]);
  return polygon(d, [...top, ...bottom]);
}

export function bodyClipPath(d: ClotheslineDrawing, p: Polaroid): string {
  const x0 = p.body[0] - BODY_MARGIN;
  const x1 = p.body[2] + BODY_MARGIN;
  const bottom = p.body[3] + BODY_BOTTOM_EXTRA;
  const top: Pt[] = samples(x0, x1).map((x) => [x, ropeY(d.rope, x) + d.ropeHalf]);
  return polygon(d, [...top, [x1, bottom], [x0, bottom]]);
}

export function pegClipPath(d: ClotheslineDrawing, peg: Polaroid["pegs"][number]): string {
  return polygon(d, [
    [peg.x0, peg.top],
    [peg.x1, peg.top],
    [peg.x1, ropeY(d.rope, peg.x1) + d.ropeHalf],
    [peg.x0, ropeY(d.rope, peg.x0) + d.ropeHalf],
  ]);
}

export function pivot(d: ClotheslineDrawing, p: Polaroid): { x: string; y: string } {
  return {
    x: `${(p.pivotX / d.width) * 100}%`,
    y: `${(ropeY(d.rope, p.pivotX) / d.height) * 100}%`,
  };
}

// Mask for the photo inside a polaroid: the window quad minus the peg holes, relative to the window's bounding box.
export function windowMask(p: Polaroid): {
  box: { left: number; top: number; width: number; height: number };
  svg: string;
} {
  const xs = p.window.map(([x]) => x);
  const ys = p.window.map(([, y]) => y);
  const left = Math.min(...xs);
  const top = Math.min(...ys);
  const width = Math.max(...xs) - left;
  const height = Math.max(...ys) - top;
  const n = (v: number) => String(Number(v.toFixed(2)));

  const quad = `M${p.window.map(([x, y]) => `${n(x - left)},${n(y - top)}`).join("L")}Z`;
  const holes = p.pegHoles.map(([x, y, w, h]) => `M${n(x - left)},${n(y - top)}h${n(w)}v${n(h)}h${n(-w)}z`);
  const path = [quad, ...holes].join(" ");
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${n(width)} ${n(height)}' preserveAspectRatio='none'>` +
    `<path fill-rule='evenodd' d='${path}'/></svg>`;
  return { box: { left, top, width, height }, svg };
}
