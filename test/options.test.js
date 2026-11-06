import { describe, it } from "node:test";
import assert from "node:assert";
import { ThemeRegistry } from "#themes/themeRegistry.js";
import { ThemeLoader } from "#themes/themeLoader.js";
import { defaultOptions, resolveOptions } from "#themes/themeOptions.js";
import { JSDOM } from "jsdom";
import { JsdomTransformer, loadAsset } from "./jsdomTransformer.js";
import { fullPerson } from "./persons.js";

const swedish = {
  headings: {
    contact: "Kontaktuppgifter",
    description: "Sammanfattning",
    knowsLanguage: "Språk",
    knowsAbout: "Kärnkompetenser",
    skills: "Färdigheter",
    certifications: "Certifieringar",
    worksFor: "Arbetslivserfarenhet",
    alumniOf: "Utbildning",
    projects: "Projekt",
    lifeEvent: "Händelser"
  },
  labels: { present: "pågående", years: "år" }
};

const render = async (themeId, options) => {
  const theme = new ThemeLoader(new JsdomTransformer(), loadAsset).loadTheme(themeId, options);
  const html = await theme.renderHTML(structuredClone(fullPerson));
  return new JSDOM(html).window.document;
};

describe("resolveOptions", () => {
  it("gives the defaults when nothing is given", () => {
    assert.deepStrictEqual(resolveOptions(), defaultOptions);
    assert.deepStrictEqual(resolveOptions({}), defaultOptions);
  });

  it("keeps the default for anything left out", () => {
    const options = resolveOptions({ headings: { worksFor: "Erfarenhet" } });
    assert.strictEqual(options.headings.worksFor, "Erfarenhet");
    assert.strictEqual(options.headings.alumniOf, defaultOptions.headings.alumniOf);
    assert.strictEqual(options.labels.present, defaultOptions.labels.present);
  });

  it("ignores a value that isn't a string", () => {
    const options = resolveOptions({ headings: { worksFor: undefined, skills: 42 } });
    assert.strictEqual(options.headings.worksFor, defaultOptions.headings.worksFor);
    assert.strictEqual(options.headings.skills, defaultOptions.headings.skills);
  });

  it("doesn't change the defaults", () => {
    resolveOptions({ headings: { worksFor: "Erfarenhet" } }).headings.skills = "x";
    assert.strictEqual(defaultOptions.headings.worksFor, "Work Experience");
    assert.strictEqual(defaultOptions.headings.skills, "Skills");
  });
});

for (const themeId of Object.keys(ThemeRegistry)) {
  describe(`${themeId} with options from ThemeLoader`, () => {
    it("uses the given headings and none of the English ones", async () => {
      const document = await render(themeId, swedish);
      const headings = [...document.querySelectorAll("h2")].map((h2) => h2.textContent.trim());
      assert.ok(headings.includes("Arbetslivserfarenhet"), headings.join(", "));
      const text = document.body.textContent;
      for (const english of Object.values(defaultOptions.headings)) {
        assert.ok(!text.includes(english), `"${english}" is still in the page`);
      }
    });

    it("uses the given label for a role that hasn't ended", async () => {
      const document = await render(themeId, swedish);
      const text = document.body.textContent;
      assert.match(text, /pågående/);
      assert.doesNotMatch(text, /\bpresent\b/);
    });

    it("renders the same as before without options", async () => {
      const without = await render(themeId);
      const withDefaults = await render(themeId, defaultOptions);
      assert.strictEqual(without.body.innerHTML, withDefaults.body.innerHTML);
      assert.match(without.body.textContent, /Work Experience/);
    });
  });
}

describe("colors", () => {
  const css = async (colors) => {
    const theme = new ThemeLoader(new JsdomTransformer(), loadAsset).loadTheme("minimal", {
      colors
    });
    return theme.renderCSS(structuredClone(fullPerson));
  };

  it("sets the CSS variables of the colors a CV gives, after the theme's own", async () => {
    const result = await css({
      accent: "#ff0066",
      background: "rgb(10, 10, 10)",
      textMuted: "gray"
    });
    const overrides = result.slice(result.lastIndexOf(":root"));
    assert.match(overrides, /--accent-color: #ff0066;/);
    assert.match(overrides, /--background-color: rgb\(10, 10, 10\);/);
    assert.match(overrides, /--text-color-muted: gray;/);
  });

  it("adds nothing when no color is given", async () => {
    assert.deepStrictEqual(resolveOptions().colors, {});
    assert.strictEqual((await css({})).includes("--accent-color: #ff"), false);
  });

  it("ignores unknown keys and values that could break out of the stylesheet", async () => {
    const options = resolveOptions({
      colors: {
        accent: "red; } body { display: none",
        link: "url(https://example.com/x)",
        border: "</style><script>",
        text: 5,
        nonsense: "red"
      }
    });
    assert.deepStrictEqual(options.colors, {});
  });
});
