import { Theme, html } from "../theme.js";
import Person, { projects, certifications, work, education } from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeMetadata } from "../themeMetadata.js";
import { IconFactory, icon } from "../icons.js";
import { linkText, locationText, normalizeArray } from "../utils.js";

export class BoilingDieselTheme extends Theme {
  static readonly meta: ThemeMetadata = {
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
      .on("header .job-title", {
        element(p: any) {
          const { jobTitle } = person;
          if (jobTitle) {
            p.replace(`<p class="job-title">${jobTitle}</p>`, html);
          } else {
            p.remove();
          }
        }
      })
      .on("header .description", {
        element(div: any) {
          const { description, email, telephone, url, sameAs, workLocation } = person;
          const iconFactory = new IconFactory(person);
          const links = normalizeArray(
            email ? `mailto:${email}` : undefined,
            telephone ? `tel:${telephone}` : undefined,
            url,
            sameAs
          );
          const location = locationText(workLocation);
          if (!description && !links.length && !location) {
            div.remove();
            return;
          }
          if (description) {
            // Already HTML-escaped by semantic-cv-core; insert as HTML so it
            // isn't escaped twice.
            div.append(description, html);
          }
          if (links.length || location) {
            div.append(
              `
                <ul>
                  ${location ? `<li><a>${icon("location")}<span>${location}</span></a></li>` : ""}
                  ${links.map((link: string) => `<li><a href="${link}">${iconFactory.icon(link)}<span>${linkText(link)}</span></a></li>`).join("\n")}
                </ul>
              `,
              html
            );
          }
        }
      });

    const basics = [
      renderKnowsAbout(knowsAbout),
      renderSkills(skills),
      renderKnowsLanguage(knowsLanguage),
      renderCertifications(certifications(person))
    ].join("");

    transformer.on("main", {
      element(main: any) {
        if (basics.trim()) {
          main.append(`<div><div class="grid">${basics}</div></div>`, html);
        }
        main.append(renderWorksFor(work(person)), html);
        main.append(renderProjects(projects(person)), html);
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
                      <p class="job-title"></p>
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
