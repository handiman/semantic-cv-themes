#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { readdir } from "node:fs/promises";

const themesPath = process.argv[2];
if (!themesPath) {
  console.error("Missing path to themes directory");
  process.exit(1);
}

const toThemeName = (slug) => {
  return (
    slug
      .replace(/-/g, " ") // replace "-" with space
      .replace(/\b\w/g, (c) => c.toUpperCase()) // TitleCase
      .replace(/\s+/g, "") + // remove space
    "Theme"
  );
};

const entries = await readdir(themesPath, { withFileTypes: true });
const themes = [];
for (const entry of entries) {
  if (entry.isDirectory()) {
    if (entry.name.startsWith(".") || ["dist", "scripts"].includes(entry.name)) {
      continue;
    }
    const themeSlug = entry.name;
    const themeName = toThemeName(themeSlug);
    themes.push({
      themeSlug,
      themeName
    });
  }
}

const stream = fs.createWriteStream(path.join(themesPath, "themeRegistry.generated.ts"), {
  flags: "w"
});
const writeLine = (data) => {
  stream.write(data + "\n");
};

writeLine(`import { ThemeRegistryEntry } from "./themeRegistryEntry.js";`);
writeLine(`import { titleify } from "./theme.js";`);
for (const theme of themes) {
  writeLine(`import { ${theme.themeName} } from "./${theme.themeSlug}/index.js";`);
}
writeLine(`const ThemeRegistry: Record<string, ThemeRegistryEntry> = {${themes
  .map(
    (theme) => `\n  [${theme.themeName}.id]: {
    type: ${theme.themeName},
    title: ${theme.themeName}.title ?? titleify(${theme.themeName}.id),
    description: ${theme.themeName}.description,
    tags: ${theme.themeName}.tags
  }`
  )
  .join(",")}    
};
export default ThemeRegistry;
`);

stream.end();
