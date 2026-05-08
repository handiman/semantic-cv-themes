import { Theme, titleify } from "../theme.js";
import { HTMLTransformer } from "../htmlTransformer.js";
import { FaIconFactory, normalizeArray } from "../utils.js";
import Person, { projects, certifications, work, education } from "../person.js";
import { ThemeTags } from "../themeTags.js";

const id = "minimal";
const description =
  "A neutral, understated single‑column layout designed to be readable, reliable, and universally suitable.";
const tags = [
  ThemeTags.singleCol,
  ThemeTags.lightMode,
  ThemeTags.minimal,
  ThemeTags.neutral,
  ThemeTags.resume,
  ThemeTags.default
];
const html = { html: true };

export class MinimalTheme extends Theme {
  constructor(
    private transformer: HTMLTransformer,
    loadAsset: (assetName: string) => Promise<string>
  ) {
    super(id, loadAsset, titleify(id), description);
  }

  static get id() {
    return id;
  }

  static get title() {
    return;
  }

  static get description() {
    return description;
  }

  static get tags() {
    return tags;
  }

  async renderHTML(person: Person): Promise<string> {
    const {
      transformer,
      renderWorksFor,
      renderAlumniOf,
      renderProjects,
      renderKnowsLanguage,
      renderKnowsAbout,
      renderSkills,
      renderLifeEvents,
      renderCertifications
    } = this;
    const iconFactory = new FaIconFactory(person);
    const {
      image,
      name,
      jobTitle,
      description,
      url,
      sameAs,
      email,
      telephone,
      knowsAbout,
      skills,
      knowsLanguage,
      lifeEvent
    } = person;
    const certs = certifications(person);
    const urls = normalizeArray(
      sameAs,
      url,
      email ? `mailto:${email}` : undefined,
      telephone ? `tel:${telephone}` : undefined
    );

    transformer.on("head", {
      element(head: any) {
        head.append(
          `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.9.0/css/all.min.css"  />\n`,
          html
        );
      }
    });

    transformer.on("aside", {
      element(aside: any) {
        if (image) {
          aside.append(`<img src="${image}" alt="${name ?? ""}" />`, html);
        }
        aside.append(renderKnowsAbout(knowsAbout), html);
        aside.append(renderSkills(skills), html);
        aside.append(renderCertifications(certs), html);
        aside.append(renderKnowsLanguage(knowsLanguage), html);
      }
    });

    transformer.on("main", {
      element(main: any) {
        main.append(
          `
            <header>
                <h1>${name}</h1>
                ${jobTitle ? `<div>${jobTitle}</div>` : ""}
                ${description ? `<div>${description}</div>` : ""}
                ${urls.length > 0 ? `<ul>${urls.map((link: string) => `<li><a href="${link}">${iconFactory.faIcon(link)}</a></li>`).join("\n")}</ul>` : ""}
            </header>
            ${renderProjects(projects(person))}
            ${renderWorksFor(work(person))}
            ${renderAlumniOf(education(person))}
          `,
          html
        );

        main.append(renderLifeEvents(lifeEvent), html);
      }
    });

    return await transformer.transform(`
      <div class="wrapper">      
        <aside></aside>
        <main></main>
      </div>
    `);
  }

  renderJS(_person: Person): Promise<string> {
    return Promise.resolve("");
  }
}
