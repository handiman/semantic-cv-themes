import { describe, it } from "node:test";
import assert from "node:assert";
import { Theme } from "#themes/theme.js";

class TestTheme extends Theme {
  static meta = { id: "test", title: "Test", description: "", tags: [] };
  constructor() {
    super(undefined, () => Promise.resolve(""));
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

  describe("role keywords", () => {
    const term = (name) => ({ "@type": "DefinedTerm", name });
    const items = (html) => [...html.matchAll(/<li>([^<]*)<\/li>/g)].map((match) => match[1]);
    const keywordsOf = (html) => html.match(/<ul class="scv-keywords">(.*?)<\/ul>/s)?.[1];

    it("are a list, one item per keyword", () => {
      const html = theme.renderWorksFor([
        { keywords: [term("Rust"), term("Go")], worksFor: { name: "Acme" } }
      ]);
      assert.match(html, /<ul class="scv-keywords"><li>Rust<\/li><li>Go<\/li><\/ul>/);
    });

    it("are listed after the description of a work entry", () => {
      const html = theme.renderWorksFor([
        {
          description: "Built things",
          keywords: [term("TypeScript"), term("Azure Service Bus")],
          worksFor: { name: "Acme" }
        }
      ]);
      assert.deepStrictEqual(items(keywordsOf(html)), ["TypeScript", "Azure Service Bus"]);
      assert.ok(html.indexOf("Built things") < html.indexOf("scv-keywords"));
    });

    it("are listed for a project too", () => {
      const html = theme.renderProjects([
        { keywords: [term("Rust")], worksFor: { "@type": "Project", name: "Rocket" } }
      ]);
      assert.deepStrictEqual(items(keywordsOf(html)), ["Rust"]);
    });

    it("keep the order the author gave them", () => {
      const html = theme.renderWorksFor([
        { keywords: [term("Zig"), term("Ada")], worksFor: { name: "Acme" } }
      ]);
      assert.deepStrictEqual(items(keywordsOf(html)), ["Zig", "Ada"]);
    });

    it("leave out the list when a role has none", () => {
      const html = theme.renderWorksFor([{ worksFor: { name: "Acme" } }]);
      assert.doesNotMatch(html, /scv-keywords/);
    });

    it("leave out the list when none of them has a name", () => {
      const html = theme.renderWorksFor([
        { keywords: [{ "@type": "DefinedTerm" }], worksFor: { name: "Acme" } }
      ]);
      assert.doesNotMatch(html, /scv-keywords/);
    });

    it("are inserted as they are, since core has already escaped them", () => {
      const html = theme.renderWorksFor([
        { keywords: [term("C&amp;C")], worksFor: { name: "Acme" } }
      ]);
      assert.deepStrictEqual(items(keywordsOf(html)), ["C&amp;C"]);
    });
  });
});

describe("Theme base CSS", () => {
  const css = () => new TestTheme().renderCSS({});

  it("gives a default to every shared CSS variable", async () => {
    const root = (await css()).match(/:root\s*\{([^}]*)\}/)[1];
    for (const name of [
      "--text-color",
      "--text-color-muted",
      "--background-color",
      "--heading-color",
      "--accent-color",
      "--link-color",
      "--border-color",
      "--font-family-base",
      "--font-size-base",
      "--space-0",
      "--space-1",
      "--space-2",
      "--space-3",
      "--border-radius-base"
    ]) {
      assert.match(root, new RegExp(`${name}\\s*:`), name);
    }
  });

  it("preserves description line breaks", async () => {
    assert.match(await css(), /\.scv-description \{ white-space: pre-line; \}/);
  });

  it("lays the keywords of a role out in a wrapping row", async () => {
    assert.match(await css(), /\.scv-keywords \{ display: flex; flex-wrap: wrap;/);
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
