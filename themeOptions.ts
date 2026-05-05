export type ThemeOptions = {
  headings: {
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
    projects: "Featured Projects",
    lifeEvent: "Events"
  }
};
