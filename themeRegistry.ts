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
 * ThemeRegistry is intentionally static and side‑effect‑free: themes do not
 * self‑register, and the registry remains the single source of truth for
 * available themes.
 */
import ThemeRegistry from "./themeRegistry.generated.js";
export { default as ThemeRegistry } from "./themeRegistry.generated.js";
export default ThemeRegistry;
