import { describe, it } from "node:test";
import assert from "node:assert";
import { Theme } from "#themes/theme.js";

class TestTheme extends Theme {
  constructor() {
    super(() => Promise.resolve(""), { id: "test", title: "Test", description: "", tags: [] });
  }
  renderHTML() {
    return Promise.resolve("");
  }
}

const count = (html, tag) => (html.match(new RegExp(tag, "g")) ?? []).length;

describe("Theme section renderers", () => {
  const theme = new TestTheme();

  for (const method of ["renderKnowsLanguage", "renderKnowsAbout", "renderSkills"]) {
    it(`${method} closes every list it opens`, () => {
      const html = theme[method](["One", "Two"]);
      assert.strictEqual(count(html, "<ul>"), 1);
      assert.strictEqual(count(html, "</ul>"), 1);
      assert.strictEqual(count(html, "<li>"), 2);
    });

    it(`${method} renders nothing for an empty list`, () => {
      assert.strictEqual(theme[method]([]), "");
    });
  }

  it("renders role dates with the right month", () => {
    const html = theme.renderWorksFor([
      {
        roleName: "Dev",
        startDate: "2020-01-15",
        endDate: "2021-12-31",
        worksFor: { name: "Acme" }
      }
    ]);
    assert.match(html, />2020-01</);
    assert.match(html, />2021-12</);
  });
});
