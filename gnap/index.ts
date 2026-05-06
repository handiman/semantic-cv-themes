import { Theme } from "../theme.js";
import { HTMLTransformer } from "../htmlTransformer.js";
import { FaIconFactory } from "../utils.js";
import Person, { projects, certifications, work, education } from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeOptions } from "#themes/themeOptions.js";

const id = "gnap";
const title = "GNAP!";
const description = "Smurf‑inspired black & white theme with splashes of green";
const tags = [
  ThemeTags.heroFullscreen,
  ThemeTags.darkMode,
  ThemeTags.monoChrome,
  ThemeTags.accented,
  ThemeTags.playful,
  ThemeTags.bold
];

const html = { html: true };

export class GnapTheme extends Theme {
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

  renderHTML(person: Person): Promise<string> {
    const { transformer, options } = this;

    transformer.on("head", {
      element(head: any) {
        head.append(
          `
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.9.0/css/all.min.css"  />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400;1,600;1,700;1,800&display=swap" />
          `,
          html
        );
      }
    });

    renderHeader(transformer, person);
    renderBasics(transformer, person, options);
    renderProjects(transformer, person, options);
    renderWork(transformer, person, options);
    renderEducation(transformer, person, options);
    renderCertificates(transformer, person, options);
    renderLifeEvents(transformer, person, options);
    renderFooter(transformer, person, options);
    renderMenu(transformer, person);

    return transformer.transform(`
        <main class="grey darken-4 white-text">
            <article class="white black-text">
                <header class="valign-wrapper grey darken-4 white-text">
                    <div class="container">
                    </div>
                </header>
                <section id="basics">
                    <div class="container">
                    </div>
                </section>
                <section id="projects">
                    <div class="container">
                    </div>
                </section>
                <section id="work">
                    <div class="container">
                    </div>
                </section>
                <section id="education">
                    <div class="container">
                    </div>
                </section>
                <section id="certificates">
                    <div class="container">
                    </div>
                </section>
                <section id="events">
                    <div class="container">
                    </div>
                </section>                    
            </article>
            <footer class="grey darken-4 white-text no-print">
                <div class="container">
                </div>
            </footer>
            <div class="menu" role="navigation" aria-label="primary">
            </div>
        </main>
    `);
  }

  renderJS(_: any) {
    return Promise.resolve("");
  }
}

const renderHeader = (transformer: HTMLTransformer, person: Person) => {
  const { name, jobTitle, telephone } = person;
  transformer.on("main article header .container", {
    element(el: any) {
      el.append(
        `        
        <div class="no-print">Hi, I'm</div>
        <h1>${name ?? ""}</h1>
        ${jobTitle ? `<h4 class="job-title" id="job-title">${jobTitle}</h4>` : ""}
        ${telephone ? `<div class="print"><i class="fas fa-phone"></i> ${telephone}</div>` : ""}
      `,
        html
      );
    }
  });
};

const renderBasics = (transformer: HTMLTransformer, person: Person, options: ThemeOptions) => {
  const { knowsLanguage, knowsAbout, skills, description } = person;
  const { headings } = options;
  const renderSummary = () => {
    if (description) {
      return `
        <div id="summary">
            <h2>${headings.description}</h2>
            ${description ? `<div>${description}</div>` : ""}
        </div>
      `;
    }
    return "";
  };
  const renderSkills = () => {
    return `
        <div id="skills">
            <h2>${headings.knowsAbout} & ${headings.skills}</h2>
            <div>
              ${
                knowsAbout && knowsAbout.length
                  ? `
                  <div>
                    <h3>Core</h3>
                    <ul>${knowsAbout.map((item: string) => `<li>${item}</li>`).join("\n")}</ul>
                  </div>`
                  : ""
              }
              ${
                skills && skills.length
                  ? `
                  <div>
                    <h3>Tech</h3>
                    <ul>${skills.map((item: string) => `<li>${item}</li>`).join("\n")}</ul>
                  </div>`
                  : ""
              }
            </div>
        </div>
    `;
  };

  const renderLanguages = () => {
    if (knowsLanguage && knowsLanguage.length) {
      return `
            <div id="languages">
                <h2>${headings.knowsLanguage}</h2>
                <ul class="languages">
                    ${knowsLanguage
                      .map(
                        (language: string) => `<li>
                        ${language}
                    </li>`
                      )
                      .join("\n")}
                </ul>
            </div>    
            `;
    }
    return "";
  };

  transformer.on("#basics .container", {
    element(el: any) {
      el.append(
        `
            ${renderSummary()}
            ${renderSkills()}
            ${renderLanguages()}
        `,
        html
      );
    }
  });
};

