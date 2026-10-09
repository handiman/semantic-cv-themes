import { describe, it } from "node:test";
import assert from "node:assert";
import { period } from "#themes/person.js";

describe("period", () => {
  for (const [input, expected] of [
    ["2020-01-15", "2020-01"],
    ["2020-12-01", "2020-12"],
    ["2021-10", "2021-10"],
    ["2021-10-01T00:00:00Z", "2021-10"],
    [new Date(Date.UTC(2019, 0, 31)), "2019-01"],
    [new Date(Date.UTC(2019, 11, 1)), "2019-12"]
  ]) {
    it(`${input instanceof Date ? input.toISOString() : input} -> ${expected}`, () => {
      assert.strictEqual(period(input), expected);
    });
  }

  it("returns text that isn't a date unchanged", () => {
    assert.strictEqual(period("Spring term"), "Spring term");
  });
});
