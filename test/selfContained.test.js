import { describe, it } from "node:test";
import assert from "node:assert";
import { ThemeRegistry } from "#themes/themeRegistry.js";
import { loadTheme, renderDocument } from "./jsdomTransformer.js";
import { fullPerson } from "./persons.js";

// A theme is self-contained: everything it needs (styles, scripts, fonts, images, filters) is in
// the page it renders. The only addresses in the page that point elsewhere are the CV's own: its
// links and its photo. So a theme works offline, in a saved file and in a PDF, and a CV never
// makes its reader's browser call anyone.

// Addresses that come from the Person, and so belong to the CV rather than to the theme.
const ownAddresses = new Set([
  fullPerson.url,
  fullPerson.image,
  ...fullPerson.sameAs,
  `mailto:${fullPerson.email}`,
  `tel:${fullPerson.telephone}`,
  `tel:${fullPerson.telephone.replace(/\s/g, "")}`
]);

// Attributes that make a browser load or go to an address.
const addressAttributes = ["src", "href", "srcset", "poster", "data", "action", "xlink:href"];

// An address inside the page itself: a data: URL or a fragment such as an SVG filter's #id.
const isInline = (address) => /^(data:|#)/i.test(address.trim());

// The namespace of inline SVG is an identifier, never fetched.
const svgNamespace = /^https?:\/\/www\.w3\.org\/(2000\/svg|1999\/xlink)$/;

const externalAddresses = (text) =>
  [...text.matchAll(/(?:https?:)?\/\/[a-z0-9-]+(?:\.[a-z0-9-]+)+[^\s"'()<>]*/gi)]
    .map(([address]) => address)
    .filter((address) => !svgNamespace.test(address));

for (const themeId of Object.keys(ThemeRegistry)) {
  describe(`${themeId} is self-contained`, () => {
    it("points nowhere but to the CV's own links and photo in its HTML", async () => {
      const document = await renderDocument(themeId, structuredClone(fullPerson));
      const foreign = [];
      for (const el of document.querySelectorAll("*")) {
        for (const name of addressAttributes) {
          const value = el.getAttribute(name);
          if (value !== null && !isInline(value) && !ownAddresses.has(value)) {
            foreign.push(`<${el.localName} ${name}="${value}">`);
          }
        }
        const style = el.getAttribute("style");
        if (style && externalAddresses(style).length) {
          foreign.push(`<${el.localName} style="${style}">`);
        }
      }
      assert.deepStrictEqual(foreign, []);
    });

    it("loads nothing from its CSS", async () => {
      const css = await loadTheme(themeId).renderCSS(fullPerson);
      assert.doesNotMatch(css, /@import/);
      const urls = [...css.matchAll(/url\(\s*["']?([^"')]+)/g)].map(([, address]) => address);
      assert.deepStrictEqual(
        urls.filter((address) => !isInline(address)),
        []
      );
      assert.deepStrictEqual(externalAddresses(css), []);
    });

    it("makes no network call from its JS", async () => {
      const js = await loadTheme(themeId).renderJS(fullPerson);
      assert.doesNotMatch(
        js,
        /\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon|importScripts|\bimport\s*\(/
      );
      assert.deepStrictEqual(externalAddresses(js), []);
    });
  });
}
