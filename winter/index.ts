import { Theme } from "../theme.js";
import { HTMLTransformer } from "../htmlTransformer.js";
import Person, { projects, certifications, work, education } from "../person.js";
import { FaIconFactory, normalizeArray } from "../utils.js";

const html = { html: true };

export class WinterTheme extends Theme {
  constructor(
    private transformer: HTMLTransformer,
    loadAsset: (assetName: string) => Promise<string>
  ) {
    super(WinterTheme.id, loadAsset);
  }

  static get id() {
    return "winter";
  }

  renderJS(_: Person): Promise<string> {
    return Promise.resolve("");
  }

  renderHTML(person: Person): Promise<string> {
    const { transformer } = this;

    transformer.on("head", {
      element(head: any) {
        head.append(
          `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.9.0/css/all.min.css"  />`,
          html
        );
      }
    });

    transformer.on("header div", {
      element(header: any) {
        header.append(renderHeader(person), html);
      }
    });

    transformer.on("main", {
      element(main: any) {
        main.append(renderBasics(person), html);
        main.append(renderProjects(person), html);
        main.append(renderWork(person), html);
        main.append(renderEducation(person), html);
        main.append(renderLifeEvents(person), html);
        main.append(renderFooter(person), html);
      }
    });

    return transformer.transform(`
    <header>
      <div></div>
    </header>
    <div>
      <main></main>
    </div>
    `);
  }
}

const renderFooter = (person: Person) => {
  const renderSocial = () => {
    const iconFactory = new FaIconFactory(person);
    const { sameAs, url, email, telephone } = person;
    const links = normalizeArray(
      sameAs,
      url,
      email ? `mailto:${email}` : undefined,
      telephone ? `tel:${telephone}` : undefined
    );
    if (links && links.length) {
      return `<ul">${links.map((link: any) => `<li><a href="${link}">${iconFactory.faIcon(link)}</a></li>`).join("\n")}</ul>`;
    }
  };

  return `<footer>${renderSocial()}</footer>`;
};

const renderHeader = (person: Person) => {
  const { image, name, jobTitle, email, telephone } = person;
  return `
    <div class="image">
        ${image ? `<img src="${image}" alt="${name ?? ""}" />` : ""}
    </div>
    <div class="title">
        <h1>${name ?? ""}</h1>
        ${jobTitle ? `<div>${jobTitle}</div>` : ""}
        <ul>
        ${email ? `<li><a href="mailto:${email}"><i class="fas fa-envelope"></i>${email}</a></li>` : ""}
        ${telephone ? `<li><a href="tel:${telephone}"><i class="fas fa-phone"></i>${telephone}</a></li>` : ""}
        </ul>
    </title>
  `;
};

const renderBasics = (person: Person) => {
  const { description, knowsAbout, skills, knowsLanguage } = person;
  const certs = certifications(person);
  return `
    <section>
      <h2>Professional Summary</h2>
      ${description ? `<p>${description}</p>` : ""}
      <div class="grid">
      ${
        knowsAbout && knowsAbout.length
          ? `
        <section>
          <h2>Core Compentencies</h2>
          <ul>${knowsAbout.map((area: string) => `<li>${area}</li>`).join("\n")}</ul>        
        </section>
      `
          : ""
      }
      ${
        skills && skills.length
          ? `
        <section>
          <h2>Technical Skills</h2>
          <ul>${skills.map((skill: string) => `<li>${skill}</li>`).join("\n")}</ul>        
        </section>
        `
          : ""
      }
      ${
        knowsLanguage && knowsLanguage.length
          ? `
        <section>
          <h2>Languages</h2>
          <ul>${knowsLanguage.map((language: string) => `<li>${language}</li>`).join("\n")}</ul>
        </section>
         `
          : ""
      }
      ${
        certs && certs.length
          ? `
        <section>
          <h2>Certifications</h2>
          <ul>${certs.map((cert: any) => `<li>${cert.name}</li>`).join("\n")}</ul>
        </section>
        `
          : ""
      }
      </div>
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
  const period = () => {
    if (startDate || endDate) {
      return `
        ${startDate ? `<time datetime="${startDate}">${startDate}</time>` : ""}
        ${endDate ? ` <time datetime="${endDate}">${endDate}</time>` : "present"}
    `;
    }
  };
  const caption = () => {
    const span = period();
    return `
        ${name ? `<h3>${name}</h3>` : ""}
        <ul class="caption">
          ${roleName ? `<li>${roleName}</li>` : ""}
          ${span ? `<li>${span}</li>` : ""}
          ${location ? ` <li>${location}</li>` : ""}
        </ul>
      `;
  };
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
        <h2>Life Events</h2>
        <div>
            ${lifeEvent
              .map(
                (event: any) =>
                  `
                <article>
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
                </article>
            `
              )
              .join("\n")}
        </div>
      </section>
    `
    : "";
};
