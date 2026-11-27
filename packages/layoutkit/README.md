# layoutkit-css

LayoutKit is one CSS file of layout tags for semantic HTML. The file is 84,385
bytes (13,508 bytes gzipped). There is no runtime JavaScript and no build step
to use the file.

`lk-stack`, `lk-row`, `lk-grid`, and `lk-center` name the layout so you are not
rewriting the same flex column, and so the markup does not turn into a utility
class for every property. The tags are for developers. Browsers and assistive
technologies do not treat them like native HTML landmarks, headings, lists,
forms, buttons, links, or tables.

Use LayoutKit inside native semantic HTML.

## What LayoutKit Is

- One CSS file. 84,385 bytes, 13,508 bytes gzipped.
- No runtime JavaScript.
- No npm dependencies.
- No custom element registration. The tags are unknown elements with a stylesheet.
- Framework-agnostic. Link it, or import it once.
- Layout wrappers for readable HTML structure.
- A CSS layer named `layoutkit`. Unlayered author CSS wins, even a single class.

## What LayoutKit Is Not

LayoutKit is not a component library, design system, substitute for semantic
HTML, button kit, form kit, typography system, icon library, animation system,
JavaScript behavior layer, stateful app shell, data table solution, or
substitute for normal CSS.

It is not Tailwind and it is not Bootstrap. Tailwind puts one property in each
class. Bootstrap ships control skins and scripts. `lk-select` is the exception
that proves the boundary: it styles a native `select` only inside
`@supports (appearance: base-select)`.

It is the same family of layouts as Every Layout: stack, switcher, sidebar,
cluster, cover, and the centered overlay. Every Layout is the explanation and
its own elements. This package is the CSS file, with container queries on by
default since 2.0.0.

`--lk-base` does not restyle the page. The OKLCH relatives exist for you to
reference. Named grid areas still belong in normal CSS. See `MIGRATION.md`.
2.1.0 adds tags and does not change 2.0.0 defaults. 2.2.0 changes centered
overflow to `safe center` where that keyword exists. See `MIGRATION.md`.

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
layout. If the CSS does not load, nothing in JavaScript rebuilds it. The tags
remain unknown elements. That is separate from `@supports`: a missing CSS
feature skips the enhancement and leaves the native control or the unanimated
disclosure in place.

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
- `lk-grid`: CSS grid columns, rows, gaps, responsive auto-fit, container queries unless `container="off"`, and opt-in subgrid.
- `lk-cluster`: wrapping inline group.
- `lk-switcher`: row-to-stack layout. Container queries are on. The default limit is 4.
- `lk-sidebar`: wrapping sidebar/content layout. Container queries are on. `sticky` is opt-in.
- `lk-cover`: min-height region with a centered child.
- `lk-frame`: full-width grid. The center track is the measure. The side tracks are the gutter.
- `lk-bleed`: spans an `lk-frame`. Subgrid puts its children back in the column where subgrid exists.
- `lk-spacer`: flexible or fixed spacer.
- `lk-divider`: visual divider.
- `lk-aspect-ratio`: aspect-ratio wrapper.
- `lk-scroll-area`: constrained scroll container. Horizontal direction snaps unless `snap="off"`.
- `lk-progress`: scroll progress bar, static where scroll timelines are unsupported.
- `lk-popover`: top-layer panel for a native `popover`.
- `lk-disclosure`: layout for native `details`/`summary`. `look="panel"` draws the border. The same `name` on each `details` is the exclusive group, and that behavior is HTML.
- `lk-menu`: invoker plus `lk-popover`, with opt-in anchor positioning.
- `lk-dock`: hover magnification. `:has(+ :hover)` grows the previous item where that selector matches.
- `lk-select`: a native `select`. Custom picker styling requires `appearance: base-select`.
- `lk-columns`: multi-column text flow.

## Attributes

Common attributes include:

