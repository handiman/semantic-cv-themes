import { afterEach, describe, it, mock } from "node:test";
import assert from "node:assert";
import { ThemeRegistry } from "#themes/themeRegistry.js";
import { loadTheme } from "./jsdomTransformer.js";
import { fullPerson } from "./persons.js";

// A theme must render the same page for the same Person on any day (CLAUDE.md, priority 1).
// property.test.js renders twice within one run, which can't catch a theme that reads the clock,
// so this renders with the clock set to two dates far apart.
const renderAt = async (themeId, now) => {
  mock.timers.enable({ apis: ["Date"], now });
  try {
    return await loadTheme(themeId).renderHTML(structuredClone(fullPerson));
  } finally {
    mock.timers.reset();
  }
};

describe("Rendering doesn't depend on the clock", () => {
  afterEach(() => mock.timers.reset());

  for (const themeId of Object.keys(ThemeRegistry)) {
    it(`${themeId} renders the same page in 2001 and in 2031`, async () => {
      const early = await renderAt(themeId, new Date("2001-02-03T04:05:06Z"));
      const late = await renderAt(themeId, new Date("2031-12-30T22:59:58Z"));
      assert.strictEqual(late, early);
    });
  }
});
