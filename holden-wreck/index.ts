import { BoilingDieselTheme } from "../boiling-diesel/index.js";
import { Theme } from "../theme.js";
import { HTMLTransformer } from "../htmlTransformer.js";
import { Person } from "../person.js";
import { ThemeTags } from "../themeTags.js";

const id = "holden-wreck";
const title = "Holden wreck";
const description =
  "A clean, approachable two‑column résumé with a light, balanced layout and clear structure.";
const tags = [
  ThemeTags.twoCol,
  ThemeTags.resume,
  ThemeTags.lightMode,
  ThemeTags.minimal,
  ThemeTags.editorial,
  ThemeTags.calm
];

export class HoldenWreckTheme extends Theme {
  private base: BoilingDieselTheme;
  constructor(transformer: HTMLTransformer, loadAsset: (_: string) => Promise<string>) {
    super(HoldenWreckTheme.id, loadAsset);
    this.base = new BoilingDieselTheme(transformer, loadAsset);
  }

  static get id() {
    return id;
  }

  static get title() {
    return title;
  }

  static get description() {
    return description;
  }

  static get tags() {
    return tags;
  }

  renderHTML(person: Person): Promise<string> {
    return this.base.renderHTML(person);
  }

  async renderCSS(person: Person): Promise<string> {
    const css = await this.base.renderCSS(person);
    return css.replace(
      /:root\s*\{[\s\S]*?\}/,
      `:root {
        --header-color: #6b5a3a;
        --text-color: #2f3a2e;
        --heading-color: var(--text-color);
        --border-color: #7a7f82;
        --link-color: var(--text-color);
        --link-color-visited: var(--border-color);
        --space-1: 10px;
        --space-2: 20px;
        --space-3: 40px;
        --image-size: 270px;
        --half-header-height: calc((var(--image-size) / 2) + var(--space-3));
      }`
    );
  }
}
