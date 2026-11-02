import { Theme, Slots } from "../theme.js";
import Person, { certifications } from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeMetadata } from "../themeMetadata.js";
import { contactLinks } from "../contact.js";
import { locationText } from "../utils.js";

/**
 * Full-width bands with slanted edges: a dark header band cut off at an angle, and every other
 * section on a tinted band slanted the other way, so the page reads as a series of angled planes.
 * The slants are clip-paths on the bands; print flattens them.
 */
export class LeanAngleTheme extends Theme {
  static readonly meta: ThemeMetadata = {
    id: "lean-angle",
    title: "Lean Angle",
    added: "2026-11-02",
    description:
      "Full-width bands with slanted edges: a dark header cut off at an angle and every other section on a tinted band leaning the other way. Prints flat.",
    tags: [
      ThemeTags.singleCol,
      ThemeTags.accentHeader,
      ThemeTags.colorBlocks,
      ThemeTags.lightMode,
      ThemeTags.cool,
      ThemeTags.bold
    ]
  };

  protected layout(person: Person): string {
    return `
      <header>
        <div class="inner">
          <h1>${person.name ?? ""}</h1>
          <slot name="jobTitle"></slot>
          <slot name="contact"></slot>
        </div>
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
      // The short lists share one band, as a grid.
      basics: () => {
        const basics = [
          renderKnowsAbout(knowsAbout),
          renderSkills(skills),
          renderKnowsLanguage(knowsLanguage),
          renderCertifications(certifications(person))
        ].join("");
        return basics.trim()
          ? `<section id="basics"><div class="grid">${basics}</div></section>`
          : "";
      }
    };
  }
}
