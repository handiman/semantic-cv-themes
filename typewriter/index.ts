import { Theme } from "../theme.js";
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
    super(TypewriterTheme.id, loadAsset);
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
    const { transformer } = this;

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
        article.append(renderBasics(person), html);
        article.append(renderProjects(person), html);
        article.append(renderWork(person), html);
        article.append(renderEducation(person), html);
        article.append(renderLifeEvents(person), html);
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

const renderBasics = (person: Person) => {
  const { description, knowsAbout, skills, knowsLanguage } = person;
  const certs = certifications(person);
  return `
    <section id="basics">
        ${
          description
            ? `
            <div>
              <h2>Professional Summary</h2>
              <p>${description}</p>
            </div>
            `
            : ""
        }
        ${
          knowsAbout && knowsAbout.length
            ? `
            <div>
              <h2>Expertise</h2>
              <ul>${knowsAbout.map((area: string) => `<li>${area}</li>`).join("")}</ul>
            </div>
            `
            : ""
        }
        ${
          skills && skills.length
            ? `
            <div>
              <h2>Skills</h2>
              <ul>${skills.map((skill: string) => `<li>${skill}</li>`).join("")}</ul>
            </div>
            `
            : ""
        }
        ${
          knowsLanguage && knowsLanguage.length
            ? `
            <div>
              <h2>Languages</h2>
              <ul>${knowsLanguage.map((language: string) => `<li>${language}</li>`).join("")}</ul>
            </div>
            `
            : ""
        }
        ${
          certs && certs.length
            ? `
            <div>
              <h2>Certifications</h2>
              <ul>${certs.map((cert: any) => `<li>${cert.name}</li>`).join("")}</ul>
            </div>
            `
            : ""
        }
    </section>
  `;
};

const renderWork = (person: Person) => renderRoles("Professional Experience", work(person));

const renderEducation = (person: Person) => renderRoles("Education", education(person));

const renderProjects = (person: Person) => renderRoles("Projects", projects(person));

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

const renderLifeEvents = (person: Person) => {
  const { lifeEvent } = person;
  return lifeEvent && lifeEvent.length
    ? `
    <section>
        <h2 class="pirata-one-regular">Life Events</h2>
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
