import { describe, it } from "node:test";
import assert from "node:assert";
import { MatildaTheme } from "#themes/matilda/index.js";

/** Collects everything the theme adds to the page, which is all the markup it renders. */
class CollectingTransformer {
  hooks = [];
  on(selector, hooks) {
    this.hooks.push({ selector, hooks });
    return this;
  }
  async transform() {
    const added = {};
    for (const { selector, hooks } of this.hooks) {
      const element = {
        append: (content) => (added[selector] = (added[selector] ?? "") + content),
        remove: () => {}
      };
      hooks.element(element);
    }
    return added;
  }
}

const render = (person) =>
  new MatildaTheme(new CollectingTransformer(), () => Promise.resolve("")).renderHTML(person);

const person = { name: "Yoda", jobTitle: "Jedi Master", description: "Small, green." };

describe("matilda header", () => {
  it("has a single h1, so the name is not a heading twice", async () => {
    const { aside, main } = await render(person);
    assert.strictEqual(((aside + main).match(/<h1/g) ?? []).length, 1);
  });

  it("is rendered in main, not in aside", async () => {
    const { aside, main } = await render(person);
    assert.match(
      main,
      /<header>\s*<div><h1>Yoda<\/h1><\/div>\s*<div>Jedi Master<\/div>\s*<\/header>/
    );
    assert.doesNotMatch(aside, /<header|Jedi Master/);
  });
});
