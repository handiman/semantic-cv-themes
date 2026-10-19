# CLAUDE.md

Guidance for Claude Code in this repository.

## What this is

`semantic-cv-themes` — the base `Theme` class and the free themes that render a normalized schema.org/Person CV. Used
by the [semantic-cv](https://github.com/handiman/semantic-cv) CLI (which includes this repo as the Git submodule
`src/themes`) and by the hosted renderer at [semantic.cv](https://semantic.cv). Normalizing, analyzing and the page
skeleton live in `semantic-cv-core`, not here.

## Priorities (in order)

1. **Deterministic, runtime-neutral output.** A theme turns a Person into HTML, CSS and JS strings and nothing else:
   no file or network access, no timestamps, no randomness. Assets are loaded only through the injected `loadAsset`.
2. **No double escaping.** The Person a theme receives is already HTML-escaped (see "Escaping").
3. **Prints well.** CVs get printed and saved as PDF; check the `@media print` result of any layout change.
4. **No runtime dependencies.** `jsdom` is for tests only.

## Conventions

- **Every Person field is optional.** Null-check before rendering and leave out the whole section, heading included,
  when it is empty.
- One directory per theme, named in kebab-case after the theme id: `<id>/index.ts` and `<id>/<id>.css`. The class is
  the title-cased id plus `Theme` (`holden-wreck` → `HoldenWreckTheme`). That naming is what generates the registry.
- A theme extends `Theme` ([theme.ts](theme.ts)), declares a `meta` constant (`id`, `title`, `description`, `tags`),
  exposes it as `static get meta()`, and implements `renderHTML(person)`. `renderCSS` / `renderJS` default to loading
  `<id>.css` / `<id>.js` through `loadAsset`.
- Tags come from `ThemeTags` ([themeTags.ts](themeTags.ts)); don't invent free-form strings.
- Shared building blocks live in [person.ts](person.ts) (`work`, `education`, `projects`, `certifications`),
  [utils.ts](utils.ts) (`normalizeArray`, `linkText`, `locationText`) and [fontawesome.ts](fontawesome.ts). Use them
  rather than re-deriving the same filters in a theme.
- Import paths end in `.js` (ESM, `module: node20`). Tests import the compiled output through `#themes/*`.
- Prettier is authoritative: double quotes, no trailing commas, width 100.

## Stack

- TypeScript, strict, compiled with `tsc` to `dist/`. Tests are plain JavaScript on `node:test`, run against `dist/`.
- `HTMLTransformer` ([htmlTransformer.ts](htmlTransformer.ts)) is the abstraction over `html-rewriter-wasm` (CLI) and
  `HTMLRewriter` (Workers); a theme only uses `on(selector, { element })` and `transform`.
- No CSS preprocessor and no bundler. Theme CSS is a plain file next to the theme.

## Escaping

`semantic-cv-core`'s `renderHTML` escapes every string in the Person and removes unsafe URLs (`javascript:`, `data:`,
…) **before** a theme sees it. Therefore:

- Insert values as HTML (`{ html: true }`) and never call an escape function in a theme.
- Never call a theme with an unescaped Person, and never hand a theme data that didn't come from core. Tests that render
  a theme directly must pass a Person that went through `escapeForHtml` from core.
- Don't add fields to markup from anywhere but the Person (no query strings, no environment).

## Adding a theme

1. Create `<id>/index.ts` and `<id>/<id>.css`, following an existing theme (`minimal` is the smallest).
2. Run `npm run build:themeRegistry` (also part of `npm run build`). It regenerates
   [themeRegistry.generated.ts](themeRegistry.generated.ts) from the directories — **don't edit that file by hand**
   and commit the regenerated version. Directories named `node_modules`, `dist`, `scripts`, `test` or starting with `.`
   are ignored, so a theme can't use those names.
3. Add tags that describe it truthfully and a one-sentence description (they show up in the theme gallery).
4. Check it with a full Person and with an almost empty one (only `name`), on screen and in print preview.

The registry in [themeRegistry.ts](themeRegistry.ts) is the single source of truth: `ThemeLoader` instantiates by id and
falls back to `minimal` for an unknown id. Themes don't register themselves.

## Commands

- `npm ci` – install
- `npm run build:themeRegistry` – regenerate the theme registry
- `npm run build` – clean, regenerate the registry, `tsc`
- `npm test` – build, then all `*.test.js`

Run `npm test` before considering work done. CI (`.github/workflows/ci.yml`) runs it on every push.

## Tests

- `test/theme.test.js` covers the base class (section renderers, the base print CSS); `contact.test.js`,
  `person.test.js` and `index.test.js` cover the shared helpers. Individual themes have no tests of their own, so
  a shared behavior goes in the base class with a test there, not copied into each theme.
- The tests use a small `jsdom`-based `HTMLTransformer` (see `contact.test.js`), not `html-rewriter-wasm`. It runs hooks
  one selector at a time, which is enough to check what text ends up in the page.
- Never wait on the network. No test fetches fonts or icons.

## Working in the CLI repo's submodule

This repository is included in `semantic-cv` as `src/themes`. A change here is a PR in **this** repo; the CLI repo then
bumps its submodule pointer in a separate commit. The CLI build copies the non-`.ts` files (CSS) into `dist/themes`
with `scripts/copy-themes.js`, so an asset in a theme directory must not be a `.ts` file to be shipped.

## Git workflow

Branch from `master` as `fix/…`, `feat/…`, `docs/…`, `refactor/…`, `test/…` or `ci/…`; commits are
`type(Scope): Subject`, for example `fix(Themes): Keep line breaks, dates and colons in printed text`. Permissions for
you:

- **Pushing a branch and opening a PR needs no confirmation.** (If `gh` can't open the PR:
  `POST /repos/<owner>/<repo>/pulls` via the REST API, owner/repo from `git remote get-url origin`, with the token
  `git credential fill` returns for github.com, and the JSON payload in a file — an emoji or backtick in the body
  breaks shell quoting.)
- **Merging into `master` needs asking, every time.** So does anything that ships to users. The CLI repo publishes to
  npm from its own `master`, so a merge here only reaches users once the CLI repo bumps the pointer.
- **Never rebase or force-push an already-pushed branch.** Ask first if rebasing still seems right for some reason.
