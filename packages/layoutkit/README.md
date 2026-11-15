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

Named grid areas and component-specific behavior still belong in normal CSS.
Switcher, sidebar, and grid measure themselves unless `container="off"`.
Subgrid, row snap, sticky regions, and popovers stay opt-in. See
`MIGRATION.md` for the 2.0.0 defaults.

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
    <lk-box lk-text="2xl">Dashboard</lk-box>
  </lk-stack>
</lk-box>
```

The bad example loses native document meaning. `lk-text` is an attribute for a
real element, not a tag. Use `main`, `section`,
`article`, `header`, `footer`, `nav`, headings, links, buttons, lists, tables,
and form controls for their real HTML jobs. Use `lk-*` tags for layout around
them.

## Core Primitives

LayoutKit currently includes:

- `lk-stack`: vertical flow with `gap`.
- `lk-row`: horizontal flow with `gap`.
- `lk-center`: center children. `overlay` covers a positioned parent.
- `lk-box`: block wrapper with optional padding, width, and flow spacing.
- `lk-card`: neutral padded block with optional radius, surface, and border.
- `lk-spread`: row with space between children.
- `lk-grid`: CSS grid columns, rows, gaps, responsive auto-fit, opt-in container queries, and opt-in subgrid.
- `lk-cluster`: wrapping inline group.
- `lk-switcher`: intrinsic row-to-stack layout, with an opt-in container-query measure and a child-count `limit`.
- `lk-sidebar`: wrapping sidebar/content layout, with opt-in container queries and a sticky side.
- `lk-cover`: min-height region with a centered child.
- `lk-spacer`: flexible or fixed spacer.
- `lk-divider`: visual divider.
- `lk-aspect-ratio`: aspect-ratio wrapper.
- `lk-scroll-area`: constrained scroll container and opt-in scroll-snap carousel.
- `lk-progress`: scroll progress bar, static where scroll timelines are unsupported.
- `lk-popover`: top-layer panel for a native `popover`.
- `lk-disclosure`: layout for native `details`/`summary`.
- `lk-menu`: invoker plus `lk-popover`, with opt-in anchor positioning.
- `lk-columns`: multi-column text flow.

## Attributes

Common attributes include:

- Spacing: `gap`, `padding`, `col-gap`, `row-gap`.
- Alignment: `align`, `justify`, `place`, `place-items`, `center`.
- Sizing: `fill`, `full-height`, `width`, `size`, `max-h`, `min`.
- Grid: `cols`, `rows`, `responsive`, `flow`, `container`, `subgrid`.
- Direction and variants: `wrap`, `reverse`, `side`, `orientation`,
  `thickness`, `ratio`, `radius`, `surface`, `border`, `container`, `sticky`,
  `adapt`, `snap`, `slide`, `anchor`, `panel`, `scope`.
- Namespaced text helpers: `lk-text`, `lk-weight`.

Most finite scales are enumerated so markup stays readable. Free-form values use
custom properties such as `--lk-ratio`, `--lk-divider-color`,
`--lk-min-child-width`, `--lk-max-height`, `--lk-max-width`, `--lk-measure`,
`--lk-switch-at`, `--lk-sidebar-width`, `--lk-sidebar-content-min`,
`--lk-sticky-top`, `--lk-snap-gap`, `--lk-pad`, `--lk-anchor`,
`--lk-progress-color`, `--lk-popover-bg`, `--lk-popover-fg`,
`--lk-popover-border`, `--lk-space-fluid-*`, and `--lk-overlay-inset`.

`min` on `lk-grid` sets an auto-fit track size and overrides `responsive` when
both are present. Empty tracks collapse, so items grow to fill the row. Both
clamp a track that would otherwise be wider than the container.

`flow` on `lk-box` and `lk-card` uses the same spacing scale as `gap`. On
`lk-grid`, `flow` is `row`, `col`, or `dense`.

`full-height` and the `lk-cover` minimum use `100dvh` where supported, then
`100svh`, then `100vh`. `--lk-cover-min` still replaces that default. The
divider defaults to a `currentColor` mix, with `#e5e7eb` where `color-mix()` is
unavailable. Replaced children inside `lk-aspect-ratio` (`img`, `video`,
`iframe`, `canvas`, `svg`) fill the frame with `object-fit: cover`.

Put `center` on the child of `lk-cover` that should sit in the middle. It is not
an attribute of `lk-cover` itself.

`container` does nothing unless the browser supports container queries. It does
not change a switcher, sidebar, or grid that omits the attribute. `subgrid`,
`snap`, `sticky`, `adapt`, and `anchor` are the same kind of opt-in.
`lk-popover` never sets `display`, because an author `display` would override
the user agent's hidden state for a closed popover.

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

Card grid:

```html
<section aria-labelledby="projects-heading">
  <lk-stack gap="lg">
    <h2 id="projects-heading">Projects</h2>
    <lk-grid responsive gap="md">
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

Container-query grid. Fixed `cols` stack when this grid is under 32rem. Omit
`container` and the three columns stay three columns:

```html
<section aria-labelledby="regions-heading">
  <lk-stack gap="sm">
    <h2 id="regions-heading">Regions</h2>
    <lk-grid container cols="3" gap="md">
      <article><h3>North</h3></article>
      <article><h3>South</h3></article>
      <article><h3>West</h3></article>
    </lk-grid>
  </lk-stack>
