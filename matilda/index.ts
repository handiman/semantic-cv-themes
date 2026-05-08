import { Theme, titleify } from "../theme.js";
import { HTMLTransformer } from "../htmlTransformer.js";
import { FaIconFactory, normalizeArray } from "../utils.js";
import Person, { projects, certifications, work, education } from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeOptions } from "../themeOptions.js";

const id = "matilda";
const description =
  "A soft, pastel‑toned two‑column theme with gentle typography and a friendly, editorial touch.";
const tags = [
  ThemeTags.twoCol,
  ThemeTags.headshot,
  ThemeTags.lightMode,
  ThemeTags.pastel,
  ThemeTags.resume,
  ThemeTags.technical
];
const html = { html: true };

export class MatildaTheme extends Theme {
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

  renderHTML(person: Person): Promise<string> {
    const {
      transformer,
      options,
      renderKnowsAbout,
      renderSkills,
      renderKnowsLanguage,
      renderWorksFor,
      renderAlumniOf,
      renderProjects,
      renderLifeEvents,
      renderCertifications
    } = this;
    const { headings } = options;
    const {
      name,
      image,
      url,
      email,
      telephone,
      sameAs,
      knowsLanguage,
      knowsAbout,
      skills,
      lifeEvent
    } = person;
    const iconFactory = new FaIconFactory(person);
    const contactDetails = () => {
      const linkText = (url: string) => {
        if (url.indexOf("mailto:") > -1 || url.indexOf("tel:") > -1) {
          return url.substring(url.indexOf(":") + 1);
        }

        const text = url.substring(url.indexOf("://") + 3).replace("www.", "");
        return text.length > 26 ? text.substring(0, 25) + "…" : text;
      };
      const links = normalizeArray(
        sameAs,
        url,
        email ? `mailto:${email}` : undefined,
        telephone ? `tel:${telephone}` : undefined
      );
      return links.length
        ? `
          <section>
            <h2>${headings.contact}</h2>
            <ul>${links.map((link: string) => `<li><a href="${link}" title="${link}"><span>${linkText(link)}</span>${iconFactory.faIcon(link)}</a></li>`).join("")}</ul>
          </section>
        `
        : "";
    };
    transformer.on("head", {
      element(head: any) {
        head.append(
          `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.9.0/css/all.min.css"  />`,
          html
        );
      }
    });

    transformer.on(".photo", {
      element(photo: any) {
        if (image) {
          photo.append(`<img src="${image}" alt="${name ?? ""}" />`, html);
        } else {
          photo.remove();
        }
      }
    });

    transformer.on("aside", {
      element(aside: any) {
        aside.append(
          `
            ${renderHeader(person)}
            ${contactDetails()}
            ${renderKnowsAbout(knowsAbout)}
            ${renderSkills(skills)}
            ${renderKnowsLanguage(knowsLanguage)}
            ${renderCertifications(certifications(person))}
          `,
          html
        );
      }
    });

    transformer.on("main", {
      element(main: any) {
        main.append(
          `
            ${renderHeader(person)}
            ${renderDescription(person, options)}
            ${renderProjects(projects(person))}
            ${renderWorksFor(work(person))}
            ${renderAlumniOf(education(person))}
            ${renderLifeEvents(lifeEvent)}
        `,
          html
        );
      }
    });

    return transformer.transform(`
      <div class="desktop">
        <div class="cv">
          <aside>
            <section class="photo"></section>
          </aside>
          <main></main>
        </div>
      </div>
    `);
  }
}

const renderHeader = (person: any): string => {
  const { name, jobTitle } = person;
  return name || jobTitle
    ? `
      <header>
        <div><h1>${name ?? ""}</h1></div>
        <div>${jobTitle ?? ""}</div>
      </header>
    `
    : "";
};

const renderDescription = (person: Person, options: ThemeOptions): string => {
  const { description } = person;
  const { headings } = options;
  return description
    ? `
      <section>
        <h2${headings.description}</h2>
        <div>${description}</div>
      </section>
    `
    : "";
};
