import { Theme, html } from "../theme.js";
import { locationText } from "../utils.js";
import Person, { projects, certifications, work, education } from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeOptions } from "../themeOptions.js";
import { ThemeMetadata } from "../themeMetadata.js";
import { icon } from "../icons.js";
import { contactLinks } from "../contact.js";

export class MatildaTheme extends Theme {
  static readonly meta: ThemeMetadata = {
    id: "matilda",
    title: "Matilda",
    description:
      "A soft, pastel‑toned two‑column theme with gentle typography and a friendly, editorial touch.",
    tags: [
      ThemeTags.twoCol,
      ThemeTags.headshot,
      ThemeTags.lightMode,
      ThemeTags.pastel,
      ThemeTags.resume,
      ThemeTags.technical
    ]
  };

  renderHTML(person: Person): Promise<string> {
    const {
      transformer,
      options,
      renderKnowsAbout,
      renderSkills,
      renderKnowsLanguage,
      renderWorksFor,
      renderAlumniOf,
      renderProjects,
      renderLifeEvents,
      renderCertifications
    } = this;
    const { headings } = options;
    const { name, image, knowsLanguage, knowsAbout, skills, lifeEvent } = person;
    const contactDetails = () => {
      const links = contactLinks(person);
      const location = locationText(person.workLocation);
      return links.length || location
        ? `
          <section>
            <h2>${headings.contact}</h2>
            <ul>${location ? `<li><a><span>${location}</span>${icon("location")}</a></li>` : ""}${links.map((link) => `<li><a href="${link.href}" title="${link.href}"><span>${link.text}</span>${link.icon}</a></li>`).join("")}</ul>
          </section>
        `
        : "";
    };

    transformer.on(".photo", {
      element(photo: any) {
        if (image) {
          photo.append(`<img src="${image}" alt="${name ?? ""}" />`, html);
        } else {
          photo.remove();
        }
      }
    });

    transformer.on("aside", {
      element(aside: any) {
        aside.append(
          `
            ${contactDetails()}
            ${renderKnowsAbout(knowsAbout)}
            ${renderSkills(skills)}
            ${renderKnowsLanguage(knowsLanguage)}
            ${renderCertifications(certifications(person))}
          `,
          html
        );
      }
    });

    transformer.on("main", {
      element(main: any) {
        main.append(
          `
            ${renderHeader(person)}
            ${renderDescription(person, options)}
            ${renderWorksFor(work(person))}
            ${renderProjects(projects(person))}
            ${renderAlumniOf(education(person))}
            ${renderLifeEvents(lifeEvent)}
        `,
          html
        );
      }
    });

    return transformer.transform(`
      <div class="desktop">
        <div class="cv">
          <aside>
            <section class="photo"></section>
          </aside>
          <main></main>
        </div>
      </div>
    `);
  }
}

const renderHeader = (person: any): string => {
  const { name, jobTitle } = person;
  return name || jobTitle
    ? `
      <header>
        <div><h1>${name ?? ""}</h1></div>
        ${jobTitle ? `<div>${jobTitle}</div>` : ""}
      </header>
    `
    : "";
};

const renderDescription = (person: Person, options: ThemeOptions): string => {
  const { description } = person;
  const { headings } = options;
  return description
    ? `
      <section>
        <h2>${headings.description}</h2>
        <div>${description}</div>
      </section>
    `
    : "";
};
