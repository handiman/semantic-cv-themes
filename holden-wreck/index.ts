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
      "Boiling Diesel's layout in earthier colours: an olive header band, a round photo with a grey ring and dark slate headings on a white page.",
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
