import { describe, it } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { JSDOM } from "jsdom";
import { loadTheme } from "./jsdomTransformer.js";
import { fullPerson, nameOnlyPerson } from "./persons.js";

const script = fs.readFileSync(path.join(import.meta.dirname, "..", "times", "times.js"), "utf8");

// The page as core assembles it: the theme's HTML, then the theme's enhancement element. The
// date in the browser is set to a fixed day, so the test doesn't depend on when it runs.
const renderInBrowser = async (person) => {
  const html = await loadTheme("times").renderHTML(structuredClone(person));
  const dom = new JSDOM(`<!DOCTYPE html><body>${html}</body>`, { runScripts: "outside-only" });
  const { window } = dom;
  window.eval(`
    const RealDate = Date;
    Date = class extends RealDate {
      constructor(...args) { super(...(args.length ? args : [2026, 9, 22, 12])); }
    };
  `);
  window.eval(script);
  window.document.body.append(window.document.createElement("semantic-cv-theme-times"));
  return window.document;
};

describe("times date line", () => {
  it("is not in the HTML the theme renders", async () => {
    const html = await loadTheme("times").renderHTML(structuredClone(fullPerson));
    assert.doesNotMatch(html, /dateline/);
  });

  it("is added in the browser as a time element with today's date", async () => {
    const document = await renderInBrowser(fullPerson);
    const dates = document.querySelectorAll("header .grid time.dateline");
    assert.strictEqual(dates.length, 1);
    assert.strictEqual(dates[0].dateTime, "2026-10-22");
    assert.ok(dates[0].textContent.trim());
  });

  it("goes in the first cell, before the contact links", async () => {
    const document = await renderInBrowser(fullPerson);
    const cells = document.querySelectorAll("header .grid > div");
    assert.strictEqual(cells.length, 2);
    assert.ok(cells[0].querySelector(".dateline"));
    assert.ok(cells[1].querySelector(".social"));
  });

  it("gets a row of its own, above the rule, when there are no contact links", async () => {
    const document = await renderInBrowser(nameOnlyPerson);
    const grid = document.querySelector("header .grid");
    assert.ok(grid.querySelector(".dateline"));
    assert.ok(grid.nextElementSibling.classList.contains("hr"));
  });

  it("is added once, also when the element is connected again", async () => {
    const document = await renderInBrowser(fullPerson);
    const element = document.querySelector("semantic-cv-theme-times");
    document.body.append(element);
    assert.strictEqual(document.querySelectorAll(".dateline").length, 1);
  });
});
