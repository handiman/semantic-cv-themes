import { Theme, Slots } from "../theme.js";
import Person from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeMetadata } from "../themeMetadata.js";
import { contactLinks } from "../contact.js";
import { locationText } from "../utils.js";

/**
 * The CV as a project's README on a code host: system sans-serif, headings with a hairline under
 * them, and keywords, skills and areas set as inline code. Familiar to anyone who reads READMEs.
 */
export class ReadmeTheme extends Theme {
  static readonly meta: ThemeMetadata = {
    id: "readme",
    title: "Readme",
    added: "2026-11-16",
    description:
      "The CV as a rendered README: system type, headings over a hairline rule, and keywords, skills and areas as inline code. Familiar to anyone who reads them for a living.",
    tags: [ThemeTags.singleCol, ThemeTags.lightMode, ThemeTags.neutral, ThemeTags.technical]
  };

  // Keywords as inline code, like the names of tools in a README.
  protected renderKeywords(keywords: Array<string>): string {
    return `<p class="keywords">${keywords.map((keyword) => `<code>${keyword}</code>`).join(" ")}</p>`;
  }

  protected layout(person: Person): string {
    return `
      <header>
        <h1>${person.name ?? ""}</h1>
        <slot name="jobTitle"></slot>
        <slot name="contact"></slot>
      </header>
      <main>
        <slot name="summary"></slot>
        <slot name="worksFor"></slot>
        <slot name="projects"></slot>
        <slot name="alumniOf"></slot>
        <slot name="knowsAbout"></slot>
        <slot name="skills"></slot>
        <slot name="knowsLanguage"></slot>
        <slot name="certifications"></slot>
        <slot name="lifeEvent"></slot>
      </main>
    `;
  }

  protected slots(person: Person): Slots {
    const { headings } = this.options;
    const { jobTitle, description } = person;
    return {
      jobTitle: () => (jobTitle ? `<p class="job-title">${jobTitle}</p>` : ""),
      contact: () => {
        const location = locationText(person.workLocation);
        const links = contactLinks(person);
        return location || links.length
          ? `<ul class="contact">
              ${location ? `<li>${location}</li>` : ""}
              ${links.map((link) => `<li><a href="${link.href}">${link.text}</a></li>`).join("")}
            </ul>`
          : "";
      },
      summary: () =>
        description
          ? `<section id="description">
              <h2>${headings.description}</h2>
              <p class="scv-description">${description}</p>
            </section>`
          : ""
    };
  }
}
