import { Theme } from "../theme.js";
import { HTMLTransformer } from "../htmlTransformer.js";
import Person, { projects, certifications, work, education } from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeMetadata } from "../themeMetadata.js";
import fa, { FaIconFactory } from "../fontawesome.js";
import { linkText, locationText, normalizeArray } from "../utils.js";

const meta = {
  id: "boiling-diesel",
  title: "Boiling Diesel",
  description:
    "A bold, high‑contrast dark theme built for technical résumés that want a strong, confident presence.",
  tags: [
    ThemeTags.twoCol,
    ThemeTags.resume,
    ThemeTags.darkMode,
    ThemeTags.highContrast,
    ThemeTags.technical,
    ThemeTags.bold
  ]
};

const html = { html: true };

export class BoilingDieselTheme extends Theme {
  constructor(
    private transformer: HTMLTransformer,
    loadAsset: (_: string) => Promise<string>,
    metadata?: ThemeMetadata
  ) {
    super(loadAsset, metadata ?? meta);
  }

  static get meta(): ThemeMetadata {
    return meta;
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
            `<link rel="stylesheet" href="${fa}" />\n`,
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
          const { description, email, telephone, url, sameAs, workLocation } = person;
          if (description) {
            // Already HTML-escaped by semantic-cv-core; insert as HTML so it
            // isn't escaped twice.
            div.append(description, html);
          }
          const iconFactory = new FaIconFactory(person);
          const links = normalizeArray(
            email ? `mailto:${email}` : undefined,
            telephone ? `tel:${telephone}` : undefined,
            url,
            sameAs
          );
          const location = locationText(workLocation);
          if (links.length || location) {
            div.append(
              `
                <ul>
                  ${location ? `<li><a><i class="fas fa-location-dot"></i><span>${location}</span></a></li>` : ""}
                  ${links.map((link: string) => `<li><a href="${link}">${iconFactory.faIcon(link)}<span>${linkText(link)}</span></a></li>`).join("\n")}
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
      <div class="page">
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
