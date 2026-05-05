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
   * @param title Optional human friendly theme title
   */
  constructor(
    public id: string,
    private loadAsset: (assetName: string) => Promise<string>,
    public title: string = titleify(id),
    public description: string = ""
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
  async renderCSS(_person: Person) {
    return withResetCSS(await this.loadAsset(`${this.id}.css`));
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

export const titleify = (s: string) => initCaps(s).replaceAll("-", " ").replaceAll("_", " ").trim();

const initCaps = (s: string) => {
  if (s.length) {
    return `${s[0].toUpperCase()}${s.substring(1)}`;
  }
  return s;
};

const withResetCSS = (themeCss: string) => `
:root {
  --text-color: #222;
  --background-color: #fff;
  --accent-color: #007aff;
  --link-color: #007aff;

  --font-size-base: 16px;
  --font-family-base: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;

  --spacing-base: 1rem;
  --border-radius-base: 4px;
}  
html, body, *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { font-size: var(--font-size-base); font-family: var(--font-family-base); color: var(--text-color); background-color: var(--background-color); }
a, a:link, a:visited, a:active, a:hover { color: var(--accent-color); text-decoration: none; }
a:hover { text-decoration: underline; }
ul, ol, li, li:before, li:after {   list-style: none; margin: 0; padding: 0; }
.page { display: grid; grid-template-columns: auto; grid-template-areas: "header" "aside" "main"; } .page header { grid-area: "header"; }
aside { grid-area: "aside"; }
main { grid-area: "main"; }
.scv-footer { color: var(--text-primary); text-align:center; font-size: .9rem; opacity: .5; } 
.print { display: none; }
.no-print { display: reset; }
@media print { .print { display: reset; } .no-print { display: none; }}
${themeCss}    
`;
