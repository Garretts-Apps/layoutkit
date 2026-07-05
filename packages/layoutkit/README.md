# layoutkit-css

LayoutKit is a tiny pure-CSS layout vocabulary for readable app structure.

It provides developer-readable layout primitives such as `lk-stack`, `lk-row`,
`lk-grid`, and `lk-center`, so app structure is easier to scan without adopting
a framework, runtime, or design system. These tags are intent-shaped layout
markup styled by one CSS file. They are semantic to developers, but browsers and
assistive technologies do not treat them like native HTML landmarks, headings,
lists, forms, buttons, links, or tables.

Use LayoutKit inside native semantic HTML.

## What LayoutKit Is

- One CSS file.
- No runtime JavaScript.
- No npm dependencies.
- No custom element registration.
- Framework-agnostic.
- A small set of layout wrappers for readable HTML structure.
- A CSS layer named `layoutkit` with low-specificity selectors.

## What LayoutKit Is Not

LayoutKit is not a component library, design system, substitute for semantic
HTML, button kit, form kit, typography system, color theme, icon library,
animation system, JavaScript behavior layer, stateful app shell, data table
solution, or substitute for normal CSS.

When a layout needs named grid areas, complex container-query logic, dense
responsive rules, or component-specific behavior, use normal CSS.

## Install

### npm

```bash
npm install layoutkit-css
```

Import the stylesheet once at your application root or global CSS entry:

```js
import "layoutkit-css/layoutkit.css";
```

Some CSS bundlers also support:

```css
@import "layoutkit-css/layoutkit.css";
```

### CDN

Load the stylesheet early in the document `<head>`:

```html
<link rel="stylesheet" href="https://unpkg.com/layoutkit-css/layoutkit.css">
```

### Local Stylesheet

You can vendor `layoutkit.css` and link it like any other stylesheet:

```html
<link rel="stylesheet" href="/css/layoutkit.css">
```

## CSS Loading

Load LayoutKit CSS before content that depends on it. Prefer a normal
stylesheet link for CDN or direct browser usage. In frameworks, import it at the
root or global CSS level.

Avoid lazy-loading LayoutKit through JavaScript when it controls initial page
layout. LayoutKit has no JavaScript fallback by design. If the CSS does not
load, `lk-*` tags remain plain unknown elements without the intended layout
styling.

## Semantic HTML Guidance

Good: LayoutKit wraps and arranges semantic HTML.

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

Bad: LayoutKit stands in for document meaning.

```html
<lk-box>
  <lk-stack>
    <lk-text>Dashboard</lk-text>
  </lk-stack>
</lk-box>
```

The bad example loses native document meaning. Use `main`, `section`,
`article`, `header`, `footer`, `nav`, headings, links, buttons, lists, tables,
and form controls for their real HTML jobs. Use `lk-*` tags for layout around
them.

## Core Primitives

LayoutKit currently includes:

- `lk-stack`: vertical flow with `gap`.
- `lk-row`: horizontal flow with `gap`.
- `lk-center`: center children.
- `lk-box`: block wrapper with optional padding, width, and flow spacing.
- `lk-card`: neutral padded block with optional radius, surface, and border.
- `lk-spread`: row with space between children.
- `lk-grid`: CSS grid columns, rows, gaps, and responsive auto-fit.
- `lk-cluster`: wrapping inline group.
- `lk-switcher`: intrinsic row-to-stack layout.
- `lk-sidebar`: wrapping sidebar/content layout.
- `lk-cover`: min-height region with a centered child.
- `lk-spacer`: flexible or fixed spacer.
- `lk-divider`: visual divider.
- `lk-aspect-ratio`: aspect-ratio wrapper.
- `lk-scroll-area`: constrained scroll container.

## Attributes

Common attributes include:

