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
 * Text for `workLocation`, which may be a plain string or a schema.org
 * Place with a name.
 */
export const locationText = (location: any): string | undefined =>
  typeof location === "string" ? location : (location?.name ?? undefined);

/**
 * Remove the protocol part from a URL and return the result.
 */
export const removeProtocol = (url: string) => {
  const result = url.replace("mailto:", "").replace("tel:", "");
  const pos = result.indexOf("://");
  return pos > -1 ? result.substring(pos + 3) : result;
};
