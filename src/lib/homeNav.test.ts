import test from "node:test";
import assert from "node:assert/strict";
import { hubUrl, staysOnPage } from "./homeNav.ts";

test("the logo leads to the hub in the same language", () => {
  assert.equal(hubUrl("it"), "https://albertorsini.it/");
  assert.equal(hubUrl("en"), "https://albertorsini.it/en/");
});

const plain = { button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false };

test("Home on the home page only scrolls back up", () => {
  assert.equal(staysOnPage("/", plain), true);
});

test("Home elsewhere navigates as usual", () => {
  assert.equal(staysOnPage("/viaggi", plain), false);
});

test("opening Home in a new tab is left to the browser", () => {
  for (const key of ["metaKey", "ctrlKey", "shiftKey", "altKey"]) {
    assert.equal(staysOnPage("/", { ...plain, [key]: true }), false, key);
  }
  assert.equal(staysOnPage("/", { ...plain, button: 1 }), false);
});
