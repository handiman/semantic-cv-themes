import { describe, it } from "node:test";
import assert from "node:assert";
import { normalizeArray } from "#themes/utils.js";

describe("normalizeArray", () => {
  it("removes empty items", () => {
    const actualValue = normalizeArray(["https://www.henrikbecker.net"], "", null, undefined);
    assert.strictEqual(actualValue.length, 1);
    assert.strictEqual(actualValue[0], "https://www.henrikbecker.net");
  });
});