- Spacing: `gap`, `padding`, `col-gap`, `row-gap`.
- Alignment: `align`, `justify`, `place`, `place-items`, `center`.
- Sizing: `fill`, `full-height`, `width`, `size`, `max-h`, `min`.
- Grid: `cols`, `rows`, `responsive`, `flow`, `container`, `subgrid`.
- Direction and variants: `wrap`, `reverse`, `side`, `orientation`,
  `thickness`, `ratio`, `radius`, `surface`, `border`, `container`, `sticky`,
  `stuck`, `adapt`, `snap`, `slide`, `mark`, `cue`, `anchor`, `match`, `panel`,
  `scope`, `reading`. `spot` is `first` or `last` on a child.
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
`100svh`, then `100vh`. `--lk-cover-min` still replaces that default. A host
can set `--lk-cover-min: calc(100dvh - var(--lk-toolbar, 0px))` to clear a
toolbar. There is no second full-height attribute. Centered alignment uses
`safe center` where that keyword exists. The
divider defaults to a `currentColor` mix, with `#e5e7eb` where `color-mix()` is
unavailable. Replaced children inside `lk-aspect-ratio` (`img`, `video`,
`iframe`, `canvas`, `svg`) fill the frame with `object-fit: cover`.

Put `center` on the child of `lk-cover` that should sit in the middle. It is not
an attribute of `lk-cover` itself.

Switcher, sidebar, and grid set `container-type: inline-size` unless the
attribute is `off`. Omitting `container` does not restore the 1.4 layout.
Without container-query support, the guarded rules are skipped. `subgrid`,
`sticky`, and `anchor` are opt-in. `adapt` centering and horizontal
`scroll-snap` are on unless set to `off`. `snap` on a row is still opt-in.
`lk-popover` never sets `display`, because an author `display` would override
the user agent's hidden state for a closed popover.

## Frozen Convenience Helpers

`lk-card`, `lk-text`, and `lk-weight` are small convenience helpers, not a
component or typography system. 2.1.0 also adds opt-in paint: `look="panel"`,
`pattern`, `blend`, `bands`, and `lk-dock`. They do nothing until you set them.
They are not a theme.

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
- Focus order follows source order unless `reading-flow` exists. A reversed row, a dense grid, and `spot` then follow the picture. `reading="source"` opts out. Firefox and Safari keep source order.
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

Current Chrome, Firefox, and Safari cover the flex, grid, cascade layer, logical
property, `aspect-ratio`, and `min()` layout. Viewport units step through
`100dvh`, `100svh`, and `100vh`. Dividers use `color-mix()` and fall back to
`#e5e7eb`. A card border uses `color-mix()` without that fallback.

Container queries, `:has()`, subgrid, scroll snap, and `position: sticky` are
in current major browsers and still inside `@supports`. Anchor positioning
(`position-area`, earlier name `inset-area`) and `anchor-size()` are in current
Chrome, Firefox, and Safari. `animation-timeline` is not universal.
`reading-flow` and scroll-state queries are Chromium only as of November 2026.
`popover="hint"` is Chromium and Firefox, not Safari. An unknown hint value
uses the `auto` popover state, so `popovertarget` still opens the panel.
`interpolate-size: allow-keywords` (disclosure height) is Chromium only among
stable engines. `appearance: base-select` is Chromium and Safari 27, not
Firefox stable. Where the test fails, the earlier behavior remains: a closed
popover stays hidden, a disclosure still opens, a select stays the
operating-system control, and tab order follows the source.

## Security And Package Verification

LayoutKit has no runtime JavaScript, npm dependencies, remote imports, network
requests, or install scripts. Verify package contents with:

```bash
npm pack layoutkit-css
tar -tzf layoutkit-css-*.tgz
```

Use pinned installs when you need reproducible builds:

```bash
npm install layoutkit-css@2.2.0
```

Review third-party packages before use.

## Versioning And Stability

The package follows semver. 2.0.0 changes several defaults. 2.1.0 does not.
2.2.0 changes centered overflow to `safe center` where that keyword exists.
`MIGRATION.md` lists the 2.0.0 changes, the 2.2.0 restore rule, and the CSS
that restores the 1.5.0 look.

## Contributing

See `CONTRIBUTING.md` in the package for contribution and design rules.

## License

MIT
