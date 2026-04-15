import { Person } from "./person.js";

/**
 * Small normalization helpers used throughout Semantic‑CV.
 *
 * These utilities convert optional or mixed single‑value/array fields
 * into predictable arrays, and provide a simple Font Awesome icon
 * factory for social/contact links. All helpers are pure and free of
 * side effects.
 */

/**
 * Normalize a value into an array.
 * - `null`/`undefined` → []
 * - single item → [item]
 * - array → array
 */
export const arrayOf = (obj: any) => (obj && obj.map ? obj : obj ? [obj] : []);

/**
 * Merge multiple values/arrays into a single flat array with empty
 * values removed. Useful when combining optional fields.
 */
export const normalizeArray = (...args: Array<any>) => {
  let result = new Array<any>();
  for (const arg of args) {
    if (arg && arg.map) {
      result = [...result, ...arg];
    } else if (arg) {
      result.push(arg);
    }
  }
  return result.filter((item) => (item ? true : false));
};

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
