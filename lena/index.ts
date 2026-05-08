import { Theme, titleify } from "../theme.js";
import { HTMLTransformer } from "../htmlTransformer.js";
import { FaIconFactory, normalizeArray } from "../utils.js";
import Person, { projects, certifications, work, education, period } from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeOptions } from "../themeOptions.js";

const id = "lena";
const description =
  "A modern two‑column theme with clean typography, subtle accents, and a calm, well‑organized visual flow.";
const tags = [
  ThemeTags.twoCol,
  ThemeTags.headshot,
  ThemeTags.lightMode,
  ThemeTags.calm,
  ThemeTags.typographyForward,
  ThemeTags.photo
];
const html = { html: true };

export class LenaTheme extends Theme {
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

  async renderHTML(person: Person): Promise<string> {
    const { transformer, options } = this;
    const { headings } = options;

    transformer.on("head", {
      element(head: any) {
        head.prepend(
          `
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Display:ital,wght@0,100..900;1,100..900&family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.9.0/css/all.min.css"  />
          `,
          html
        );
      }
    });

    transformer.on("header", {
      element(header: any) {
        renderHeader(header, person);
      }
    });

    transformer.on("main", {
      element(main: any) {
        main.append(renderRoles(headings.projects, projects(person)), html);
        main.append(renderRoles(headings.worksFor, work(person)), html);
        main.append(renderRoles(headings.alumniOf, education(person)), html);
        main.append(renderLifeEvents(person, options), html);
      }
    });

    transformer.on("aside", {
      element(aside: any) {
        aside.append(renderContact(person, options), html);
        aside.append(renderKnowsAbout(person, options), html);
        aside.append(renderSkills(person, options), html);
        aside.append(renderLanguages(person, options), html);
        aside.append(renderCertifications(person, options), html);
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
  renderJS(_person: Person): Promise<string> {
    return Promise.resolve("");
  }
}

const renderRoles = (heading: string, roles: Array<any>) => {
  return roles && roles.length
    ? `
      <section>
        <h2>${heading}</h2>
        ${roles.map(renderRole).join("")}
      </section>
    `
    : "";
};

const renderRole = (role: any) => {
  const { roleName, startDate, endDate, description, worksFor, alumniOf } = role;
  const { name, location } = worksFor ?? alumniOf;
  const duration =
    startDate || endDate
      ? `
        ${startDate ? `<time datetime="${startDate}">${period(startDate)}</time>` : ""}
        ${endDate ? ` &hyphen; <time datetime="${endDate}">${period(endDate)}</time>` : "present"}
      `
      : undefined;
  return role
    ? `
    <article>
        ${name ? `<h3>${name}</h3>` : ""}
        <ul class="caption">
          ${roleName ? `<li>${roleName}</li>` : ""}
          ${duration ? `<li>${duration}</li>` : ""}
          ${location ? `<li>${location}</li>` : ""}
        </ul>
        ${description ? `<p>${description}</p>` : ""}
    </article>
  `
    : "";
};

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

const renderLifeEvents = (person: any, options: ThemeOptions) => {
  const { lifeEvent } = person;
  const { headings } = options;
  return lifeEvent && lifeEvent.length
    ? `
    <section>
      <h2>${headings.lifeEvent}</h2>
      ${lifeEvent.map(renderLifeEvent).join("")}
    </section>
    `
    : "";
};

const renderLifeEvent = (event: any) => {
  const { name, startDate, description } = event;
  const location = event.location ? event.location.name : undefined;
  return `
  <article>
    ${name ? `<h3>${name}</h3>` : ""}
    <ul class="caption">
      ${startDate ? `<li><time datetime="${startDate}">${period(startDate)}</time></li>` : ""}
      ${location ? `<li>${location}</li>` : ""}
    </ul>
    ${description ? `<p>${description}</p>` : ""}
  </article>
  `;
};

const renderContact = (person: any, options: ThemeOptions) => {
  const { email, telephone, url, sameAs } = person;
  const { headings } = options;
  const links = normalizeArray(
    sameAs,
    url,
    email ? `mailto:${email}` : undefined,
    telephone ? `tel:${telephone}` : undefined
  );
  const iconFactory = new FaIconFactory(person);
  const linkText = (url: string) => {
    if (url.indexOf("mailto:") > -1 || url.indexOf("tel:") > -1) {
      return url.substring(url.indexOf(":") + 1);
    }

    return url.substring(url.indexOf("://") + 3).replace("www.", "");
  };
  return links && links.length
    ? `
      <section>
        <h2>${headings.contact}</h2>
        <ul>${links.map((link: string) => `<li><a href="${link}" title="${link}">${iconFactory.faIcon(link)}<span>${linkText(link)}</span></a></li>`).join("")}</ul>
      </section>
        `
    : "";
};

const renderKnowsAbout = (person: any, options: ThemeOptions) => {
  const { knowsAbout } = person;
  const { headings } = options;
  return knowsAbout && knowsAbout.length
    ? `
    <section>
      <h2>${headings.knowsAbout}</h2>
      <ul>${knowsAbout.map((area: string) => `<li>${area}</li>`).join("")}</ul>
    </section>
  `
    : "";
};

const renderSkills = (person: any, options: ThemeOptions) => {
  const { skills } = person;
  const { headings } = options;
  return skills && skills.length
    ? `
    <section>
      <h2>${headings.skills}</h2>
      <ul>${skills.map((skill: string) => `<li>${skill}</li>`).join("")}</ul>
    </section>
    `
    : "";
};

const renderLanguages = (person: any, options: ThemeOptions) => {
  const { knowsLanguage } = person;
  const { headings } = options;
  return knowsLanguage && knowsLanguage.length
    ? `
    <section>
      <h2>${headings.knowsLanguage}</h2>
      <ul>${knowsLanguage.map((language: string) => `<li>${language}</li>`).join("")}</ul>
    </section>
    `
    : "";
};

const renderCertifications = (person: any, options: ThemeOptions) => {
  const certs = certifications(person);
  const { headings } = options;
  return certs && certs.length
    ? `
    <section>
      <h2>${headings.certifications}</h2>
      <ul>${certs.map((cert: any) => `<li>${cert.name}</li>`).join("")}</ul>
    </section>
    `
    : "";
};
