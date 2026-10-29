import { Theme, html } from "../theme.js";
import Person, { projects, certifications, work, education } from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeMetadata } from "../themeMetadata.js";
import { locationText } from "../utils.js";
import { contactLinks } from "../contact.js";

export class GnapTheme extends Theme {
  static readonly meta: ThemeMetadata = {
    id: "gnap",
    title: "GNAP!",
    description:
      'A full‑screen dark hero ("Hi, I\'m …") followed by a white page with oversized, light headings and an icon rail for contact links. Black and white with green links — Smurf‑inspired.',
    tags: [
      ThemeTags.heroFullscreen,
      ThemeTags.singleCol,
      ThemeTags.monoChrome,
      ThemeTags.highContrast,
      ThemeTags.accented,
      ThemeTags.typographyForward,
      ThemeTags.playful,
      ThemeTags.bold
    ]
  };

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
    const location = locationText(person.workLocation);
    // The menu and footer show icon-only links and are hidden in print, so
    // print gets the addresses as text in the header.
    const printContacts = contactLinks(person);

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

    transformer.on("main article header .container", {
      element(el: any) {
        el.append(
          `        
            <div class="no-print">Hi, I'm</div>
            <h1>${name ?? ""}</h1>
            ${jobTitle ? `<p class="job-title">${jobTitle}</p>` : ""}
            ${location ? `<div class="location">${location}</div>` : ""}
            ${printContacts.length ? `<ul class="print contact">${printContacts.map((link) => `<li>${link.text}</li>`).join("")}</ul>` : ""}
          `,
          html
        );
      }
    });

    const knowledge = [
      renderKnowsAbout(knowsAbout),
      renderSkills(skills),
      renderKnowsLanguage(knowsLanguage)
    ].join("");
    const basics = `
      ${renderSummary()}
      ${knowledge.trim() ? `<div id="knowledgeGrid"><div>${knowledge}</div></div>` : ""}
    `;
    const works = renderWorksFor(work(person));
    const events = renderLifeEvents(lifeEvent);
    const socialLinks = social(person);

    // Only sections with content go into the page (#76), and the footer links only to those.
    // The wrapper of a section gets an id for the footer links, unless the section inside already has
    // that id (the base class's projects section is id="projects").
    const section = (id: string | undefined, content: string) =>
      content.trim()
        ? `<section${id ? ` id="${id}"` : ""}><div class="container">${content}</div></section>`
        : "";
    const footerLinks = [
      basics.trim() ? `<li><a href="#basics">${headings.description}</a></li>` : "",
      skills && skills.length ? `<li><a href="#skills">${headings.skills}</a></li>` : "",
      works.trim() ? `<li><a href="#work">${headings.worksFor}</a></li>` : "",
      events.trim() ? `<li><a href="#events">${headings.lifeEvent}</a></li>` : ""
    ].join("");
    const footer =
      footerLinks || socialLinks
        ? `
          <footer class="grey darken-4 white-text no-print">
            <div class="container">
              ${footerLinks ? `<ul class="row center inline inline-delimited">${footerLinks}</ul>` : ""}
              ${socialLinks ? `<div class="row center">${socialLinks}</div>` : ""}
            </div>
          </footer>
        `
        : "";
    const menu = socialLinks
      ? `<div class="menu" role="navigation" aria-label="primary"><div>${socialLinks}</div></div>`
      : "";

    return transformer.transform(`
        <main class="grey darken-4 white-text">
          <article class="white black-text">
            <header class="valign-wrapper grey darken-4 white-text">
              <div class="container"></div>
            </header>
            ${section("basics", basics)}
            ${section("work", works)}
            ${section(undefined, renderProjects(projects(person)))}
            ${section("education", renderAlumniOf(education(person)))}
            ${section("certificates", renderCertifications(certifications(person)))}
            ${section("events", events)}
          </article>
          ${footer}
          ${menu}
        </main>
    `);
  }
}

const social = (person: Person) => {
  const links = contactLinks(person);
  if (links.length > 0) {
    return `<ul class="social">${links.map((link) => `<li><a href="${link.href}" aria-label="${link.label}">${link.icon}</a></li>`).join("\n")}</ul>`;
  }
};
