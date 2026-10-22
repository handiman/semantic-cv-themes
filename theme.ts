import { Person, certifications, education, period, projects, work } from "./person.js";
import { HTMLTransformer } from "./htmlTransformer.js";
import { ThemeMetadata } from "./themeMetadata.js";
import { defaultOptions, ThemeOptions } from "./themeOptions.js";
import { arrayOf, locationText } from "./utils.js";

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
 *
 * Security: the Person passed to the render methods comes from
 * semantic-cv-core's renderHTML, which has already HTML-escaped every
 * string and removed unsafe URLs (javascript:, data:, …). Themes therefore
 * insert values as HTML (`{ html: true }`) and must not escape them again.
 * Never call a theme with an unescaped Person.
 */
export abstract class Theme {
  /**
   * Id, title, description and tags of the theme. Every theme declares its own as
   * `static readonly meta`; the base class reads it from there.
   */
  declare static readonly meta: ThemeMetadata;

  /**
   * Create a new theme instance. Themes don't declare a constructor of their own;
   * `ThemeLoader` calls this one.
   *
   * @param transformer HTML rewriting implementation of the runtime (CLI or Worker).
   * @param loadAsset Function that loads a theme asset (CSS/JS) by name.
   *                  Implemented differently in CLI and Worker runtimes.
   * @param options Theme options such as headings. Custom values require a subscription. (or forking the repo and building your own implementation for the creative ones out there)
   */
  constructor(
    protected transformer: HTMLTransformer,
    private loadAsset: (assetName: string) => Promise<string>,
    protected options: ThemeOptions = defaultOptions
  ) {
    // Bound, so a theme can take them out of `this` and call them from a transformer hook.
    this.renderHTML = this.renderHTML.bind(this);
    this.renderCSS = this.renderCSS.bind(this);
    this.renderJS = this.renderJS.bind(this);
    this.renderWorksFor = this.renderWorksFor.bind(this);
    this.renderAlumniOf = this.renderAlumniOf.bind(this);
    this.renderProjects = this.renderProjects.bind(this);
    this.renderCertifications = this.renderCertifications.bind(this);
    this.renderLifeEvents = this.renderLifeEvents.bind(this);
    this.renderKnowsLanguage = this.renderKnowsLanguage.bind(this);
    this.renderKnowsAbout = this.renderKnowsAbout.bind(this);
    this.renderSkills = this.renderSkills.bind(this);
    this.renderKeywords = this.renderKeywords.bind(this);
  }

  /** The `meta` of the concrete theme class. */
  private get meta(): ThemeMetadata {
    return (this.constructor as typeof Theme).meta;
  }

  /**
   * The page skeleton of the theme, with a `<slot name="…"></slot>` wherever a
   * part of the CV goes. `renderHTML` replaces each slot with that part, or
   * removes it when the Person has nothing for it, so no slot reaches the
   * browser. Unlike Web Components, the slots are filled here, on the server.
   *
   * Slot names are those of `sectionSlots` (the sections of the base class)
   * and those the theme adds in `slots`. A theme that builds its page another
   * way overrides `renderHTML` instead and leaves this undefined.
   */
  protected layout(_person: Person): string | undefined {
    return undefined;
  }

  /**
   * The theme's own slots, for the parts it renders in its own markup (for
   * example the header or the contact details). A slot here replaces a
   * section slot of the same name.
   */
  protected slots(_person: Person): Slots {
    return {};
  }

  /** The sections every theme can place in its layout, rendered by the base class. */
  protected sectionSlots(person: Person): Slots {
    return {
      worksFor: () => this.renderWorksFor(work(person)),
      projects: () => this.renderProjects(projects(person)),
      alumniOf: () => this.renderAlumniOf(education(person)),
      lifeEvent: () => this.renderLifeEvents(person.lifeEvent),
      certifications: () => this.renderCertifications(certifications(person)),
      knowsAbout: () => this.renderKnowsAbout(person.knowsAbout),
      skills: () => this.renderSkills(person.skills),
      knowsLanguage: () => this.renderKnowsLanguage(person.knowsLanguage)
    };
  }

  /**
   * Render the main HTML fragment for the CV: the `layout` with every slot
   * filled or removed. A theme without a layout overrides this.
   *
   * @param person Normalized JSON‑LD Person object.
   * @returns Promise resolving to an HTML string.
   */
  async renderHTML(person: Person): Promise<string> {
    const layout = this.layout(person);
    if (layout === undefined) {
      throw new Error(`Theme "${this.meta.id}" has neither a layout nor its own renderHTML`);
    }
    const slots: Slots = { ...this.sectionSlots(person), ...this.slots(person) };
    const themeId = this.meta.id;
    this.transformer.on("slot", {
      element(slot: any) {
        const name = slot.getAttribute("name") ?? "";
        const render = slots[name];
        if (!render) {
          throw new Error(`Theme "${themeId}" has a slot named "${name}", which nothing renders`);
        }
        const content = render();
        if (content.trim()) {
          slot.replace(content, html);
        } else {
          slot.remove();
        }
      }
    });
    return this.transformer.transform(layout);
  }

