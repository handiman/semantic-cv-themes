import { Theme, html } from "../theme.js";
import Person, { projects, certifications, work, education } from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { linkText, locationText, normalizeArray } from "../utils.js";
import { ThemeMetadata } from "../themeMetadata.js";

export class TypewriterTheme extends Theme {
  static readonly meta: ThemeMetadata = {
    id: "typewriter",
    title: "Typewriter",
    description:
      "A retro, monochrome résumé styled like a typewritten page. Charmingly imperfect and intentionally quirky.",
    tags: [
      ThemeTags.singleCol,
      ThemeTags.lightMode,
      ThemeTags.monoChrome,
      ThemeTags.resume,
      ThemeTags.humorous,
      ThemeTags.retro
    ]
  };

  protected renderKeywords(keywords: Array<string>): string {
    return `<p>${this.options.headings.skills}: ${keywords.join(", ")}</p>`;
  }

  renderHTML(person: Person): Promise<string> {
    const {
      transformer,
      options,
      renderWorksFor,
      renderAlumniOf,
      renderProjects,
      renderLifeEvents,
      renderKnowsLanguage,
      renderKnowsAbout,
      renderSkills,
      renderCertifications
    } = this;
    const { headings } = options;
    const { name, jobTitle, description, knowsAbout, skills, knowsLanguage, lifeEvent } = person;
    const location = locationText(person.workLocation);
    const contacts = normalizeArray(
      person.email ? `mailto:${person.email}` : undefined,
      person.telephone ? `tel:${person.telephone}` : undefined,
      person.url,
      person.sameAs
    );

    const basics = [
      description
        ? `
          <div>
            <h2>${headings.description}</h2>
            <p>${description}</p>
          </div>
          `
        : "",
      renderKnowsAbout(knowsAbout),
      renderSkills(skills),
      renderKnowsLanguage(knowsLanguage),
      renderCertifications(certifications(person))
    ].join("");

    transformer.on("article", {
      element(article: any) {
        article.append(
          `
            <header>
              <h1>${name ?? ""}</h1>
              ${jobTitle ? `<div>${jobTitle}</div>` : ""}
              ${
                location || contacts.length
                  ? `<ul class="contact">
                      ${location ? `<li>${location}</li>` : ""}
                      ${contacts.map((link: string) => `<li><a href="${link}">${linkText(link)}</a></li>`).join("")}
                    </ul>`
                  : ""
              }
            </header>
            ${basics.trim() ? `<section id="basics">${basics}</section>` : ""}
            ${renderWorksFor(work(person))}
            ${renderProjects(projects(person))}
            ${renderAlumniOf(education(person))}
            ${renderLifeEvents(lifeEvent)}
          `,
          html
        );
      }
    });

    return transformer.transform(`<main><article class="paper"></article></main>`);
  }
}
