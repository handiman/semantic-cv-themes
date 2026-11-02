import { Theme, Slots } from "../theme.js";
import Person from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeMetadata } from "../themeMetadata.js";
import { contactLinks } from "../contact.js";
import { locationText } from "../utils.js";

/**
 * A CV as a till receipt: a narrow strip of paper in monospace, dashed rules between sections,
 * every job a line item with its dates on the right, skills by the piece, and a barcode at the
 * bottom. The barcode and the quantities are drawn by proof-of-work.css, so no visible text is
 * hard-coded.
 */
export class ProofOfWorkTheme extends Theme {
  static readonly meta: ThemeMetadata = {
    id: "proof-of-work",
    title: "Proof of Work",
    description:
      "A CV as a till receipt: a narrow strip of paper in monospace, every job a line item with its dates on the right, skills by the piece and a barcode at the bottom.",
    tags: [
      ThemeTags.singleCol,
      ThemeTags.lightMode,
      ThemeTags.monoChrome,
      ThemeTags.playful,
      ThemeTags.retro
    ]
  };

  protected layout(person: Person): string {
    return `
      <div class="receipt">
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
          <slot name="knowsAbout"></slot>
          <slot name="skills"></slot>
          <slot name="knowsLanguage"></slot>
          <slot name="certifications"></slot>
          <slot name="lifeEvent"></slot>
        </main>
        <div class="barcode" aria-hidden="true"></div>
      </div>
    `;
  }

  protected slots(person: Person): Slots {
    const { headings } = this.options;
    const { jobTitle, description } = person;
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
          : ""
    };
  }
}
