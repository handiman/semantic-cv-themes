import { arrayOf } from "./utils.js";

/**
 * All certifications and credentials held by the person.
 */
export const certifications = (person: Person) => {
  return [...arrayOf(person.hasCertification), ...arrayOf(person.hasCredential)];
};

/**
 * Projects the person has worked on (Role-wrapped worksFor entries that are not Organizations).
 */
export const projects = (person: Person) => {
  return arrayOf(person.worksFor).filter(
    (item: any) => item.worksFor && item.worksFor["@type"] !== "Organization"
  );
};

/**
 * Work experience entries (Role-wrapped worksFor entries that are not Projects).
 */
export const work = (person: Person) => {
  return arrayOf(person.worksFor).filter(
    (item: any) => item.worksFor && item.worksFor["@type"] !== "Project"
  );
};

/**
 * Educational institutions the person has attended.
 */
export const education = (person: Person) => {
  return arrayOf(person.alumniOf);
};

/**
 * Convert a date to the format YYYY-MM.
 * @param date
 */
export const period = (value: string | Date) => {
  const date = "string" === typeof value ? new Date(value) : value;
  const year = date.getFullYear();
  const month = date.getMonth();
  return `${year}-${month < 10 ? `0${month}` : month}`;
};

/**
 * Minimal normalized subset of schema.org/Person used by Semantic‑CV.
 * All fields are optional and may be null or undefined depending on user input.
 */
export type Person = {
  name: string | null | undefined;
  jobTitle: string | null | undefined;
  workLocation: string | null | undefined;
  description: string | null | undefined;
  image: string | null | undefined;
  url: string | null | undefined;
  email: string | null | undefined;
  telephone: string | null | undefined;
  sameAs: Array<string> | null | undefined;
  knowsAbout: Array<string> | null | undefined;
  skills: Array<string> | null | undefined;
  knowsLanguage: Array<string> | null | undefined;
  alumniOf: Array<{}> | null | undefined;
  worksFor: Array<{}> | null | undefined;
  hasCertification: Array<{}> | null | undefined;
  hasCredential: Array<{}> | null | undefined;
  lifeEvent: Array<{}> | null | undefined;
};

export default Person;
