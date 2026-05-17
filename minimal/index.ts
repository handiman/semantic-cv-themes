import { Theme } from "../theme.js";
import { HTMLTransformer } from "../htmlTransformer.js";
import { normalizeArray, removeProtocol } from "../utils.js";
import Person, { projects, certifications, work, education } from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeMetadata } from "../themeMetadata.js";
import fa, { FaIconFactory } from "../fontawesome.js";

const meta = {
  id: "minimal",
  title: "Minimal",
  description:
    "A neutral, understated single‑column layout designed to be readable, reliable, and universally suitable.",
  tags: [
    ThemeTags.singleCol,
    ThemeTags.lightMode,
    ThemeTags.minimal,
    ThemeTags.neutral,
    ThemeTags.resume,
    ThemeTags.default
  ]
};
const html = { html: true };

export class MinimalTheme extends Theme {
  constructor(
    private transformer: HTMLTransformer,
    loadAsset: (assetName: string) => Promise<string>
  ) {
    super(loadAsset, meta);
  }

  static get meta(): ThemeMetadata {
    return meta;
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
        head.append(`<link rel="stylesheet" href="${fa}"  />\n`, html);
      }
    });

    transformer.on("header", {
      element(header: any) {
        if (image) {
          header.append(`<picture><img src="${image}" alt="${name ?? ""}" /></picture>`, html);
        }
        header.append(
          `
            <div>
              <h1>${name}</h1>
              ${jobTitle ? `<div>${jobTitle}</div>` : ""}
              ${description ? `<div>${description}</div>` : ""}
              ${urls.length > 0 ? `<ul>${urls.map((link: string) => `<li><a href="${link}">${iconFactory.faIcon(link)}<div class="print">${removeProtocol(link)}</div></a></li>`).join("\n")}</ul>` : ""}
            </div>              
        `,
          html  
        );
      }
    });

    transformer.on("aside", {
      element(aside: any) {
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
      <div class="page">      
        <header></header>
        <aside></aside>
        <main></main>
      </div>
    `);
  }

  renderJS(_person: Person): Promise<string> {
    return Promise.resolve("");
  }
}
