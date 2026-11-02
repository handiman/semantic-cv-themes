import { Theme, Slots } from "../theme.js";
import Person from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeMetadata } from "../themeMetadata.js";
import { contactLinks } from "../contact.js";
import { locationText } from "../utils.js";

/**
 * A bento grid: every part of the CV is a card, and the cards come in different sizes on one grid,
 * packed densely so the page has no holes when a part is missing. Print stacks the cards.
 */
export class BentoTheme extends Theme {
  static readonly meta: ThemeMetadata = {
    id: "bento",
    title: "Bento",
    added: "2026-11-02",
    description:
      "A bento grid: every part of the CV is a rounded card, and the cards come in different sizes packed into one grid, with a dark card for the name and soft tints for the rest.",
    tags: [ThemeTags.lightMode, ThemeTags.neutral, ThemeTags.colorBlocks, ThemeTags.creative]
  };

  protected layout(person: Person): string {
    return `
      <main class="bento">
        <header>
          <h1>${person.name ?? ""}</h1>
          <slot name="jobTitle"></slot>
        </header>
        <slot name="contact"></slot>
        <slot name="summary"></slot>
        <slot name="knowsAbout"></slot>
        <slot name="worksFor"></slot>
        <slot name="skills"></slot>
        <slot name="knowsLanguage"></slot>
        <slot name="certifications"></slot>
        <slot name="projects"></slot>
        <slot name="alumniOf"></slot>
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
          ? `<section id="contact">
              <h2>${headings.contact}</h2>
              <ul>
                ${location ? `<li>${location}</li>` : ""}
                ${links.map((link) => `<li><a href="${link.href}">${link.icon}<span>${link.text}</span></a></li>`).join("")}
              </ul>
            </section>`
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
