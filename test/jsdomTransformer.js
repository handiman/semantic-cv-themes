import fs from "node:fs";
import path from "node:path";
import { JSDOM } from "jsdom";
import { ThemeLoader } from "#themes/themeLoader.js";

/**
 * Minimal HTMLTransformer on top of jsdom, enough to render a theme in a
 * test. Unlike HTMLRewriter it runs hooks one selector at a time, which is
 * fine for checking what text ends up in the page.
 */
export class JsdomTransformer {
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
export const loadAsset = (name) => {
  const file = path.join(themeRoot, path.parse(name).name, name);
  return Promise.resolve(fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "");
};

/** Renders the theme with the given id and returns the page as a DOM document. */
export const renderDocument = async (themeId, person) => {
  const theme = new ThemeLoader(new JsdomTransformer(), loadAsset).loadTheme(themeId);
  return new JSDOM(await theme.renderHTML(person)).window.document;
};