const renderProjects = (transformer: HTMLTransformer, person: Person, options: ThemeOptions) => {
  const { headings } = options;
  const proj = projects(person);
  if (proj && proj.length) {
    transformer.on("#projects .container", {
      element(el: any) {
        el.append(
          `
          <h2>${headings.projects}</h2>
          <ul>
          ${proj.map((role: any) => `<li>${experience(role)}</li>`).join("")}
          </ul>
        `,
          html
        );
      }
    });
  }
};

const experience = (role: any) => {
  const { roleName, startDate, endDate, description, worksFor, alumniOf } = role;
  const { name, _location } = worksFor ?? alumniOf;
  const period = () => {
    if (startDate || endDate) {
      return `
        ${startDate ? `<time datetime="${startDate}">${startDate}</time>` : ""}
        ${endDate ? ` <time datetime="${endDate}">${endDate}</time>` : "present"}
      `;
    }
    return "";
  };

  return `
    <h4>${name}</h4>
    <div class="caption">
        ${roleName ? `<span>${roleName}</span>` : ""}
        ${period()}
    </div>
    ${description ? `<ul><li>${description}</li></ul>` : ""}
  `;
};

const renderWork = (transformer: HTMLTransformer, person: Person, options: ThemeOptions) => {
  const worksFor = work(person);
  const { headings } = options;
  if (worksFor && worksFor.length) {
    transformer.on("#work .container", {
      element(el: any) {
        el.append(
          `
          <h2>${headings.worksFor}</h2>
          <ul>
          ${worksFor.map((role: any) => `<li>${experience(role)}</li>`).join("")}
          </ul>
        `,
          html
        );
      }
    });
  }
};

const renderEducation = (transformer: HTMLTransformer, person: Person, options: ThemeOptions) => {
  const alumniOf = education(person);
  const { headings } = options;
  if (alumniOf && alumniOf.length) {
    transformer.on("#education .container", {
      element(el: any) {
        el.append(
          `
          <h2>${headings.alumniOf}</h2>
          <ul>
          ${alumniOf.map((role: any) => `<li>${experience(role)}</li>`).join("")}
          </ul>
        `,
          html
        );
      }
    });
  }
};

const renderCertificates = (
  transformer: HTMLTransformer,
  person: Person,
  options: ThemeOptions
) => {
  const certs = certifications(person);
  const { headings } = options;
  if (certs && certs.length > 0) {
    transformer.on("#certificates .container", {
      element(el: any) {
        el.append(
          `
            <h2>${headings.certifications}</h2>
            <ul>${certs
              .map(
                (cert) => `
                <li>
                    <h4>${cert.name}</h4>
                </li>`
              )
              .join("")}
            </ul>
        `,
          html
        );
      }
    });
  }
};

const renderLifeEvents = (transformer: HTMLTransformer, person: Person, options: ThemeOptions) => {
  const { lifeEvent } = person;
  const { headings } = options;
  transformer.on("#events .container", {
    element(el: any) {
      if (lifeEvent && lifeEvent.length) {
        el.append(
          `
            <h2>${headings.lifeEvent}</h2>
            <ul>${lifeEvent
              .map(
                (event: any) => `
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
              .join("")}</ul>
        `,
          html
        );
      } else {
        el.remove();
      }
    }
  });
};

const social = (person: Person) => {
  const iconFactory = new FaIconFactory(person);
  const { sameAs, url, email, telephone } = person;
  let links = [...(sameAs ?? [])];
  if (url) {
    links.push(url);
  }
  if (email) {
    links.push(`mailto:${email}`);
  }
  if (telephone) {
    links.push(`tel:${telephone}`);
  }
  if (links.length > 0) {
    return `<ul class="social">${links.map((url) => `<li><a href="${url}">${iconFactory.faIcon(url)}</a></li>`).join("\n")}</ul>`;
  }
};

const renderFooter = (transformer: HTMLTransformer, person: Person, options: ThemeOptions) => {
  const { lifeEvent } = person;
  const { headings } = options;

  transformer.on("footer .container", {
    element(footer: any) {
      footer.append(
        `
        <ul class="row center inline inline-delimited">
            <li><a href="#basics">${headings.description}</a></li>
            <li><a href="#skills">${headings.skills}</a></li>
            <li><a href="#work">${headings.worksFor}</a></li>
            ${lifeEvent && lifeEvent.length ? `<li><a href="#events">${headings.lifeEvent}</a></li>` : ""}
        </ul>
        <div class="row center">
          ${social(person)}
        </div>
      `,
        html
      );
    }
  });
};

const renderMenu = (transformer: HTMLTransformer, person: Person) => {
  transformer.on(".menu", {
    element(menu: any) {
      menu.append(`<div>${social(person) ?? ""}</div>`, html);
    }
  });
};
