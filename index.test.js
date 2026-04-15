import { describe, it } from "node:test";
import assert from "node:assert";
import { FaIconFactory, normalizeArray } from "./dist/utils.js";

describe("faIcon", () => {
  let sut = new FaIconFactory({
    url: "https://www.henrikbecker.net"
  });
  for (const [key, expectedClass] of Object.entries({
    ["https://www.henrikbecker.net"]: "fas fa-globe",
    ["mailto:spam@henrikbecker.se"]: "fas fa-envelope",
    ["tel:+46123456789"]: "fas fa-phone",
    ["https://github.com/handiman"]: "fab fa-github",
    ["https://www.linkedin.com/prettygoodprogrammer"]: "fab fa-linkedin",
    ["https://www.microsoft.com"]: "fab fa-windows",
    ["https://www.apple.com"]: "fab fa-apple",
    ["https://www.pinterest.com"]: "fab fa-pinterest",
    ["https://www.flickr.com"]: "fab fa-flickr",
    ["https://www.facebook.com"]: "fab fa-facebook",
    ["https://www.twitter.com"]: "fab fa-twitter",
    ["https://www.x.com"]: "fab fa-twitter",
    ["https://x.com"]: "fab fa-twitter"
  })) {
    it(`${key} should yield ${expectedClass}`, () => {
      assert.strictEqual(sut.faIcon(key), `<i class="${expectedClass}"></i>`);
    });
  }
});

describe("normalizeArray", () => {
  it("removes empty items", () => {
    const actualValue = normalizeArray(["https://www.henrikbecker.net"], "", null, undefined);
    assert.strictEqual(actualValue.length, 1);
    assert.strictEqual(actualValue[0], "https://www.henrikbecker.net");
  });
});
