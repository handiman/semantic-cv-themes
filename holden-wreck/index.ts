import { BoilingDieselTheme } from "../boiling-diesel/index.js";
import { Theme } from "../theme.js";
import { HTMLTransformer } from "../htmlTransformer.js";
import { Person } from "../person.js";
import { ThemeTags } from "../themeTags.js";
import { ThemeMetadata } from "../themeMetadata.js";

const meta = {
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

export class HoldenWreckTheme extends Theme {
  private base: BoilingDieselTheme;
  constructor(transformer: HTMLTransformer, loadAsset: (_: string) => Promise<string>) {
    super(loadAsset, meta);
    this.base = new BoilingDieselTheme(transformer, loadAsset, meta);
  }

  static get meta(): ThemeMetadata {
    return meta;
  }

  renderHTML(person: Person): Promise<string> {
    return this.base.renderHTML(person);
  }
}
