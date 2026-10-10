import { describe, it } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { JSDOM } from "jsdom";
import { ThemeLoader } from "#themes/themeLoader.js";
import { ThemeRegistry } from "#themes/themeRegistry.js";

/**
 * Minimal HTMLTransformer on top of jsdom, enough to render a theme in a
 * test. Unlike HTMLRewriter it runs hooks one selector at a time, which is
 * fine for checking what text ends up in the page.
 */
class JsdomTransformer {
  hooks = [];
  on(selector, hooks) {
    this.hooks.push({ selector, hooks });
    return this;
  }
  async transform(html) {
    const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body>${html}</body></html>`);
    const { document } = dom.window;
    for (const { selector, hooks } of this.hooks) {
      for (const el of document.querySelectorAll(selector)) {
        hooks.element(wrap(el));
      }
    }
    return document.body.innerHTML;
  }
}

const wrap = (el) => ({
  append: (content, opts) => insert(el, "beforeend", content, opts),
  prepend: (content, opts) => insert(el, "afterbegin", content, opts),
  before: (content, opts) => insert(el, "beforebegin", content, opts),
  after: (content, opts) => insert(el, "afterend", content, opts),
  replace: (content, opts) => {
    insert(el, "beforebegin", content, opts);
    el.remove();
  },
  remove: () => el.remove(),
  setAttribute: (name, value) => el.setAttribute(name, value)
});

const insert = (el, position, content, opts) =>
  opts?.html
    ? el.insertAdjacentHTML(position, content)
    : el.insertAdjacentText(position, String(content));

const themeRoot = path.resolve(import.meta.dirname, "..");
const loadAsset = (name) => {
  const file = path.join(themeRoot, path.parse(name).name, name);
  return Promise.resolve(fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "");
};

const person = {
  name: "Ada Lovelace",
  jobTitle: "Analyst",
  workLocation: "London, England",
  email: "ada@example.com",
  telephone: "+44 20 7946 0000",
  url: "https://www.ada.example",
  sameAs: [
    "https://github.com/ada",
    "https://www.linkedin.com/in/ada-lovelace-analytical-engine-programmer/"
  ]
};

const expected = [
  "London, England",
  "ada@example.com",
  "+44 20 7946 0000",
  "ada.example",
  "github.com/ada",
  "linkedin.com/in/ada-lovelace-analytical-engine-programmer/"
];

const renderText = async (themeId) => {
  const transformer = new JsdomTransformer();
  const theme = new ThemeLoader(transformer, loadAsset).loadTheme(themeId);
  const html = await theme.renderHTML(person);
  const { document } = new JSDOM(html).window;
  document.querySelectorAll("script, style, link").forEach((el) => el.remove());
  return document.body.textContent.replace(/\s+/g, " ");
};

describe("Contact details", () => {
  for (const themeId of Object.keys(ThemeRegistry)) {
    it(`${themeId} renders location, email, phone and every link as text`, async () => {
      const text = await renderText(themeId);
      for (const value of expected) {
        assert.ok(text.includes(value), `${themeId} is missing "${value}"`);
      }
      assert.doesNotMatch(text, /…/, `${themeId} truncates a link`);
    });
  }

  it("Gnap shows print-only content in print", async () => {
    const css = await loadAsset("gnap.css");
    const print = css.substring(css.indexOf("@media print"));
    assert.doesNotMatch(print, /display:\s*""/);
  });
});
