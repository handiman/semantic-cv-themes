import { Theme } from "../theme.js";
import { HTMLTransformer } from "../htmlTransformer.js";
import { FaIconFactory } from "../utils.js";
import Person, { projects, certifications, work, education } from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeMetadata } from "#themes/themeMetadata.js";

const meta = {
  id: "gnap",
  title: "GNAP!",
  description: "Smurf‑inspired black & white theme with splashes of green",
  tags: [
    ThemeTags.heroFullscreen,
    ThemeTags.darkMode,
    ThemeTags.monoChrome,
    ThemeTags.accented,
    ThemeTags.playful,
    ThemeTags.bold
  ]
};

const html = { html: true };

export class GnapTheme extends Theme {
  constructor(
    private transformer: HTMLTransformer,
    loadAsset: (assetName: string) => Promise<string>
  ) {
    super(loadAsset, meta);
  }

  static get meta(): ThemeMetadata {
    return meta;
  }

  renderHTML(person: Person): Promise<string> {
    const {
      transformer,
      options,
      renderLifeEvents,
      renderKnowsLanguage,
      renderKnowsAbout,
      renderSkills,
      renderCertifications,
      renderWorksFor,
      renderAlumniOf,
      renderProjects
    } = this;
    const { headings } = options;
    const { name, description, jobTitle, telephone, lifeEvent, knowsLanguage, knowsAbout, skills } =
      person;

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

    transformer.on("#basics .container", {
      element(el: any) {
        el.append(
          `
            ${renderSummary()}
            <div id="knowledgeGrid">
              <div>
                ${renderKnowsAbout(knowsAbout)}
                ${renderSkills(skills)}
                ${renderKnowsLanguage(knowsLanguage)}          
              </div>
            </div>
        `,
          html
        );
      }
    });

    transformer.on("#projects .container", {
      element(el: any) {
        el.append(renderProjects(projects(person)), html);
      }
    });

    transformer.on("#work .container", {
      element(el: any) {
        el.append(renderWorksFor(work(person)), html);
      }
    });

    transformer.on("#education .container", {
      element(el: any) {
        el.append(renderAlumniOf(education(person)), html);
      }
    });

    transformer.on("#certificates .container", {
      element(el: any) {
        el.append(renderCertifications(certifications(person)), html);
      }
    });

    transformer.on("#events .container", {
      element(el: any) {
        el.append(renderLifeEvents(lifeEvent), html);
      }
    });

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

    transformer.on(".menu", {
      element(menu: any) {
        menu.append(`<div>${social(person) ?? ""}</div>`, html);
      }
    });

    return transformer.transform(`
        <main class="grey darken-4 white-text">
          <article class="white black-text">
            <header class="valign-wrapper grey darken-4 white-text">
              <div class="container"></div>
            </header>
            <section id="basics">
              <div class="container"></div>
            </section>
            <section id="projects">
              <div class="container"></div>
            </section>
            <section id="work">
              <div class="container"></div>
            </section>
            <section id="education">
              <div class="container"></div>
            </section>
            <section id="certificates">
              <div class="container"></div>
            </section>
            <section id="events">
              <div class="container"></div>
            </section>                    
          </article>
          <footer class="grey darken-4 white-text no-print">
            <div class="container"></div>
          </footer>
          <div class="menu" role="navigation" aria-label="primary"></div>
        </main>
    `);
  }

  renderJS(_: any) {
    return Promise.resolve("");
  }
}

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
