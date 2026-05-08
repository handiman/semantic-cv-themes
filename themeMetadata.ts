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
  tags: Array<ThemeTag>;
};