</section>
```

One child centers. A `place` or `justify` value still wins. A card with a
direct `figure` bleeds that figure:

```html
<lk-row adapt="solo">
  <button type="button">Only action</button>
</lk-row>
<lk-card adapt="figure">
  <figure>
    <img src="/photos/shore.jpg" alt="Rocky shore">
  </figure>
  <h3>Shore</h3>
  <p>The text stays inset.</p>
</lk-card>
```

Nested grid shares the parent tracks. Keep `cols` so browsers without subgrid
still have columns:

```html
<lk-grid cols="3" gap="md">
  <strong>Name</strong>
  <strong>Status</strong>
  <strong>Updated</strong>
  <lk-grid cols="3" subgrid>
    <span>Website</span>
    <span>Ready</span>
    <span>Today</span>
  </lk-grid>
</lk-grid>
```

Scroll-snap carousel. Each direct child is a slide. The region does not create
a tab stop; set `tabindex="0"` and a name when keyboard users must scroll it:

```html
<section aria-labelledby="slides-heading">
  <h2 id="slides-heading">Highlights</h2>
  <lk-row snap slide="peek" tabindex="0" aria-label="Highlights">
    <article><h3>One</h3></article>
    <article><h3>Two</h3></article>
    <article><h3>Three</h3></article>
  </lk-row>
</section>
```

Sticky sidebar and a progress bar tied to a scroller. The progress element is
static when scroll-driven animations are unavailable:

```html
<lk-sidebar sticky>
  <nav aria-label="Sections">
    <lk-stack gap="xs">
      <a href="#overview">Overview</a>
      <a href="#details">Details</a>
    </lk-stack>
  </nav>
  <lk-scroll-area max-h="md" tabindex="0" aria-label="Notes">
    <lk-progress scope="nearest"></lk-progress>
    <p>Notes</p>
  </lk-scroll-area>
</lk-sidebar>
```

Menu and disclosure. The button opens a native popover. `anchor` tethers it
where anchor positioning exists. The disclosure uses `details`:

```html
<lk-menu anchor>
  <button type="button" popovertarget="account-menu">Account</button>
  <lk-popover id="account-menu" popover>
    <nav aria-label="Account">
      <lk-stack gap="xs">
        <a href="/settings">Settings</a>
        <a href="/sign-out">Sign out</a>
      </lk-stack>
    </nav>
  </lk-popover>
</lk-menu>
<lk-disclosure panel="overlay" anchor>
  <details>
    <summary>Filters</summary>
    <lk-stack gap="xs">
      <label><input type="checkbox"> Open</label>
    </lk-stack>
  </details>
</lk-disclosure>
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
  inside it still needs usable native markup. It does not create a tab stop. If
  the region itself must be scrolled from the keyboard, set `tabindex="0"` and
  a name on it. Without `direction`, both axes scroll; `direction="vertical"`
  clips inline overflow. A `snap` carousel follows the same keyboard rule.
  Direct children are the slides.
- `lk-menu` and `lk-disclosure` do not invent buttons. Use a real `button`,
  `summary`, or link. The menu invoker is the first child.
- `lk-progress` is decorative. It does not replace a status message.
- LayoutKit provides layout behavior only. Accessibility still depends on the
  underlying HTML and application code.

## TSX/JSX

LayoutKit includes a small `jsx.d.ts` file. It teaches TypeScript about the
known `lk-*` elements and common attributes. It does not import React types, add
a runtime, register custom elements, or imply any browser behavior.

Importing the stylesheet resolves these types:

```ts
import "layoutkit-css/layoutkit.css";
```

You can also include them without importing the CSS:

```ts
/// <reference types="layoutkit-css" />
```

`compilerOptions.types` replaces TypeScript's automatic `@types` list, so only
use that array when it names every package you still need:

```json
{
  "compilerOptions": {
    "types": ["layoutkit-css"]
  }
}
```

React-specific HTML prop typing still comes from your own React and
`@types/react` setup. LayoutKit does not depend on React. The declarations only
accept attributes the stylesheet implements.

## Browser Support

LayoutKit targets modern evergreen browsers with support for custom properties,
flexbox, grid, cascade layers, logical properties, `aspect-ratio`, `svh`,
`dvh`, `min()`, `object-fit`, and `color-mix()`. Container queries, `:has()`,
subgrid, scroll snap, `position: sticky`, `animation-timeline: scroll()`, and
anchor positioning (`position-area`, with `inset-area` as the earlier name)
are progressive enhancements. Markup that uses those opt-in attributes keeps
the previous layout where a feature is missing.

## Security And Package Verification

LayoutKit has no runtime JavaScript, npm dependencies, remote imports, network
requests, or install scripts. Verify package contents with:

```bash
npm pack layoutkit-css
tar -tzf layoutkit-css-*.tgz
```

Use pinned installs when you need reproducible builds:

```bash
npm install layoutkit-css@2.0.0
```

Review third-party packages before use.

## Versioning And Stability

The package follows semver. 2.0.0 changes several defaults. `MIGRATION.md` lists
each change and the CSS that restores the 1.5.0 look.

## Contributing

See `CONTRIBUTING.md` in the package for contribution and design rules.

## License

MIT