  /**
   * Render the theme's CSS: the base CSS, then `{id}.css` of every theme class
   * from the furthest ancestor to this one. A variant that extends another
   * theme therefore gets that theme's CSS first, and its own `{id}.css` only
   * needs what differs, typically the values of the CSS variables.
   *
   * @param person Normalized JSON‑LD Person object.
   * @returns Promise resolving to a CSS string.
   */
  async renderCSS(_person: Person) {
    const ids: Array<string> = [];
    for (
      let type = this.constructor as typeof Theme;
      type && type !== Theme;
      type = Object.getPrototypeOf(type)
    ) {
      if (Object.prototype.hasOwnProperty.call(type, "meta")) {
        ids.unshift(type.meta.id);
      }
    }
    const css = await Promise.all(ids.map((id) => this.loadAsset(`${id}.css`)));
    return withResetCSS(css.join("\n"));
  }

  /**
   * Render the theme's JavaScript module.
   * By default, loads `{id}.js` via the provided asset loader. Both runtimes
   * give an empty string when the theme has no such file, so a theme without
   * a script doesn't need to override this.
   *
   * @param person Normalized JSON‑LD Person object.
   * @returns Promise resolving to a JavaScript string.
   */
  renderJS(_person: Person) {
    return this.loadAsset(`${this.meta.id}.js`);
  }

  public get id() {
    return this.meta.id;
  }

  public get title() {
    return this.meta.title;
  }

  public get description() {
    return this.meta.description;
  }

  protected renderKnowsLanguage(knowsLanguage: Array<string> | null | undefined): string {
    const { headings } = this.options;
    return knowsLanguage && knowsLanguage.length
      ? `
        <section id="knowsLanguage">
          <h2>${headings.knowsLanguage}</h2>
          <ul>${knowsLanguage.map((language: string) => `<li>${language}</li>`).join("")}</ul>
        </section>
      `
      : "";
  }

  protected renderKnowsAbout(knowsAbout: Array<string> | null | undefined): string {
    const { headings } = this.options;
    return knowsAbout && knowsAbout.length
      ? `
        <section id="knowsAbout">
          <h2>${headings.knowsAbout}</h2>
          <ul>${knowsAbout.map((area: string) => `<li>${area}</li>`).join("")}</ul>
        </section>
      `
      : "";
  }

  protected renderSkills(skills: Array<string> | null | undefined): string {
    const { headings } = this.options;
    return skills && skills.length
      ? `
        <section id="skills">
          <h2>${headings.skills}</h2>
          <ul>${skills.map((skill: string) => `<li>${skill}</li>`).join("")}</ul>
        </section>
      `
      : "";
  }

  protected renderWorksFor(worksFor: Array<any> | null | undefined): string {
    const { headings } = this.options;
    return worksFor && worksFor.length
      ? `
        <section id="worksFor">
          <h2>${headings.worksFor}</h2>
          ${worksFor.map((role) => renderRole(role, this.renderKeywords, this.options.labels.present)).join("")}
        </section>
      `
      : "";
  }

  protected renderAlumniOf(alumniOf: Array<any> | null | undefined): string {
    const { headings } = this.options;
    return alumniOf && alumniOf.length
      ? `
        <section id="alumniOf">
          <h2>${headings.alumniOf}</h2>
          ${alumniOf.map((role) => renderRole(role, this.renderKeywords, this.options.labels.present)).join("")}
        </section>
      `
      : "";
  }

  protected renderProjects(proj: Array<any> | null | undefined): string {
    const { headings } = this.options;
    return proj && proj.length
      ? `
        <section id="project">
          <h2>${headings.projects}</h2>
          ${proj.map((role) => renderRole(role, this.renderKeywords, this.options.labels.present)).join("")}
        </section>
      `
      : "";
  }

  protected renderLifeEvents(lifeEvent: Array<any> | null | undefined): string {
    const { headings } = this.options;
    return lifeEvent && lifeEvent.length
      ? `
        <section id="lifeEvent">
          <h2>${headings.lifeEvent}</h2>
          ${lifeEvent.map(renderLifeEvent).join("")}
        </section>
      `
      : "";
  }

