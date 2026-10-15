import { describe, it } from "node:test";
import assert from "node:assert";
import { Theme } from "#themes/theme.js";

class TestTheme extends Theme {
  constructor() {
    super(() => Promise.resolve(""), { id: "test", title: "Test", description: "", tags: [] });
  }
  renderHTML() {
    return Promise.resolve("");
  }
}

const count = (html, tag) => (html.match(new RegExp(tag, "g")) ?? []).length;

describe("Theme section renderers", () => {
  const theme = new TestTheme();

  for (const method of ["renderKnowsLanguage", "renderKnowsAbout", "renderSkills"]) {
    it(`${method} closes every list it opens`, () => {
      const html = theme[method](["One", "Two"]);
      assert.strictEqual(count(html, "<ul>"), 1);
      assert.strictEqual(count(html, "</ul>"), 1);
      assert.strictEqual(count(html, "<li>"), 2);
    });

    it(`${method} renders nothing for an empty list`, () => {
      assert.strictEqual(theme[method]([]), "");
    });
  }

  it("renders role dates with the right month", () => {
    const html = theme.renderWorksFor([
      {
        roleName: "Dev",
        startDate: "2020-01-15",
        endDate: "2021-12-31",
        worksFor: { name: "Acme" }
      }
    ]);
    assert.match(html, />2020-01</);
    assert.match(html, />2021-12</);
  });

  it("separates role dates with an en dash", () => {
    const html = theme.renderWorksFor([
      { startDate: "2020-01-15", endDate: "2021-12-31", worksFor: { name: "Acme" } }
    ]);
    assert.match(html, /&ndash;/);
    assert.doesNotMatch(html, /&hyphen;/);
  });

  it("keeps the line breaks in role and life event descriptions", () => {
    const role = theme.renderWorksFor([{ description: "One\nTwo\n", worksFor: { name: "Acme" } }]);
    const event = theme.renderLifeEvents([{ name: "Moved", description: "One\nTwo" }]);
    assert.match(role, /<p class="scv-description">One\nTwo<\/p>/);
    assert.match(event, /<p class="scv-description">One\nTwo<\/p>/);
  });
});

describe("Theme base CSS", () => {
  const css = () => new TestTheme().renderCSS({});

  it("preserves description line breaks", async () => {
    assert.match(await css(), /\.scv-description \{ white-space: pre-line; \}/);
  });

  it("only keeps articles, not whole sections, on one printed page", async () => {
    const print = (await css()).split("@media print")[1];
    assert.match(print, /\n\s*article \{ break-inside: avoid;/);
    assert.doesNotMatch(print, /section,? *article|section \{ break-inside/);
  });

  it("keeps headings with the content that follows them in print", async () => {
    const print = (await css()).split("@media print")[1];
    assert.match(print, /h1, h2, h3 \{ break-after: avoid;/);
  });

  it("turns off contextual alternates in print", async () => {
    const print = (await css()).split("@media print")[1];
    assert.match(print, /font-feature-settings: "calt" 0/);
  });
});
