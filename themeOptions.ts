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
