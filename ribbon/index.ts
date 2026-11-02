import { Theme, Slots } from "../theme.js";
import Person, { certifications } from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeMetadata } from "../themeMetadata.js";
import { contactLinks } from "../contact.js";
import { locationText } from "../utils.js";

/**
 * A white sheet on warm grey, with the name on a wine-red ribbon that runs past both edges of the
 * sheet and folds around them, and every section heading on a smaller ribbon tab that folds around
 * its left edge. Print flattens the ribbons into plain bands and tabs.
 */
export class RibbonTheme extends Theme {
  static readonly meta: ThemeMetadata = {
    id: "ribbon",
    title: "Ribbon",
    added: "2026-11-02",
    description:
      "A white sheet with the name on a wine-red ribbon folded around its edges and every section heading on a small ribbon tab. Calm grey text and plenty of air around it.",
    tags: [
      ThemeTags.singleCol,
      ThemeTags.accentHeader,
      ThemeTags.lightMode,
      ThemeTags.warm,
      ThemeTags.accented
    ]
  };

  protected layout(person: Person): string {
    return `
      <div class="sheet">
        <header>
          <div class="ribbon">
            <h1>${person.name ?? ""}</h1>
            <slot name="jobTitle"></slot>
          </div>
          <slot name="contact"></slot>
        </header>
        <main>
          <slot name="summary"></slot>
          <slot name="worksFor"></slot>
          <slot name="projects"></slot>
          <slot name="alumniOf"></slot>
          <slot name="basics"></slot>
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
      // The short lists share one section, as a grid, with plain headings instead of tabs.
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
