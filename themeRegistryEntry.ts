import { ThemeTag } from "./themeTags.js";

export interface ThemeRegistryEntry {
  /** Concrete theme class (constructor). */
  type: new (...args: any[]) => any;

  /** Optional human‑friendly display name. */
  title?: string;

  /** Short description used in galleries and previews. */
  description: string;

  /** The date the theme was added, as `YYYY-MM-DD`. */
  added: string;

  /** Show the theme in the sample on the landing page. */
  featured?: boolean;

  /** Tags describing layout, mood, and features. */
  tags: ThemeTag[];
}