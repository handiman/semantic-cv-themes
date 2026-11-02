import { Theme, Slots } from "../theme.js";
import Person, { certifications } from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeMetadata } from "../themeMetadata.js";
import { contactLinks } from "../contact.js";
import { locationText } from "../utils.js";

/**
 * Neo-brutalism: thick black borders, hard offset shadows with no blur, and a few loud flat colors
 * on the section headings, set like stickers. Everything is straight lines and solid fills, so it
 * prints as it looks.
 */
export class NeoBrutalTheme extends Theme {
  static readonly meta: ThemeMetadata = {
    id: "neo-brutal",
    title: "Neo-Brutal",
    description:
      "Neo-brutalism: thick black borders, hard offset shadows with no blur, and loud yellow, pink and cyan sticker headings. Straight lines and solid fills, so it prints as it looks.",
    tags: [
      ThemeTags.singleCol,
      ThemeTags.lightMode,
      ThemeTags.highContrast,
      ThemeTags.bold,
      ThemeTags.playful,
      ThemeTags.creative
    ]
  };

  protected layout(person: Person): string {
    return `
      <header>
        <h1>${person.name ?? ""}</h1>
        <slot name="jobTitle"></slot>
        <slot name="contact"></slot>
      </header>
      <main>
        <slot name="summary"></slot>
        <slot name="basics"></slot>
        <slot name="worksFor"></slot>
        <slot name="projects"></slot>
        <slot name="alumniOf"></slot>
        <slot name="lifeEvent"></slot>
      </main>
    `;
  }

  protected slots(person: Person): Slots {
    const { headings } = this.options;
    const { renderKnowsAbout, renderSkills, renderKnowsLanguage, renderCertifications } = this;
    const { jobTitle, description, knowsAbout, skills, knowsLanguage } = person;
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
          : "",
      // The short lists as small boxes side by side.
      basics: () => {
        const basics = [
          renderKnowsAbout(knowsAbout),
          renderSkills(skills),
          renderKnowsLanguage(knowsLanguage),
          renderCertifications(certifications(person))
        ].join("");
        return basics.trim() ? `<div class="basics">${basics}</div>` : "";
      }
    };
  }
}
