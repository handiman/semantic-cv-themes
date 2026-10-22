import { describe, it } from "node:test";
import assert from "node:assert";
import { ThemeRegistry } from "#themes/themeRegistry.js";
import { renderDocument } from "./jsdomTransformer.js";
import { fullPerson } from "./persons.js";

// Every Person field is optional, and a theme leaves out what it has nothing for (CLAUDE.md).
// An element with no text and no image may only be:
// - a layout region (header, aside, main, nav, footer), which the page's grid may need,
// - an element marked decorative with aria-hidden="true", or with the class "hr",
// - a wrapper that holds nothing but such elements.
const layout = new Set(["header", "aside", "main", "nav", "footer"]);

const allowedEmpty = (el) =>
  layout.has(el.localName) ||
  el.getAttribute("aria-hidden") === "true" ||
  el.classList.contains("hr") ||
  (el.children.length > 0 && [...el.children].every(allowedEmpty));

const isEmpty = (el) => !el.textContent.trim() && !el.querySelector("img, svg");

const describeElement = (el) =>
  el.localName + (el.id ? `#${el.id}` : "") + [...el.classList].map((c) => `.${c}`).join("");

const sparsePersons = {
  "only a name": { name: "Ada Lindqvist" },
  "a name and a job title": { name: "Ada Lindqvist", jobTitle: "Developer" },
  "a name and an email address": { name: "Ada Lindqvist", email: "ada@example.com" },
  "a name and one skill": { name: "Ada Lindqvist", skills: ["C#"] },
  "a full Person": fullPerson
};

for (const themeId of Object.keys(ThemeRegistry)) {
  describe(`${themeId} leaves out empty elements`, () => {
    for (const [label, person] of Object.entries(sparsePersons)) {
      it(`with ${label}`, async () => {
        const document = await renderDocument(themeId, structuredClone(person));
        const empty = [...document.body.querySelectorAll("*")]
          .filter((el) => !el.closest("svg") && el.localName !== "img" && el.localName !== "br")
          .filter((el) => isEmpty(el) && !allowedEmpty(el))
          .map(describeElement);
        assert.deepStrictEqual(empty, []);
      });
    }
  });
}
