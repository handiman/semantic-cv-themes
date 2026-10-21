import { describe, it } from "node:test";
import assert from "node:assert";
import { ThemeRegistry } from "#themes/themeRegistry.js";
import { renderDocument } from "./jsdomTransformer.js";

const person = {
  name: "Yoda",
  jobTitle: "Jedi Master",
  description: "Small, green.",
  worksFor: [
    {
      "@type": "Role",
      roleName: "Master",
      startDate: "2020-01",
      worksFor: { "@type": "Organization", name: "Jedi Order" }
    },
    {
      "@type": "Role",
      roleName: "Lead",
      startDate: "2021-01",
      worksFor: { "@type": "Project", name: "Rocket" }
    }
  ]
};

const headingsOf = async (themeId) => {
  const document = await renderDocument(themeId, person);
  return [...document.querySelectorAll("h2")].map((h2) => h2.textContent.trim());
};

for (const themeId of Object.keys(ThemeRegistry)) {
  describe(`${themeId} sections`, () => {
    it("has Work Experience and Projects headings", async () => {
      const headings = await headingsOf(themeId);
      assert.ok(headings.includes("Work Experience"), headings.join(", "));
      assert.ok(headings.includes("Projects"), headings.join(", "));
    });

    it("puts Projects after Work Experience", async () => {
      const headings = await headingsOf(themeId);
      assert.ok(
        headings.indexOf("Work Experience") < headings.indexOf("Projects"),
        headings.join(", ")
      );
    });
  });
}
