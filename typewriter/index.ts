import { Theme } from "../theme.js";
import { HTMLTransformer } from "../htmlTransformer.js";
import Person, { projects, certifications, work, education } from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { linkText, locationText, normalizeArray } from "../utils.js";
import { ThemeMetadata } from "../themeMetadata.js";
import { ThemeOptions } from "../themeOptions.js";

const meta = {
  id: "typewriter",
  title: "Typewriter",
  description:
    "A retro, monochrome résumé styled like a typewritten page. Charmingly imperfect and intentionally quirky.",
  tags: [
    ThemeTags.singleCol,
    ThemeTags.lightMode,
    ThemeTags.monoChrome,
    ThemeTags.resume,
    ThemeTags.humorous,
    ThemeTags.retro
  ]
};

const html = { html: true };

export class TypewriterTheme extends Theme {
  constructor(
    private transformer: HTMLTransformer,
    loadAsset: (assetName: string) => Promise<string>,
    options?: ThemeOptions
  ) {
    super(loadAsset, meta, options);
  }

  static get meta(): ThemeMetadata {
    return meta;
  }

  protected renderKeywords(keywords: Array<string>): string {
    return `<p>${this.options.headings.skills}: ${keywords.join(", ")}</p>`;
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
    const location = locationText(person.workLocation);
    const contacts = normalizeArray(
      person.email ? `mailto:${person.email}` : undefined,
      person.telephone ? `tel:${person.telephone}` : undefined,
      person.url,
      person.sameAs
    );

    transformer.on("article", {
      element(article: any) {
        article.append(
          `
            <header>
              <h1>${name ?? ""}</h1>
              <div>${jobTitle ?? ""}</div>
              ${
                location || contacts.length
                  ? `<ul class="contact">
                      ${location ? `<li>${location}</li>` : ""}
                      ${contacts.map((link: string) => `<li><a href="${link}">${linkText(link)}</a></li>`).join("")}
                    </ul>`
                  : ""
              }
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
            ${renderWorksFor(work(person))}
            ${renderProjects(projects(person))}
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
