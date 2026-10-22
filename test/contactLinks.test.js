import { describe, it } from "node:test";
import assert from "node:assert";
import { contactLinks } from "#themes/contact.js";

describe("contactLinks", () => {
  it("is empty for a Person without contact details", () => {
    assert.deepStrictEqual(contactLinks({ name: "Ada" }), []);
  });

  it("gives email, phone, website and profiles, in that order", () => {
    const links = contactLinks({
      sameAs: ["https://github.com/ada", "https://www.linkedin.com/in/ada"],
      url: "https://www.ada.example",
      telephone: "+46 8 123",
      email: "ada@example.com"
    });
    assert.deepStrictEqual(
      links.map(({ href, text, label }) => ({ href, text, label })),
      [
        { href: "mailto:ada@example.com", text: "ada@example.com", label: "Email" },
        { href: "tel:+46 8 123", text: "+46 8 123", label: "Phone" },
        { href: "https://www.ada.example", text: "ada.example", label: "Website" },
        { href: "https://github.com/ada", text: "github.com/ada", label: "GitHub" },
        { href: "https://www.linkedin.com/in/ada", text: "linkedin.com/in/ada", label: "LinkedIn" }
      ]
    );
  });

  it("gives every link its icon as inline SVG", () => {
    const [link] = contactLinks({ email: "ada@example.com" });
    assert.match(link.icon, /^<svg class="icon"/);
  });
});
