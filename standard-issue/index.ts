import { Theme, Slots } from "../theme.js";
import Person from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeMetadata } from "../themeMetadata.js";
import { contactLinks } from "../contact.js";
import { locationText } from "../utils.js";

/**
 * The theme for applicant tracking systems: one column, no color, no icons, no grid, and nothing
 * that only makes sense when seen. Every part is plain text in reading order, so it reads the same
 * to a parser as to a person.
 */
export class StandardIssueTheme extends Theme {
  static readonly meta: ThemeMetadata = {
    id: "standard-issue",
    title: "Standard Issue",
    description:
      "Plain on purpose: one column, black on white, no icons and no color, like a well-kept word-processor document. Reads the same to an applicant tracking system as to a person.",
    tags: [ThemeTags.singleCol, ThemeTags.lightMode, ThemeTags.neutral, ThemeTags.corporate]
  };

  // Keywords as one line of text, not as tags, so a parser reads them as words.
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
      // Contact details as text, without icons: the address is what a parser looks for.
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
