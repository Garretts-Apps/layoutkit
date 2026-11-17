# LayoutKit

LayoutKit is one CSS file of layout tags for semantic HTML. The file is
85,031 bytes (13,626 bytes gzipped). There is no runtime JavaScript, no
dependency, and no build step to use it: link the stylesheet or import it once.

It ships as `layoutkit-css` on npm:

- npm: https://www.npmjs.com/package/layoutkit-css
- Website: https://layoutkit.dev
- GitHub: https://github.com/Garretts-Apps/layoutkit

The registry’s latest release is 1.3.2, published 5 July 2026. The file in
this repository is 2.2.0. A CDN URL for the package still serves 1.3.2 until
2.2.0 is published.

`lk-stack`, `lk-row`, `lk-grid`, and `lk-center` name the layout so you are not
rewriting the same flex column, and so a later reader can see the intent
without decoding a utility-class string. The tags are for developers. Browsers
and assistive technologies do not treat them like native semantic HTML.

Use LayoutKit inside real HTML landmarks, sections, headings, links, buttons,
lists, tables, and forms.

## What LayoutKit Is

- One CSS file from npm, a CDN, or a local copy.
- No runtime JavaScript.
- No npm dependencies.
- No custom element registration.
- Framework-agnostic.
- A small set of layout wrappers for readable app structure.
- Rules in `@layer layoutkit`. Unlayered CSS written later wins, including a one-class rule.

## What LayoutKit Is Not

LayoutKit is not a component library, design system, substitute for semantic
HTML, button kit, form kit, typography system, icon library, animation system,
JavaScript behavior layer, stateful app shell, data table solution, or
substitute for normal CSS. It is not Tailwind: a few tags, not a class per
property. It is not Bootstrap: no widget script and no control skin, except
`lk-select`, which opts a native `select` into `appearance: base-select` only
where that value exists. It is in the same family as Every Layout (stack,
switcher, sidebar, cluster, cover, centered overlay). Every Layout is the book.
This package is the file.

`--lk-base` and the OKLCH relatives derived from it do not paint anything until
you use the variables. Named grid areas still belong in normal CSS. 2.0.0
measures switcher, sidebar, and grid from their own size. 2.2.0 keeps those
defaults. Centered overflow uses `safe center` where that keyword exists.
See `packages/layoutkit/MIGRATION.md`.

## Install

```bash
npm install layoutkit-css
```

Import the stylesheet once at your application root or global CSS entry:

```js
import "layoutkit-css/layoutkit.css";
```

CDN usage:

```html
<link rel="stylesheet" href="https://unpkg.com/layoutkit-css/layoutkit.css">
```

Local copy:

```html
<link rel="stylesheet" href="/css/layoutkit.css">
```

Load LayoutKit CSS early in the document `<head>` when it controls initial page
layout. Avoid lazy-loading it through JavaScript for initial layout. If the CSS
does not load, nothing in JavaScript rebuilds it and `lk-*` tags are plain unknown elements without intended layout
styling.

## Semantic HTML Guidance

Good:

```html
<main>
  <section aria-labelledby="dashboard-heading">
    <lk-stack gap="lg">
      <h1 id="dashboard-heading">Dashboard</h1>
      <lk-grid cols="3" responsive>
        <article>
          <h2>Open orders</h2>
          <p>128</p>
        </article>
      </lk-grid>
    </lk-stack>
  </section>
</main>
```

Bad:

```html
<lk-box>
  <lk-stack>
    <lk-box lk-text="2xl">Dashboard</lk-box>
  </lk-stack>
</lk-box>
```

The bad example loses native document meaning. `lk-text` is an attribute for a
real element, not a tag. Do not use `lk-*` elements as headings, lists, tables,
forms, landmarks, links, buttons, or controls.

## Core Primitives

`lk-stack`, `lk-row`, `lk-center`, `lk-box`, `lk-card`, `lk-spread`, `lk-grid`,
`lk-cluster`, `lk-switcher`, `lk-sidebar`, `lk-cover`, `lk-frame`, `lk-bleed`,
`lk-spacer`, `lk-divider`, `lk-aspect-ratio`, `lk-scroll-area`, `lk-progress`,
`lk-popover`, `lk-disclosure`, `lk-menu`, `lk-dock`, `lk-select`, and
`lk-columns`.

