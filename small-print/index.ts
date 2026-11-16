import { Theme, Slots } from "../theme.js";
import Person from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeMetadata } from "../themeMetadata.js";
import { contactLinks } from "../contact.js";
import { locationText } from "../utils.js";

/**
 * For the long CV: small type, tight spacing and one column, with the name of each employer and the
 * role on one line, so a career of many assignments fits on few pages without a second column.
 */
export class SmallPrintTheme extends Theme {
  static readonly meta: ThemeMetadata = {
    id: "small-print",
    title: "Small Print",
    added: "2026-11-16",
    description:
      "For the long CV: small sans-serif type, tight spacing and one column, with employer, role and dates on one line each, so many assignments fit on few pages.",
    tags: [ThemeTags.singleCol, ThemeTags.compact, ThemeTags.lightMode, ThemeTags.monoChrome]
  };

  // Keywords as one line of text, after a label, so they read as words to a parser.
  protected renderKeywords(keywords: Array<string>): string {
    return `<p class="keywords">${this.options.headings.skills}: ${keywords.join(", ")}</p>`;
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
