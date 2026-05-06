import { Theme, titleify } from "../theme.js";
import { HTMLTransformer } from "../htmlTransformer.js";
import { FaIconFactory, normalizeArray } from "../utils.js";
import Person, { projects, certifications, work, education, period } from "../person.js";
import { ThemeTags } from "../themeTags.js";

const id = "alice";
const description = "Modern, responsive theme.";
const tags = [
  ThemeTags.twoCol,
  ThemeTags.headshot,
  ThemeTags.darkMode,
  ThemeTags.wide,
  ThemeTags.photo,
  ThemeTags.resume
];
const html = { html: true };

export class AliceTheme extends Theme {
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
    return;
  }

  static get description() {
    return description;
  }

  static get tags() {
    return tags;
  }

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

    transformer.on("head", {
      element(head: any) {
        head.append(
          `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.9.0/css/all.min.css"  />`,
          html
        );
      }
    });

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
        if (el) {
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

  renderJS(_person: Person): Promise<string> {
    return Promise.resolve("");
  }
}

const renderContactDetails = (person: Person) => {
  const { email, telephone, url, sameAs } = person;
  const contactDetails = normalizeArray(
    email ? `mailto:${email}` : email,
    telephone ? `tel:${telephone}` : telephone,
    url,
    sameAs
  );
  const iconFactory = new FaIconFactory(person);
  const linkText = (url: string) => {
    if (url.indexOf("mailto:") > -1 || url.indexOf("tel:") > -1) {
      return url.substring(url.indexOf(":") + 1);
    }

    return url.substring(url.indexOf("://") + 3).replace("www.", "");
  };
  return contactDetails.length
    ? `
    <div id="contact">
        <ul>${contactDetails
          .map((url: string) => {
            const icon = iconFactory.faIcon(url);
            return `<li><a href="${url}">${icon}${linkText(url)}</a></li>`;
          })
          .join("\n")}
        </ul>
    </div>
    `
    : "";
};
