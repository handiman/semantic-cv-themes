import { ThemeTag } from "./themeTags.js";

export interface ThemeRegistryEntry {
  /** Concrete theme class (constructor). */
  type: new (...args: any[]) => any;

  /** Optional human‑friendly display name. */
  title?: string;

  /** Short description used in galleries and previews. */
  description: string;

  /** Tags describing layout, mood, and features. */
  tags: ThemeTag[];
}