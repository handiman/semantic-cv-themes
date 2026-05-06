import { Theme } from "../theme.js";
import { HTMLTransformer } from "../htmlTransformer.js";
import Person, { projects, certifications, work, education } from "../person.js";
import { FaIconFactory, normalizeArray } from "../utils.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeOptions } from "../themeOptions.js";

const id = "winter";
const title = "Winter";
const description = "A crisp, cool, spacious layout with bright whites and clean structure.";
const tags = [
  ThemeTags.twoCol,
  ThemeTags.headshot,
  ThemeTags.lightMode,
  ThemeTags.cool,
  ThemeTags.resume
];

const html = { html: true };

export class WinterTheme extends Theme {
  constructor(
    private transformer: HTMLTransformer,
    loadAsset: (assetName: string) => Promise<string>
  ) {
    super(id, loadAsset, title, description);
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

  renderJS(_: Person): Promise<string> {
    return Promise.resolve("");
  }

  renderHTML(person: Person): Promise<string> {
    const { transformer, options } = this;

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
        main.append(renderBasics(person, options), html);
        main.append(renderProjects(person, options), html);
        main.append(renderWork(person, options), html);
        main.append(renderEducation(person, options), html);
        main.append(renderLifeEvents(person, options), html);
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

const renderBasics = (person: Person, options: ThemeOptions) => {
  const { description, knowsAbout, skills, knowsLanguage } = person;
  const { headings } = options;
  const certs = certifications(person);
  return `
    <section>
      <h2>${headings.description}</h2>
      ${description ? `<p>${description}</p>` : ""}
      <div class="grid">
      ${
        knowsAbout && knowsAbout.length
          ? `
        <section>
          <h2>${headings.knowsAbout}</h2>
          <ul>${knowsAbout.map((area: string) => `<li>${area}</li>`).join("\n")}</ul>        
        </section>
      `
          : ""
      }
      ${
        skills && skills.length
          ? `
        <section>
          <h2>${headings.skills}</h2>
          <ul>${skills.map((skill: string) => `<li>${skill}</li>`).join("\n")}</ul>        
        </section>
        `
          : ""
      }
      ${
        knowsLanguage && knowsLanguage.length
          ? `
        <section>
          <h2>${headings.knowsLanguage}</h2>
          <ul>${knowsLanguage.map((language: string) => `<li>${language}</li>`).join("\n")}</ul>
        </section>
         `
          : ""
      }
      ${
        certs && certs.length
          ? `
        <section>
          <h2>${headings.certifications}</h2>
          <ul>${certs.map((cert: any) => `<li>${cert.name}</li>`).join("\n")}</ul>
        </section>
        `
          : ""
      }
      </div>
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

const renderLifeEvents = (person: Person, options: ThemeOptions) => {
  const { lifeEvent } = person;
  const { headings } = options;
  return lifeEvent && lifeEvent.length
    ? `
      <section>
        <h2>${headings.lifeEvent}</h2>
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
