import { Theme, html } from "../theme.js";
import { locationText } from "../utils.js";
import Person, { projects, certifications, work, education } from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeOptions } from "../themeOptions.js";
import { ThemeMetadata } from "../themeMetadata.js";
import { icon } from "../icons.js";
import { contactLinks } from "../contact.js";

export class LenaTheme extends Theme {
  static readonly meta: ThemeMetadata = {
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
  const location = locationText(person.workLocation);
  const { headings } = options;
  const links = contactLinks(person);
  return links.length || location
    ? `
      <section>
        <h2>${headings.contact}</h2>
        <ul>${location ? `<li><a>${icon("location")}<span>${location}</span></a></li>` : ""}${links.map((link) => `<li><a href="${link.href}" title="${link.href}">${link.icon}<span>${link.text}</span></a></li>`).join("")}</ul>
      </section>
        `
    : "";
};
