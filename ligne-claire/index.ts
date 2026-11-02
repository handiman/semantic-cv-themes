import { Theme, Slots } from "../theme.js";
import Person from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeMetadata } from "../themeMetadata.js";
import { contactLinks } from "../contact.js";
import { locationText } from "../utils.js";

/**
 * A CV as a page of a comic in the ligne claire style: every part in a panel with an even black
 * outline and white gutters, flat colors with no shading, headings in yellow caption boxes, hand
 * lettering, and the summary in a speech balloon under a title panel with a flat sky.
 */
export class LigneClaireTheme extends Theme {
  static readonly meta: ThemeMetadata = {
    id: "ligne-claire",
    title: "Ligne Claire",
    description:
      "A CV as a comic page in the ligne claire style: panels with even black outlines, flat colors, yellow caption boxes, hand lettering and the summary in a speech balloon.",
    tags: [
      ThemeTags.lightMode,
      ThemeTags.colorBlocks,
      ThemeTags.typographyForward,
      ThemeTags.playful,
      ThemeTags.creative
    ]
  };

  protected layout(person: Person): string {
    return `
      <main class="strip">
        <header>
          <h1>${person.name ?? ""}</h1>
          <slot name="jobTitle"></slot>
        </header>
        <slot name="summary"></slot>
        <slot name="contact"></slot>
        <slot name="worksFor"></slot>
        <slot name="knowsAbout"></slot>
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
                ${links.map((link) => `<li><a href="${link.href}">${link.text}</a></li>`).join("")}
              </ul>
            </section>`
          : "";
      },
      // The summary as a speech balloon in its panel.
      summary: () =>
        description
          ? `<section id="description">
              <h2>${headings.description}</h2>
              <p class="scv-description balloon">${description}</p>
            </section>`
          : ""
    };
  }
}
