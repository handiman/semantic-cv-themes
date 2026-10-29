import { Theme, Slots } from "../theme.js";
import { locationText } from "../utils.js";
import Person, { certifications } from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeMetadata } from "../themeMetadata.js";
import { contactLinks } from "../contact.js";

export class TimesTheme extends Theme {
  static readonly meta: ThemeMetadata = {
    id: "times",
    title: "Times",
    description:
      "A playful newspaper‑inspired résumé with an editorial layout and a subtle sense of humor.",
    tags: [
      ThemeTags.singleCol,
      ThemeTags.lightMode,
      ThemeTags.monoChrome,
      ThemeTags.editorial,
      ThemeTags.typographyForward,
      ThemeTags.playful
    ]
  };

  protected renderKeywords(keywords: Array<string>): string {
    return `<p>${this.options.headings.skills}: ${keywords.join(", ")}</p>`;
  }

  protected layout(): string {
    return `
      <main>
        <div>
          <slot name="header"></slot>
          <slot name="basics"></slot>
          <slot name="worksFor"></slot>
          <slot name="projects"></slot>
          <slot name="alumniOf"></slot>
          <slot name="lifeEvent"></slot>
        </div>
      </main>
    `;
  }

  protected slots(person: Person): Slots {
    const { options, renderKnowsLanguage, renderKnowsAbout, renderSkills, renderCertifications } =
      this;
    const { name, jobTitle, description, knowsLanguage, knowsAbout, skills } = person;
    const { headings } = options;

    const renderSocial = () => {
      const links = contactLinks(person);
      if (links.length > 0) {
        return `<ul class="social">${links.map((link) => `<li><a href="${link.href}" aria-label="${link.label}">${link.icon}</a><div class="print">${link.text}</div></li>`).join("\n")}</ul>`;
      }
    };

    const renderHeader = () => {
      // The date line is added in the browser by times.js, so the HTML is the same on any day (#75).
      const social = renderSocial();
      return `
        <header>
            <h1>
                ${name ?? ""}
                ${jobTitle ? `<small>${jobTitle}</small>` : ""}
                ${locationText(person.workLocation) ? `<small>${locationText(person.workLocation)}</small>` : ""}
            </h1>
            ${social ? `<div class="grid"><div>${social}</div></div>` : ""}
            <div class="hr"></div>
        </header>
      `;
    };

    const renderBasics = () => {
      const basics = [
        renderKnowsAbout(knowsAbout),
        renderSkills(skills),
        renderKnowsLanguage(knowsLanguage),
        renderCertifications(certifications(person))
      ].join("");
      return `
        ${
          description
            ? `<section>
            <h2 class="pirata-one-regular">${headings.description}</h2>
            <p>${description}</p>
        </section>`
            : ""
        }
        ${basics.trim() ? `<section id="basics">${basics}</section>` : ""}
      `;
    };

    return { header: renderHeader, basics: renderBasics };
  }
}
