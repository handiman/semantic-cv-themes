import { Theme, Slots } from "../theme.js";
import Person, { certifications } from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeMetadata } from "../themeMetadata.js";
import { contactLinks } from "../contact.js";
import { locationText } from "../utils.js";

/**
 * Soft, blurred color fields behind the page, like an aurora, with every section on a translucent
 * glass card in front of them. Blur and translucency don't print reliably, so print uses flat white
 * cards and keeps a hint of the colors in the header.
 */
export class AuroraTheme extends Theme {
  static readonly meta: ThemeMetadata = {
    id: "aurora",
    title: "Aurora",
    added: "2026-11-02",
    description:
      "Soft blurred fields of violet, teal and rose behind the page, with every section on a translucent glass card in front of them. Prints as flat white cards.",
    tags: [
      ThemeTags.singleCol,
      ThemeTags.lightMode,
      ThemeTags.pastel,
      ThemeTags.calm,
      ThemeTags.creative
    ]
  };

  protected layout(person: Person): string {
    return `
      <div class="sky" aria-hidden="true"></div>
      <div class="page">
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
      </div>
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
          : "",
      // The short lists on one card, as a grid.
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
