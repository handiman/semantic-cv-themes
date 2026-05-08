import { Theme, titleify } from "../theme.js";
import { HTMLTransformer } from "../htmlTransformer.js";
import Person, { projects, certifications, work, education } from "../person.js";
import { ThemeTags } from "../themeTags.js";

const id = "typewriter";
const description =
  "A retro, monochrome résumé styled like a typewritten page. Charmingly imperfect and intentionally quirky.";
const tags = [
  ThemeTags.singleCol,
  ThemeTags.lightMode,
  ThemeTags.monoChrome,
  ThemeTags.resume,
  ThemeTags.humorous,
  ThemeTags.retro
];

const html = { html: true };

export class TypewriterTheme extends Theme {
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

  renderJS(_person: Person): Promise<string> {
    return Promise.resolve("");
  }

  renderHTML(person: Person): Promise<string> {
    const {
      transformer,
      options,
      renderWorksFor,
      renderAlumniOf,
      renderProjects,
      renderLifeEvents,
      renderKnowsLanguage,
      renderKnowsAbout,
      renderSkills,
      renderCertifications
    } = this;
    const { headings } = options;
    const { name, jobTitle, description, knowsAbout, skills, knowsLanguage, lifeEvent } = person;

    transformer.on("head", {
      element(head: any) {
        head.append(
          `
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link href="https://fonts.googleapis.com/css2?family=Special+Elite&display=swap" rel="stylesheet" />
          `,
          html
        );
      }
    });

    transformer.on("article", {
      element(article: any) {
        article.append(
          `
            <header>
              <h1>${name ?? ""}</h1>
              <div>${jobTitle ?? ""}</div>
            </header>
            <section id="basics">
                ${
                  description
                    ? `
                    <div>
                      <h2>${headings.description}</h2>
                      <p>${description}</p>
                    </div>
                    `
                    : ""
                }
                ${renderKnowsAbout(knowsAbout)}
                ${renderSkills(skills)}
                ${renderKnowsLanguage(knowsLanguage)}
                ${renderCertifications(certifications(person))}
            </section>
            ${renderProjects(projects(person))}
            ${renderWorksFor(work(person))}
            ${renderAlumniOf(education(person))}
            ${renderLifeEvents(lifeEvent)}
          `,
          html
        );
      }
    });

    return transformer.transform(`<main><article class="paper"></article></main>`);
  }
}
