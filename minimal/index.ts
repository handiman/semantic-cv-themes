import { Theme, Slots } from "../theme.js";
import { contactLinks } from "../contact.js";
import { locationText } from "../utils.js";
import Person from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeMetadata } from "../themeMetadata.js";

export class MinimalTheme extends Theme {
  static readonly meta: ThemeMetadata = {
    id: "minimal",
    title: "Minimal",
    description:
      "A neutral, understated layout with a narrow sidebar for skills and a main column for experience. Plain, readable and suitable for most CVs.",
    tags: [
      ThemeTags.twoCol,
      ThemeTags.photo,
      ThemeTags.lightMode,
      ThemeTags.minimal,
      ThemeTags.neutral,
      ThemeTags.default
    ]
  };

  protected layout(): string {
    return `
      <div class="page">
        <header><slot name="identity"></slot></header>
        <aside>
          <slot name="knowsAbout"></slot>
          <slot name="skills"></slot>
          <slot name="certifications"></slot>
          <slot name="knowsLanguage"></slot>
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
    return { identity: () => renderIdentity(person) };
  }
}

const renderIdentity = (person: Person) => {
  const { image, name, jobTitle, description } = person;
  const location = locationText(person.workLocation);
  const links = contactLinks(person);
  return `
    ${image ? `<picture><img src="${image}" alt="${name ?? ""}" /></picture>` : ""}
    <div>
      <h1>${name}</h1>
      ${jobTitle ? `<div>${jobTitle}</div>` : ""}
      ${location ? `<div>${location}</div>` : ""}
      ${description ? `<div>${description}</div>` : ""}
      ${links.length > 0 ? `<ul>${links.map((link) => `<li><a href="${link.href}" aria-label="${link.label}">${link.icon}<div class="print">${link.text}</div></a></li>`).join("\n")}</ul>` : ""}
    </div>
  `;
};
