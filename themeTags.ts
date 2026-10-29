// Tags describe what a theme looks like, so they can be checked against its preview. Every theme
// prints well and renders a résumé, so there are no tags for that. Add a tag when a theme needs it.
export const ThemeTags = {
  // 1. Layout - the shape of the page.
  /** The CV runs in one column; a small grid for skills and languages still counts. */
  singleCol: "single-column",
  /** A sidebar or second column runs next to the main column. */
  twoCol: "two-column",
  /** The first screen is a hero with the name, before the CV. */
  heroFullscreen: "hero-fullscreen",
  /** A band of color across the top, behind the name or photo. */
  accentHeader: "accent-header",
  /** Shows the Person's photo when there is one. */
  photo: "photo",
  minimal: "minimal",

  // 2. Color and tone - the palette and the feel.
  lightMode: "light-mode",
  darkMode: "dark-mode",
  highContrast: "high-contrast",
  monoChrome: "monochrome",
  accented: "accented",
  warm: "warm",
  cool: "cool",
  neutral: "neutral",
  pastel: "pastel",
  muted: "muted",
  bold: "bold",
  calm: "calm",
  playful: "playful",
  editorial: "editorial",
  retro: "retro",

  // 3. Style - what stands out.
  /** The type carries the design: a distinctive face, small caps, oversized headings. */
  typographyForward: "typography-forward",
  /** Sections sit on shaded blocks of color. */
  colorBlocks: "color-blocks",

  // 4. Use - who the theme suits.
  /** The theme used when none is given, or an unknown one. */
  default: "default",
  technical: "technical",
  creative: "creative",
  corporate: "corporate"
} as const;
export type ThemeTag = (typeof ThemeTags)[keyof typeof ThemeTags];
export default ThemeTags;
