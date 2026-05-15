import { Person } from "./person.js";

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
