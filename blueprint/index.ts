import { Theme, Slots } from "../theme.js";
import Person, { certifications } from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeMetadata } from "../themeMetadata.js";
import { contactLinks } from "../contact.js";
import { locationText } from "../utils.js";

/**
 * A technical drawing: white lines on blueprint blue with a grid, a framed sheet, a title block for
 * the header and numbered sections. Printed, it turns into blue lines on white paper.
 */
export class BlueprintTheme extends Theme {
  static readonly meta: ThemeMetadata = {
    id: "blueprint",
    title: "Blueprint",
    description:
      "A technical drawing: white lines on blueprint blue over a faint grid, with a title block for the name and numbered sections. Prints as blue lines on white.",
    tags: [
      ThemeTags.twoCol,
      ThemeTags.cool,
      ThemeTags.monoChrome,
      ThemeTags.typographyForward,
      ThemeTags.technical
    ]
  };

  protected layout(person: Person): string {
    return `
      <div class="sheet">
        <header class="title-block">
          <div class="title">
            <h1>${person.name ?? ""}</h1>
            <slot name="jobTitle"></slot>
          </div>
          <slot name="contact"></slot>
        </header>
        <div class="drawing">
          <slot name="parts"></slot>
          <main>
            <slot name="summary"></slot>
            <slot name="worksFor"></slot>
            <slot name="projects"></slot>
            <slot name="alumniOf"></slot>
            <slot name="lifeEvent"></slot>
          </main>
        </div>
      </div>
    `;
  }

  protected slots(person: Person): Slots {
    const { headings } = this.options;
    const { renderKnowsAbout, renderSkills, renderKnowsLanguage, renderCertifications } = this;
    const { jobTitle, description, knowsAbout, skills, knowsLanguage } = person;
    return {
      jobTitle: () => (jobTitle ? `<p class="job-title">${jobTitle}</p>` : ""),
      // A cell of the title block, labeled like one.
      contact: () => {
        const location = locationText(person.workLocation);
        const links = contactLinks(person);
        return location || links.length
          ? `<div class="contact">
              <h2>${headings.contact}</h2>
              <ul>
                ${location ? `<li>${location}</li>` : ""}
                ${links.map((link) => `<li><a href="${link.href}">${link.icon}<span>${link.text}</span></a></li>`).join("")}
              </ul>
            </div>`
          : "";
      },
      summary: () =>
        description
          ? `<section id="description">
              <h2>${headings.description}</h2>
              <p class="scv-description">${description}</p>
            </section>`
          : "",
      // The short lists, as the drawing's parts list beside the main column.
      parts: () => {
        const parts = [
          renderKnowsAbout(knowsAbout),
          renderSkills(skills),
          renderKnowsLanguage(knowsLanguage),
          renderCertifications(certifications(person))
        ].join("");
        return parts.trim() ? `<aside class="parts">${parts}</aside>` : "";
      }
    };
  }
}
