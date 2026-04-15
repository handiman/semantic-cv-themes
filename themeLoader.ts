import { Theme } from "./theme.js";
import { HTMLTransformer } from "./htmlTransformer.js";
import { ThemeRegistry } from "./themeRegistry.js";

/**
 * Factory responsible for instantiating concrete theme classes.
 *
 * The loader is runtime‑neutral: it receives the active HTMLTransformer
 * and asset loader function, then injects them into the selected theme
 * when constructing it.
 *
 * If an unknown theme ID is requested, the loader falls back to the
 * "minimal" theme defined in the ThemeRegistry.
 */
export class ThemeLoader {
  /**
   * @param transformer HTML rewriting implementation used by the theme.
   * @param loadAsset Function for loading theme assets (CSS/JS) by name.
   *                  Provided by the surrounding runtime (CLI or Worker).
   */ constructor(
    private transformer: HTMLTransformer,
    private loadAsset: (assetName: string) => Promise<string>
  ) {}

  /**
   * Instantiate a theme by ID.
   *
   * @param themeId Identifier of the theme to load. Must correspond to a
   *                registered theme in the ThemeRegistry. Falls back to
   *                the "minimal" theme if the ID is unknown.
   * @returns A concrete Theme instance ready for rendering.
   */
  loadTheme(themeId: string): Theme {
    const { type } = ThemeRegistry[themeId] ?? ThemeRegistry["minimal"];
    return new type(this.transformer, this.loadAsset);
  }
}

export default ThemeLoader;
