import { BoilingDieselTheme } from "../boiling-diesel/index.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeMetadata } from "../themeMetadata.js";

/**
 * Boiling Diesel's layout with its own colors: the HTML comes from Boiling Diesel, the CSS from
 * holden-wreck.css.
 */
export class HoldenWreckTheme extends BoilingDieselTheme {
  static readonly meta: ThemeMetadata = {
    id: "holden-wreck",
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
  };
}
