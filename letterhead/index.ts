import { Theme, Slots } from "../theme.js";
import Person from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeMetadata } from "../themeMetadata.js";
import { contactLinks } from "../contact.js";
import { locationText } from "../utils.js";

/**
 * A law firm's letterhead: the name centered in serif small capitals over a double rule, contact
 * details in one quiet line, and the CV below in one column. Black and dark grey only.
 */
export class LetterheadTheme extends Theme {
  static readonly meta: ThemeMetadata = {
    id: "letterhead",
    title: "Letterhead",
    description:
      "A law firm's letterhead: the name centered in serif small capitals over a double rule, contact details in one quiet line, and the CV below in one column. Black and grey only.",
    tags: [
      ThemeTags.singleCol,
      ThemeTags.lightMode,
      ThemeTags.monoChrome,
      ThemeTags.muted,
      ThemeTags.typographyForward,
      ThemeTags.corporate
    ]
  };

  // Keywords as a quiet line of text rather than tags.
  protected renderKeywords(keywords: Array<string>): string {
    return `<p class="keywords">${keywords.join(", ")}</p>`;
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
