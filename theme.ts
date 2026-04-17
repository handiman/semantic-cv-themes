import { Person } from "./person.js";

/**
 * Base class for all Semantic‑CV themes.
 *
 * A theme is a deterministic, runtime‑agnostic renderer that produces
 * three string fragments — HTML, CSS, and JS — based solely on a
 * normalized schema.org/Person object.
 *
 * Subclasses must implement `renderHTML()`. The base class provides
 * default implementations for `renderCSS()` and `renderJS()` that load
 * assets named after the theme's `id` (e.g. "minimal.css", "minimal.js").
 */
export abstract class Theme {
  /**
   * Create a new theme instance.
   *
   * @param id Unique identifier for the theme. Used for asset resolution
   *           and for generating enhancement element names such as
   *           `<semantic-cv-theme-{id}>`.
   * @param loadAsset Function that loads a theme asset (CSS/JS) by name.
   *                  Implemented differently in CLI and Worker runtimes.
   */
  constructor(
    public id: string,
    private loadAsset: (assetName: string) => Promise<string>,
    public title: string = titleify(id)
  ) {}

  /**
   * Render the main HTML fragment for the CV.
   * Must be implemented by all concrete themes.
   *
   * @param person Normalized JSON‑LD Person object.
   * @returns Promise resolving to an HTML string.
   */
  abstract renderHTML(person: Person): Promise<string>;

  /**
   * Render the theme's CSS.
   * By default, loads `{id}.css` via the provided asset loader.
   *
   * @param person Normalized JSON‑LD Person object.
   * @returns Promise resolving to a CSS string.
   */
  renderCSS(_person: Person) {
    return this.loadAsset(`${this.id}.css`);
  }

  /**
   * Render the theme's JavaScript module.
   * By default, loads `{id}.js` via the provided asset loader.
   *
   * @param person Normalized JSON‑LD Person object.
   * @returns Promise resolving to a JavaScript string.
   */
  renderJS(_person: Person) {
    return this.loadAsset(`${this.id}.js`);
  }
}

export default Theme;

const titleify = (s: string) => initCaps(s).replaceAll("-", " ").replaceAll("_", " ").trim();

const initCaps = (s: string) => {
  if (s.length) {
    return `${s[0].toUpperCase()}${s.substring(1)}`;
  }
  return s;
};
