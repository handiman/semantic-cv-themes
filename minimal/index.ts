import { Theme } from "../theme.js";
import { HTMLTransformer } from "../htmlTransformer.js";
import { FaIconFactory, normalizeArray } from "../utils.js";
import Person, { projects, certifications, work, education } from "../person.js";

const html = { html: true };

export class MinimalTheme extends Theme {
  constructor(
    private transformer: HTMLTransformer,
    loadAsset: (assetName: string) => Promise<string>
  ) {
    super(MinimalTheme.id, loadAsset);
  }

  static get id() {
    return "minimal";
  }

  async renderHTML(person: Person): Promise<string> {
    const { transformer } = this;
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
          if (knowsAbout && knowsAbout.length) {
            aside.append(
              `
                <section>
                  <h2>Core Competencies</h2>
                  <ul>${knowsAbout.map((thing: string) => `<li>${thing}</li>`).join("")}</ul>
                </section>
              `,
              html
            );
          }
          if (skills && skills.length) {
            aside.append(
              `
                <section>
                  <h2>Tech Skills</h2>
                  <ul>${skills.map((skill: string) => `<li>${skill}</li>`).join("")}</ul>
                </section>
              `,
              html
            );
          }
          if (certs && certs.length) {
            aside.append(
              `
                <section>
                  <h2>Certifications</h2>
                  <ul>${certs.map((cert: any) => `<li>${cert.name}</li>`).join("")}</ul>
                </section>
              `,
              html
            );
          }
          if (knowsLanguage && knowsLanguage.length) {
            aside.append(
              `
                <section>
                  <h2>Languages</h2>
                  <ul>${knowsLanguage.map((language: string) => `<li>${language}</li>`).join("")}</ul>
                </section>
              `,
              html
            );
          }
        }
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
            ${renderProjects(person)};
            ${renderWork(person)};
            ${renderEducation(person)};
          `,
          html
        );

        if (lifeEvent && lifeEvent.length) {
          main.append(
            `
              <section>
                <h2>Education</h2>
                <h2>Life Events</h2>
                <ul>
                ${lifeEvent
                  .map(
                    (event: any) =>
                      `
                    <li>
                        ${event.name ? `<div>${event.name}</div>` : ""}
                        ${
                          event.startDate || (event.location && event.location.name)
                            ? `
                                <div>
                                    ${event.startDate ? `${event.startDate}` : ""}
                                    ${event.location && event.location.name ? `${event.location.name}` : ""}
                                </div>`
                            : ""
                        }
                        ${event.description ? `<div>${event.description}</div>` : ""}
                    </li>
                    `
                  )
                  .join("")}
                </ul>
              </section>
            `,
            html
          );
        }
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

const renderProjects = (person: Person) => renderRoles("Projects", "projects", projects(person));

const renderWork = (person: Person) => renderRoles("Professional Experience", "work", work(person));

const renderEducation = (person: Person) =>
  renderRoles("Education", "education", education(person));

const renderRoles = (heading: string, className: string, roles: Array<any>) => {
  return roles && roles.length
    ? `
      <section class="${className}">
        <h2>${heading}</h2>
        ${roles.map(renderRole).join("")}
      </section>
    `
    : "";
};

const renderRole = (role: any) => {
  const { roleName, startDate, endDate, worksFor, alumniOf, description } = role;
  const { name, location } = worksFor ?? alumniOf;
  const period = () => {
    if (startDate || endDate) {
      return `
        ${startDate ? `<time datetime="${startDate}">${startDate}</time>` : ""}
        ${endDate ? ` <time datetime="${endDate}">${endDate}</time>` : "present"}
      `;
    }
  };
  const header = () => {
    const span = period();
    return `
      ${name ? `<h3>${name}</h3>` : ""}
      <ul>
        ${roleName ? `<li>${roleName}</li>` : ""}
        ${span ? `<li>${span}</li>` : ""}
        ${location ? ` <li>${location}</li>` : ""}
      </ul>
    `;
  };

  return `
    <article>
      ${header() ?? ""}
      ${description ? `<p>${description}<p>` : ""}
    </article>
  `;
};
