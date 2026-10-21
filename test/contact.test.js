import { describe, it } from "node:test";
import assert from "node:assert";
import { ThemeRegistry } from "#themes/themeRegistry.js";
import { renderDocument, loadAsset } from "./jsdomTransformer.js";

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

const renderText = async (themeId, subject = person) => {
  const document = await renderDocument(themeId, subject);
  document.querySelectorAll("script, style, link").forEach((el) => el.remove());
  return document.body.textContent.replace(/\s+/g, " ");
};

const role = (location) => ({
  "@type": "Role",
  roleName: "Analyst",
  startDate: "2020-01-15",
  worksFor: { "@type": "Organization", name: "Acme", location }
});

describe("Places", () => {
  const stockholm = { "@type": "Place", name: "Stockholm" };
  const address = { "@type": "PostalAddress", addressLocality: "Malmö", addressCountry: "SE" };

  for (const themeId of Object.keys(ThemeRegistry)) {
    it(`${themeId} renders a Place and a PostalAddress as text`, async () => {
      const text = await renderText(themeId, {
        ...person,
        workLocation: address,
        worksFor: [role(stockholm)]
      });
      assert.ok(text.includes("Malmö, SE"), `${themeId} is missing the work location`);
      assert.ok(text.includes("Stockholm"), `${themeId} is missing the role location`);
      assert.ok(!text.includes("[object Object]"), `${themeId} prints an object`);
    });
  }
});

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
