import { Theme, Slots } from "../theme.js";
import Person from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeMetadata } from "../themeMetadata.js";
import { contactLinks } from "../contact.js";
import { locationText } from "../utils.js";

/**
 * Not too much, not too little: a centered header, one column, a common sans-serif and one quiet
 * accent on the headings. No icons, so the contact details are plain text in reading order.
 */
export class LagomTheme extends Theme {
  static readonly meta: ThemeMetadata = {
    id: "lagom",
    title: "Lagom",
    added: "2026-11-16",
    description:
      "Not too much, not too little: the name centered over one quiet line of contact details, then the CV in one column with slate-blue headings. Nothing to get used to.",
    tags: [ThemeTags.singleCol, ThemeTags.lightMode, ThemeTags.calm, ThemeTags.muted]
  };

  // Keywords as one line of text, so they read as words to a person and to a parser alike.
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
