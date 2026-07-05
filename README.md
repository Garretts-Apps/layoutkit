# LayoutKit

LayoutKit is a tiny pure-CSS layout vocabulary for readable app structure.

It ships as `layoutkit-css` on npm:

- npm: https://www.npmjs.com/package/layoutkit-css
- Website: https://layoutkit.dev
- GitHub: https://github.com/Garretts-Apps/layoutkit

LayoutKit gives you developer-readable layout primitives such as `lk-stack`,
`lk-row`, `lk-grid`, and `lk-center`, so app structure is easier to scan without
adopting a framework, runtime, or design system. These tags are intent-shaped
layout markup styled by one CSS file. They are semantic to developers, but
browsers and assistive technologies do not treat them like native semantic HTML.

Use LayoutKit inside real HTML landmarks, sections, headings, links, buttons,
lists, tables, and forms.

## What LayoutKit Is

- One CSS file from npm, a CDN, or a local copy.
- No runtime JavaScript.
- No npm dependencies.
- No custom element registration.
- Framework-agnostic.
- A small set of layout wrappers for readable app structure.
- Low-specificity CSS in `@layer layoutkit`.

## What LayoutKit Is Not

LayoutKit is not a component library, design system, substitute for semantic
HTML, button kit, form kit, typography system, color theme, icon library,
animation system, JavaScript behavior layer, stateful app shell, data table
solution, or substitute for normal CSS.

When a layout needs named grid areas, complex container-query logic, dense
responsive rules, or component-specific behavior, use normal CSS.

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
does not load, `lk-*` tags are plain unknown elements without intended layout
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
    <lk-text>Dashboard</lk-text>
  </lk-stack>
</lk-box>
```

The bad example loses native document meaning. Do not use `lk-*` elements as
headings, lists, tables, forms, landmarks, links, buttons, or controls.

## Core Primitives

`lk-stack`, `lk-row`, `lk-center`, `lk-box`, `lk-card`, `lk-spread`, `lk-grid`,
`lk-cluster`, `lk-switcher`, `lk-sidebar`, `lk-cover`, `lk-spacer`,
`lk-divider`, `lk-aspect-ratio`, and `lk-scroll-area`.

Common attributes include `gap`, `padding`, `align`, `justify`, `place`,
`center`, `fill`, `full-height`, `wrap`, `reverse`, `width`, `cols`, `rows`,
`responsive`, `min`, `col-gap`, `row-gap`, `flow`, `place-items`, `size`,
`orientation`, `thickness`, `direction`, `max-h`, `ratio`, `radius`, `surface`,
`border`, `side`, `lk-text`, and `lk-weight`.

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
      <lk-grid responsive min="md" gap="md">
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
  --lk-space-sm: var(--space-sm, 0.5rem);
  --lk-space-md: var(--space-md, 1rem);
  --lk-space-lg: var(--space-lg, 1.5rem);
  --lk-text-md: var(--text-md, 1rem);
  --lk-radius-md: var(--radius-md, 0.75rem);
}
```

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
- LayoutKit provides layout behavior only. Accessibility still depends on the
  underlying HTML and application code.

## TSX/JSX

The package includes `jsx.d.ts`, a dependency-free declaration file for known
`lk-*` elements and common attributes. It only teaches TypeScript about the
custom tags; it does not add runtime JavaScript or custom element behavior.

```json
{
  "compilerOptions": {
    "types": ["layoutkit-css"]
  }
}
```

React-specific HTML prop typing still comes from the consuming app's React and
`@types/react` setup. LayoutKit does not depend on React.

## Browser Support

LayoutKit targets modern evergreen browsers with support for custom properties,
flexbox, grid, cascade layers, logical properties, `aspect-ratio`, `svh`, and
`color-mix()`.

## Security And Package Verification

LayoutKit has no runtime JavaScript, npm dependencies, remote imports, network
requests, or install scripts.

```bash
npm pack layoutkit-css
tar -tzf layoutkit-css-*.tgz
```

Use pinned installs when you need reproducible builds:

```bash
npm install layoutkit-css@1.3.0
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
