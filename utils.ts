/**
 * Small normalization helpers used throughout Semantic‑CV.
 *
 * These utilities convert optional or mixed single‑value/array fields
 * into predictable arrays, and provide a simple Font Awesome icon
 * factory for social/contact links. All helpers are pure and free of
 * side effects.
 */

/**
 * Normalize a value into an array.
 * - `null`/`undefined` → []
 * - single item → [item]
 * - array → array
 */
export const arrayOf = (obj: any) => (obj && obj.map ? obj : obj ? [obj] : []);

/**
 * Merge multiple values/arrays into a single flat array with empty
 * values removed. Useful when combining optional fields.
 */
export const normalizeArray = (...args: Array<any>) => {
  let result = new Array<any>();
  for (const arg of args) {
    if (arg && arg.map) {
      result = [...result, ...arg];
    } else if (arg) {
      result.push(arg);
    }
  }
  return result.filter((item) => (item ? true : false));
};

/**
 * Visible text for a contact link: the address without protocol or a
 * leading "www.". Never truncated, so printed CVs keep the full link.
 */
export const linkText = (url: string) => removeProtocol(url).replace(/^www\./, "");

/**
 * Text for a location such as `workLocation`: a plain string as it is, the
 * name of a schema.org Place, or the parts of a PostalAddress joined with
 * commas. Undefined when there is nothing to show.
 */
export const locationText = (location: any): string | undefined => {
  if (typeof location === "string") {
    return location;
  }
  if (location?.name) {
    return location.name;
  }
  const parts = [
    location?.streetAddress,
    location?.postalCode,
    location?.addressLocality,
    location?.addressRegion,
    location?.addressCountry
  ].filter((part) => typeof part === "string" && part.trim());
  return parts.length ? parts.join(", ") : undefined;
};

/**
 * Remove the protocol part from a URL and return the result.
 */
export const removeProtocol = (url: string) => {
  const result = url.replace("mailto:", "").replace("tel:", "");
  const pos = result.indexOf("://");
  return pos > -1 ? result.substring(pos + 3) : result;
};
