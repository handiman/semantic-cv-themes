import { describe, it } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { ThemeRegistry } from "#themes/themeRegistry.js";
import { renderDocument } from "./jsdomTransformer.js";
import { fullPerson, nameOnlyPerson } from "./persons.js";

// Golden snapshots: every theme in the registry is rendered with a full Person and with one that has
// only a name, and the page is compared with a file in test/snapshots. A refactor that is meant to
// leave the output alone must leave these files alone; a change that is meant to alter a theme
// shows up as a diff of them.
//
// The page is written in a canonical form, one element per line, so the indentation of a theme's
// template strings doesn't matter. Whitespace inside text is collapsed to single spaces, and
// whitespace-only text between elements is left out.
//
// To update the files on purpose: npm run test:update-snapshots

const update = process.argv.includes("--update");
const snapshotDir = path.join(import.meta.dirname, "snapshots");

const persons = { full: fullPerson, "name-only": nameOnlyPerson };

const voidElements = new Set([
  "area",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "source",
  "wbr"
]);

const escapeText = (text) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escapeAttribute = (value) => escapeText(value).replace(/"/g, "&quot;");
const collapse = (text) => text.replace(/\s+/g, " ").trim();

const startTag = (el) => {
  const attributes = [...el.attributes]
    .map(({ name, value }) => ` ${name}="${escapeAttribute(value)}"`)
    .sort()
    .join("");
  return `<${el.localName}${attributes}>`;
};

const lines = (node, depth) => {
  const indent = "  ".repeat(depth);
  if (node.nodeType === node.TEXT_NODE) {
    const text = collapse(node.textContent);
    return text ? [indent + escapeText(text)] : [];
  }
  if (node.nodeType === node.COMMENT_NODE) {
    return [`${indent}<!-- ${collapse(node.textContent)} -->`];
  }
  if (node.nodeType !== node.ELEMENT_NODE) {
    return [];
  }
  const open = startTag(node);
  if (voidElements.has(node.localName)) {
    return [indent + open];
  }
  const close = `</${node.localName}>`;
  const children = [...node.childNodes].flatMap((child) => lines(child, depth + 1));
  if (children.length === 0) {
    return [indent + open + close];
  }
  const onlyText = [...node.childNodes].every((child) => child.nodeType === child.TEXT_NODE);
  if (onlyText && children.length === 1) {
    return [indent + open + children[0].trim() + close];
  }
  return [indent + open, ...children, indent + close];
};

/** The body of a rendered page in canonical form. */
export const canonical = (document) =>
  [...document.body.childNodes].flatMap((node) => lines(node, 0)).join("\n") + "\n";

describe("canonical form", () => {
  it("ignores indentation and collapses whitespace in text", async () => {
    const { JSDOM } = await import("jsdom");
    const a = new JSDOM("<main>\n  <h1>  Ada \n Lindqvist </h1>\n</main>").window.document;
    const b = new JSDOM("<main><h1>Ada Lindqvist</h1></main>").window.document;
    assert.strictEqual(canonical(a), canonical(b));
  });

  it("sorts attributes and escapes text", async () => {
    const { JSDOM } = await import("jsdom");
    const document = new JSDOM(`<p title="x" class="y">R&amp;D</p>`).window.document;
    assert.strictEqual(canonical(document), `<p class="y" title="x">R&amp;D</p>\n`);
  });
});

describe("HTML snapshots", () => {
  for (const themeId of Object.keys(ThemeRegistry)) {
    for (const [personName, person] of Object.entries(persons)) {
      it(`${themeId} with the ${personName} Person matches its snapshot`, async () => {
        const actual = canonical(await renderDocument(themeId, structuredClone(person)));
        const file = path.join(snapshotDir, `${themeId}.${personName}.html`);
        if (update) {
          fs.mkdirSync(snapshotDir, { recursive: true });
          fs.writeFileSync(file, actual);
          return;
        }
        assert.ok(
          fs.existsSync(file),
          `${path.relative(process.cwd(), file)} is missing; run npm run test:update-snapshots`
        );
        // Read with LF line endings whatever Git did on checkout.
        const expected = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
        assert.strictEqual(actual, expected);
      });
    }
  }

  it("has no snapshot of a theme or Person that no longer exists", { skip: update }, () => {
    const known = new Set(
      Object.keys(ThemeRegistry).flatMap((themeId) =>
        Object.keys(persons).map((personName) => `${themeId}.${personName}.html`)
      )
    );
    const stale = fs.readdirSync(snapshotDir).filter((file) => !known.has(file));
    assert.deepStrictEqual(stale, [], "delete these from test/snapshots");
  });
});
