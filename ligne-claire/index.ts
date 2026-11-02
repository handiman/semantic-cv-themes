import { Theme, Slots } from "../theme.js";
import Person from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeMetadata } from "../themeMetadata.js";
import { contactLinks } from "../contact.js";
import { locationText } from "../utils.js";

/**
 * A CV as a page of a comic in the ligne claire style: every part in a panel with an even black
 * outline and white gutters, flat colors with no shading, headings in yellow caption boxes, hand
 * lettering, and the summary in a speech balloon under a title panel with a flat sky.
 */
export class LigneClaireTheme extends Theme {
  static readonly meta: ThemeMetadata = {
    id: "ligne-claire",
    title: "Ligne Claire",
    description:
      "A CV as a comic page in the ligne claire style: panels with even black outlines, flat colors, yellow caption boxes, hand lettering and the summary in a speech balloon.",
    tags: [
      ThemeTags.lightMode,
      ThemeTags.colorBlocks,
      ThemeTags.typographyForward,
      ThemeTags.playful,
      ThemeTags.creative
    ]
  };

  protected layout(person: Person): string {
    return `
      <main class="strip">
        <header>
          <h1>${person.name ?? ""}</h1>
          <slot name="jobTitle"></slot>
        </header>
        <slot name="portrait"></slot>
        <slot name="summary"></slot>
        <slot name="contact"></slot>
        <slot name="worksFor"></slot>
        <slot name="knowsAbout"></slot>
        <slot name="skills"></slot>
        <slot name="knowsLanguage"></slot>
        <slot name="certifications"></slot>
        <slot name="projects"></slot>
        <slot name="alumniOf"></slot>
        <slot name="lifeEvent"></slot>
      </main>
    `;
  }

  protected slots(person: Person): Slots {
    const { headings } = this.options;
    const { name, image, jobTitle, description } = person;
    return {
      // The photo in a panel of its own, drawn over by the ink filter in ligne-claire.css: flat
      // colors and black outlines. The filter is inline SVG, so nothing is loaded and the photo is
      // never sent anywhere.
      portrait: () =>
        image
          ? `<section id="portrait">
              <svg class="filters" aria-hidden="true" focusable="false">${inkFilter}</svg>
              <img src="${image}" alt="${name ?? ""}" />
            </section>`
          : "",
      jobTitle: () => (jobTitle ? `<p class="job-title">${jobTitle}</p>` : ""),
      contact: () => {
        const location = locationText(person.workLocation);
        const links = contactLinks(person);
        return location || links.length
          ? `<section id="contact">
              <h2>${headings.contact}</h2>
              <ul>
                ${location ? `<li>${location}</li>` : ""}
                ${links.map((link) => `<li><a href="${link.href}">${link.text}</a></li>`).join("")}
              </ul>
            </section>`
          : "";
      },
      // The summary as a speech balloon in its panel.
      summary: () =>
        description
          ? `<section id="description">
              <h2>${headings.description}</h2>
              <p class="scv-description balloon">${description}</p>
            </section>`
          : ""
    };
  }
}

/**
 * Turns a photo into something like a clear-line drawing.
 *
 * - Flat colors: a strong blur merges small detail into areas, then each channel is posterized to a
 *   few levels.
 * - Outlines: a difference of Gaussians on a grey copy. Where a pixel is darker than its
 *   surroundings (a small blur darker than a large one), it becomes ink. The difference is taken as
 *   5 · (large + (1 − small) − 1) with an arithmetic composite, which keeps the alpha at 1; a
 *   discrete transfer then turns everything above a threshold black and the rest white.
 * - The outlines are multiplied over the flat colors.
 */
const inkFilter = `
  <filter id="ligne-claire-ink" color-interpolation-filters="sRGB">
    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="soft" />
    <feComponentTransfer in="soft" result="flat">
      <feFuncR type="discrete" tableValues="0.08 0.24 0.4 0.55 0.7 0.84 0.95" />
      <feFuncG type="discrete" tableValues="0.08 0.24 0.4 0.55 0.7 0.84 0.95" />
      <feFuncB type="discrete" tableValues="0.08 0.24 0.4 0.55 0.7 0.84 0.95" />
    </feComponentTransfer>
    <feColorMatrix in="SourceGraphic" type="saturate" values="0" result="grey" />
    <feGaussianBlur in="grey" stdDeviation="1.5" result="small" />
    <feGaussianBlur in="grey" stdDeviation="3.2" result="large" />
    <feComponentTransfer in="small" result="small-inverted">
      <feFuncR type="table" tableValues="1 0" />
      <feFuncG type="table" tableValues="1 0" />
      <feFuncB type="table" tableValues="1 0" />
    </feComponentTransfer>
    <feComposite in="large" in2="small-inverted" operator="arithmetic" k1="0" k2="5" k3="5" k4="-5" result="line" />
    <feComponentTransfer in="line" result="ink">
      <feFuncR type="discrete" tableValues="1 1 1 0 0 0 0 0 0 0" />
      <feFuncG type="discrete" tableValues="1 1 1 0 0 0 0 0 0 0" />
      <feFuncB type="discrete" tableValues="1 1 1 0 0 0 0 0 0 0" />
    </feComponentTransfer>
    <feBlend in="flat" in2="ink" mode="multiply" />
  </filter>
`;
