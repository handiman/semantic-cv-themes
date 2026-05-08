import { Theme } from "../theme.js";
import { HTMLTransformer } from "../htmlTransformer.js";
import Person, { projects, certifications, work, education } from "../person.js";
import { FaIconFactory, normalizeArray } from "../utils.js";
import { ThemeTags } from "../themeTags.js";

const id = "winter";
const title = "Winter";
const description = "A crisp, cool, spacious layout with bright whites and clean structure.";
const tags = [
  ThemeTags.twoCol,
  ThemeTags.headshot,
  ThemeTags.lightMode,
  ThemeTags.cool,
  ThemeTags.resume
];

const html = { html: true };

export class WinterTheme extends Theme {
  constructor(
    private transformer: HTMLTransformer,
    loadAsset: (assetName: string) => Promise<string>
  ) {
    super(id, loadAsset, title, description);
  }

  static get id() {
    return id;
  }

  static get title() {
    return title;
  }

  static get description() {
    return description;
  }

  static get tags() {
    return tags;
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
      return `
    <section>
      <h2>${headings.description}</h2>
      ${description ? `<p>${description}</p>` : ""}
      <div class="grid">
        ${renderKnowsAbout(knowsAbout)}
        ${renderSkills(skills)}
        ${renderKnowsLanguage(knowsLanguage)}
        ${renderCertifications(certifications(person))}
      </div>
    </section>
  `;
    };

    const renderFooter = () => {
      const renderSocial = () => {
        const iconFactory = new FaIconFactory(person);
        const links = normalizeArray(
          sameAs,
          url,
          email ? `mailto:${email}` : undefined,
          telephone ? `tel:${telephone}` : undefined
        );
        if (links && links.length) {
          return `<ul">${links.map((link: any) => `<li><a href="${link}">${iconFactory.faIcon(link)}</a></li>`).join("\n")}</ul>`;
        }
      };

      return `<footer>${renderSocial()}</footer>`;
    };

    const renderHeader = () => {
      return `
        <div class="image">
            ${image ? `<img src="${image}" alt="${name ?? ""}" />` : ""}
        </div>
        <div class="title">
            <h1>${name ?? ""}</h1>
            ${jobTitle ? `<div>${jobTitle}</div>` : ""}
            <ul>
            ${email ? `<li><a href="mailto:${email}"><i class="fas fa-envelope"></i>${email}</a></li>` : ""}
            ${telephone ? `<li><a href="tel:${telephone}"><i class="fas fa-phone"></i>${telephone}</a></li>` : ""}
            </ul>
        </title>
      `;
    };

    transformer.on("head", {
      element(head: any) {
        head.append(
          `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.9.0/css/all.min.css"  />`,
          html
        );
      }
    });

    transformer.on("header div", {
      element(header: any) {
        header.append(renderHeader(), html);
      }
    });

    transformer.on("main", {
      element(main: any) {
        main.append(renderBasics(), html);
        main.append(renderProjects(projects(person)), html);
        main.append(renderWorksFor(work(person)), html);
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
