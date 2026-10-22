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
};

export type ThemeOptions = {
  headings: ThemeHeadings;
  labels: ThemeLabels;
};

/** Options as a caller gives them: anything left out keeps its default. */
export type ThemeOptionsInput = {
  headings?: Partial<ThemeHeadings>;
  labels?: Partial<ThemeLabels>;
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
    present: "present"
  }
};

/**
 * Complete options from what the caller gave, with the defaults for anything left out. A value
 * that isn't a string is ignored, so a heading can't become "undefined" in the page.
 */
export const resolveOptions = (input?: ThemeOptionsInput): ThemeOptions => ({
  headings: { ...defaultOptions.headings, ...strings(input?.headings) },
  labels: { ...defaultOptions.labels, ...strings(input?.labels) }
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
      present: "pågående"
    }
  }
};

/** The languages the themes have headings for: English and those in `translations`. */
export const supportedLanguages = ["en", ...Object.keys(translations)];

/**
 * Theme options in the language of a CV, given as a language tag ("sv", "sv-SE", "en-GB").
 * Only the primary subtag counts. A language the themes have no headings for, or no language at
 * all, gives English.
 */
export const themeOptionsFor = (language?: string): ThemeOptions => {
  const primary = (language ?? "").split("-")[0].toLowerCase();
  return resolveOptions(translations[primary]);
};
