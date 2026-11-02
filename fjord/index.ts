import { Theme, Slots } from "../theme.js";
import Person, { certifications, education } from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeMetadata } from "../themeMetadata.js";
import { contactLinks } from "../contact.js";
import { locationText } from "../utils.js";

/**
 * A header of two slanted bands in petrol and sea green, falling to the right like the sides of a
 * fjord, with a round photo on their lower edge and the name centered under it in spaced capitals.
 * Below, a narrow column with the profile, contact details, education and languages next to a
 * wide one with experience and skills.
 */
export class FjordTheme extends Theme {
  static readonly meta: ThemeMetadata = {
    id: "fjord",
    title: "Fjord",
    added: "2026-11-02",
    description:
      "Two slanted bands in petrol and sea green across the top, a round photo on their edge and the name in spaced capitals, over a narrow column for profile and contact details and a wide one for experience.",
    tags: [
      ThemeTags.twoCol,
      ThemeTags.accentHeader,
      ThemeTags.photo,
      ThemeTags.lightMode,
      ThemeTags.cool,
      ThemeTags.corporate
    ]
  };

  protected layout(person: Person): string {
    return `
      <header>
        <slot name="photo"></slot>
        <h1>${person.name ?? ""}</h1>
        <slot name="jobTitle"></slot>
      </header>
      <div class="page">
        <slot name="sidebar"></slot>
        <main>
          <slot name="worksFor"></slot>
          <slot name="projects"></slot>
          <slot name="knowsAbout"></slot>
          <slot name="skills"></slot>
          <slot name="lifeEvent"></slot>
        </main>
      </div>
    `;
  }

  protected slots(person: Person): Slots {
    const { headings } = this.options;
    const { renderAlumniOf, renderKnowsLanguage, renderCertifications } = this;
    const { image, name, jobTitle, description, knowsLanguage } = person;
    return {
      photo: () =>
        image ? `<div class="photo"><img src="${image}" alt="${name ?? ""}" /></div>` : "",
      jobTitle: () => (jobTitle ? `<p class="job-title">${jobTitle}</p>` : ""),
      // The profile, contact details, education and languages share the narrow column, which is
      // left out when all are empty.
      sidebar: () => {
        const location = locationText(person.workLocation);
        const links = contactLinks(person);
        const summary = description
          ? `<section id="description">
              <h2>${headings.description}</h2>
              <p class="scv-description">${description}</p>
            </section>`
          : "";
        const contact =
          location || links.length
            ? `<section id="contact">
                <h2>${headings.contact}</h2>
                <ul>
                  ${location ? `<li>${location}</li>` : ""}
                  ${links.map((link) => `<li><a href="${link.href}">${link.icon}<span>${link.text}</span></a></li>`).join("")}
                </ul>
              </section>`
            : "";
        const sidebar = [
          summary,
          contact,
          renderAlumniOf(education(person)),
          renderKnowsLanguage(knowsLanguage),
          renderCertifications(certifications(person))
        ].join("");
        return sidebar.trim() ? `<aside>${sidebar}</aside>` : "";
      }
    };
  }
}
