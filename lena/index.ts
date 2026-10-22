import { Theme } from "../theme.js";
import { HTMLTransformer } from "../htmlTransformer.js";
import { locationText, normalizeArray } from "../utils.js";
import Person, { projects, certifications, work, education } from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeOptions } from "../themeOptions.js";
import { ThemeMetadata } from "../themeMetadata.js";
import { IconFactory, icon } from "../icons.js";

const meta = {
  id: "lena",
  title: "Lena",
  description:
    "A modern two‑column theme with clean typography, subtle accents, and a calm, well‑organized visual flow.",
  tags: [
    ThemeTags.twoCol,
    ThemeTags.headshot,
    ThemeTags.lightMode,
    ThemeTags.calm,
    ThemeTags.typographyForward,
    ThemeTags.photo
  ]
};
const html = { html: true };

export class LenaTheme extends Theme {
  constructor(
    private transformer: HTMLTransformer,
    loadAsset: (_: string) => Promise<string>,
    options?: ThemeOptions
  ) {
    super(loadAsset, meta, options);
  }

  static get meta(): ThemeMetadata {
    return meta;
  }

  async renderHTML(person: Person): Promise<string> {
    const {
      transformer,
      options,
      renderProjects,
      renderWorksFor,
      renderAlumniOf,
      renderLifeEvents,
      renderCertifications,
      renderKnowsLanguage,
      renderKnowsAbout,
      renderSkills
    } = this;
    const { lifeEvent, knowsLanguage, knowsAbout, skills } = person;

    transformer.on("header", {
      element(header: any) {
        renderHeader(header, person);
      }
    });

    transformer.on("main", {
      element(main: any) {
        main.append(renderWorksFor(work(person)), html);
        main.append(renderProjects(projects(person)), html);
        main.append(renderAlumniOf(education(person)), html);
        main.append(renderLifeEvents(lifeEvent), html);
      }
    });

    transformer.on("aside", {
      element(aside: any) {
        aside.append(renderContact(person, options), html);
        aside.append(renderKnowsAbout(knowsAbout), html);
        aside.append(renderSkills(skills), html);
        aside.append(renderKnowsLanguage(knowsLanguage), html);
        aside.append(renderCertifications(certifications(person)), html);
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

const renderHeader = (header: any, person: Person) => {
  const { image, name, jobTitle, description } = person;
  header.append(
    `
        <div class="summary">
            ${name ? `<h1>${name}</h1>` : ""}
            ${jobTitle ? `<p class="job-title">${jobTitle}</p>` : ""}
            ${description ? `<p>${description}</p>` : ""}
        </div>
        ${image ? `<div class="photo"><img src="${image}" alt="${name ?? ""}" /></div>` : ""}
    `,
    html
  );
};

const renderContact = (person: any, options: ThemeOptions) => {
  const { email, telephone, url, sameAs } = person;
  const location = locationText(person.workLocation);
  const { headings } = options;
  const links = normalizeArray(
    sameAs,
    url,
    email ? `mailto:${email}` : undefined,
    telephone ? `tel:${telephone}` : undefined
  );
  const iconFactory = new IconFactory(person);
  const linkText = (url: string) => {
    if (url.indexOf("mailto:") > -1 || url.indexOf("tel:") > -1) {
      return url.substring(url.indexOf(":") + 1);
    }

    return url.substring(url.indexOf("://") + 3).replace("www.", "");
  };
  return links.length || location
    ? `
      <section>
        <h2>${headings.contact}</h2>
        <ul>${location ? `<li><a>${icon("location")}<span>${location}</span></a></li>` : ""}${links.map((link: string) => `<li><a href="${link}" title="${link}">${iconFactory.icon(link)}<span>${linkText(link)}</span></a></li>`).join("")}</ul>
      </section>
        `
    : "";
};
