import { Person, period } from "./person.js";
import { ThemeMetadata } from "./themeMetadata.js";
import { defaultOptions, ThemeOptions } from "./themeOptions.js";

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
   * @param loadAsset Function that loads a theme asset (CSS/JS) by name.
   *                  Implemented differently in CLI and Worker runtimes.
   * @param options Theme options such as headings. Custom values require a subscription. (or forking the repo and building your own implementation for the creative ones out there)
   * @param meta Theme metadata such as id, title, description and tags.
   */
  constructor(
    private loadAsset: (assetName: string) => Promise<string>,
    private meta: ThemeMetadata,
    protected options: ThemeOptions = defaultOptions
  ) {
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
  }

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
    return withResetCSS(await this.loadAsset(`${this.meta.id}.css`));
  }

  /**
   * Render the theme's JavaScript module.
   * By default, loads `{id}.js` via the provided asset loader.
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
          <ul>${knowsLanguage.map((language: string) => `<li>${language}</li>`).join("")}
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
          ${worksFor.map(renderRole).join("")}
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
          ${alumniOf.map(renderRole).join("")}
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
          ${proj.map(renderRole).join("")}
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
a, a:link, a:visited, a:active, a:hover { color: var(--accent-color); text-decoration: none; } a:hover { text-decoration: underline; }
ul, ol, li, li:before, li:after { list-style: none; margin: 0; padding: 0; }
.scv-footer { color: var(--text-primary); text-align:center; font-size: .9rem; opacity: .5; } 
.print { display: none; } .no-print { display: reset; }
@media print { .print { display: unset; } .no-print { display: none; }}
${themeCss}    
`;

const renderRole = (role: any) => {
  const { roleName, startDate, endDate, description, worksFor, alumniOf } = role;
  const { name, location } = worksFor ?? alumniOf;
  const duration =
    startDate || endDate
      ? `
          ${startDate ? `<time datetime="${startDate}">${period(startDate)}</time>` : ""}
          ${endDate ? ` &hyphen; <time datetime="${endDate}">${period(endDate)}</time>` : "present"}
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
        ${description ? `<p>${description}</p>` : ""}
    </article>
    `
    : "";
};

const renderLifeEvent = (event: any) => {
  const { name, startDate, description } = event;
  const location = event.location ? event.location.name : undefined;
  return `
      <article>
        ${name ? `<h3>${name}</h3>` : ""}
        <ul class="caption">
          ${startDate ? `<li><time datetime="${startDate}">${period(startDate)}</time></li>` : ""}
          ${location ? `<li>${location}</li>` : ""}
        </ul>
        ${description ? `<p>${description}</p>` : ""}
      </article>
    `;
};
