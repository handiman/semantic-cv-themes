import { describe, it } from "node:test";
import assert from "node:assert";
import { MatildaTheme } from "#themes/matilda/index.js";

/** Collects everything the theme adds to the page, which is all the markup it renders. */
class CollectingTransformer {
  hooks = [];
  on(selector, hooks) {
    this.hooks.push(hooks);
    return this;
  }
  async transform() {
    let html = "";
    const element = { append: (content) => (html += content), remove: () => {} };
    for (const hooks of this.hooks) {
      hooks.element(element);
    }
    return html;
  }
}

const render = (person) =>
  new MatildaTheme(new CollectingTransformer(), () => Promise.resolve("")).renderHTML(person);

describe("matilda", () => {
  it("renders the summary as an h2 heading", async () => {
    const html = await render({ name: "Yoda", description: "Small, green." });
    assert.match(html, /<h2>Summary<\/h2>\s*<div>Small, green\.<\/div>/);
  });

  it("closes the opening tag of every heading", async () => {
    const html = await render({
      name: "Yoda",
      jobTitle: "Jedi Master",
      description: "Small, green.",
      worksFor: [{ roleName: "Master", worksFor: { "@type": "Organization", name: "Jedi Order" } }]
    });
    assert.doesNotMatch(html, /<h[1-6][^\s>]/);
  });
});
