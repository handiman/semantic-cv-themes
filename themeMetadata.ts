import { ThemeTag } from "./themeTags.js";

export type ThemeMetadata = {
  /** Unique identifier for the theme. Used for asset resolution
   *  and for generating enhancement element names such as
   *  `<semantic-cv-theme-{id}>`.
   */
  id: string;
  /** Human friendly theme title */
  title: string;
  description: string;
  /** The date the theme was added, as `YYYY-MM-DD`. The gallery sorts by it. */
  added: string;
  /** Show the theme in the sample on the landing page. Defaults to false. */
  featured?: boolean;
  tags: Array<ThemeTag>;
};
