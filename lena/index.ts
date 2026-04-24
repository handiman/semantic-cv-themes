import { Theme } from "../theme.js";
import { HTMLTransformer } from "../htmlTransformer.js";
import { FaIconFactory, normalizeArray } from "../utils.js";
import Person, { projects, certifications, work, education, period } from "../person.js";
import { ThemeTags } from "../themeTags.js";

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
    super(LenaTheme.id, loadAsset);
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
    const { transformer } = this;

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
        main.append(renderRoles("Featured projects", projects(person)), html);
        main.append(renderRoles("Professional experience", work(person)), html);
        main.append(renderRoles("Education", education(person)), html);
        main.append(renderLifeEvents(person), html);
      }
    });

    transformer.on("aside", {
      element(aside: any) {
        aside.append(renderContact(person), html);
        aside.append(renderKnowsAbout(person), html);
        aside.append(renderSkills(person), html);
        aside.append(renderLanguages(person), html);
        aside.append(renderCertifications(person), html);
      }
    });

    return await transformer.transform(`
        <div class="page">
            <header></header>
            <main></main>
            <aside></aside>
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

const renderLifeEvents = (person: any) => {
  const { lifeEvent } = person;
  return lifeEvent && lifeEvent.length
    ? `
    <section>
      <h2>Life events</h2>
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

const renderContact = (person: any) => {
  const { email, telephone, url, sameAs } = person;
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
        <h2>Contact Details</h2>
        <ul>${links.map((link: string) => `<li><a href="${link}" title="${link}">${iconFactory.faIcon(link)}<span>${linkText(link)}</span></a></li>`).join("")}</ul>
      </section>
        `
    : "";
};

const renderKnowsAbout = (person: any) => {
  const { knowsAbout } = person;
  return knowsAbout && knowsAbout.length
    ? `
    <section>
      <h2>Core Competencies</h2>
      <ul>${knowsAbout.map((area: string) => `<li>${area}</li>`).join("")}</ul>
    </section>
  `
    : "";
};

const renderSkills = (person: any) => {
  const { skills } = person;
  return skills && skills.length
    ? `
    <section>
      <h2>Skills</h2>
      <ul>${skills.map((skill: string) => `<li>${skill}</li>`).join("")}</ul>
    </section>
    `
    : "";
};

const renderLanguages = (person: any) => {
  const { knowsLanguage } = person;
  return knowsLanguage && knowsLanguage.length
    ? `
    <section>
      <h2>Languages</h2>
      <ul>${knowsLanguage.map((language: string) => `<li>${language}</li>`).join("")}</ul>
    </section>
    `
    : "";
};

const renderCertifications = (person: any) => {
  const certs = certifications(person);
  return certs && certs.length
    ? `
    <section>
      <h2>Certifications</h2>
      <ul>${certs.map((cert: any) => `<li>${cert.name}</li>`).join("")}</ul>
    </section>
    `
    : "";
};
