import { describe, it } from "node:test";
import assert from "node:assert";
import { defaultOptions, supportedLanguages, themeOptionsFor } from "#themes/themeOptions.js";
import { ThemeRegistry } from "#themes/themeRegistry.js";
import { ThemeLoader } from "#themes/themeLoader.js";
import { JSDOM } from "jsdom";
import { JsdomTransformer, loadAsset } from "./jsdomTransformer.js";
import { fullPerson } from "./persons.js";

describe("themeOptionsFor", () => {
  it("gives Swedish headings and labels for Swedish", () => {
    const options = themeOptionsFor("sv");
    assert.strictEqual(options.headings.worksFor, "Arbetslivserfarenhet");
    assert.strictEqual(options.headings.alumniOf, "Utbildning");
    assert.strictEqual(options.labels.present, "pågående");
  });

  it("only looks at the primary subtag, in any case", () => {
    for (const tag of ["sv-SE", "sv-FI", "SV", "Sv-se"]) {
      assert.deepStrictEqual(themeOptionsFor(tag), themeOptionsFor("sv"), tag);
    }
  });

  it("falls back to English for a language without headings, or no language", () => {
    for (const tag of ["en", "en-GB", "de", "fi", "", undefined]) {
      assert.deepStrictEqual(themeOptionsFor(tag), defaultOptions, String(tag));
    }
  });

  it("has every heading and label in every supported language", () => {
    for (const language of supportedLanguages) {
      const options = themeOptionsFor(language);
      for (const key of Object.keys(defaultOptions.headings)) {
        assert.ok(options.headings[key], `${language} lacks the heading ${key}`);
      }
      for (const key of Object.keys(defaultOptions.labels)) {
        assert.ok(options.labels[key], `${language} lacks the label ${key}`);
      }
    }
    assert.deepStrictEqual(supportedLanguages, ["en", "sv"]);
  });

  it("translates every heading and label into Swedish", () => {
    const sv = themeOptionsFor("sv");
    for (const key of Object.keys(defaultOptions.headings)) {
      assert.notStrictEqual(sv.headings[key], defaultOptions.headings[key], key);
    }
    for (const key of Object.keys(defaultOptions.labels)) {
      assert.notStrictEqual(sv.labels[key], defaultOptions.labels[key], key);
    }
  });
});

describe("themeOptionsFor with the CV's own headings and labels", () => {
  it("puts them over the headings of the CV's language", () => {
    const options = themeOptionsFor("sv", {
      headings: { worksFor: "Uppdrag" },
      labels: { present: "nu" }
    });
    assert.strictEqual(options.headings.worksFor, "Uppdrag");
    assert.strictEqual(options.labels.present, "nu");
    assert.strictEqual(options.headings.alumniOf, "Utbildning");
  });

  it("puts them over English when the CV has no language the themes know", () => {
    for (const language of [undefined, "de"]) {
      const options = themeOptionsFor(language, { headings: { worksFor: "Assignments" } });
      assert.strictEqual(options.headings.worksFor, "Assignments");
      assert.strictEqual(options.headings.alumniOf, "Education");
    }
  });

  it("ignores a value that isn't text", () => {
    const options = themeOptionsFor("sv", { headings: { worksFor: 42, skills: undefined } });
    assert.strictEqual(options.headings.worksFor, "Arbetslivserfarenhet");
    assert.strictEqual(options.headings.skills, "Färdigheter");
  });

  it("is the language's options when the CV sets none", () => {
    assert.deepStrictEqual(themeOptionsFor("sv", undefined), themeOptionsFor("sv"));
    assert.deepStrictEqual(themeOptionsFor("sv", {}), themeOptionsFor("sv"));
  });
});

for (const themeId of Object.keys(ThemeRegistry)) {
  it(`${themeId} in Swedish has Swedish headings and no English ones`, async () => {
    const theme = new ThemeLoader(new JsdomTransformer(), loadAsset).loadTheme(
      themeId,
      themeOptionsFor("sv")
    );
    const { body } = new JSDOM(await theme.renderHTML(structuredClone(fullPerson))).window.document;
    assert.match(body.textContent, /Arbetslivserfarenhet/);
    assert.match(body.textContent, /pågående/);
    for (const english of Object.values(defaultOptions.headings)) {
      assert.ok(!body.textContent.includes(english), `"${english}" is still in the page`);
    }
  });
}