- Spacing: `gap`, `padding`, `col-gap`, `row-gap`.
- Alignment: `align`, `justify`, `place`, `place-items`, `center`.
- Sizing: `fill`, `full-height`, `width`, `size`, `max-h`, `min`.
- Grid: `cols`, `rows`, `responsive`, `flow`.
- Direction and variants: `wrap`, `reverse`, `side`, `orientation`,
  `thickness`, `ratio`, `radius`, `surface`, `border`.
- Namespaced text helpers: `lk-text`, `lk-weight`.

Most finite scales are enumerated so markup stays readable. Free-form values use
custom properties such as `--lk-ratio`, `--lk-divider-color`,
`--lk-min-child-width`, `--lk-max-height`, `--lk-max-width`, `--lk-measure`,
`--lk-switch-at`, and `--lk-sidebar-width`.

## Frozen Convenience Helpers

`lk-card`, `lk-text`, and `lk-weight` are intentionally small convenience
helpers. They are not the start of a component or typography system, and new
visual styling primitives should be rejected unless they directly support
layout.

## Examples

Dashboard layout:

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

Card grid:

```html
<section aria-labelledby="projects-heading">
  <lk-stack gap="lg">
    <h2 id="projects-heading">Projects</h2>
    <lk-grid responsive min="sm" gap="md">
      <article>
        <h3>Website</h3>
        <p>Updated today</p>
      </article>
      <article>
        <h3>Docs</h3>
        <p>Ready for review</p>
      </article>
    </lk-grid>
  </lk-stack>
</section>
```

Toolbar/header spread:

```html
<header>
  <lk-spread align="center">
    <a href="/">Acme</a>
    <nav aria-label="Primary">
      <lk-row gap="sm" wrap>
        <a href="/docs">Docs</a>
        <a href="/pricing">Pricing</a>
      </lk-row>
    </nav>
  </lk-spread>
</header>
```

Centered empty state:

```html
<section aria-labelledby="empty-heading">
  <lk-center style="min-block-size: 20rem;">
    <lk-stack gap="sm" align="center">
      <h2 id="empty-heading">No results</h2>
      <p>Try changing the filters.</p>
      <button type="button">Reset filters</button>
    </lk-stack>
  </lk-center>
</section>
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

All rules live in `@layer layoutkit`, so unlayered app styles override them
normally. If your app uses cascade layers, place `layoutkit` where you want it:

```css
@layer reset, layoutkit, components, utilities;
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
- `lk-scroll-area` only applies overflow and max-size behavior; the content
  inside it still needs usable native markup.
- LayoutKit provides layout behavior only. Accessibility still depends on the
  underlying HTML and application code.

## TSX/JSX

LayoutKit includes a small `jsx.d.ts` file. It teaches TypeScript about the
known `lk-*` elements and common attributes. It does not import React types, add
a runtime, register custom elements, or imply any browser behavior.

For TSX projects, make sure TypeScript includes package types. One option is to
add the package to `compilerOptions.types`:

```json
{
  "compilerOptions": {
    "types": ["layoutkit-css"]
  }
}
```

React-specific HTML prop typing still comes from your own React and
`@types/react` setup. LayoutKit does not depend on React.

## Browser Support

LayoutKit targets modern evergreen browsers with support for custom properties,
flexbox, grid, cascade layers, logical properties, `aspect-ratio`, `svh`, and
`color-mix()`.

## Security And Package Verification

LayoutKit has no runtime JavaScript, npm dependencies, remote imports, network
requests, or install scripts. Verify package contents with:

```bash
npm pack layoutkit-css
tar -tzf layoutkit-css-*.tgz
```

Use pinned installs when you need reproducible builds:

```bash
npm install layoutkit-css@1.3.1
```

Review third-party packages before use.

## Versioning And Stability

The package follows semver. Existing `lk-*` tags and documented attributes are
kept backward-compatible unless a behavior is clearly a bug or unsafe.

## Contributing

See `CONTRIBUTING.md` in the package for contribution and design rules.

## License

MIT
