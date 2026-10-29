import { Theme, Slots } from "../theme.js";
import { locationText } from "../utils.js";
import Person from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeOptions } from "../themeOptions.js";
import { ThemeMetadata } from "../themeMetadata.js";
import { icon } from "../icons.js";
import { contactLinks } from "../contact.js";

export class MatildaTheme extends Theme {
  static readonly meta: ThemeMetadata = {
    id: "matilda",
    title: "Matilda",
    description:
      "A soft, pastel‑toned two‑column theme with gentle typography and a friendly, editorial touch.",
    tags: [ThemeTags.twoCol, ThemeTags.photo, ThemeTags.lightMode, ThemeTags.pastel, ThemeTags.calm]
  };

  protected layout(): string {
    return `
      <div class="desktop">
        <div class="cv">
          <aside>
            <slot name="photo"></slot>
            <slot name="contact"></slot>
            <slot name="knowsAbout"></slot>
            <slot name="skills"></slot>
            <slot name="knowsLanguage"></slot>
            <slot name="certifications"></slot>
          </aside>
          <main>
            <slot name="header"></slot>
            <slot name="description"></slot>
            <slot name="worksFor"></slot>
            <slot name="projects"></slot>
            <slot name="alumniOf"></slot>
            <slot name="lifeEvent"></slot>
          </main>
        </div>
      </div>
    `;
  }

  protected slots(person: Person): Slots {
    const { headings } = this.options;
    const { name, image } = person;
    return {
      photo: () =>
        image ? `<section class="photo"><img src="${image}" alt="${name ?? ""}" /></section>` : "",
      contact: () => {
        const links = contactLinks(person);
        const location = locationText(person.workLocation);
        return links.length || location
          ? `
          <section>
            <h2>${headings.contact}</h2>
            <ul>${location ? `<li><a><span>${location}</span>${icon("location")}</a></li>` : ""}${links.map((link) => `<li><a href="${link.href}" title="${link.href}"><span>${link.text}</span>${link.icon}</a></li>`).join("")}</ul>
          </section>
        `
          : "";
      },
      header: () => renderHeader(person),
      description: () => renderDescription(person, this.options)
    };
  }
}

const renderHeader = (person: any): string => {
  const { name, jobTitle } = person;
  return name || jobTitle
    ? `
      <header>
        <div><h1>${name ?? ""}</h1></div>
        ${jobTitle ? `<div>${jobTitle}</div>` : ""}
      </header>
    `
    : "";
};

const renderDescription = (person: Person, options: ThemeOptions): string => {
  const { description } = person;
  const { headings } = options;
  return description
    ? `
      <section>
        <h2>${headings.description}</h2>
        <div>${description}</div>
      </section>
    `
    : "";
};
