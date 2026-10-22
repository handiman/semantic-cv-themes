import { Theme } from "../theme.js";
import { HTMLTransformer } from "../htmlTransformer.js";
import Person, { projects, certifications, work, education } from "../person.js";
import { locationText, normalizeArray, removeProtocol } from "../utils.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeMetadata } from "../themeMetadata.js";
import { IconFactory, icon } from "../icons.js";

const meta = {
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

const html = { html: true };

export class WinterTheme extends Theme {
  constructor(
    private transformer: HTMLTransformer,
    loadAsset: (assetName: string) => Promise<string>
  ) {
    super(loadAsset, meta);
  }

  static get meta(): ThemeMetadata {
    return meta;
  }

  renderJS(_: Person): Promise<string> {
    return Promise.resolve("");
  }

  renderHTML(person: Person): Promise<string> {
    const {
      transformer,
      options,
      renderKnowsLanguage,
      renderKnowsAbout,
      renderSkills,
      renderCertifications,
      renderWorksFor,
      renderAlumniOf,
      renderProjects,
      renderLifeEvents
    } = this;
    const {
      name,
      jobTitle,
      description,
      image,
      sameAs,
      url,
      email,
      telephone,
      knowsAbout,
      skills,
      knowsLanguage,
      lifeEvent
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
        const iconFactory = new IconFactory(person);
        const links = normalizeArray(
          sameAs,
          url,
          email ? `mailto:${email}` : undefined,
          telephone ? `tel:${telephone}` : undefined
        );
        if (links && links.length) {
          return `<ul>${links.map((link: any) => `<li><a href="${link}" aria-label="${iconFactory.label(link)}">${iconFactory.icon(link)}</a><div class="print">${removeProtocol(link)}</div></li>`).join("\n")}</ul>`;
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

    transformer.on("header div", {
      element(header: any) {
        header.append(renderHeader(), html);
      }
    });

    transformer.on("main", {
      element(main: any) {
        main.append(renderBasics(), html);
        main.append(renderWorksFor(work(person)), html);
        main.append(renderProjects(projects(person)), html);
        main.append(renderAlumniOf(education(person)), html);
        main.append(renderLifeEvents(lifeEvent), html);
        main.append(renderFooter(), html);
      }
    });

    return transformer.transform(`
      <header>
        <div></div>
      </header>
      <div>
        <main></main>
      </div>
    `);
  }
}
