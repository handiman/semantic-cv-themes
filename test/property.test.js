import { describe, it } from "node:test";
import assert from "node:assert";
import fc from "fast-check";
import { ThemeRegistry } from "#themes/themeRegistry.js";
import { JSDOM } from "jsdom";
import { loadTheme } from "./jsdomTransformer.js";

// Property-based tests: fast-check generates Persons with any combination of the fields core
// produces, every one of them optional, and shrinks a failure to the smallest Person that fails.
// Rendering with jsdom is slow, so each theme gets fewer runs than the properties in core.
const runs = { numRuns: 25 };

// A theme receives a Person that core has normalized and escaped, so the text has no character
// that needs escaping. Words that the placeholder check looks for are left out.
const text = fc
  .stringMatching(/^[A-Za-zÅÄÖåäöé0-9][A-Za-zÅÄÖåäöé0-9 .,:+#/()-]{0,30}$/)
  .filter((value) => !/undefined|null|NaN|object/i.test(value));
const date = fc.constantFrom("2019", "2020-05", "2021-03-14", "2024-11-30");
const url = fc.constantFrom(
  "https://github.com/someone",
  "https://www.linkedin.com/in/someone",
  "https://example.com/",
  "https://stackoverflow.com/users/1/someone"
);
const list = (arb) => fc.array(arb, { minLength: 1, maxLength: 4 });

// Every field optional, like the output of core's normalize.
const optional = (shape) => fc.record(shape, { requiredKeys: [] });

// Core always gives a Role its organization, but the organization may have no name.
const organization = fc
  .tuple(fc.constantFrom("Organization", "Project"), optional({ name: text, description: text }))
  .map(([type, fields]) => ({ "@type": type, ...fields }));

const role = fc
  .tuple(
    organization,
    optional({
      roleName: text,
      description: text,
      startDate: date,
      endDate: date,
      keywords: list(fc.record({ "@type": fc.constant("DefinedTerm"), name: text }))
    })
  )
  .map(([worksFor, r]) => ({ "@type": "Role", worksFor, ...r }));

const education = fc
  .tuple(optional({ name: text }), optional({ description: text, startDate: date, endDate: date }))
  .map(([school, r]) => ({
    "@type": "Role",
    alumniOf: { "@type": "EducationalOrganization", ...school },
    ...r
  }));

const person = optional({
  jobTitle: text,
  description: text,
  email: fc.constantFrom("someone@example.com", "a.b@example.se"),
  telephone: fc.constantFrom("+46 70 123 45 67", "08-123 456"),
  url,
  sameAs: list(url),
  workLocation: text,
  knowsLanguage: list(text),
  knowsAbout: list(text),
  skills: list(text),
  worksFor: list(role),
  alumniOf: list(education),
  hasCredential: list(
    optional({ name: text, description: text, datePublished: date }).map((c) => ({
      "@type": "EducationalOccupationalCredential",
      ...c
    }))
  ),
  hasCertification: list(
    optional({ name: text, issuedBy: text, validFrom: date }).map((c) => ({
      "@type": "Certification",
      ...c
    }))
  ),
  lifeEvent: list(
    optional({ name: text, description: text, startDate: date }).map((e) => ({
      "@type": "Event",
      ...e
    }))
  )
}).chain((fields) => text.map((name) => ({ "@type": "Person", name, ...fields })));

for (const themeId of Object.keys(ThemeRegistry)) {
  // One property with all three checks, so that each generated Person is rendered only twice.
  it(`${themeId}, for any Person, renders the name, prints no placeholder and gives the same HTML twice`, async () => {
    await fc.assert(
      fc.asyncProperty(person, async (p) => {
        // A theme is made for one render (it collects transformer hooks), so each gets its own.
        const html = await loadTheme(themeId).renderHTML(structuredClone(p));
        assert.strictEqual(await loadTheme(themeId).renderHTML(structuredClone(p)), html);

        const { textContent } = new JSDOM(html).window.document.body;
        assert.ok(textContent.includes(p.name), p.name);
        assert.doesNotMatch(textContent, /undefined|null|NaN|\[object/);
      }),
      runs
    );
  });
}
