import { describe, it } from "node:test";
import assert from "node:assert";
import { ThemeRegistry } from "#themes/themeRegistry.js";
import { renderDocument } from "./jsdomTransformer.js";

const person = { name: "Yoda" };

for (const themeId of Object.keys(ThemeRegistry)) {
  describe(`${themeId} with a Person that has only a name`, () => {
    it("shows the name", async () => {
      const document = await renderDocument(themeId, person);
      assert.match(document.body.textContent, /Yoda/);
    });

    it("leaves out every section, heading included", async () => {
      const document = await renderDocument(themeId, person);
      const headings = [...document.querySelectorAll("h2, h3")].map((h) => h.textContent.trim());
      assert.deepStrictEqual(headings, []);
    });

    it("prints no placeholder for a missing value", async () => {
      const document = await renderDocument(themeId, person);
      assert.doesNotMatch(document.body.textContent, /undefined|null|NaN|\[object/);
    });
  });
}
