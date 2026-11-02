import { Theme, Slots } from "../theme.js";
import Person from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeMetadata } from "../themeMetadata.js";
import { contactLinks } from "../contact.js";
import { locationText } from "../utils.js";

/**
 * The initials of the first and last word of a name. Only words that start with a letter count, so
 * a character reference (the name comes HTML-escaped, "&amp;") is never taken for an initial.
 */
const initials = (name: string | null | undefined) => {
  const words = (name ?? "").split(/\s+/).filter((word) => /^\p{L}/u.test(word));
  const letters = words.length > 1 ? [words[0], words[words.length - 1]] : words;
  return letters.map((word) => [...word][0].toUpperCase()).join("");
};

/**
 * Stationery for a CV: the initials in a thin brass frame over the name in a serif, deep navy and
 * brass on warm white, small-caps headings with a hairline running out to the margin, and the dates
 * hanging in a margin of their own to the left of the text.
 */
export class MonogramTheme extends Theme {
  static readonly meta: ThemeMetadata = {
    id: "monogram",
    title: "Monogram",
    added: "2026-11-02",
    description:
      "Like engraved stationery: the initials in a thin brass frame over the name in a serif, navy and brass on warm white, and the dates hanging in a margin of their own.",
    tags: [
      ThemeTags.singleCol,
      ThemeTags.lightMode,
      ThemeTags.warm,
      ThemeTags.calm,
      ThemeTags.typographyForward,
      ThemeTags.corporate
    ]
  };

  protected layout(person: Person): string {
    return `
      <header>
        <slot name="monogram"></slot>
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
    const { name, jobTitle, description } = person;
    return {
      // Decoration: the name itself follows in the h1.
      monogram: () => {
        const letters = initials(name);
        return letters ? `<div class="monogram" aria-hidden="true">${letters}</div>` : "";
      },
      jobTitle: () => (jobTitle ? `<p class="job-title">${jobTitle}</p>` : ""),
      contact: () => {
        const location = locationText(person.workLocation);
        const links = contactLinks(person);
        return location || links.length
          ? `<ul class="contact">
              ${location ? `<li>${location}</li>` : ""}
              ${links.map((link) => `<li><a href="${link.href}">${link.icon}<span>${link.text}</span></a></li>`).join("")}
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
