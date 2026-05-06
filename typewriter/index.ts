import { Theme, titleify } from "../theme.js";
import { HTMLTransformer } from "../htmlTransformer.js";
import Person, { projects, certifications, work, education } from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeOptions } from "../themeOptions.js";

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
    const { transformer, options } = this;

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
        article.append(renderHeader(person), html);
        article.append(renderBasics(person, options), html);
        article.append(renderProjects(person, options), html);
        article.append(renderWork(person, options), html);
        article.append(renderEducation(person, options), html);
        article.append(renderLifeEvents(person, options), html);
      }
    });

    return transformer.transform(`<main><article class="paper"></article></main>`);
  }
}
const renderHeader = (person: Person) => {
  const { name, jobTitle } = person;
  return `
    <header>
      <h1>${name ?? ""}</h1>
      <div>${jobTitle ?? ""}</div>
    </header>
  `;
};

const renderBasics = (person: Person, options: ThemeOptions) => {
  const { description, knowsAbout, skills, knowsLanguage } = person;
  const { headings } = options;
  const certs = certifications(person);
  return `
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
        ${
          knowsAbout && knowsAbout.length
            ? `
            <div>
              <h2>${headings.knowsAbout}</h2>
              <ul>${knowsAbout.map((area: string) => `<li>${area}</li>`).join("")}</ul>
            </div>
            `
            : ""
        }
        ${
          skills && skills.length
            ? `
            <div>
              <h2>${headings.skills}</h2>
              <ul>${skills.map((skill: string) => `<li>${skill}</li>`).join("")}</ul>
            </div>
            `
            : ""
        }
        ${
          knowsLanguage && knowsLanguage.length
            ? `
            <div>
              <h2>${headings.knowsLanguage}</h2>
              <ul>${knowsLanguage.map((language: string) => `<li>${language}</li>`).join("")}</ul>
            </div>
            `
            : ""
        }
        ${
          certs && certs.length
            ? `
            <div>
              <h2>${headings.certifications}</h2>
              <ul>${certs.map((cert: any) => `<li>${cert.name}</li>`).join("")}</ul>
            </div>
            `
            : ""
        }
    </section>
  `;
};

const renderWork = (person: Person, options: ThemeOptions) =>
  renderRoles(options.headings.worksFor, work(person));

const renderEducation = (person: Person, options: ThemeOptions) =>
  renderRoles(options.headings.alumniOf, education(person));

const renderProjects = (person: Person, options: ThemeOptions) =>
  renderRoles(options.headings.projects, projects(person));

const renderRoles = (heading: string, roles: Array<any>) => {
  return roles && roles.length
    ? `
      <h2>${heading}</h2>
      <div>
        ${roles.map(renderRole).join("")}
      </div>  
    `
    : "";
};

const renderRole = (role: any) => {
  const { startDate, endDate, roleName, description, worksFor, alumniOf } = role;
  const { name, location } = worksFor ?? alumniOf ?? {};
  function period() {
    if (startDate || endDate) {
      return `
            ${startDate ? `<time datetime="${startDate}">${startDate}</time>` : ""}
            ${endDate ? ` <time datetime="${endDate}">${endDate}</time>` : "present"}
        `;
    }
  }
  function caption() {
    const span = period();
    return `
        ${name ? `<h3>${name}</h3>` : ""}
        <ul class="caption">
          ${roleName ? `<li>${roleName}</li>` : ""}
          ${span ? `<li>${span}</li>` : ""}
          ${location ? ` <li>${location}</li>` : ""}
        </ul>
      `;
  }
  return `
    <article>
        ${caption() ?? ""}
        ${description ? `<p>${description}<p>` : ""}
    </article>
`;
};

const renderLifeEvents = (person: Person, options: ThemeOptions) => {
  const { lifeEvent } = person;
  const { headings } = options;
  return lifeEvent && lifeEvent.length
    ? `
    <section>
        <h2 class="pirata-one-regular">${headings.lifeEvent}</h2>
        <div id="events">
            ${lifeEvent
              .map(
                (event: any) => `
                <div>
                    ${event.name ? `<h3>${event.name}</h3>` : ""}
                    ${
                      event.startDate || (event.location && event.location.name)
                        ? `
                    <div class="caption">
                        ${event.startDate ? `${event.startDate}` : ""}
                        ${event.location && event.location.name ? `${event.location.name}` : ""}
                    </div>`
                        : ""
                    }
                    ${event.description ? `<p>${event.description}</p>` : ""}                
                </div>`
              )
              .join("")}
        </div>
    </section>
    `
    : "";
};