  /**
   * The keywords of a role, already escaped. A theme can override this to
   * show them another way.
   */
  protected renderKeywords(keywords: Array<string>): string {
    return `<ul class="scv-keywords">${keywords.map((keyword) => `<li>${keyword}</li>`).join("")}</ul>`;
  }

  protected renderCertifications(certs: Array<any> | null | undefined): string {
    const { headings } = this.options;
    return certs && certs.length
      ? `
        <section id="certifications">
          <h2>${headings.certifications}</h2>
          <ul>${certs.map((cert: any) => `<li>${cert.name}</li>`).join("")}</ul>
        </section>
      `
      : "";
  }
}

export default Theme;

/** The parts of a layout, by slot name. Each renders its markup, or "" when it has nothing. */
export type Slots = Record<string, () => string>;

/** Options for inserting a string as HTML with the transformer: `el.append(markup, html)`. */
export const html = { html: true } as const;

const withResetCSS = (themeCss: string) => `
:root {
  /* The CSS variables every theme uses for these roles (see CLAUDE.md). A theme sets
     the values in its own :root; these are the defaults. */
  --text-color: #222;
  --text-color-muted: #666;
  --background-color: #fff;
  --heading-color: var(--text-color);
  --accent-color: #007aff;
  --link-color: #007aff;
  --border-color: #ddd;

  --font-size-base: 16px;
  --font-family-base: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;

  --space-0: 0.5rem;
  --space-1: 1rem;
  --space-2: 2rem;
  --space-3: 3rem;
  --border-radius-base: 4px;
}  
html, body, *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { font-size: var(--font-size-base); font-family: var(--font-family-base); color: var(--text-color); background-color: var(--background-color); }
a, a:link, a:visited, a:active, a:hover { color: var(--accent-color); text-decoration: none; } a:hover { text-decoration: underline; }
ul, ol, li, li:before, li:after { list-style: none; margin: 0; padding: 0; }
.scv-footer { color: var(--text-color); text-align:center; font-size: .9rem; opacity: .5; } 
.scv-description { white-space: pre-line; }
.icon { width: 1em; height: 1em; vertical-align: -0.125em; flex: none; }
.scv-keywords { display: flex; flex-wrap: wrap; gap: .25rem .5rem; margin-top: .5rem; font-size: .85em; }
.scv-keywords li { padding: .1rem .5rem; border: 1px solid currentColor; border-radius: var(--border-radius-base); opacity: .8; }
.print { display: none; } .no-print { display: reset; }
@media print { 
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  /* Keep one role together; a whole section rarely fits on a page. */
  article { break-inside: avoid; page-break-inside: avoid; }
  h1, h2, h3 { break-after: avoid; page-break-after: avoid; }
  /* Contextual alternates (e.g. Inter's) print "-" and ":" as glyphs with
     no Unicode mapping, so ATS text extraction loses them. */
  html, body { font-feature-settings: "calt" 0; }
  .print { display: unset; } 
  .no-print { display: none; }
}
@page { margin: 0; padding: 0; }
${themeCss}    
`;

const renderRole = (
  role: any,
  renderKeywords: (keywords: Array<string>) => string,
  present: string
) => {
  const { roleName, startDate, endDate, description, worksFor, alumniOf } = role;
  const { name } = worksFor ?? alumniOf;
  const location = locationText((worksFor ?? alumniOf).location);
  const keywords = arrayOf(role.keywords)
    .map((keyword: any) => keyword?.name)
    .filter(Boolean);
  const duration =
    startDate || endDate
      ? `
          ${startDate ? `<time datetime="${startDate}">${period(startDate)}</time>` : ""}
          &ndash; ${endDate ? ` <time datetime="${endDate}">${period(endDate)}</time>` : present}
        `
      : undefined;
  return role
    ? `
      <article>
        ${name ? `<h3>${name}</h3>` : ""}
        <ul class="caption">
          ${roleName ? `<li>${roleName}</li>` : ""}
          ${duration ? `<li>${duration}</li>` : ""}
          ${location ? `<li>${location}</li>` : ""}
        </ul>
        ${description ? `<p class="scv-description">${String(description).trim()}</p>` : ""}
        ${keywords.length ? renderKeywords(keywords) : ""}
    </article>
    `
    : "";
};

const renderLifeEvent = (event: any) => {
  const { name, startDate, description } = event;
  const location = locationText(event.location);
  return `
      <article>
        ${name ? `<h3>${name}</h3>` : ""}
        <ul class="caption">
          ${startDate ? `<li><time datetime="${startDate}">${period(startDate)}</time></li>` : ""}
          ${location ? `<li>${location}</li>` : ""}
        </ul>
        ${description ? `<p class="scv-description">${String(description).trim()}</p>` : ""}
      </article>
    `;
};
