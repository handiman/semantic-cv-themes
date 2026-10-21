import { describe, it } from "node:test";
import assert from "node:assert";
import { renderDocument } from "./jsdomTransformer.js";

const person = {
  name: "Yoda",
  jobTitle: "Jedi Master",
  description: "Small, green.",
  worksFor: [{ roleName: "Master", worksFor: { "@type": "Organization", name: "Jedi Order" } }]
};

describe("matilda", () => {
  it("renders the summary as an h2 heading", async () => {
    const document = await renderDocument("matilda", person);
    const summary = [...document.querySelectorAll("h2")].find((h2) => h2.textContent === "Summary");
    assert.strictEqual(summary.nextElementSibling.textContent, "Small, green.");
  });

  it("closes the opening tag of every heading", async () => {
    const document = await renderDocument("matilda", person);
    const broken = [...document.querySelectorAll("*")].filter((el) => /^H[1-6]./.test(el.tagName));
    assert.deepStrictEqual(
      broken.map((el) => el.tagName),
      []
    );
  });

  describe("header", () => {
    it("has a single h1, so the name is not a heading twice", async () => {
      const document = await renderDocument("matilda", person);
      assert.strictEqual(document.querySelectorAll("h1").length, 1);
    });

    it("is rendered in main, not in aside", async () => {
      const document = await renderDocument("matilda", person);
      assert.strictEqual(document.querySelector("main > header h1").textContent, "Yoda");
      assert.strictEqual(document.querySelector("aside header"), null);
      assert.doesNotMatch(document.querySelector("aside").textContent, /Jedi Master/);
    });
  });
});
