import { Theme, Slots } from "../theme.js";
import Person from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeMetadata } from "../themeMetadata.js";
import { contactLinks } from "../contact.js";
import { locationText } from "../utils.js";

/**
 * Business as usual: the CV as the company template everyone has seen, with the headings on grey
 * bands, Arial throughout and the contact details on one line. No icons and no color.
 */
export class BusinessUsualTheme extends Theme {
  static readonly meta: ThemeMetadata = {
    id: "business-usual",
    title: "Business Usual",
    added: "2026-11-16",
    description:
      "Business as usual: the company template everyone has seen, with headings on grey bands, Arial throughout and not one surprise. Black, white and grey.",
    tags: [
      ThemeTags.singleCol,
      ThemeTags.lightMode,
      ThemeTags.neutral,
      ThemeTags.monoChrome,
      ThemeTags.corporate
    ]
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
