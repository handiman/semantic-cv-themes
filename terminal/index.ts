import { Theme, Slots } from "../theme.js";
import Person, { certifications } from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeMetadata } from "../themeMetadata.js";
import { contactLinks } from "../contact.js";
import { locationText } from "../utils.js";

/**
 * A shell session in a terminal window: monospace on a dark background, a prompt before each
 * heading and a blinking cursor at the end. Printed, it is black on white.
 *
 * The prompts and the window's title bar are drawn by terminal.css, so no visible text is
 * hard-coded and the headings still follow the CV's language.
 */
export class TerminalTheme extends Theme {
  static readonly meta: ThemeMetadata = {
    id: "terminal",
    title: "Terminal",
    added: "2026-11-02",
    description:
      "A CV as a shell session: monospace on a dark terminal window, a prompt before every heading and a blinking cursor at the end. Prints black on white.",
    tags: [
      ThemeTags.singleCol,
      ThemeTags.darkMode,
      ThemeTags.highContrast,
      ThemeTags.accented,
      ThemeTags.retro,
      ThemeTags.technical
    ]
  };

  protected layout(person: Person): string {
    return `
      <div class="window">
        <div class="title-bar" aria-hidden="true"></div>
        <div class="screen">
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
          <div class="cursor" aria-hidden="true"></div>
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
