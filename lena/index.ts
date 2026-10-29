import { Theme, Slots } from "../theme.js";
import { locationText } from "../utils.js";
import Person from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeOptions } from "../themeOptions.js";
import { ThemeMetadata } from "../themeMetadata.js";
import { icon } from "../icons.js";
import { contactLinks } from "../contact.js";

export class LenaTheme extends Theme {
  static readonly meta: ThemeMetadata = {
    id: "lena",
    title: "Lena",
    description:
      "A warm, paper‑toned two‑column layout with small‑caps headings, shaded section bands and a framed portrait overlapping the header. Classic and calm.",
    tags: [
      ThemeTags.twoCol,
      ThemeTags.photo,
      ThemeTags.lightMode,
      ThemeTags.warm,
      ThemeTags.calm,
      ThemeTags.typographyForward,
      ThemeTags.colorBlocks
    ]
  };

  protected layout(): string {
    return `
      <div class="page">
        <header><slot name="identity"></slot></header>
        <aside>
          <slot name="contact"></slot>
          <slot name="knowsAbout"></slot>
          <slot name="skills"></slot>
          <slot name="knowsLanguage"></slot>
          <slot name="certifications"></slot>
        </aside>
        <main>
          <slot name="worksFor"></slot>
          <slot name="projects"></slot>
          <slot name="alumniOf"></slot>
          <slot name="lifeEvent"></slot>
        </main>
      </div>
    `;
  }

  protected slots(person: Person): Slots {
    return {
      identity: () => renderHeader(person),
      contact: () => renderContact(person, this.options)
    };
  }
}

const renderHeader = (person: Person) => {
  const { image, name, jobTitle, description } = person;
  return `
        <div class="summary">
            ${name ? `<h1>${name}</h1>` : ""}
            ${jobTitle ? `<p class="job-title">${jobTitle}</p>` : ""}
            ${description ? `<p>${description}</p>` : ""}
        </div>
        ${image ? `<div class="photo"><img src="${image}" alt="${name ?? ""}" /></div>` : ""}
    `;
};

const renderContact = (person: any, options: ThemeOptions) => {
  const location = locationText(person.workLocation);
  const { headings } = options;
  const links = contactLinks(person);
  return links.length || location
    ? `
      <section>
        <h2>${headings.contact}</h2>
        <ul>${location ? `<li><a>${icon("location")}<span>${location}</span></a></li>` : ""}${links.map((link) => `<li><a href="${link.href}" title="${link.href}">${link.icon}<span>${link.text}</span></a></li>`).join("")}</ul>
      </section>
        `
    : "";
};
