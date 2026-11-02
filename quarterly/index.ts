import { Theme, Slots } from "../theme.js";
import Person, { certifications } from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeMetadata } from "../themeMetadata.js";
import { contactLinks } from "../contact.js";
import { locationText } from "../utils.js";

/**
 * An annual report: navy and grey, serif headings over a sans-serif text, every role a row with its
 * dates right-aligned in tabular figures, and the short lists in a narrow column at the side, like
 * the key figures in a report's margin.
 */
export class QuarterlyTheme extends Theme {
  static readonly meta: ThemeMetadata = {
    id: "quarterly",
    title: "Quarterly",
    added: "2026-11-02",
    description:
      "An annual report: navy serif headings, dates right-aligned like figures in a table, and skills, languages and certifications as key figures in a side column.",
    tags: [
      ThemeTags.twoCol,
      ThemeTags.lightMode,
      ThemeTags.cool,
      ThemeTags.accented,
      ThemeTags.corporate
    ]
  };

  protected layout(person: Person): string {
    return `
      <header>
        <h1>${person.name ?? ""}</h1>
        <slot name="jobTitle"></slot>
        <slot name="contact"></slot>
      </header>
      <div class="report">
        <main>
          <slot name="summary"></slot>
          <slot name="worksFor"></slot>
          <slot name="projects"></slot>
          <slot name="alumniOf"></slot>
          <slot name="lifeEvent"></slot>
        </main>
        <slot name="figures"></slot>
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
      // The short lists, as the key figures beside the main column.
      figures: () => {
        const figures = [
          renderKnowsAbout(knowsAbout),
          renderSkills(skills),
          renderKnowsLanguage(knowsLanguage),
          renderCertifications(certifications(person))
        ].join("");
        return figures.trim() ? `<aside class="figures">${figures}</aside>` : "";
      }
    };
  }
}
