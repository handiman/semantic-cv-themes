import { Theme, html } from "../theme.js";
import { locationText, normalizeArray, removeProtocol } from "../utils.js";
import Person, { projects, certifications, work, education } from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeMetadata } from "../themeMetadata.js";
import { IconFactory } from "../icons.js";

export class TimesTheme extends Theme {
  static readonly meta: ThemeMetadata = {
    id: "times",
    title: "Times",
    description:
      "A playful newspaper‑inspired résumé with an editorial layout and a subtle sense of humor.",
    tags: [
      ThemeTags.twoCol,
      ThemeTags.lightMode,
      ThemeTags.editorial,
      ThemeTags.typographyForward,
      ThemeTags.playful
    ]
  };

  protected renderKeywords(keywords: Array<string>): string {
    return `<p>${this.options.headings.skills}: ${keywords.join(", ")}</p>`;
  }

  renderHTML(person: Person): Promise<string> {
    const {
      transformer,
      options,
      renderKnowsLanguage,
      renderKnowsAbout,
      renderSkills,
      renderCertifications,
      renderWorksFor,
      renderAlumniOf,
      renderProjects,
      renderLifeEvents
    } = this;
    const iconFactory = new IconFactory(person);
    const {
      name,
      jobTitle,
      description,
      sameAs,
      url,
      email,
      telephone,
      knowsLanguage,
      knowsAbout,
      skills,
      lifeEvent
    } = person;
    const { headings } = options;

    const renderSocial = () => {
      const links = normalizeArray(
        sameAs,
        url,
        email ? `mailto:${email}` : undefined,
        telephone ? `tel:${telephone}` : undefined
      );
      if (links.length > 0) {
        return `<ul class="social">${links.map((item: string) => `<li><a href="${item}" aria-label="${iconFactory.label(item)}">${iconFactory.icon(item)}</a><div class="print">${removeProtocol(item)}</div></li>`).join("\n")}</ul>`;
      }
    };

    const renderHeader = () => {
      // The date line is added in the browser by times.js, so the HTML is the same on any day (#75).
      const social = renderSocial();
      return `
        <header>
            <h1>
                ${name ?? ""}
                ${jobTitle ? `<small>${jobTitle}</small>` : ""}
                ${locationText(person.workLocation) ? `<small>${locationText(person.workLocation)}</small>` : ""}
            </h1>
            ${social ? `<div class="grid"><div>${social}</div></div>` : ""}
            <div class="hr"></div>
        </header>
      `;
    };

    const renderBasics = () => {
      const basics = [
        renderKnowsAbout(knowsAbout),
        renderSkills(skills),
        renderKnowsLanguage(knowsLanguage),
        renderCertifications(certifications(person))
      ].join("");
      return `
        ${
          description
            ? `<section>
            <h2 class="pirata-one-regular">${headings.description}</h2>
            <p>${description}</p>
        </section>`
            : ""
        }
        ${basics.trim() ? `<section id="basics">${basics}</section>` : ""}
      `;
    };

    transformer.on("main div", {
      element(el: any) {
        el.append(renderHeader(), html);
        el.append(renderBasics(), html);
        el.append(renderWorksFor(work(person)), html);
        el.append(renderProjects(projects(person)), html);
        el.append(renderAlumniOf(education(person)), html);
        el.append(renderLifeEvents(lifeEvent), html);
      }
    });

    return transformer.transform(`<main><div></div></main>`);
  }
}
