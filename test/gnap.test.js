import { describe, it } from "node:test";
import assert from "node:assert";
import { loadTheme, renderDocument } from "./jsdomTransformer.js";

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

  describe("layout classes", () => {
    // Gnap used to get these from the Materialize framework; its own CSS has to style them now.
    const classes = [
      "container",
      "row",
      "center",
      "valign-wrapper",
      "grey",
      "darken-4",
      "white",
      "white-text",
      "black-text"
    ];
    const person = { name: "Yoda", jobTitle: "Jedi Master", sameAs: ["https://github.com/yoda"] };

    for (const name of classes) {
      it(`has a rule for .${name} in its CSS, where its markup uses it`, async () => {
        const document = await renderDocument("gnap", person);
        const css = await loadTheme("gnap").renderCSS(person);
        assert.ok(document.querySelector(`.${name}`), `the markup does not use .${name}`);
        assert.ok(css.includes(`.${name}`), `the CSS has no rule for .${name}`);
      });
    }
  });
});
