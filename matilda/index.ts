import { Theme, titleify } from "../theme.js";
import { HTMLTransformer } from "../htmlTransformer.js";
import { FaIconFactory, normalizeArray } from "../utils.js";
import Person, { projects, certifications, work, education } from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeOptions } from "../themeOptions.js";

const id = "matilda";
const description =
  "A soft, pastel‑toned two‑column theme with gentle typography and a friendly, editorial touch.";
const tags = [
  ThemeTags.twoCol,
  ThemeTags.headshot,
  ThemeTags.lightMode,
  ThemeTags.pastel,
  ThemeTags.resume,
  ThemeTags.technical
];
const html = { html: true };

export class MatildaTheme extends Theme {
  constructor(
    private transformer: HTMLTransformer,
    loadAsset: (_: string) => Promise<string>
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

    renderAside(transformer, person, options);
    renderMain(transformer, person, options);

    return transformer.transform(`
      <div class="desktop">
        <div class="cv">
          <aside></aside>
          <main></main>
        </div>
      </div>
    `);
  }
}

const renderAside = (transformer: HTMLTransformer, person: Person, options: ThemeOptions) => {
  const iconFactory = new FaIconFactory(person);
  const { image, name, email, telephone, url, sameAs } = person;
  const { headings } = options;
  const contactDetails = () => {
    const linkText = (url: string) => {
      if (url.indexOf("mailto:") > -1 || url.indexOf("tel:") > -1) {
        return url.substring(url.indexOf(":") + 1);
      }

      const text = url.substring(url.indexOf("://") + 3).replace("www.", "");
      return text.length > 26 ? text.substring(0, 25) + "…" : text;
    };
    const links = normalizeArray(
      sameAs,
      url,
      email ? `mailto:${email}` : undefined,
      telephone ? `tel:${telephone}` : undefined
    );
    return links.length
      ? `
          <section>
            <h2>${headings.contact}</h2>
            <ul>${links.map((link: string) => `<li><a href="${link}" title="${link}"><span>${linkText(link)}</span>${iconFactory.faIcon(link)}</a></li>`).join("")}</ul>
          </section>
        `
      : "";
  };

  transformer.on("aside", {
    element(aside: any) {
      if (image) {
        aside.append(
          `
            <section class="photo"><img src="${image}" alt="${name ?? ""}" /></section>
            ${header(person)}
            ${contactDetails()}
            ${knowsAbout(person, options)}
            ${skills(person, options)}
            ${languages(person, options)}
            ${renderCertifications(person, options)}
            `,
          html
        );
      }
    }
  });
};

const header = (person: any) => {
  const { name, jobTitle } = person;
  return `
    <header>
      <div><h1>${name ?? ""}</h1></div>
      <div>${jobTitle ?? ""}</div>
    </header>
  `;
};

const knowsAbout = (person: Person, options: ThemeOptions) => {
  const { knowsAbout } = person;
  const { headings } = options;
  if (knowsAbout && knowsAbout.length) {
    return `
    <section>
        <h2>${headings.knowsAbout}</h2>
        <ul>${knowsAbout.map((item: string) => `<li>${item}</li>`).join("")}</ul>
    </section>
    `;
  }
  return "";
};

const skills = (person: Person, options: ThemeOptions) => {
  const { skills } = person;
  const { headings } = options;
  if (skills && skills.length) {
    return `
      <section>
        <h2>${headings.skills}</h2>
        <ul>${skills.map((item: string) => `<li>${item}</li>`).join("")}</ul>
      </section>
    `;
  }
  return "";
};

const languages = (person: Person, options: ThemeOptions) => {
  const { knowsLanguage } = person;
  const { headings } = options;
  if (knowsLanguage && knowsLanguage.length) {
    return `
      <section>
        <h2>${headings.knowsLanguage}</h2>
        <ul>${knowsLanguage.map((language: string) => `<li>${language}</li>`).join("")}</ul>
      </section>
    `;
  }
  return "";
};

const renderCertifications = (person: Person, options: ThemeOptions) => {
  const certs = certifications(person);
  const { headings } = options;
  if (certs && certs.length) {
    return `
      <section>
        <h2>${headings.certifications}</h2>
        <ul>${certs.map((cert) => `<li>${cert.name}</li>`).join("")}</ul>
      </section>
    `;
  }
  return "";
};

const renderMain = (transformer: HTMLTransformer, person: Person, options: ThemeOptions) => {
  transformer.on("main", {
    element(main: any) {
      main.append(
        `
        ${header(person) ?? ""}
        ${renderDescription(person, options) ?? ""}
        ${renderProjects(person, options) ?? ""}
        ${renderWork(person, options) ?? ""}
        ${renderEducation(person, options) ?? ""}
        ${lifeEvents(person, options) ?? ""}
        `,
        html
      );
    }
  });
};

const renderDescription = (person: Person, options: ThemeOptions) => {
  const { description } = person;
  const { headings } = options;
  return description
    ? `
      <section>
        <h2${headings.description}</h2>
        <div>${description}</div>
      </section>
    `
    : "";
};

const renderProjects = (person: Person, options: ThemeOptions) =>
  experiences(options.headings.projects, projects(person));
const renderWork = (person: Person, options: ThemeOptions) =>
  experiences(options.headings.worksFor, work(person));
const renderEducation = (person: Person, options: ThemeOptions) =>
  experiences(options.headings.alumniOf, education(person));

const lifeEvents = (person: Person, options: ThemeOptions) => {
  const { lifeEvent } = person;
  const { headings } = options;
  if (lifeEvent && lifeEvent.length) {
    return `
    <section class="life-events">
      <h2>${headings.lifeEvent}</h2>
      <ul>${lifeEvent
        .map(
          (e: any) => `
        <li>
          <div>
            ${e.name ? `<h3>${e.name}</h3>` : ""}
            ${e.startDate ? `<time datetime="${e.startDate}">${e.startDate}</time>` : ""}
            ${e.location && e.location.name ? `<span>${e.location.name}</span>` : ""}
          </div>
        </li>`
        )
        .join("")}
      </ul>
    </section>
    `;
  }
};

const experiences = (heading: string, roles: Array<any>) => {
  if (roles && roles.length) {
    return `<section>
      <h2>${heading}</h2>
      ${roles.map(experience).join("")}
    </section>`;
  }
};

const experience = (role: any) => {
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
