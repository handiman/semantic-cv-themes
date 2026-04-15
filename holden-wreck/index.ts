import { BoilingDieselTheme } from "../boiling-diesel/index.js";
import { Theme } from "../theme.js";
import { HTMLTransformer } from "../htmlTransformer.js";
import { Person } from "../person.js";

export class HoldenWreckTheme extends Theme {
  private base: BoilingDieselTheme;
  constructor(transformer: HTMLTransformer, loadAsset: (_: string) => Promise<string>) {
    super(HoldenWreckTheme.id, loadAsset);
    this.base = new BoilingDieselTheme(transformer, loadAsset);
  }

  static get id() {
    return "holden-wreck";
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
