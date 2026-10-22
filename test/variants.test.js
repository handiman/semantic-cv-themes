import { describe, it } from "node:test";
import assert from "node:assert";
import { loadAsset, loadTheme } from "./jsdomTransformer.js";

describe("A theme that extends another (Holden Wreck → Boiling Diesel)", () => {
  it("gets the parent's CSS first and then its own", async () => {
    const css = await loadTheme("holden-wreck").renderCSS({});
    const parent = await loadAsset("boiling-diesel.css");
    const own = await loadAsset("holden-wreck.css");
    const parentAt = css.indexOf(parent);
    const ownAt = css.indexOf(own);
    assert.ok(parentAt > -1, "Boiling Diesel's CSS is missing");
    assert.ok(ownAt > parentAt, "Holden Wreck's CSS doesn't come after Boiling Diesel's");
  });

  it("renders the parent's HTML", async () => {
    const person = { name: "Ada", jobTitle: "Developer" };
    assert.strictEqual(
      await loadTheme("holden-wreck").renderHTML(structuredClone(person)),
      await loadTheme("boiling-diesel").renderHTML(structuredClone(person))
    );
  });

  it("leaves a theme that extends Theme directly with only its own CSS", async () => {
    const css = await loadTheme("boiling-diesel").renderCSS({});
    assert.ok(!css.includes(await loadAsset("holden-wreck.css")));
  });
});
