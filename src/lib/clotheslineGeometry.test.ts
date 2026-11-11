import { test } from "node:test";
import assert from "node:assert/strict";
import {
  ropeY,
  ropeBandClipPath,
  bodyClipPath,
  pegClipPath,
  pivot,
  windowMask,
  type ClotheslineDrawing,
  type Polaroid,
} from "./clotheslineGeometry.ts";

const p: Polaroid = {
  body: [20, 25, 40, 60],
  pegs: [{ x0: 28, x1: 32, top: 5 }],
  pivotX: 30,
  window: [[22, 30], [38, 30], [38, 55], [22, 55]],
  pegHoles: [[29, 30, 2, 3]],
  amp: 1,
  dur: 3,
};
const d: ClotheslineDrawing = {
  src: "x",
  width: 100,
  height: 100,
  rope: [[0, 10], [100, 30]],
  ropeHalf: 1,
  polaroids: [p],
};

test("ropeY interpolates and clamps to the end points", () => {
  assert.equal(ropeY(d.rope, 50), 20);
  assert.equal(ropeY(d.rope, -5), 10);
  assert.equal(ropeY(d.rope, 200), 30);
});
test("ropeBandClipPath starts at the top edge of the band", () => {
  assert.ok(ropeBandClipPath(d).startsWith("polygon(0.00% 9.00%"));
});
test("pivot sits on the rope", () => {
  assert.deepEqual(pivot(d, p), { x: "30%", y: "16%" });
});
test("windowMask", () => {
  const mask = windowMask(p);
  assert.deepEqual(mask.box, { left: 22, top: 30, width: 16, height: 25 });
  assert.ok(mask.svg.includes("fill-rule='evenodd'"));
  assert.ok(mask.svg.includes("M7,0h2v3h-2z"));
});
test("pegClipPath starts at the peg top", () => {
  assert.ok(pegClipPath(d, p.pegs[0]).includes("28.00% 5.00%"));
});
test("bodyClipPath spans 8px outside the body down to bottom + 12", () => {
  const clip = bodyClipPath(d, p);
  assert.ok(clip.startsWith("polygon(12.00% "));
  assert.ok(clip.includes("48.00% 72.00%"));
  assert.ok(clip.includes("12.00% 72.00%"));
});
