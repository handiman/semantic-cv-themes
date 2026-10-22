#!/usr/bin/env node
// Creates a new theme from the templates in scripts/templates:
//   npm run new-theme -- my-theme
// writes my-theme/index.ts and my-theme/my-theme.css. Then build, look at it with
// `npm run preview`, and add its snapshots with `npm run test:update-snapshots`.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const templates = path.join(root, "scripts", "templates");

/** Directory names the registry generator skips, so a theme can't use them. */
const reserved = ["node_modules", "dist", "scripts", "test"];

/** The class name the registry generator expects: "my-theme" → "MyThemeTheme". */
export const className = (id) =>
  id
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\s+/g, "") + "Theme";

/** A first title from the id: "my-theme" → "My theme". */
export const title = (id) => {
  const words = id.replace(/-/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
};

/** Why the id can't be used for a new theme, or undefined if it can. */
export const problemWith = (id, existing = []) => {
  if (!id) {
    return "Give the id of the new theme, for example: npm run new-theme -- my-theme";
  }
  if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(id)) {
    return `"${id}" is not a valid theme id: use lower-case letters, digits and single hyphens, starting with a letter.`;
  }
  if (reserved.includes(id)) {
    return `"${id}" is reserved and can't be a theme id.`;
  }
  if (existing.includes(id)) {
    return `A directory named "${id}" already exists.`;
  }
  return undefined;
};

/** The files of a new theme, by path relative to the repository. */
export const themeFiles = (id) => {
  const fill = (template) =>
    fs
      .readFileSync(path.join(templates, template), "utf8")
      .replaceAll("__CLASS__", className(id))
      .replaceAll("__ID__", id)
      .replaceAll("__TITLE__", title(id));
  return {
    [`${id}/index.ts`]: fill("index.ts.template"),
    [`${id}/${id}.css`]: fill("theme.css.template")
  };
};

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const id = process.argv[2];
  const existing = fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  const problem = problemWith(id, existing);
  if (problem) {
    console.error(problem);
    process.exit(1);
  }
  for (const [file, content] of Object.entries(themeFiles(id))) {
    fs.mkdirSync(path.join(root, path.dirname(file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), content);
    console.log(`Created ${file}`);
  }
  console.log(`
Next:
  1. Set the description and tags in ${id}/index.ts, and make the layout and CSS your own.
  2. npm run preview, and open dist/preview/index.html to see it next to the other themes.
  3. npm run test:update-snapshots, then npm test.`);
}
