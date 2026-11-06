export type ThemeHeadings = {
  contact: string;
  description: string;
  knowsLanguage: string;
  knowsAbout: string;
  skills: string;
  certifications: string;
  worksFor: string;
  alumniOf: string;
  projects: string;
  lifeEvent: string;
};

export type ThemeLabels = {
  /** Shown instead of an end date for a role that hasn't ended. */
  present: string;
  /** Heads a column of numbers of years, such as how long each skill has been in use. */
  years: string;
};

/** The CSS variable that each color overrides, by the key a CV uses for it. */
export const colorVariables = {
  text: "--text-color",
  textMuted: "--text-color-muted",
  background: "--background-color",
  heading: "--heading-color",
  accent: "--accent-color",
  link: "--link-color",
  border: "--border-color"
} as const;

/** Colors a CV sets. Left out means the theme's own color. */
export type ThemeColors = Partial<Record<keyof typeof colorVariables, string>>;

export type ThemeOptions = {
  headings: ThemeHeadings;
  labels: ThemeLabels;
  colors: ThemeColors;
};

/** Options as a caller gives them: anything left out keeps its default. */
export type ThemeOptionsInput = {
  headings?: Partial<ThemeHeadings>;
  labels?: Partial<ThemeLabels>;
  colors?: ThemeColors;
};

export const defaultOptions: ThemeOptions = {
  headings: {
    contact: "Contact Details",
    description: "Summary",
    knowsLanguage: "Languages",
    knowsAbout: "Core Competencies",
    skills: "Skills",
    certifications: "Certifications",
    worksFor: "Work Experience",
    alumniOf: "Education",
    projects: "Projects",
    lifeEvent: "Events"
  },
  labels: {
    present: "present",
    years: "years"
  },
  colors: {}
};

/**
 * Whether `value` is a CSS color that is safe to put in a stylesheet: a hex color, a color
 * name, or rgb(), rgba(), hsl() or hsla(). Nothing that could end the declaration or the
 * stylesheet (`;`, `}`, `<`, quotes, `url(`) gets through.
 */
export const isColor = (value: unknown): value is string =>
  typeof value === "string" &&
  /^(#[0-9a-f]{3,8}|[a-z]+|(?:rgb|hsl)a?\([0-9a-z%.,\s/+-]+\))$/i.test(value.trim());

const colorsOf = (values: Record<string, unknown> | undefined): ThemeColors =>
  Object.fromEntries(
    Object.entries(values ?? {})
      .filter(([key, value]) => key in colorVariables && isColor(value))
      .map(([key, value]) => [key, (value as string).trim()])
  );

/**
 * Complete options from what the caller gave, with the defaults for anything left out. A value
 * that isn't a string is ignored, so a heading can't become "undefined" in the page.
 */
export const resolveOptions = (input?: ThemeOptionsInput): ThemeOptions => ({
  headings: { ...defaultOptions.headings, ...strings(input?.headings) },
  labels: { ...defaultOptions.labels, ...strings(input?.labels) },
  colors: colorsOf(input?.colors)
});

const strings = (values: Record<string, unknown> | undefined) =>
  Object.fromEntries(Object.entries(values ?? {}).filter(([, value]) => typeof value === "string"));

/**
 * Headings and labels per language, by primary language subtag. English is the default and
 * needs nothing here. Add a language by adding its translations.
 */
const translations: Record<string, ThemeOptionsInput> = {
  sv: {
    headings: {
      contact: "Kontaktuppgifter",
      description: "Sammanfattning",
      knowsLanguage: "Språk",
      knowsAbout: "Kärnkompetenser",
      skills: "Färdigheter",
      certifications: "Certifieringar",
      worksFor: "Arbetslivserfarenhet",
      alumniOf: "Utbildning",
      projects: "Projekt",
      lifeEvent: "Händelser"
    },
    labels: {
      present: "pågående",
      years: "år"
    }
  }
};

/** The languages the themes have headings for: English and those in `translations`. */
export const supportedLanguages = ["en", ...Object.keys(translations)];

/**
 * Theme options for a CV: its own headings and labels (`custom`, from its theme object, already
 * HTML-escaped by semantic-cv-core's themeOptionsOf) over those of its language, over English.
 * The language is a tag ("sv", "sv-SE", "en-GB"); only the primary subtag counts, and a language
 * the themes have no headings for, or none at all, gives English.
 */
export const themeOptionsFor = (language?: string, custom?: ThemeOptionsInput): ThemeOptions => {
  const primary = (language ?? "").split("-")[0].toLowerCase();
  const base = resolveOptions(translations[primary]);
  return {
    headings: { ...base.headings, ...strings(custom?.headings) },
    labels: { ...base.labels, ...strings(custom?.labels) },
    colors: colorsOf(custom?.colors)
  };
};
