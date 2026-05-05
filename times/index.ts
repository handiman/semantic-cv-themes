import { Theme, titleify } from "../theme.js";
import { HTMLTransformer } from "../htmlTransformer.js";
import { FaIconFactory, normalizeArray } from "../utils.js";
import Person, { projects, certifications, work, education } from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeOptions } from "#themes/themeOptions.js";

const id = "times";
const description =
  "A playful newspaper‑inspired résumé with an editorial layout and a subtle sense of humor.";
const tags = [
  ThemeTags.twoCol,
  ThemeTags.lightMode,
  ThemeTags.editorial,
  ThemeTags.typographyForward,
  ThemeTags.playful
];

const html = { html: true };

export class TimesTheme extends Theme {
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

  renderJS(_person: Person) {
    return Promise.resolve("");
  }

  renderHTML(person: Person): Promise<string> {
    const { transformer, options } = this;
    const iconFactory = new FaIconFactory(person);
    const renderSocial = () => {
      const { sameAs, url, email, telephone } = person;
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
      const { name, jobTitle } = person;
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
        el.append(renderBasics(person, options), html);
        el.append(renderProjects(person, options), html);
        el.append(renderWork(person, options), html);
        el.append(renderEducation(person, options), html);
        el.append(renderLifeEvents(person, options), html);
      }
    });

    return transformer.transform(`<main><div></div></main>`);
  }
}

const renderBasics = (person: Person, options: ThemeOptions) => {
  const { description } = person;
  const { headings } = options;
  return `
    <section>
        <h2 class="pirata-one-regular">${headings.description}</h2>
        ${description ? `<p>${description}</p>` : ""}
    </section>
    <section id="basics">
        ${renderKnowsAbout(person, options)}
        ${renderSkills(person, options)}
        ${renderLanguages(person, options)}
        ${renderCerts(person, options)}
    </section>
  `;
};

const renderKnowsAbout = (person: Person, options: ThemeOptions) => {
  const { knowsAbout } = person;
  const { headings } = options;
  return knowsAbout && knowsAbout.length
    ? `
    <article>
        <h2>${headings.knowsAbout}</h2>
        <ul>${knowsAbout.map((area: string) => `<li>${area}</li>`).join("\n")}</ul>
    </article>
  `
    : "";
};

const renderSkills = (person: Person, options: ThemeOptions) => {
  const { skills } = person;
  const { headings } = options;
  return skills && skills.length
    ? `
    <article>
        <h2>${headings.skills}</h2>
        <ul>${skills.map((skill: string) => `<li>${skill}</li>`).join("\n")}</ul>
    </article>
  `
    : "";
};

const renderLanguages = (person: Person, options: ThemeOptions) => {
  const { knowsLanguage } = person;
  const { headings } = options;
  return knowsLanguage && knowsLanguage.length
    ? `
    <article>
        <h2>${headings.knowsLanguage}</h2>
        <ul>${knowsLanguage.map((language: string) => `<li>${language}</li>`).join("\n")}</ul>    
    </article>
  `
    : "";
};

const renderCerts = (person: Person, options: ThemeOptions) => {
  const certs = certifications(person);
  const { headings } = options;
  return certs && certs.length
    ? `
    <article>
        <h2>${headings.certifications}</h2>
        <ul>${certs.map((cert: any) => `<li>${cert.name}</li>`).join("\n")}</ul>    
    </article>
    `
    : "";
};

const renderWork = (person: Person, options: ThemeOptions) =>
  renderRoles(options.headings.worksFor, "work", work(person));

const renderEducation = (person: Person, options: ThemeOptions) =>
  renderRoles(options.headings.alumniOf, "education", education(person));

const renderProjects = (person: Person, options: ThemeOptions) =>
  renderRoles(options.headings.projects, "projects", projects(person));

const renderRoles = (heading: string, id: string, roles: Array<any>) =>
  roles && roles.length
    ? `
    <section>
      <h2 class="pirata-one-regular">${heading}</h2>
      <div id="${id}">
        ${roles.map(renderRole).join("\n")}
      </div>  
    </section>
    `
    : "";

function renderRole(role: any) {
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
}

const renderLifeEvents = (person: Person, options: ThemeOptions) => {
  const { lifeEvent } = person;
  const { headings } = options;
  if (lifeEvent && lifeEvent.length) {
    return `
        <section>
            <h2 class="pirata-one-regular">${headings.lifeEvent}</h2>
            <div id="events">
                ${lifeEvent
                  .map(
                    (event: any) => `
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
    `;
  }
  return "";
};
