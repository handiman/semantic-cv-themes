import { Theme, Slots } from "../theme.js";
import Person from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeMetadata } from "../themeMetadata.js";
import { contactLinks } from "../contact.js";
import { locationText } from "../utils.js";

/**
 * The CV as a filled-in office form: every section a ruled box with its heading on a grey strip,
 * every role a row of the form, and the contact details in a box of their own next to the name.
 * Black, white and grey; nothing that only makes sense when seen.
 */
export class TpsReportTheme extends Theme {
  static readonly meta: ThemeMetadata = {
    id: "tps-report",
    title: "TPS Report",
    added: "2026-11-16",
    description:
      "A filled-in office form, cover sheet included: every section a ruled box with its heading on a grey strip, each role a row of the form, and the contact details boxed next to the name.",
    tags: [
      ThemeTags.singleCol,
      ThemeTags.lightMode,
      ThemeTags.monoChrome,
      ThemeTags.corporate,
      ThemeTags.playful
    ]
  };

  // Keywords as one line of text, after a label, so they read as words to a parser.
  protected renderKeywords(keywords: Array<string>): string {
    return `<p class="keywords">${this.options.headings.skills}: ${keywords.join(", ")}</p>`;
  }

  protected layout(): string {
    return `
      <header>
        <slot name="who"></slot>
        <slot name="contact"></slot>
      </header>
      <main>
        <slot name="summary"></slot>
        <slot name="worksFor"></slot>
        <slot name="projects"></slot>
        <slot name="alumniOf"></slot>
        <slot name="knowsAbout"></slot>
        <slot name="skills"></slot>
        <slot name="knowsLanguage"></slot>
        <slot name="certifications"></slot>
        <slot name="lifeEvent"></slot>
      </main>
    `;
  }

  protected slots(person: Person): Slots {
    const { headings } = this.options;
    const { jobTitle, description } = person;
    return {
      // The name and title in one box, the first field of the form.
      who: () =>
        `<div class="who">
          <h1>${person.name ?? ""}</h1>
          ${jobTitle ? `<p class="job-title">${jobTitle}</p>` : ""}
        </div>`,
      contact: () => {
        const location = locationText(person.workLocation);
        const links = contactLinks(person);
        return location || links.length
          ? `<section id="contact">
              <h2>${headings.contact}</h2>
              <ul class="contact">
                ${location ? `<li>${location}</li>` : ""}
                ${links.map((link) => `<li><a href="${link.href}">${link.text}</a></li>`).join("")}
              </ul>
            </section>`
          : "";
      },
      summary: () =>
        description
          ? `<section id="description">
              <h2>${headings.description}</h2>
              <p class="scv-description">${description}</p>
            </section>`
          : ""
    };
  }
}
