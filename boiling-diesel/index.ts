import { Theme, titleify } from "../theme.js";
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
    super(id, loadAsset, titleify(id), description);
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
    const {
      transformer,
      renderProjects,
      renderWorksFor,
      renderAlumniOf,
      renderLifeEvents,
      renderKnowsAbout,
      renderSkills,
      renderKnowsLanguage,
      renderCertifications
    } = this;
    const { knowsAbout, skills, knowsLanguage, lifeEvent } = person;

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

    transformer.on("main", {
      element(main: any) {
        main.append(
          `
            <div>
              <div class="grid">
                ${renderKnowsAbout(knowsAbout)}
                ${renderSkills(skills)}
                ${renderKnowsLanguage(knowsLanguage)}
                ${renderCertifications(certifications(person))}
              </div>
            </div>
          `,
          html
        );
        main.append(renderProjects(projects(person)), html);
        main.append(renderWorksFor(work(person)), html);
        main.append(renderAlumniOf(education(person)), html);
        main.append(renderLifeEvents(lifeEvent ?? []), html);
      }
    });

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
