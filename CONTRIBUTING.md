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

1. **Create it from the template:** `npm run new-theme -- my-theme`. The id is lower-case kebab-case and names the folder and the class (`my-theme` → `MyThemeTheme`). You get `my-theme/index.ts` and `my-theme/my-theme.css`, and the new theme already passes all tests.
2. **Make it yours.** In `index.ts`, set the description and tags in `meta`, and shape the `layout(person)`: the page skeleton, with a `<slot name="worksFor"></slot>` and so on wherever a part of the CV goes. The base class fills each slot, or removes it when there is nothing for it. Parts in your own markup (the header, contact details) go in `slots(person)`. If you want full control instead, override `renderHTML(person)`, like `gnap/` does.
3. **Style it** in `my-theme.css`. It's loaded after a small shared reset. Set the shared CSS variables (`--text-color`, `--space-1`, …) in its `:root`; CLAUDE.md lists them.
4. **Optionally add `my-theme/my-theme.js`** for behavior. It runs as a module, and the page includes a `<semantic-cv-theme-my-theme>` element that your script can define. See `matilda/` and `times/`.
5. **Look at it:** `npm run preview`, then open `dist/preview/index.html`. It shows every theme with a full CV and with only a name. Check the print preview too, since many people print their CV or save it as a PDF.
6. **Add its snapshots:** `npm run test:update-snapshots`, then `npm test`.

### Treat the Person as already escaped

The Person passed to `renderHTML` is already HTML-escaped by semantic-cv-core, and unsafe URLs are removed. Insert its values as HTML (`{ html: true }`) and don't escape them again.

Never place Person values inside a `<script>`, an `on…` attribute or a `style` attribute. HTML escaping doesn't make them safe there.

## Making a change

1. Branch from `master`, named after the kind of change: `fix/…`, `feat/…`, `docs/…`, `refactor/…`.
2. Add or update tests in `test/` for anything that isn't purely visual.
3. Run `npm test`. CI runs it and it must pass before a merge.
   - `test/snapshot.test.js` compares the HTML of every theme with the files in `test/snapshots`. If your change is meant to change a theme's markup (or adds a theme), run `npm run test:update-snapshots` and commit the updated files, so reviewers can see what changed. If you didn't mean to change any markup, the snapshots must stay as they are.
4. Write commit messages as `type(Scope): Subject`, for example `feat(Themes): Add theme "My theme"`.
5. Open a pull request against `master`. Say what it changes and why, add a screenshot for visual changes, and link the issue it closes (`Closes #123`).

## Code of conduct

Everyone taking part is expected to follow the [code of conduct](CODE_OF_CONDUCT.md).
