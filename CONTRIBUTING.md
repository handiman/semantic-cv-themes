# Contributing to Semantic-CV themes

Thanks for taking an interest. New themes, fixes to existing ones and ideas are all welcome.

## Before you start

- **Found a bug or have an idea?** Open an [issue](https://github.com/handiman/semantic-cv-themes/issues).
- **Planning a new theme or a larger change?** Open an issue first with a sketch or a short description, so we can agree on it before you put time into it.
- **Found a security problem?** Don't open a public issue. Email [security@semantic.cv](mailto:security@semantic.cv) instead.

These themes are used by both the [Semantic-CV CLI](https://github.com/handiman/semantic-cv) and [semantic.cv](https://semantic.cv), which include this repository as a Git submodule.

## Getting set up

You need Node.js 20 or later (CI runs Node 25).

```sh
git clone https://github.com/handiman/semantic-cv-themes.git
cd semantic-cv-themes
npm ci
npm test
```

## Adding a theme

1. **Create a folder named after the theme's id**, in lower-case kebab-case, for example `my-theme/`. The folder name gives the class name: `my-theme` must export `MyThemeTheme`. The registry (`themeRegistry.generated.ts`) is generated from the folders, so you don't edit it by hand.
2. **Add `my-theme/index.ts`** with a class that extends `Theme`, with a `meta` (`id`, `title`, `description`, `tags`) and a `renderHTML(person)`. `minimal/` is the simplest one to start from. Use the base class's section renderers (`renderWorksFor`, `renderSkills` and so on) where they fit.
3. **Add `my-theme/my-theme.css`.** It's loaded after a small shared reset.
4. **Optionally add `my-theme/my-theme.js`** for behavior. It runs as a module, and the page includes a `<semantic-cv-theme-my-theme>` element that your script can define. See `matilda/`.
5. **Check that it prints well**, since many people print their CV or save it as a PDF.

### Treat the Person as already escaped

The Person passed to `renderHTML` is already HTML-escaped by semantic-cv-core, and unsafe URLs are removed. Insert its values as HTML (`{ html: true }`) and don't escape them again.

Never place Person values inside a `<script>`, an `on…` attribute or a `style` attribute. HTML escaping doesn't make them safe there.

## Making a change

1. Branch from `master`, named after the kind of change: `fix/…`, `feat/…`, `docs/…`, `refactor/…`.
2. Add or update tests in `test/` for anything that isn't purely visual.
3. Run `npm test`. CI runs it and it must pass before a merge.
4. Write commit messages as `type(Scope): Subject`, for example `feat(Themes): Add theme "My theme"`.
5. Open a pull request against `master`. Say what it changes and why, add a screenshot for visual changes, and link the issue it closes (`Closes #123`).

## Code of conduct

Everyone taking part is expected to follow the [code of conduct](CODE_OF_CONDUCT.md).
