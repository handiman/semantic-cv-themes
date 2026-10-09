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
 *
 * ISO strings ("2021-10", "2021-10-21", "2021-10-21T08:00:00Z") are read
 * as written, so the result never shifts with the local time zone.
 * Anything that isn't a valid date is returned unchanged.
 */
export const period = (value: string | Date) => {
  if ("string" === typeof value) {
    const iso = /^(\d{4})-(\d{2})/.exec(value);
    if (iso) {
      return `${iso[1]}-${iso[2]}`;
    }
  }
  const date = "string" === typeof value ? new Date(value) : value;
  if (isNaN(date.getTime())) {
    return String(value);
  }
  const month = date.getUTCMonth() + 1; // getUTCMonth() is zero-based
  return `${date.getUTCFullYear()}-${String(month).padStart(2, "0")}`;
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
