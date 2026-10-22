import { describe, it } from "node:test";
import assert from "node:assert";
import { Theme } from "#themes/theme.js";
import { ThemeRegistry } from "#themes/themeRegistry.js";
import { JsdomTransformer, loadTheme } from "./jsdomTransformer.js";
import { fullPerson, nameOnlyPerson } from "./persons.js";

const meta = { id: "test", title: "Test", description: "", tags: [] };
const noAssets = () => Promise.resolve("");

const themeWith = (layout, slots = {}) =>
  new (class extends Theme {
    static meta = meta;
    layout() {
      return layout;
    }
    slots() {
      return slots;
    }
  })(new JsdomTransformer(), noAssets);

const body = (html) =>
  html
    .replace(/^.*<body>|<\/body>.*$/gs, "")
    .replace(/\s+/g, " ")
    .trim();

describe("Slot layouts", () => {
  it("replaces a section slot with the section of the base class", async () => {
    const html = await themeWith(`<main><slot name="skills"></slot></main>`).renderHTML({
      skills: ["C#"]
    });
    assert.match(html, /<main>\s*<section id="skills">/);
    assert.doesNotMatch(html, /<slot/);
  });

  it("removes a slot that has nothing to show", async () => {
    const html = await themeWith(`<main><slot name="skills"></slot></main>`).renderHTML({});
    assert.strictEqual(body(html), "<main></main>");
  });

  it("fills a slot of the theme's own", async () => {
    const html = await themeWith(`<header><slot name="hello"></slot></header>`, {
      hello: () => "<p>Hello</p>"
    }).renderHTML({});
    assert.strictEqual(body(html), "<header><p>Hello</p></header>");
  });

  it("lets a slot of the theme replace a section slot of the same name", async () => {
    const html = await themeWith(`<main><slot name="skills"></slot></main>`, {
      skills: () => "<p>Mine</p>"
    }).renderHTML({ skills: ["C#"] });
    assert.strictEqual(body(html), "<main><p>Mine</p></main>");
  });

  it("only renders the slots the layout uses", async () => {
    let calls = 0;
    await themeWith(`<main></main>`, { unused: () => (calls++, "x") }).renderHTML({});
    assert.strictEqual(calls, 0);
  });

  it("fails on a slot name that nothing renders", async () => {
    await assert.rejects(
      themeWith(`<main><slot name="skils"></slot></main>`).renderHTML({}),
      /slot named "skils"/
    );
  });

  it("fails for a theme with neither a layout nor its own renderHTML", async () => {
    const theme = new (class extends Theme {
      static meta = meta;
    })(new JsdomTransformer(), noAssets);
    await assert.rejects(theme.renderHTML({}), /neither a layout nor its own renderHTML/);
  });
});

for (const themeId of Object.keys(ThemeRegistry)) {
  it(`${themeId} leaves no <slot> in the page`, async () => {
    for (const person of [fullPerson, nameOnlyPerson]) {
      const html = await loadTheme(themeId).renderHTML(structuredClone(person));
      assert.doesNotMatch(html, /<\/?slot\b/);
    }
  });
}
