#!/usr/bin/env node
// Renders every theme with the full and the name-only Person from test/persons.js into
// dist/preview, with an index page that shows them side by side:
//   npm run preview
// then open dist/preview/index.html. Each page is put together the way semantic-cv-core does it
// (the theme's HTML, CSS and JS, and its enhancement element), so it looks like the real thing,
// on screen and in the browser's print preview.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "dist", "preview");
const load = (file) => import(pathToFileURL(path.join(root, file)).href);

const { ThemeRegistry } = await load("dist/themeRegistry.js");
const { JsdomTransformer, loadAsset } = await load("test/jsdomTransformer.js");
const { ThemeLoader } = await load("dist/themeLoader.js");
const { themeOptionsFor } = await load("dist/themeOptions.js");
const { fullPerson, nameOnlyPerson } = await load("test/persons.js");

// The test Person's photo points to example.com, which doesn't exist. The preview shows a drawn
// placeholder instead, so a theme's photo frame can be judged. (Core removes data: URLs from a real
// Person; this one never leaves the preview.)
const photo =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" fill="#c9d3dc"/><circle cx="60" cy="46" r="22" fill="#8a9aa9"/><path d="M20 120c4-26 20-38 40-38s36 12 40 38z" fill="#8a9aa9"/></svg>`
  );

const persons = [
  { key: "full", label: "Full CV", person: { ...fullPerson, image: photo } },
  { key: "name-only", label: "Only a name", person: nameOnlyPerson },
  { key: "sv", label: "In Swedish", person: { ...fullPerson, image: photo }, language: "sv" }
];

// The Persons in test/persons.js are already escaped, like the Person core hands a theme. The
// theme's own title and description come from this repository.
const page = async (themeId, person, language) => {
  const theme = new ThemeLoader(new JsdomTransformer(), loadAsset).loadTheme(
    themeId,
    themeOptionsFor(language)
  );
  const html = await theme.renderHTML(structuredClone(person));
  const css = await theme.renderCSS(person);
  const js = await theme.renderJS(person);
  return `<!DOCTYPE html>
<html${language ? ` lang="${language}"` : ""}>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${themeId} – preview</title>
  <script type="module">${js}</script>
  <style type="text/css">${css}</style>
</head>
<body>
${html}
<semantic-cv-theme-${themeId}></semantic-cv-theme-${themeId}>
<footer class="scv-footer">Rendered with <a href="https://semantic.cv">semantic.cv</a> — Theme: <a href="#">${themeId}</a></footer>
</body>
</html>
`;
};

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const rows = [];
for (const [themeId, entry] of Object.entries(ThemeRegistry)) {
  const links = [];
  for (const { key, label, person, language } of persons) {
    const file = `${themeId}.${key}.html`;
    fs.writeFileSync(path.join(out, file), await page(themeId, person, language));
    links.push(`<a href="${file}">${label}</a>`);
  }
  rows.push(`
    <article>
      <h2>${entry.title ?? themeId} <small>${themeId}</small></h2>
      <p>${entry.description}</p>
      <p>${links.join(" · ")}</p>
      <div class="frames">
        ${persons.map(({ key }) => `<iframe src="${themeId}.${key}.html" title="${themeId}, ${key}" loading="lazy"></iframe>`).join("")}
      </div>
    </article>`);
}

fs.writeFileSync(
  path.join(out, "index.html"),
  `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Semantic-CV themes – preview</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 2rem; color: #222; background: #f4f4f4; }
    article { background: #fff; padding: 1rem 1.5rem; margin-bottom: 2rem; border-radius: 6px; }
    h2 small { font-weight: normal; color: #888; font-size: 0.8em; }
    .frames { display: flex; gap: 1rem; overflow-x: auto; }
    iframe { width: 600px; height: 450px; border: 1px solid #ddd; flex: none; }
  </style>
</head>
<body>
  <h1>Semantic-CV themes</h1>
  <p>Every theme with a full CV, with only a name, and in Swedish. Open a page to see it full size, and use the browser's print preview to check the printed CV.</p>
  ${rows.join("\n")}
</body>
</html>
`
);

console.log(
  `Wrote ${Object.keys(ThemeRegistry).length * persons.length} pages. Open ${path.relative(process.cwd(), path.join(out, "index.html"))}`
);
