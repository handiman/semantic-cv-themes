import { Theme, Slots } from "../theme.js";
import Person, { certifications } from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeMetadata } from "../themeMetadata.js";
import { icon } from "../icons.js";
import { locationText } from "../utils.js";
import { contactLinks } from "../contact.js";

export class BoilingDieselTheme extends Theme {
  static readonly meta: ThemeMetadata = {
    id: "boiling-diesel",
    title: "Boiling Diesel",
    description:
      "A white page under a dark header band, with a large round photo breaking the edge and olive‑brown headings. Sturdy and straightforward, with skills set in a two‑by‑two grid.",
    tags: [
      ThemeTags.singleCol,
      ThemeTags.accentHeader,
      ThemeTags.photo,
      ThemeTags.lightMode,
      ThemeTags.warm,
      ThemeTags.bold,
      ThemeTags.technical
    ]
  };

  protected layout(person: Person): string {
    const { name, jobTitle } = person;
    return `
      <div class="page">
          <header>
              <div>
                  <slot name="photo"></slot>
                  <div>
                      <h1>${name ?? ""}</h1>
                      ${jobTitle ? `<p class="job-title">${jobTitle}</p>` : ""}
                      <slot name="description"></slot>
                  </div>
              </div>
          </header>
          <main>
              <slot name="basics"></slot>
              <slot name="worksFor"></slot>
              <slot name="projects"></slot>
              <slot name="alumniOf"></slot>
              <slot name="lifeEvent"></slot>
          </main>
      </div>
    `;
  }

  protected slots(person: Person): Slots {
    const { renderKnowsAbout, renderSkills, renderKnowsLanguage, renderCertifications } = this;
    const { image, name, description, workLocation, knowsAbout, skills, knowsLanguage } = person;
    return {
      photo: () => (image ? `<img src="${image}" alt="${name ?? ""}" />` : ""),
      description: () => {
        const links = contactLinks(person);
        const location = locationText(workLocation);
        if (!description && !links.length && !location) {
          return "";
        }
        return `
          <div class="description">
            ${description ?? ""}
            ${
              links.length || location
                ? `<ul>
                  ${location ? `<li><a>${icon("location")}<span>${location}</span></a></li>` : ""}
                  ${links.map((link) => `<li><a href="${link.href}">${link.icon}<span>${link.text}</span></a></li>`).join("\n")}
                </ul>`
                : ""
            }
          </div>
        `;
      },
      basics: () => {
        const basics = [
          renderKnowsAbout(knowsAbout),
          renderSkills(skills),
          renderKnowsLanguage(knowsLanguage),
          renderCertifications(certifications(person))
        ].join("");
        return basics.trim() ? `<div><div class="grid">${basics}</div></div>` : "";
      }
    };
  }
}
