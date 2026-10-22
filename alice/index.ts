import { Theme, html } from "../theme.js";
import { locationText } from "../utils.js";
import Person, { projects, certifications, work, education } from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeMetadata } from "../themeMetadata.js";
import { icon } from "../icons.js";
import { contactLinks } from "../contact.js";

export class AliceTheme extends Theme {
  static readonly meta: ThemeMetadata = {
    id: "alice",
    title: "Alice",
    description:
      "A bright, balanced two‑column theme with crisp typography, gentle contrast, and a confident, approachable rhythm.",
    tags: [
      ThemeTags.twoCol,
      ThemeTags.neutral,
      ThemeTags.lightMode,
      ThemeTags.typographyForward,
      ThemeTags.minimal,
      ThemeTags.resume
    ]
  };

  async renderHTML(person: Person): Promise<string> {
    const {
      renderLifeEvents,
      renderWorksFor,
      renderAlumniOf,
      renderProjects,
      renderCertifications,
      renderKnowsLanguage,
      renderKnowsAbout,
      renderSkills
    } = this;
    const { name, jobTitle, description, image, lifeEvent, knowsAbout, knowsLanguage, skills } =
      person;
    const { transformer, options } = this;
    const { headings } = options;
    const certs = certifications(person);
    const proj = projects(person);
    const worksFor = work(person);
    const alumniOf = education(person);

    transformer.on("picture", {
      element(img: any) {
        if (image) {
          img.append(`<img src="${image}" alt="${name ?? ""}" />`, html);
        } else {
          img.remove();
        }
      }
    });

    transformer.on("#contact", {
      element(contact: any) {
        contact.replace(renderContactDetails(person), html);
      }
    });

    transformer.on("#description", {
      element(el: any) {
        if (description) {
          el.replace(
            `
            <section id="description">
              ${headings.description ? `<h2>${headings.description}</h2>` : ""}
              ${description}
            </section>
            `,
            html
          );
        } else {
          el.remove();
        }
      }
    });

    transformer.on("#project", {
      element(section: any) {
        if (proj && proj.length) {
          section.replace(renderProjects(proj), html);
        } else {
          section.remove();
        }
      }
    });

    transformer.on("#worksFor", {
      element(section: any) {
        if (worksFor && worksFor.length) {
          section.replace(renderWorksFor(worksFor), html);
        } else {
          section.remove();
        }
      }
    });

    transformer.on("#alumniOf", {
      element(section: any) {
        if (alumniOf && alumniOf.length) {
          section.replace(renderAlumniOf(alumniOf), html);
        } else {
          section.remove();
        }
      }
    });

    transformer.on("#lifeEvent", {
      element(section: any) {
        if (lifeEvent && lifeEvent.length) {
          section.replace(renderLifeEvents(lifeEvent), html);
        } else {
          section.remove();
        }
      }
    });

    transformer.on("#certifications", {
      element(section: any) {
        if (certs && certs.length) {
          section.replace(renderCertifications(certs), html);
        } else {
          section.remove();
        }
      }
    });

    transformer.on("#knowsLanguage", {
      element(section: any) {
        if (knowsLanguage && knowsLanguage.length) {
          section.replace(renderKnowsLanguage(knowsLanguage), html);
        } else {
          section.remove();
        }
      }
    });

    transformer.on("#knowsAbout", {
      element(section: any) {
        if (knowsAbout && knowsAbout.length) {
          section.replace(renderKnowsAbout(knowsAbout), html);
        } else {
          section.remove();
        }
      }
    });

    transformer.on("#skills", {
      element(section: any) {
        if (skills && skills.length) {
          section.replace(renderSkills(skills), html);
        } else {
          section.remove();
        }
      }
    });

    return await transformer.transform(`
        <div class="page">
          <div class="aside">
            <header>
                <picture></picture>
                <h1>${name ?? ""}${jobTitle ? `<small>${jobTitle}</small>` : ""}</h1>
                <div id="contact"></div>
            </header>
            <aside>
                <section id="description"></section>
                <section id="knowsAbout"></section>
                <section id="skills"></section>
                <section id="knowsLanguage"></section>
                <section id="certifications"></section>
            </aside>
          </div>
          <div class="main">
            <main>
                <section id="worksFor"></section>
                <section id="alumniOf"></section>
                <section id="project"></section>
                <section id="lifeEvent"></section>
            </main>
          </div>
        </div>
    `);
  }
}

const renderContactDetails = (person: Person) => {
  const location = locationText(person.workLocation);
  const contactDetails = contactLinks(person);
  return contactDetails.length || location
    ? `
    <div id="contact">
        <ul>${location ? `<li><a>${icon("location")}${location}</a></li>` : ""}${contactDetails
          .map((link) => `<li><a href="${link.href}">${link.icon}${link.text}</a></li>`)
          .join("\n")}
        </ul>
    </div>
    `
    : "";
};
