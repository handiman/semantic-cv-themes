import { Theme, Slots } from "../theme.js";
import Person, { certifications } from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeMetadata } from "../themeMetadata.js";
import { contactLinks } from "../contact.js";
import { locationText } from "../utils.js";

/**
 * Work, projects, education and events hang on a vertical line, each with its dates in a left
 * margin. The base class's markup is used as it is: timeline.css moves the date out of the caption
 * into the margin, so the text order (and what ATS parsers read) stays the same as in other themes.
 */
export class TimelineTheme extends Theme {
  static readonly meta: ThemeMetadata = {
    id: "timeline",
    title: "Timeline",
    added: "2026-11-02",
    description:
      "Work, projects and education on a vertical line, with the dates in a left margin and a dot for each entry. Quiet, light and easy to follow.",
    tags: [
      ThemeTags.singleCol,
      ThemeTags.timeline,
      ThemeTags.lightMode,
      ThemeTags.accented,
      ThemeTags.calm
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
      // The short lists share one grid, so they don't each take a full row.
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
