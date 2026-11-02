import { describe, it } from "node:test";
import assert from "node:assert";
import { initials } from "#themes/business-casual/index.js";
import { loadTheme } from "./jsdomTransformer.js";
import { nameOnlyPerson } from "./persons.js";

describe("Business Casual's monogram", () => {
  const cases = {
    "Ada Lindqvist": "AL",
    Ada: "A",
    "Ada Maria Lindqvist": "AL",
    "åsa öberg": "ÅÖ",
    "Jean-Luc Picard": "JP",
    // Names arrive HTML-escaped: entities are skipped, not read as letters or word breaks.
    "Conan O&#39;Brien": "CO",
    "&#39;Bud&#39; Smith": "BS",
    "Ada &amp; Co": "AC"
  };
  for (const [name, expected] of Object.entries(cases)) {
    it(`is ${expected} for ${name}`, () => {
      assert.strictEqual(initials(name), expected);
    });
  }

  it("is empty for a name without letters", () => {
    assert.strictEqual(initials("  "), "");
    assert.strictEqual(initials(""), "");
    assert.strictEqual(initials(undefined), "");
  });

  it("is left out of the page when the name has no letters", async () => {
    const html = await loadTheme("business-casual").renderHTML({
      ...nameOnlyPerson,
      name: "&#39;"
    });
    assert.ok(!html.includes("monogram"));
  });
});
