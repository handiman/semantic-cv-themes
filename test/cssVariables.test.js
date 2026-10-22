import { describe, it } from "node:test";
import assert from "node:assert";
import { ThemeRegistry } from "#themes/themeRegistry.js";
import { loadTheme } from "./jsdomTransformer.js";

// A var() of a variable that nothing defines makes the property fall back to its inherited or
// initial value, without any error. Every variable a theme's CSS uses (with the base CSS in front
// of it) must be defined somewhere in that CSS, unless the var() gives a fallback.
for (const themeId of Object.keys(ThemeRegistry)) {
  describe(`${themeId} CSS variables`, () => {
    it("uses no variable that isn't defined", async () => {
      const css = (await loadTheme(themeId).renderCSS({})).replace(/\/\*[\s\S]*?\*\//g, "");
      const defined = new Set([...css.matchAll(/(--[A-Za-z0-9-]+)\s*:/g)].map((m) => m[1]));
      const used = new Set([...css.matchAll(/var\(\s*(--[A-Za-z0-9-]+)\s*\)/g)].map((m) => m[1]));
      assert.deepStrictEqual(
        [...used].filter((name) => !defined.has(name)),
        []
      );
    });
  });
}
