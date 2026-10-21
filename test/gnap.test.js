import { describe, it } from "node:test";
import assert from "node:assert";
import { GnapTheme } from "#themes/gnap/index.js";

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
  new GnapTheme(new CollectingTransformer(), () => Promise.resolve("")).renderHTML(person);

describe("gnap", () => {
  it("renders the job title as a paragraph, not as a heading", async () => {
    const html = await render({ name: "Yoda", jobTitle: "Jedi Master" });
    assert.match(html, /<h1>Yoda<\/h1>\s*<p class="job-title">Jedi Master<\/p>/);
    assert.doesNotMatch(html, /<h4/);
  });

  it("leaves out the job title when there is none", async () => {
    const html = await render({ name: "Yoda" });
    assert.doesNotMatch(html, /job-title/);
  });
});
