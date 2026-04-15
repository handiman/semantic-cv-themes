import { Theme } from "../theme.js";
import { HTMLTransformer } from "../htmlTransformer.js";
import { FaIconFactory, normalizeArray } from "../utils.js";
import Person, { projects, certifications, work, education } from "../person.js";

const html = { html: true };

export class TimesTheme extends Theme {
  constructor(
    private transformer: HTMLTransformer,
    loadAsset: (assetName: string) => Promise<string>
  ) {
    super(TimesTheme.id, loadAsset);
  }

  static get id() {
    return "times";
  }

  renderJS(_person: Person) {
    return Promise.resolve("");
  }

  renderHTML(person: Person): Promise<string> {
    const { transformer } = this;
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
        el.append(renderBasics(person), html);
        el.append(renderProjects(person), html);
        el.append(renderWork(person), html);
        el.append(renderEducation(person), html);
        el.append(renderLifeEvents(person), html);
      }
    });

    return transformer.transform(`<main><div></div></main>`);
  }
}

const renderBasics = (person: Person) => {
  const { description } = person;
  return `
    <section>
        <h2 class="pirata-one-regular">Professional Summary</h2>
        ${description ? `<p>${description}</p>` : ""}
    </section>
    <section id="basics">
        ${renderKnowsAbout(person)}
        ${renderSkills(person)}
        ${renderLanguages(person)}
        ${renderCerts(person)}
    </section>
  `;
};

const renderKnowsAbout = (person: Person) => {
  const { knowsAbout } = person;
  return knowsAbout && knowsAbout.length
    ? `
    <article>
        <h2>Expertise</h2>
        <ul>${knowsAbout.map((area: string) => `<li>${area}</li>`).join("\n")}</ul>
    </article>
  `
    : "";
};

const renderSkills = (person: Person) => {
  const { skills } = person;
  return skills && skills.length
    ? `
    <article>
        <h2>Skills</h2>
        <ul>${skills.map((skill: string) => `<li>${skill}</li>`).join("\n")}</ul>
    </article>
  `
    : "";
};

const renderLanguages = (person: Person) => {
  const { knowsLanguage } = person;
  return knowsLanguage && knowsLanguage.length
    ? `
    <article>
        <h2>Languages</h2>
        <ul>${knowsLanguage.map((language: string) => `<li>${language}</li>`).join("\n")}</ul>    
    </article>
  `
    : "";
};

const renderCerts = (person: Person) => {
  const certs = certifications(person);
  return certs && certs.length
    ? `
    <article>
        <h2>Certifications</h2>
        <ul>${certs.map((cert: any) => `<li>${cert.name}</li>`).join("\n")}</ul>    
    </article>
    `
    : "";
};

const renderWork = (person: Person) => renderRoles("Professional Experience", "work", work(person));

const renderEducation = (person: Person) =>
  renderRoles("Education", "education", education(person));

const renderProjects = (person: Person) => renderRoles("Projects", "projects", projects(person));

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

const renderLifeEvents = (person: Person) => {
  const { lifeEvent } = person;
  if (lifeEvent && lifeEvent.length) {
    return `
        <section>
            <h2 class="pirata-one-regular">Life Events</h2>
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
