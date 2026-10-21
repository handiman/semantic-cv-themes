import { describe, it } from "node:test";
import assert from "node:assert";
import { BoilingDieselTheme } from "#themes/boiling-diesel/index.js";
import { HoldenWreckTheme } from "#themes/holden-wreck/index.js";

/** Records the page skeleton and what each hook replaces, appends or removes. */
class RecordingTransformer {
  hooks = [];
  on(selector, hooks) {
    this.hooks.push({ selector, hooks });
    return this;
  }
  async transform(skeleton) {
    const written = {};
    for (const { selector, hooks } of this.hooks) {
      const write = (content) => (written[selector] = (written[selector] ?? "") + content);
      hooks.element({ replace: write, append: write, remove: () => {}, setAttribute: () => {} });
    }
    return { skeleton, written };
  }
}

const render = (Theme, person) =>
  new Theme(new RecordingTransformer(), () => Promise.resolve("")).renderHTML(person);

for (const [id, Theme] of [
  ["boiling-diesel", BoilingDieselTheme],
  ["holden-wreck", HoldenWreckTheme]
]) {
  describe(`${id} job title`, () => {
    const person = { name: "Yoda", jobTitle: "Jedi Master" };

    it("is a paragraph with the job-title class, not a heading", async () => {
      const { skeleton, written } = await render(Theme, person);
      assert.match(skeleton, /<h1><\/h1>\s*<p class="job-title"><\/p>/);
      assert.strictEqual(written["header .job-title"], '<p class="job-title">Jedi Master</p>');
      assert.doesNotMatch(skeleton, /<h2/);
    });

    it("leaves the paragraph empty when there is no job title", async () => {
      const { written } = await render(Theme, { name: "Yoda" });
      assert.strictEqual(written["header .job-title"], '<p class="job-title"></p>');
    });
  });
}
