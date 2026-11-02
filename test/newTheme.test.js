import { describe, it } from "node:test";
import assert from "node:assert";
import { className, problemWith, themeFiles, title, today } from "../scripts/new-theme.mjs";
import { ThemeRegistry } from "#themes/themeRegistry.js";

describe("new-theme", () => {
  it("names the class the way the registry generator expects", () => {
    assert.strictEqual(className("my-theme"), "MyThemeTheme");
    assert.strictEqual(className("holden-wreck"), "HoldenWreckTheme");
    // Every existing theme follows the same rule.
    for (const [id, entry] of Object.entries(ThemeRegistry)) {
      assert.strictEqual(entry.type.name, className(id));
    }
  });

  it("gives every existing theme a valid added date and a boolean featured flag", () => {
    for (const [id, entry] of Object.entries(ThemeRegistry)) {
      assert.match(entry.added, /^\d{4}-\d{2}-\d{2}$/, id);
      assert.ok(!Number.isNaN(Date.parse(entry.added)), `${id}: ${entry.added} is not a date`);
      assert.ok([undefined, true, false].includes(entry.featured), id);
    }
  });

  it("gives a readable first title", () => {
    assert.strictEqual(title("my-theme"), "My theme");
  });

  it("refuses an id that can't be a theme", () => {
    assert.match(problemWith(undefined), /Give the id/);
    assert.match(problemWith("My_Theme"), /not a valid theme id/);
    assert.match(problemWith("-theme"), /not a valid theme id/);
    assert.match(problemWith("my--theme"), /not a valid theme id/);
    assert.match(problemWith("scripts"), /reserved/);
    assert.match(problemWith("minimal", ["minimal"]), /already exists/);
    assert.strictEqual(problemWith("my-theme", ["minimal"]), undefined);
  });

  it("fills in every placeholder of the templates", () => {
    const files = themeFiles("my-theme");
    assert.deepStrictEqual(Object.keys(files), ["my-theme/index.ts", "my-theme/my-theme.css"]);
    const index = files["my-theme/index.ts"];
    assert.match(index, /export class MyThemeTheme extends Theme/);
    assert.match(index, /id: "my-theme"/);
    assert.match(index, /title: "My theme"/);
    assert.match(index, new RegExp(`added: "${today()}"`));
    for (const content of Object.values(files)) {
      assert.doesNotMatch(content, /__[A-Z]+__/);
    }
  });
});
