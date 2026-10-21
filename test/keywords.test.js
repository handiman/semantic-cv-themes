import { describe, it } from "node:test";
import assert from "node:assert";
import { TimesTheme } from "#themes/times/index.js";
import { TypewriterTheme } from "#themes/typewriter/index.js";

const term = (name) => ({ "@type": "DefinedTerm", name });
const keywords = [term("TypeScript"), term("Azure Service Bus")];

for (const [id, Theme] of [
  ["times", TimesTheme],
  ["typewriter", TypewriterTheme]
]) {
  describe(`${id}: role keywords`, () => {
    const theme = new Theme({}, () => Promise.resolve(""));

    it("are a plain comma separated line headed Skills:", () => {
      const html = theme.renderWorksFor([{ keywords, worksFor: { name: "Acme" } }]);
      assert.match(html, /<p>Skills: TypeScript, Azure Service Bus<\/p>/);
    });

    it("are not rendered as a list", () => {
      const html = theme.renderWorksFor([{ keywords, worksFor: { name: "Acme" } }]);
      assert.doesNotMatch(html, /scv-keywords/);
    });

    it("are rendered the same way for a project", () => {
      const html = theme.renderProjects([
        { keywords, worksFor: { "@type": "Project", name: "Rocket" } }
      ]);
      assert.match(html, /<p>Skills: TypeScript, Azure Service Bus<\/p>/);
    });

    it("leave out the line when a role has none", () => {
      const html = theme.renderWorksFor([{ worksFor: { name: "Acme" } }]);
      assert.doesNotMatch(html, /Skills:/);
    });
  });
}
