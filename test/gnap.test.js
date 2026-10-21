import { describe, it } from "node:test";
import assert from "node:assert";
import { renderDocument } from "./jsdomTransformer.js";

describe("gnap", () => {
  it("renders the job title as a paragraph after the name, not as a heading", async () => {
    const document = await renderDocument("gnap", { name: "Yoda", jobTitle: "Jedi Master" });
    const jobTitle = document.querySelector("h1 + .job-title");
    assert.strictEqual(jobTitle.tagName, "P");
    assert.strictEqual(jobTitle.textContent, "Jedi Master");
    assert.strictEqual(document.querySelectorAll("h4").length, 0);
  });

  it("leaves out the job title when there is none", async () => {
    const document = await renderDocument("gnap", { name: "Yoda" });
    assert.strictEqual(document.querySelector(".job-title"), null);
  });
});
