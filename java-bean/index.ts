import { Theme, Slots } from "../theme.js";
import Person, { certifications } from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeMetadata } from "../themeMetadata.js";
import { contactLinks } from "../contact.js";
import { locationText } from "../utils.js";

/**
 * A CV as a café menu, for developers who run on Java: cream paper, coffee-brown ink, every job a
 * menu item with dotted leaders to its dates, coffee beans for bullets, and the ring a cup left on
 * the page. The beans and the stains are drawn by java-bean.css.
 */
export class JavaBeanTheme extends Theme {
  static readonly meta: ThemeMetadata = {
    id: "java-bean",
    title: "JavaBean",
    description:
      "A CV as a café menu, for developers who run on Java: cream paper, coffee-brown ink, jobs as menu items with dotted leaders, coffee beans for bullets, and a coffee ring where the cup was put down.",
    tags: [
      ThemeTags.singleCol,
      ThemeTags.lightMode,
      ThemeTags.warm,
      ThemeTags.playful,
      ThemeTags.typographyForward
    ]
  };

  protected layout(person: Person): string {
    return `
      <div class="paper">
        <div class="stain" aria-hidden="true"></div>
        <header>
          <h1>${person.name ?? ""}</h1>
          <slot name="jobTitle"></slot>
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
      // The short lists side by side, like the extras at the bottom of a menu.
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