Common attributes include `gap`, `padding`, `align`, `justify`, `place`,
`center`, `fill`, `full-height`, `wrap`, `reverse`, `width`, `cols`, `rows`,
`responsive`, `min`, `col-gap`, `row-gap`, `flow`, `place-items`, `size`,
`orientation`, `thickness`, `direction`, `max-h`, `ratio`, `radius`, `surface`,
`border`, `side`, `container`, `subgrid`, `adapt`, `snap`, `slide`, `sticky`,
`anchor`, `panel`, `scope`, `limit`, `overlay`, `look`, `pattern`, `blend`,
`bands`, `reading`, `stuck`, `mark`, `cue`, `match`, `spot`, `lk-text`, and `lk-weight`.

`min` on `lk-grid` is auto-fit and overrides `responsive`. Empty tracks
collapse, so items fill the row. `flow` on `lk-box` and `lk-card` uses the
spacing scale; on `lk-grid` it is `row`, `col`, or `dense`. `full-height` and
`lk-cover` use `100dvh`, then `100svh`, then `100vh`. Put `center` on the
`lk-cover` child that should sit in the middle. The default divider follows
`currentColor`. Replaced children of `lk-aspect-ratio` fill the frame.

Since 2.0.0, omitting `container` does not turn container queries off. Switcher,
sidebar, and grid are query containers unless you set `container="off"`.
Single-child centering, center overlay, a switcher limit of 4, fluid space, and
horizontal scroll-snap are also defaults. `subgrid`, `snap` on a row, `sticky`,
`anchor`, `panel`, `look`, `pattern`, `blend`, `bands`, `reading`, `stuck`,
`mark`, `cue`, `match`, and `spot` stay off until set. A reversed row and a
dense grid set `reading-flow` on their own where that property exists.
Container queries, `:has()`, subgrid, scroll snap, sticky positioning, scroll
timelines, anchor positioning, `reading-flow`, scroll-state queries,
`interpolate-size`, and `appearance: base-select` are wrapped in `@supports`.
The last four are not in every current browser. See the docs browser-support
section.

## Frozen Convenience Helpers

`lk-card`, `lk-text`, and `lk-weight` are intentionally small convenience
helpers. They are not the start of a component or typography system, and new
visual styling primitives should be rejected unless they directly support
layout.

## Examples

Dashboard:

```html
<main>
  <section aria-labelledby="orders-heading">
    <lk-stack gap="lg">
      <lk-spread align="center">
        <h1 id="orders-heading">Orders</h1>
        <a href="/orders">View all</a>
      </lk-spread>
      <lk-grid responsive gap="md">
        <article>
          <h2>Open orders</h2>
          <p>128</p>
        </article>
        <article>
          <h2>Delayed</h2>
          <p>7</p>
        </article>
      </lk-grid>
    </lk-stack>
  </section>
</main>
```

Native form controls:

```html
<form action="/settings" method="post">
  <lk-stack gap="md">
    <label>
      Display name
      <input name="name" autocomplete="name">
    </label>
    <lk-row gap="sm" wrap>
      <button type="submit">Save</button>
      <a href="/settings">Cancel</a>
    </lk-row>
  </lk-stack>
</form>
```

Scroll area:

```html
<section aria-labelledby="activity-heading">
  <lk-stack gap="sm">
    <h2 id="activity-heading">Recent activity</h2>
    <lk-scroll-area max-h="md" direction="vertical">
      <ol>
        <li>Order #128 opened</li>
        <li>Order #127 shipped</li>
      </ol>
    </lk-scroll-area>
  </lk-stack>
</section>
```

## Design Tokens

LayoutKit variables default to app-level variables when present:

