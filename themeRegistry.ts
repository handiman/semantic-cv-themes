import { BoilingDieselTheme } from "./boiling-diesel/index.js";
import { HoldenWreckTheme } from "./holden-wreck/index.js";
import { MinimalTheme } from "./minimal/index.js";
import { GnapTheme } from "./gnap/index.js";
import { MatildaTheme } from "./matilda/index.js";
import { TimesTheme } from "./times/index.js";
import { TypewriterTheme } from "./typewriter/index.js";
import { WinterTheme } from "./winter/index.js";
import { ThemeTag, ThemeTags } from "./themeTags.js";

/**
 * Central lookup table for all available Semantic‑CV themes.
 *
 * Each entry is keyed by the theme's static `id` and contains:
 * - `type`: the concrete theme class (constructor)
 * - `title`: optional human‑friendly display name
 * - `description`: short marketing/UX description for galleries and previews
 * - `tags`: an array of ThemeTags describing layout, mood, and features
 *
 * The ThemeLoader uses this registry to instantiate themes by ID,
 * falling back to the "minimal" theme when an unknown ID is requested.
 *
 * This object is intentionally static and side‑effect‑free: themes do not
 * self‑register, and the registry remains the single source of truth for
 * available themes.
 */
export const ThemeRegistry: Record<string, ThemeRegistryEntry> = {
  [GnapTheme.id]: {
    type: GnapTheme,
    title: GnapTheme.title,
    description: GnapTheme.description,
    tags: GnapTheme.tags
  },
  [HoldenWreckTheme.id]: {
    type: HoldenWreckTheme,
    title: "Holden wreck",
    description:
      "A clean, approachable two‑column résumé with a light, balanced layout and clear structure.",
    tags: [
      ThemeTags.twoCol,
      ThemeTags.resume,
      ThemeTags.lightMode,
      ThemeTags.minimal,
      ThemeTags.editorial,
      ThemeTags.calm
    ]
  },
  [BoilingDieselTheme.id]: {
    type: BoilingDieselTheme,
    title: "Boiling Diesel",
    description:
      "A bold, high‑contrast dark theme built for technical résumés that want a strong, confident presence.",
    tags: [
      ThemeTags.twoCol,
      ThemeTags.resume,
      ThemeTags.darkMode,
      ThemeTags.highContrast,
      ThemeTags.technical,
      ThemeTags.bold
    ]
  },
  [MinimalTheme.id]: {
    type: MinimalTheme,
    description:
      "A neutral, understated single‑column layout designed to be readable, reliable, and universally suitable.",
    tags: [
      ThemeTags.singleCol,
      ThemeTags.lightMode,
      ThemeTags.minimal,
      ThemeTags.neutral,
      ThemeTags.resume,
      ThemeTags.default
    ]
  },
  [MatildaTheme.id]: {
    type: MatildaTheme,
    description:
      "A soft, pastel‑toned two‑column theme with gentle typography and a friendly, editorial touch.",
    tags: [
      ThemeTags.twoCol,
      ThemeTags.headshot,
      ThemeTags.lightMode,
      ThemeTags.pastel,
      ThemeTags.resume,
      ThemeTags.technical
    ]
  },
  [TimesTheme.id]: {
    type: TimesTheme,
    description:
      "A playful newspaper‑inspired résumé with an editorial layout and a subtle sense of humor.",
    tags: [
      ThemeTags.twoCol,
      ThemeTags.lightMode,
      ThemeTags.editorial,
      ThemeTags.typographyForward,
      ThemeTags.playful
    ]
  },
  [TypewriterTheme.id]: {
    type: TypewriterTheme,
    description:
      "A retro, monochrome résumé styled like a typewritten page. Charmingly imperfect and intentionally quirky.",
    tags: [
      ThemeTags.singleCol,
      ThemeTags.lightMode,
      ThemeTags.monoChrome,
      ThemeTags.resume,
      ThemeTags.humorous,
      ThemeTags.retro
    ]
  },
  [WinterTheme.id]: {
    type: WinterTheme,
    description: "A crisp, cool, spacious layout with bright whites and clean structure.",
    tags: [
      ThemeTags.twoCol,
      ThemeTags.headshot,
      ThemeTags.lightMode,
      ThemeTags.cool,
      ThemeTags.resume
    ]
  }
};

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

export default ThemeRegistry;
