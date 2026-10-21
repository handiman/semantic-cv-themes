import { describe, it } from "node:test";
import assert from "node:assert";
import { ThemeRegistry } from "#themes/themeRegistry.js";
import { loadTheme, renderDocument } from "./jsdomTransformer.js";

/** The web fonts a theme has, and so the families that its CSS has to embed. */
const embedded = {
  gnap: ["Open Sans"],
  lena: ["Noto Sans", "Noto Sans Display"],
  times: ["Pirata One"],
  typewriter: ["Special Elite"]
};

/** The one external stylesheet that is left, until Gnap stops using Materialize (#59). */
const external = {
  gnap: ["https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css"]
};

const person = { name: "Yoda", jobTitle: "Jedi Master", description: "Small, green." };

const cssOf = (themeId) => loadTheme(themeId).renderCSS(person);

const fontFaces = (css) => [...css.matchAll(/@font-face \{[^}]*\}/g)].map(([rule]) => rule);

for (const themeId of Object.keys(ThemeRegistry)) {
  describe(`${themeId} fonts`, () => {
    it("loads no font and no web font stylesheet from the network", async () => {
      const document = await renderDocument(themeId, person);
      const html = document.documentElement.outerHTML;
      const css = await cssOf(themeId);
      assert.doesNotMatch(html + css, /fonts\.googleapis\.com|fonts\.gstatic\.com/);
      assert.doesNotMatch(css, /url\(\s*["']?https?:/);
    });

    it("links to nothing outside the page except what is on the list", async () => {
      const document = await renderDocument(themeId, person);
      const links = [...document.querySelectorAll("link[href], script[src]")].map(
        (el) => el.getAttribute("href") ?? el.getAttribute("src")
      );
      assert.deepStrictEqual(
        links.filter((link) => /^(https?:)?\/\//.test(link)),
        external[themeId] ?? []
      );
    });
  });
}

for (const [themeId, families] of Object.entries(embedded)) {
  describe(`${themeId} embedded fonts`, () => {
    for (const family of families) {
      it(`has ${family} inside its CSS, as a woff2 file`, async () => {
        const faces = fontFaces(await cssOf(themeId)).filter((rule) =>
          rule.includes(`font-family: "${family}";`)
        );
        assert.ok(faces.length > 0, `no @font-face for ${family}`);
        for (const rule of faces) {
          const base64 = /url\(data:font\/woff2;base64,([A-Za-z0-9+/=]+)\)/.exec(rule)?.[1];
          assert.ok(base64, `${family} is not embedded as base64`);
          const file = Buffer.from(base64, "base64");
          assert.strictEqual(file.subarray(0, 4).toString("latin1"), "wOF2");
          assert.match(rule, /unicode-range: U\+/);
        }
      });

      it(`uses ${family}`, async () => {
        const css = (await cssOf(themeId)).replace(/@font-face \{[^}]*\}/g, "");
        assert.ok(
          css.includes(`"${family}"`),
          `${family} is embedded but the theme does not use it`
        );
      });
    }

    it("covers the characters of Swedish", async () => {
      const css = await cssOf(themeId);
      const latin = fontFaces(css).find((rule) => rule.includes("U+0000-00FF"));
      assert.ok(latin, "no face that has the characters up to U+00FF, which includes å, ä and ö");
    });
  });
}
