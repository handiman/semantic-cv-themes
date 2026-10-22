import { describe, it } from "node:test";
import assert from "node:assert";
import { renderDocument } from "./jsdomTransformer.js";

for (const themeId of ["boiling-diesel", "holden-wreck"]) {
  describe(`${themeId} job title`, () => {
    it("is a paragraph with the job-title class after the name, not a heading", async () => {
      const document = await renderDocument(themeId, { name: "Yoda", jobTitle: "Jedi Master" });
      const jobTitle = document.querySelector("header h1 + .job-title");
      assert.strictEqual(jobTitle.tagName, "P");
      assert.strictEqual(jobTitle.textContent, "Jedi Master");
      assert.strictEqual(document.querySelectorAll("header h2").length, 0);
    });

    it("leaves out the paragraph when there is no job title", async () => {
      const document = await renderDocument(themeId, { name: "Yoda" });
      assert.strictEqual(document.querySelector("header .job-title"), null);
    });
  });
}
