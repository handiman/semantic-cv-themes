import { Theme } from "../theme.js";
import { HTMLTransformer } from "../htmlTransformer.js";
import { FaIconFactory, normalizeArray } from "../utils.js";
import Person, { projects, certifications, work, education } from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeMetadata } from "../themeMetadata.js";

const meta = {
  id: "times",
  title: "Times",
  description:
    "A playful newspaper‑inspired résumé with an editorial layout and a subtle sense of humor.",
  tags: [
    ThemeTags.twoCol,
    ThemeTags.lightMode,
    ThemeTags.editorial,
    ThemeTags.typographyForward,
    ThemeTags.playful
  ]
};

const html = { html: true };

export class TimesTheme extends Theme {
  constructor(
    private transformer: HTMLTransformer,
    loadAsset: (assetName: string) => Promise<string>
  ) {
    super(loadAsset, meta);
  }

  static get meta(): ThemeMetadata {
    return meta;
  }

  renderJS(_person: Person) {
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
    const iconFactory = new FaIconFactory(person);
    const {
      name,
      jobTitle,
      description,
      sameAs,
      url,
      email,
      telephone,
      knowsLanguage,
      knowsAbout,
      skills,
      lifeEvent
    } = person;
    const { headings } = options;

    const renderSocial = () => {
      const links = normalizeArray(
        sameAs,
        url,
        email ? `mailto:${email}` : undefined,
        telephone ? `tel:${telephone}` : undefined
      );
      if (links.length > 0) {
        return `<ul class="social">${links.map((item: string) => `<li><a href="${item}">${iconFactory.faIcon(item)}</a></li>`).join("\n")}</ul>`;
      }
    };

    const renderHeader = () => {
      const now = new Date();
      return `
        <header>
            <h1>
                ${name ?? ""}
                <small>${jobTitle ?? ""}</small>
            </h1>
            <div class="grid">
                <div>${now.toLocaleDateString()}</div>
                <div>${renderSocial() ?? ""}</div>
            </div>
            <div class="hr"></div>
        </header>
      `;
    };

    const renderBasics = () => {
      return `
        <section>
            <h2 class="pirata-one-regular">${headings.description}</h2>
            ${description ? `<p>${description}</p>` : ""}
        </section>
        <section id="basics">
            ${renderKnowsAbout(knowsAbout)}
            ${renderSkills(skills)}
            ${renderKnowsLanguage(knowsLanguage)}
            ${renderCertifications(certifications(person))}
        </section>
      `;
    };

    transformer.on("head", {
      element(head: any) {
        head.append(
          `
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link href="https://fonts.googleapis.com/css2?family=Pirata+One&display=swap" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.9.0/css/all.min.css"  />
          `,
          html
        );
      }
    });

    transformer.on("main div", {
      element(el: any) {
        el.append(renderHeader(), html);
        el.append(renderBasics(), html);
        el.append(renderProjects(projects(person)), html);
        el.append(renderWorksFor(work(person)), html);
        el.append(renderAlumniOf(education(person)), html);
        el.append(renderLifeEvents(lifeEvent), html);
      }
    });

    return transformer.transform(`<main><div></div></main>`);
  }
}
