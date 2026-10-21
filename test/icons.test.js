import { describe, it } from "node:test";
import assert from "node:assert";
import { IconFactory, icon } from "#themes/icons.js";
import { ThemeRegistry } from "#themes/themeRegistry.js";
import { renderDocument } from "./jsdomTransformer.js";

const factory = new IconFactory({ url: "https://www.henrikbecker.net" });

describe("icon of a contact link", () => {
  for (const [url, name, label] of [
    ["https://github.com/handiman", "github", "GitHub"],
    ["https://gitlab.com/handiman", "gitlab", "GitLab"],
    ["https://www.linkedin.com/in/prettygoodprogrammer", "linkedin", "LinkedIn"],
    ["https://x.com/handiman", "x", "X"],
    ["https://www.twitter.com/handiman", "x", "X"],
    ["https://mastodon.social/@handiman", "mastodon", "Mastodon"],
    ["https://fosstodon.org/@handiman", "mastodon", "Mastodon"],
    ["https://bsky.app/profile/handiman", "bluesky", "Bluesky"],
    ["https://stackoverflow.com/users/1/handiman", "stackoverflow", "Stack Overflow"],
    ["https://www.youtube.com/@handiman", "youtube", "YouTube"],
    ["https://www.facebook.com/handiman", "facebook", "Facebook"],
    ["https://www.instagram.com/handiman", "instagram", "Instagram"],
    ["https://www.microsoft.com", "microsoft", "Microsoft"],
    ["mailto:spam@henrikbecker.se", "envelope", "Email"],
    ["tel:+46123456789", "phone", "Phone"],
    ["https://www.henrikbecker.net", "globe", "Website"]
  ]) {
    it(`${url} is ${label}`, () => {
      assert.strictEqual(factory.icon(url), icon(name));
      assert.strictEqual(factory.label(url), label);
    });
  }

  it("is found for a subdomain of the site", () => {
    assert.strictEqual(
      factory.icon("https://learn.microsoft.com/users/handiman"),
      icon("microsoft")
    );
    assert.strictEqual(factory.icon("https://sv.linkedin.com/in/handiman"), icon("linkedin"));
  });

  describe("for any other site", () => {
    it("is the link icon, labeled with the site", () => {
      assert.strictEqual(factory.icon("https://www.pinterest.com/handiman"), icon("link"));
      assert.strictEqual(factory.label("https://www.pinterest.com/handiman"), "pinterest.com");
      assert.strictEqual(factory.label("https://codeberg.org/handiman?tab=repos"), "codeberg.org");
    });

    it("is not an icon of a site that only looks like it", () => {
      for (const url of ["https://evilgithub.com/a", "https://github.com.evil.example/a"]) {
        assert.strictEqual(factory.icon(url), icon("link"), url);
      }
    });
  });

  it("labels a hostile link with nothing that was not in it", () => {
    // A host with a percent escape is read back as a quote by a URL parser. The label is cut out
    // of the text, so it stays as it was written.
    const label = factory.label("https://a%22onfocus=%22x.com/");
    assert.strictEqual(label, "a%22onfocus=%22x.com");
    assert.doesNotMatch(label, /["<>]/);
  });
});

describe("an icon", () => {
  it("is an inline SVG that a screen reader skips, and not an icon font", () => {
    const svg = icon("github");
    assert.match(svg, /^<svg class="icon" /);
    assert.match(svg, /aria-hidden="true"/);
    assert.doesNotMatch(svg, /<i[ >]|fa-/);
  });

  it("has a shape for every name", () => {
    for (const name of ["github", "envelope", "phone", "globe", "location", "link"]) {
      assert.match(icon(name), /<path d="[^"]+"/, name);
    }
  });
});

const person = {
  name: "Ada Lovelace",
  jobTitle: "Analyst",
  workLocation: "London, England",
  email: "ada@example.com",
  telephone: "+44 20 7946 0000",
  url: "https://www.ada.example",
  sameAs: ["https://github.com/ada", "https://www.linkedin.com/in/ada-lovelace/"]
};

for (const themeId of Object.keys(ThemeRegistry)) {
  describe(`${themeId} icons`, () => {
    it("loads nothing from Font Awesome", async () => {
      const document = await renderDocument(themeId, person);
      const sources = [...document.querySelectorAll("link, script")].map(
        (el) => el.href ?? el.src ?? ""
      );
      assert.deepStrictEqual(
        sources.filter((source) => /font-?awesome/i.test(source)),
        []
      );
      assert.strictEqual(document.querySelectorAll('[class*="fa-"], i.fas, i.fab').length, 0);
    });

    it("names every link that shows nothing but an icon", async () => {
      const document = await renderDocument(themeId, person);
      for (const a of document.querySelectorAll("a")) {
        if (!a.querySelector("svg")) {
          continue;
        }
        const visible = a.cloneNode(true);
        visible.querySelectorAll(".print").forEach((el) => el.remove());
        visible.querySelectorAll("svg").forEach((el) => el.remove());
        const name = visible.textContent.trim() || a.getAttribute("aria-label");
        assert.ok(name, `a link with an icon has no name: ${a.outerHTML.slice(0, 120)}`);
      }
    });
  });
}