```css
:root {
  --lk-space-sm: var(--space-sm, var(--lk-space-fluid-sm));
  --lk-space-md: var(--space-md, var(--lk-space-fluid-md));
  --lk-space-lg: var(--space-lg, var(--lk-space-fluid-lg));
  --lk-text-md: var(--text-md, 1rem);
  --lk-radius-md: var(--radius-md, 0.75rem);
}
```

The fluid clamps are the default. A host `--space-*` token replaces that step.
`--lk-space-static-*` still holds the old rem steps.

Map LayoutKit to your app tokens:

```css
:root {
  --space-sm: var(--space-2);
  --space-md: var(--space-4);
  --space-lg: var(--space-6);
}
```

Or override LayoutKit directly:

```css
:root {
  --lk-space-sm: 0.375rem;
  --lk-space-md: 0.875rem;
  --lk-space-lg: 1.25rem;
  --lk-radius-md: 0.5rem;
}
```

## Accessibility

- LayoutKit wraps and arranges semantic HTML.
- LayoutKit does not replace semantic HTML.
- Do not put click handlers on `lk-*` elements. Use `button` or `a`.
- Do not use `lk-*` elements as headings, lists, tables, forms, landmarks, or
  controls.
- If a LayoutKit wrapper has no semantic purpose, it usually does not need ARIA.
- Do not add ARIA roles just to make layout wrappers seem semantic.
- Prefer native HTML first.
- LayoutKit should not interfere with focus order.
- Avoid hiding overflow in ways that trap keyboard users.
- Scroll containers should remain keyboard and screen-reader usable.
- `lk-scroll-area` does not create a tab stop. If the region itself must be
  scrolled from the keyboard, set `tabindex="0"` and a name on it. Without
  `direction`, both axes scroll; `direction="vertical"` clips inline overflow.
- LayoutKit provides layout behavior only. Accessibility still depends on the
  underlying HTML and application code.

## TSX/JSX

The package includes `jsx.d.ts`, a dependency-free declaration file for known
`lk-*` elements and the attributes each one implements. It only teaches
TypeScript about the custom tags; it does not add runtime JavaScript or custom
element behavior.

```ts
import "layoutkit-css/layoutkit.css";
```

```ts
/// <reference types="layoutkit-css" />
```

`compilerOptions.types` replaces TypeScript's automatic `@types` list. Use that
array only when it still names every package you need. React prop typing still
comes from the consuming app. LayoutKit does not depend on React.

## Browser Support

Current Chrome, Firefox, and Safari can use the flex, grid, layer, and logical
property layout. `100dvh` then `100svh` then `100vh`. Dividers fall back from
`color-mix()` to `#e5e7eb`. Card borders do not have that second color.

Container queries, `:has()`, subgrid, snap, and sticky are baseline in current
major browsers and still guarded. Anchor positioning, scroll-driven animation,
`interpolate-size` (disclosure height), and `appearance: base-select` are not
universal. As of November 2026, `reading-flow` and scroll-state queries are
Chromium only. `popover="hint"` is Chromium and Firefox, not Safari.
`interpolate-size: allow-keywords` is Chromium only among stable engines, and
`base-select` is Chromium plus Safari 27, not Firefox stable. Missing support
skips the enhancement. The control, the disclosure, and the source order still
work.

## Security And Package Verification

LayoutKit has no runtime JavaScript, npm dependencies, remote imports, network
requests, or install scripts.

```bash
npm pack layoutkit-css
tar -tzf layoutkit-css-*.tgz
```

Use pinned installs when you need reproducible builds:

```bash
npm install layoutkit-css@2.2.0
```

## Repository

This repository also hosts the static Vercel website for layoutkit.dev.

- `index.html`, `install.html`, `docs.html`, `playground.html`, `tutorial.html`
  are static pages.
- `layoutkit.css` is the site copy of the package stylesheet, generated from
  `packages/layoutkit/gen.mjs`.
- `assets/site.css` is the website skin.
- `assets/playground.js` powers only the optional playground page.
- `vercel.json` preserves the static Vercel deployment model.

Useful commands:

```bash
npm run build
npm run check
npm pack --dry-run --prefix packages/layoutkit
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the design rules that prevent
attribute sprawl and dependency creep.

## License

MIT
