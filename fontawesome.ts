import Person from "./person.js";

export const CDN = {
  v5: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.9.0/css/all.min.css",
  v6: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
};

export default CDN.v6;

/**
 * Factory for generating Font Awesome icon markup based on a URL or
 * contact string. Attempts to infer the appropriate icon glyph and
 * category (solid vs brand) from the input.
 *
 * This is intentionally heuristic and designed for friendly, predictable
 * output rather than exhaustive URL parsing.
 */
export class FaIconFactory {
  constructor(private person: Person) {}
  faIcon = (url: string) => {
    const { person } = this;
    const faCategory = (iconName: string) => {
      switch (iconName) {
        case "phone":
        case "envelope":
        case "globe":
          return "fas";
        default:
          return "fab";
      }
    };
    const faGlyph = (url: string) => {
      if (url.indexOf("microsoft.com") > -1) {
        return "windows";
      }
      if (url.indexOf("://x.com") > 1 || url.indexOf("://www.x.com") > -1) {
        return "twitter";
      }
      if (url.indexOf("mailto:") > -1) {
        return "envelope";
      }
      if (url.indexOf("tel:") > -1) {
        return "phone";
      }
      if (url === person.url) {
        return "globe";
      }
      let icon = url.substring(url.indexOf("://") + 3).replace("www.", "");
      return `${icon.substring(0, icon.indexOf("."))}`;
    };
    const glyph = faGlyph(url);
    const category = faCategory(glyph);

    return `<i class="${category} fa-${glyph}"></i>`;
  };
}
