import { Theme } from "../theme.js";
import { HTMLTransformer } from "../htmlTransformer.js";
import Person, { projects, certifications, work, education } from "../person.js";
import { ThemeTags } from "../themeTags.js";

const id = "boiling-diesel";
const title = "Boiling Diesel";
const description =
  "A bold, high‑contrast dark theme built for technical résumés that want a strong, confident presence.";
const tags = [
  ThemeTags.twoCol,
  ThemeTags.resume,
  ThemeTags.darkMode,
  ThemeTags.highContrast,
  ThemeTags.technical,
  ThemeTags.bold
];
const html = { html: true };

export class BoilingDieselTheme extends Theme {
  constructor(
    private transformer: HTMLTransformer,
    loadAsset: (_: string) => Promise<string>
  ) {
    super(BoilingDieselTheme.id, loadAsset);
  }

  static get id() {
    return id;
  }

  static get title() {
    return title;
  }

  static get description() {
    return description;
  }

  static get tags() {
    return tags;
  }

  renderJS(_person: any) {
    return Promise.resolve("");
  }

  async renderHTML(person: Person): Promise<string> {
    const { transformer } = this;
    transformer
      .on("head", {
        element(head: any) {
          head.append(
            `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.9.0/css/all.min.css" />\n`,
            html
          );
        }
      })
      .on("header img", {
        element(photo: any) {
          const { image, name } = person;
          if (image) {
            photo.replace(`<img src="${image}" alt="${name ?? ""}" />`, html);
          } else {
            photo.remove();
          }
        }
      })
      .on("header h1", {
        element(h1: any) {
          const { name } = person;
          h1.replace(`<h1>${name ?? ""}</h1>`, html);
        }
      })
      .on("header h2", {
        element(h2: any) {
          const { jobTitle } = person;
          h2.replace(`<h2>${jobTitle ?? ""}</h2>`, html);
        }
      })
      .on("header .description", {
        element(div: any) {
          const { description, email, telephone } = person;
          if (description) {
            div.append(description);
          }
          if (email || telephone) {
            div.append(
              `
                <ul>
                  ${email ? `<li><a href="mailto:${email}"><i class="fas fa-envelope"></i><span>${email}</span></a></li>` : ""}
                  ${telephone ? `<li><a href="tel:${telephone}"><i class="fas fa-phone"></i><span>${telephone}</span></a></li>` : ""}
                </ul>
              `,
              html
            );
          }
        }
      });

    renderSummary(transformer, person);
    renderProjects(transformer, person);
    renderWork(transformer, person);
    renderEducation(transformer, person);
    renderLifeEvents(transformer, person);

    return await transformer.transform(`
      <div class="wrapper">
          <header>
              <div>
                  <img />
                  <div>
                      <h1></h1>
                      <h2></h2>
                      <div class="description"></div>
                  </div>
              </div>
          </header>
          <main>
          </main>
      </div>
    `);
  }
}

const renderProjects = (transformer: HTMLTransformer, person: any) => {
  transformer.on("main", {
    element(main: any) {
      const proj = projects(person);
      if (proj && proj.length) {
        main.append(renderRoles("Featured Projects", proj), html);
      }
    }
  });
};

const renderWork = (transformer: HTMLTransformer, person: any) => {
  transformer.on("main", {
    element(main: any) {
      const worksFor = work(person);
      if (worksFor && worksFor.length) {
        main.append(renderRoles("Professional Experience", worksFor), html);
      }
    }
  });
};

const renderEducation = (transformer: HTMLTransformer, person: any) => {
  transformer.on("main", {
    element(main: any) {
      const alumniOf = education(person);
      if (alumniOf && alumniOf.length) {
        main.append(renderRoles("Education", alumniOf), html);
      }
    }
  });
};

const renderRoles = (heading: string, roles: Array<any>) =>
  roles && roles.length
    ? `
  <section>
    <h2>${heading}</h2>
    ${roles.map(renderRole).join("")}
  </section>
`
    : "";

const renderRole = (role: any) => {
  const { roleName, startDate, endDate, description, worksFor, alumniOf } = role;
  const { name, location } = worksFor || alumniOf;
  const period =
    startDate || endDate
      ? `
        ${startDate ? `<time datetime="${startDate}">${startDate}</time>` : ""}
        ${endDate ? ` <time datetime="${endDate}">${endDate}</time>` : "present"}
      `
      : undefined;

  return `
    <article>
      <h3>${name ?? ""}</h3>
      <ul class="caption">
      ${roleName ? `<li>${roleName}</li>` : ""}
      ${period ? `<li>${period}</li>` : ""}
      ${location ? `<li>${location}</li>` : ""}
      </ul>
      <p>${description ?? ""}</p>
    </article>
  `;
};

const renderLifeEvents = (transformer: HTMLTransformer, person: any) => {
  transformer.on("main", {
    element(main: any) {
      const { lifeEvent } = person;
      if (lifeEvent && lifeEvent.length)
        main.append(
          `
          <section>
            <h2>Life Events</h2>
            ${lifeEvent
              .map(
                (e: any) => `
               <div>
                ${e.name ? `<h3>${e.name}</h3>` : ""}
                ${e.startDate ? `<time datetime="${e.startDate}">${e.startDate}</time>` : ""}
                ${e.location && e.location.name ? `<span>${e.location.name}</span>` : ""}
              </div>`
              )
              .join("")}
          </section>
        `,
          html
        );
    }
  });
};

const renderSummary = (transformer: HTMLTransformer, person: any) => {
  transformer.on("main", {
    element(main: any) {
      main.append(
        `
        <section>
          <div class="grid">
            ${renderKnowsAbout(person)}
            ${renderSkills(person)}
            ${renderLanguages(person)}
            ${renderCerts(person)}
          </div>
        </section>
        `,
        html
      );
    }
  });
};

const renderKnowsAbout = (person: any) => {
  const { knowsAbout } = person;
  if (knowsAbout && knowsAbout.language) {
    return `
      <div>
        <h3>Core Competencies</h3>
        <ul>${knowsAbout.map((thing: string) => `<li>${thing}</li>`).join("")}</ul>
      </div>
    `;
  }
  return "";
};

const renderSkills = (person: any) => {
  const { skills } = person;
  if (skills && skills.length > 0) {
    return `
      <div>
        <h3>Tech Skills</h3>
        <ul>${skills.map((skill: string) => `<li>${skill}</li>`).join("")}</ul>
      </div>
    `;
  }
  return "";
};

const renderLanguages = (person: any) => {
  const { knowsLanguage } = person;
  if (knowsLanguage && knowsLanguage.length > 0) {
    return `
      <div>
        <h3>Languages</h3>
        <ul>${knowsLanguage.map((language: string) => `<li>${language}</li>`).join("")}</ul>
      </div>
    `;
  }
  return "";
};

const renderCerts = (person: any) => {
  const certs = certifications(person);
  if (certs && certs.length > 0) {
    return `
      <div>
        <h3>Certifications</h3>
        <ul>${certs.map((certs: any) => `<li>${certs.name}</li>`).join("")}</ul>
      </div>
    `;
  }
  return "";
};
