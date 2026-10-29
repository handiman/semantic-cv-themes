import { Theme, Slots } from "../theme.js";
import { locationText } from "../utils.js";
import Person from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeMetadata } from "../themeMetadata.js";
import { icon } from "../icons.js";
import { contactLinks } from "../contact.js";

export class AliceTheme extends Theme {
  static readonly meta: ThemeMetadata = {
    id: "alice",
    title: "Alice",
    description:
      "A split two‑column layout: a light sidebar with coral accents beside a dark charcoal main column. Clean sans‑serif type and a strong contrast between the halves.",
    tags: [
      ThemeTags.twoCol,
      ThemeTags.neutral,
      ThemeTags.lightMode,
      ThemeTags.typographyForward,
      ThemeTags.minimal,
      ThemeTags.resume
    ]
  };

  protected layout(person: Person): string {
    const { name, jobTitle } = person;
    return `
        <div class="page">
          <div class="aside">
            <header>
                <slot name="photo"></slot>
                <h1>${name ?? ""}${jobTitle ? `<small>${jobTitle}</small>` : ""}</h1>
                <slot name="contact"></slot>
            </header>
            <aside>
                <slot name="description"></slot>
                <slot name="knowsAbout"></slot>
                <slot name="skills"></slot>
                <slot name="knowsLanguage"></slot>
                <slot name="certifications"></slot>
            </aside>
          </div>
          <div class="main">
            <main>
                <slot name="worksFor"></slot>
                <slot name="alumniOf"></slot>
                <slot name="projects"></slot>
                <slot name="lifeEvent"></slot>
            </main>
          </div>
        </div>
    `;
  }

  protected slots(person: Person): Slots {
    const { name, image, description } = person;
    const { headings } = this.options;
    return {
      photo: () => (image ? `<picture><img src="${image}" alt="${name ?? ""}" /></picture>` : ""),
      contact: () => renderContactDetails(person),
      description: () =>
        description
          ? `
            <section id="description">
              ${headings.description ? `<h2>${headings.description}</h2>` : ""}
              ${description}
            </section>
            `
          : ""
    };
  }
}

const renderContactDetails = (person: Person) => {
  const location = locationText(person.workLocation);
  const contactDetails = contactLinks(person);
  return contactDetails.length || location
    ? `
    <div id="contact">
        <ul>${location ? `<li><a>${icon("location")}${location}</a></li>` : ""}${contactDetails
          .map((link) => `<li><a href="${link.href}">${link.icon}${link.text}</a></li>`)
          .join("\n")}
        </ul>
    </div>
    `
    : "";
};
