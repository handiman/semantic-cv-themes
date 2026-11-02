import { Theme, Slots } from "../theme.js";
import Person, { certifications } from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeMetadata } from "../themeMetadata.js";
import { contactLinks } from "../contact.js";
import { locationText } from "../utils.js";

/**
 * Sober, with one personal touch: the person's initials in a ring as a monogram. Slate grey and a
 * muted blue, a sans-serif, plenty of air, and the short lists in a quiet column at the side.
 */
export class BusinessCasualTheme extends Theme {
  static readonly meta: ThemeMetadata = {
    id: "business-casual",
    title: "Business Casual",
    added: "2026-11-02",
    description:
      "Sober with one personal touch: your initials in a ring as a monogram. Slate grey and a muted blue, plenty of air, and skills and languages in a quiet side column.",
    tags: [
      ThemeTags.twoCol,
      ThemeTags.lightMode,
      ThemeTags.cool,
      ThemeTags.calm,
      ThemeTags.corporate
    ]
  };

  protected layout(person: Person): string {
    return `
      <header>
        <slot name="monogram"></slot>
        <div class="identity">
          <h1>${person.name ?? ""}</h1>
          <slot name="jobTitle"></slot>
          <slot name="contact"></slot>
        </div>
      </header>
      <div class="body">
        <slot name="sidebar"></slot>
        <main>
          <slot name="summary"></slot>
          <slot name="worksFor"></slot>
          <slot name="projects"></slot>
          <slot name="alumniOf"></slot>
          <slot name="lifeEvent"></slot>
        </main>
      </div>
    `;
  }

  protected slots(person: Person): Slots {
    const { headings } = this.options;
    const { renderKnowsAbout, renderSkills, renderKnowsLanguage, renderCertifications } = this;
    const { name, jobTitle, description, knowsAbout, skills, knowsLanguage } = person;
    return {
      // Decorative: the name itself is in the heading next to it.
      monogram: () => {
        const letters = initials(name);
        return letters ? `<div class="monogram" aria-hidden="true">${letters}</div>` : "";
      },
      jobTitle: () => (jobTitle ? `<p class="job-title">${jobTitle}</p>` : ""),
      contact: () => {
        const location = locationText(person.workLocation);
        const links = contactLinks(person);
        return location || links.length
          ? `<ul class="contact">
              ${location ? `<li>${location}</li>` : ""}
              ${links.map((link) => `<li><a href="${link.href}">${link.text}</a></li>`).join("")}
            </ul>`
          : "";
      },
      summary: () =>
        description
          ? `<section id="description">
              <h2>${headings.description}</h2>
              <p class="scv-description">${description}</p>
            </section>`
          : "",
      sidebar: () => {
        const sidebar = [
          renderKnowsAbout(knowsAbout),
          renderSkills(skills),
          renderKnowsLanguage(knowsLanguage),
          renderCertifications(certifications(person))
        ].join("");
        return sidebar.trim() ? `<aside>${sidebar}</aside>` : "";
      }
    };
  }
}

/**
 * The first letter of the first and of the last word of a name: "Ada Lindqvist" gives "AL", "Ada"
 * gives "A", "Ada Maria Lindqvist" gives "AL". The name is already HTML-escaped, so entities such as
 * `&#39;` are skipped, and only letters count, so the result never needs escaping itself.
 */
export const initials = (name: string | null | undefined): string => {
  const words = (name ?? "")
    .replace(/&[#\w]+;/g, "")
    .split(/\s+/)
    .map((word) => word.match(/\p{L}/u)?.[0])
    .filter((letter): letter is string => Boolean(letter));
  if (!words.length) {
    return "";
  }
  const first = words[0];
  const last = words.length > 1 ? words[words.length - 1] : "";
  return (first + last).toLocaleUpperCase();
};
