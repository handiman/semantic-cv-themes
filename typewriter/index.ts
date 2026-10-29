import { Theme, Slots } from "../theme.js";
import Person, { certifications } from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { locationText } from "../utils.js";
import { ThemeMetadata } from "../themeMetadata.js";
import { contactLinks } from "../contact.js";

export class TypewriterTheme extends Theme {
  static readonly meta: ThemeMetadata = {
    id: "typewriter",
    title: "Typewriter",
    description:
      "A retro résumé set on lined paper in a typewriter face. Plain, single‑column and a little quirky.",
    tags: [ThemeTags.singleCol, ThemeTags.lightMode, ThemeTags.retro, ThemeTags.playful]
  };

  protected renderKeywords(keywords: Array<string>): string {
    return `<p>${this.options.headings.skills}: ${keywords.join(", ")}</p>`;
  }

  protected layout(): string {
    return `
      <main>
        <article class="paper">
          <slot name="header"></slot>
          <slot name="basics"></slot>
          <slot name="worksFor"></slot>
          <slot name="projects"></slot>
          <slot name="alumniOf"></slot>
          <slot name="lifeEvent"></slot>
        </article>
      </main>
    `;
  }

  protected slots(person: Person): Slots {
    const { options, renderKnowsLanguage, renderKnowsAbout, renderSkills, renderCertifications } =
      this;
    const { headings } = options;
    const { name, jobTitle, description, knowsAbout, skills, knowsLanguage } = person;
    const location = locationText(person.workLocation);
    const contacts = contactLinks(person);

    const basics = [
      description
        ? `
          <div>
            <h2>${headings.description}</h2>
            <p>${description}</p>
          </div>
          `
        : "",
      renderKnowsAbout(knowsAbout),
      renderSkills(skills),
      renderKnowsLanguage(knowsLanguage),
      renderCertifications(certifications(person))
    ].join("");

    return {
      header: () => `
        <header>
          <h1>${name ?? ""}</h1>
          ${jobTitle ? `<div>${jobTitle}</div>` : ""}
          ${
            location || contacts.length
              ? `<ul class="contact">
                  ${location ? `<li>${location}</li>` : ""}
                  ${contacts.map((link) => `<li><a href="${link.href}">${link.text}</a></li>`).join("")}
                </ul>`
              : ""
          }
        </header>
      `,
      basics: () => (basics.trim() ? `<section id="basics">${basics}</section>` : "")
    };
  }
}
