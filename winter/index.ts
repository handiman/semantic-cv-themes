import { Theme, Slots } from "../theme.js";
import Person, { certifications } from "../person.js";
import { locationText } from "../utils.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeMetadata } from "../themeMetadata.js";
import { icon } from "../icons.js";
import { contactLinks } from "../contact.js";

export class WinterTheme extends Theme {
  static readonly meta: ThemeMetadata = {
    id: "winter",
    title: "Winter",
    description: "A crisp, cool, spacious layout with bright whites and clean structure.",
    tags: [
      ThemeTags.twoCol,
      ThemeTags.headshot,
      ThemeTags.lightMode,
      ThemeTags.cool,
      ThemeTags.resume
    ]
  };

  protected layout(): string {
    return `
      <header>
        <div><slot name="identity"></slot></div>
      </header>
      <div>
        <main>
          <slot name="basics"></slot>
          <slot name="worksFor"></slot>
          <slot name="projects"></slot>
          <slot name="alumniOf"></slot>
          <slot name="lifeEvent"></slot>
          <slot name="footer"></slot>
        </main>
      </div>
    `;
  }

  protected slots(person: Person): Slots {
    const { options, renderKnowsLanguage, renderKnowsAbout, renderSkills, renderCertifications } =
      this;
    const {
      name,
      jobTitle,
      description,
      image,
      email,
      telephone,
      knowsAbout,
      skills,
      knowsLanguage
    } = person;

    const renderBasics = () => {
      const { headings } = options;
      const grid = [
        renderKnowsAbout(knowsAbout),
        renderSkills(skills),
        renderKnowsLanguage(knowsLanguage),
        renderCertifications(certifications(person))
      ].join("");
      if (!description && !grid.trim()) {
        return "";
      }
      return `
    <section>
      ${
        description
          ? `<h2>${headings.description}</h2>
      <p>${description}</p>`
          : ""
      }
      ${grid.trim() ? `<div class="grid">${grid}</div>` : ""}
    </section>
  `;
    };

    const renderFooter = () => {
      const renderSocial = () => {
        const links = contactLinks(person);
        if (links && links.length) {
          return `<ul>${links.map((link) => `<li><a href="${link.href}" aria-label="${link.label}">${link.icon}</a><div class="print">${link.text}</div></li>`).join("\n")}</ul>`;
        }
      };

      const social = renderSocial();
      return social ? `<footer>${social}</footer>` : "";
    };

    const renderHeader = () => {
      return `
        ${
          image
            ? `<div class="image"><img src="${image}" alt="${name ?? ""}" /></div>`
            : // Without a photo the frame is drawn empty, as a silhouette.
              `<div class="image" aria-hidden="true"></div>`
        }
        <div class="title">
            <h1>${name ?? ""}</h1>
            ${jobTitle ? `<div>${jobTitle}</div>` : ""}
            ${locationText(person.workLocation) ? `<div>${locationText(person.workLocation)}</div>` : ""}
            ${
              email || telephone
                ? `<ul>
            ${email ? `<li><a href="mailto:${email}" aria-label="Email">${icon("envelope")}<div class="print">${email}</div></a></li>` : ""}
            ${telephone ? `<li><a href="tel:${telephone}" aria-label="Phone">${icon("phone")}<div class="print">${telephone}</div></a></li>` : ""}
            </ul>`
                : ""
            }
        </div>
      `;
    };

    return { identity: renderHeader, basics: renderBasics, footer: renderFooter };
  }
}
