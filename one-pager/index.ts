import { Theme, Slots } from "../theme.js";
import Person, { certifications } from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeMetadata } from "../themeMetadata.js";
import { contactLinks } from "../contact.js";
import { locationText } from "../utils.js";

/**
 * Built to fit a long CV on one or two A4 pages: small type, tight spacing, and a light grey sidebar
 * for contact details and the short lists, so the main column holds only experience.
 */
export class OnePagerTheme extends Theme {
  static readonly meta: ThemeMetadata = {
    id: "one-pager",
    title: "One Pager",
    description:
      "Fits a long CV on one or two A4 pages: small type, tight spacing, and a light grey sidebar for contact details and skills, so the main column holds only experience.",
    tags: [
      ThemeTags.twoCol,
      ThemeTags.compact,
      ThemeTags.lightMode,
      ThemeTags.neutral,
      ThemeTags.corporate
    ]
  };

  protected layout(person: Person): string {
    return `
      <div class="page">
        <header>
          <h1>${person.name ?? ""}</h1>
          <slot name="jobTitle"></slot>
        </header>
        <slot name="sidebar"></slot>
        <main>
          <slot name="summary"></slot>
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
      summary: () =>
        description
          ? `<section id="description">
              <h2>${headings.description}</h2>
              <p class="scv-description">${description}</p>
            </section>`
          : "",
      // Contact details and the short lists share the sidebar, which is left out when all are empty.
      sidebar: () => {
        const location = locationText(person.workLocation);
        const links = contactLinks(person);
        const contact =
          location || links.length
            ? `<section id="contact">
                <h2>${headings.contact}</h2>
                <ul>
                  ${location ? `<li>${location}</li>` : ""}
                  ${links.map((link) => `<li><a href="${link.href}">${link.text}</a></li>`).join("")}
                </ul>
              </section>`
            : "";
        const sidebar = [
          contact,
          renderKnowsAbout(knowsAbout),
          renderSkills(skills),
          renderKnowsLanguage(knowsLanguage),
          renderCertifications(certifications(person))
        ].join("");
        return sidebar.trim() ? `<aside>${sidebar}</aside>` : "";
      }
    };
  }
}
