# Changelog

All notable changes to `layoutkit-css` are documented here. This project
follows [Semantic Versioning](https://semver.org/).

## Unreleased

### Changed

- **`reveal` is removed.** `lk-box`, `lk-card`, and `lk-stack` no longer fade in on scroll. Markup with `reveal` still works and shows the content as it is. `MIGRATION.md` explains how to keep the effect in your own CSS. `check-package` now fails if the rule comes back.

## 2.2.0

One default moves, and only when centered content overflows. The stylesheet
is 85,031 bytes (13,626 bytes gzipped). `MIGRATION.md` has the restore rule.

### Breaking changes

- **Centered alignment is `safe`.** `lk-center`, the `center` attribute, `align="center"`, `justify="center"`, `place="center"`, and `place-items="center"` use `safe center` where that keyword exists. Content that fits stays centered. Content that does not fit aligns to the start, so the beginning is not clipped away. Browsers without `safe` keep plain `center`. A single-axis `horizontal` or `vertical` center only makes the centered axis safe. Paste this unlayered block after LayoutKit to restore plain centering:

```css
lk-center:not([horizontal]):not([vertical]):not([place]),
lk-stack[center],
lk-row[center] {
  align-items: center;
  justify-content: center;
}
lk-center[horizontal]:not([vertical]),
lk-stack[align="center"],
lk-row[align="center"],
lk-spread[align="center"] { align-items: center; }
lk-center[vertical]:not([horizontal]),
lk-stack[justify="center"],
lk-row[justify="center"] { justify-content: center; }
lk-stack[place="center"],
lk-center[place="center"],
lk-row[place="center"],
lk-spread[place="center"],
lk-cluster[place="center"] {
  justify-content: center;
  align-items: center;
}
lk-grid[place="center"] { justify-items: center; align-items: center; }
lk-grid[place-items="center"] { place-items: center; }
```

### Added

- `reading` on `lk-row`, `lk-stack`, and `lk-grid`. `visual` sets `reading-flow` so tab and speech order follow the picture. `source` keeps DOM order and wins over the automatic value. A reversed row and a dense grid opt in on their own where `reading-flow` exists. As of November 2026 that is Chromium, not Firefox or Safari.
- `spot="first"` or `spot="last"` on a child. The visual move is inside `@supports (reading-flow: flex-visual)`, so a browser that cannot fix the reading order does not reorder the picture either.
- `stuck` with `sticky` on `lk-box`, `lk-stack`, `lk-row`, and `lk-sidebar`. Where scroll-state queries exist, a stuck bar draws a hairline on its children. The query cannot paint the sticky element itself. Without the feature, sticky is unchanged.
- `mark="current"` on `lk-row` and `lk-scroll-area`. The current slide's contents get an outline where `scroll-state(snapped)` exists. Text stays at full opacity.
- `cue` on a vertical `lk-scroll-area`. While more content sits below, the child fades at the end. The fade leaves when you reach the end. A horizontal area is unchanged.
- `match="width"` on `lk-menu` and `lk-popover`. The panel is at least as wide as its anchor where `anchor-size()` exists. `anchor-size()` is in current Chrome, Firefox, and Safari.
- `popover="hint"` on `lk-popover` anchors above the invoker where `position-area` exists. The rule does not set `display`. Open it with `popovertarget`. Add `interestfor` where interest invokers exist, for hover and focus. As of November 2026, `popover="hint"` is Chromium and Firefox, not Safari. An unknown hint value uses the `auto` popover state, so `popovertarget` still opens it.

### Changed (visual behavior)

Safe centering, above. `reverse` and dense grids do not move pixels. Where `reading-flow` exists they change tab and speech order to match the picture.

`display: grid-lanes` stays out. Safari 26.4 ships it. Chrome and Firefox do not ship it unflagged. `reading-flow` is not in Safari, so a masonry attribute would reorder the picture in the browser that cannot correct the reading order.

A toolbar-safe cover is still `--lk-cover-min`. Set `--lk-cover-min: calc(100dvh - var(--lk-toolbar, 0px))` on the host. There is no second full-height attribute.

## 2.1.0

Additions. No tag, attribute, or default from 2.0.0 changes meaning.
`MIGRATION.md` says so at the top. The stylesheet is 80,010 bytes
(12,795 bytes gzipped).

### Added

- `lk-frame` and `lk-bleed`. The frame is a full-width grid. The center track is `min(100% - gutters, measure)` and the side tracks are at least a fluid gutter (`clamp`, then `vi` where that unit exists). `width` sets the measure. `padding` replaces the fluid gutter with one spacing step. `lk-bleed` spans the frame. Where subgrid exists, children of the bleed sit back in the center track, so the band's background is full width and the text is not.
- `lk-dock`. The hovered child grows, the next sibling grows a little, and `:has(+ :hover)` grows the previous sibling where `selector(:has())` matches. `prefers-reduced-motion: reduce` drops the transition.
- `lk-select`. Wraps a native `<select>`. `appearance: base-select`, `::picker(select)`, `::picker-icon` (a `rotateX` flip), and `::checkmark` apply only inside `@supports (appearance: base-select)`. Other browsers keep the operating-system control. As of November 2026 that is Chromium and Safari 27, not Firefox stable.
- `look="panel"` on `lk-disclosure`. Bordered summary and panel, nested so the open corners are one rule. The first element inside the panel loses its top margin. Put the same `name` on each `<details>` for a mutually exclusive group. That `name` behavior is HTML.
- `pattern` on `lk-box`: `checker`, `dots`, or `grid`, from repeating gradients. `color-mix()` recolors them where it exists. `blend` sets `background-blend-mode` to `color`, `saturation`, or `multiply`. You supply the background layers.
- `--lk-base`, and, where relative `oklch()` parses, `--lk-complement`, `--lk-tetrad`, `--lk-tetrad-2`, `--lk-tint`, and `--lk-shade`. Nothing paints until you use them. `--lk-hue` is registered with `@property` as an angle so a transition can interpolate it. `bands` on `lk-stack` or `lk-row` paints children with `sibling-index()` only when that function and relative `oklch()` both parse.
- Disclosure height animation is unchanged. `look="panel"` summaries also transition their end radii where `interpolate-size: allow-keywords` exists. Firefox stable and Safari stable still open and close without that interpolation.

### Changed (visual behavior)

None by default. `look="panel"`, `bands`, `pattern`, `blend`, and the new tags do nothing until you use them.

## 2.0.0

Container queries, single-child centering, center overlay, a switcher limit of
4, fluid space, and horizontal scroll-snap are now the defaults. Tags,
attribute names, and export paths are unchanged. `MIGRATION.md` is the
upgrade guide. Paste this unlayered block after LayoutKit to restore the
1.5.0 look. A host rule outside `@layer layoutkit` beats the library.

```css
lk-switcher,
lk-sidebar,
lk-grid { container-type: normal; container-name: none; }
lk-switcher > * { flex-basis: calc((var(--lk-switch-at, 30rem) - 100%) * 999); }
lk-switcher > :nth-last-child(n + 5),
lk-switcher > :nth-last-child(n + 5) ~ * { flex-basis: revert; }
lk-center { position: static; inset: auto; }
lk-row:has(> :only-child),
lk-stack:has(> :only-child) { justify-content: flex-start; }
lk-scroll-area[direction="horizontal"] { scroll-snap-type: none; display: block; }
:root {
  --lk-space-xs: var(--space-xs, var(--lk-space-static-xs));
  --lk-space-sm: var(--space-sm, var(--lk-space-static-sm));
  --lk-space-md: var(--space-md, var(--lk-space-static-md));
  --lk-space-lg: var(--space-lg, var(--lk-space-static-lg));
  --lk-space-xl: var(--space-xl, var(--lk-space-static-xl));
  --lk-space-2xl: var(--space-2xl, var(--lk-space-static-2xl));
  --lk-space-3xl: var(--space-3xl, var(--lk-space-static-3xl));
}
lk-box[width="xl"], lk-card[width="xl"], lk-stack[width="xl"],
lk-center[width="xl"], lk-row[width="xl"], lk-spread[width="xl"] {
  max-inline-size: 64rem;
}
```

Per-feature opt-outs, which do not need that block:

- `container="off"` on `lk-switcher`, `lk-sidebar`, and `lk-grid`.
- `at="flex"` keeps `--lk-switch-at` on the flex-basis formula. `at` otherwise
  picks a hard breakpoint: xs 20rem, sm 24rem, md 30rem, lg 40rem, xl 48rem,
  2xl 64rem.
- `limit="off"` on a switcher. `2` through `6` still set another count.
- `overlay="off"` on `lk-center`.
- `adapt="off"` on `lk-row` and `lk-stack`.
- `snap="off"` on a horizontal `lk-scroll-area`.
- `animate="off"` on `lk-disclosure`.

### Breaking changes

- **Containers are on.** Switcher, sidebar, and grid set `container-type: inline-size` unless `container="off"`. Fixed `cols` on a grid stack below 32rem. `container="sm|md|lg|xl"` still selects 24, 32, 48, and 64rem.
- **Switcher threshold is a container breakpoint.** The default is 30rem. Children use `flex-basis: auto` above it and `100%` below it. `at="flex"` restores `calc((var(--lk-switch-at, 30rem) - 100%) * 999)` and the `100cqi` form. Container queries cannot read `--lk-switch-at`, so an arbitrary length still uses `at="flex"`.
- **Switcher limit defaults to 4.** Five or more children each take a full row. `sibling-count()` supplies the same threshold where that function exists.
- **One child centers.** An `lk-row` or `lk-stack` with a single element child uses `justify-content: center` unless `justify`, `place`, or `adapt="off"` is set.
- **`lk-center` overlays.** It is `position: absolute` unless `overlay="off"`. The parent supplies the containing block.
- **Space is fluid.** `--lk-space-*` is `var(--space-*, var(--lk-space-fluid-*))`. Host `--space-*` tokens still win. `--lk-space-static-*` holds the old rem steps.
- **Horizontal scroll areas snap.** `direction="horizontal"` sets `scroll-snap-type: x mandatory` unless `snap="off"`. Vertical snap stays opt-in.
- **`width="xl"` is 56rem.** The previous 64rem value is `width="2xl"`. `width="3xl"` is 80rem. `lk-spread` accepts `width`.

### Added

- `square` on `lk-center` and `lk-box` (`xs` through `xl`).
- `sticky` on `lk-box`, `lk-stack`, and `lk-row`, using the same `--lk-sticky-top` offset as a sidebar.
- `full-height="container"` and `lk-cover[size="container"]` fill the query container (`100%`, then `100cqb`). A boolean `full-height` and a plain cover stay on the viewport.
- `min-inline-size: 0` on `lk-scroll-area`, so a flex parent can shrink it.
- `adapt="scroll"` on `lk-row`: a horizontal snap scroller that becomes a column list below 32rem.
- `reveal` on `lk-box`, `lk-card`, and `lk-stack`. `animation-timeline: view()` where supported. Unsupported browsers and `prefers-reduced-motion` leave the content visible.
- Disclosure height animates with `interpolate-size: allow-keywords` where supported. `animate="off"` and reduced motion skip the transition.
- `::scroll-button()` and `::scroll-marker` on snap scrollers where `selector(::scroll-button(inline-start))` matches.
- `layout="compact"` sets `--lk-layout: compact`. Descendants inside `@container style(--lk-layout: compact)` stack their rows. The at-rule is ignored where style queries are unsupported.
- A bare `lk-progress` stays fixed to the viewport through `scroll(root)`. `scope="nearest"` follows the nearest scroller.

### Changed (visual behavior)

The defaults above change existing pages that relied on in-flow centers, the flex-basis switcher, static space, a 64rem `xl`, or a non-snapping horizontal scroller. Opt out per element, or paste the restore block.

## 1.5.0

Opt-in layouts that replace common layout JavaScript. Existing tags,
attributes, custom properties, export paths, and default rendering are
unchanged. New behavior is a new attribute or a new tag. Where a feature is
missing, `@supports` leaves the previous layout in place.

### Added
- **Container queries.** `container` on `lk-switcher`, `lk-sidebar`, and
  `lk-grid` sets `container-type: inline-size` and a `container-name` (`lk-switcher`,
  `lk-sidebar`, or `lk-grid`). Switcher children measure the threshold with
  `100cqi` instead of `100%`, and `--lk-switch-at` still sets that threshold.
  The sidebar's flexible region uses `50cqi` instead of `50%`
  (`--lk-sidebar-content-min` still overrides it). A `container` grid with
  `cols` stacks direct children when the grid itself is narrower than 32rem.
  `responsive` and `min` keep auto-fit. Children are capped at `100cqi`.
  Without container-query support the attribute does nothing.
- **`:has()` adaptation.** `adapt="solo"` on `lk-row` and `lk-stack` centers
  the layout when there is exactly one element child. `place` and `justify`
  still win. `adapt="figure"` on `lk-card` lets a direct child `figure` bleed
  to the card edges. Other children stay inset by the card padding, recorded
  as `--lk-pad`. `overflow: clip` is used where supported, otherwise
  `overflow: hidden`.
- **Subgrid.** `subgrid` on `lk-grid` shares the parent columns and spans the
  parent (`grid-column: 1 / -1`). `subgrid="rows"` shares rows. `subgrid="both"`
  shares both. Gap is inherited unless `gap`, `col-gap`, or `row-gap` is set.
  `cols` and `rows` remain the fallback where subgrid is unsupported.
- **Scroll-snap carousels.** `snap` on `lk-row` and `lk-scroll-area` turns
  direct children into slides (`mandatory` by default, or `proximity` or
  `center`). `slide` sets `full`, `half`, `third`, or `peek`.
  `direction="vertical"` on `lk-scroll-area` snaps on the block axis. `gap` is
  now an attribute of `lk-scroll-area` and sizes the carousel gap; `--lk-snap-gap`
  follows it so half and third slides fit the visible area. Physical `x`/`y`
  snap types are the fallback. Logical `inline`/`block` override them where
  supported. `snap` forces `nowrap`.
- **Sticky sidebars.** `sticky` on `lk-sidebar` sticks the side panel to
  `--lk-sticky-top` (default `0px`). `side="end"` sticks the last child instead
  of the first. The panel's max block size is `100dvh`, then `100svh`, then
  `100vh`, and it scrolls if the contents are taller.
- **Scroll progress.** `lk-progress` is an in-flow bar. Where
  `animation-timeline: scroll()` is supported, a bare element or `scope="root"`
  tracks the document, and `scope="nearest"` sticks to the nearest scroll
  container. `prefers-reduced-motion: reduce` keeps the static bar.
  `--lk-progress-color` and `--lk-progress-z` override the color and stacking.
- **Popover and disclosure.** `lk-popover` paints a top-layer panel and does
  not set `display`, so the browser can still hide a closed `popover`.
  `lk-menu` lines up an invoker with that panel. The invoker is the menu's
  first child and must be a `button`, `a`, or `summary`. `anchor` gives each
  menu its own `anchor-scope` of `--lk-menu`. Where `position-area` or the
  earlier `inset-area` is supported, the panel anchors under the invoker and
  flips when it would overflow. Otherwise the popover keeps the user agent's
  centered top layer. `side="end"` anchors to the inline end. A standalone
  `lk-popover[anchor]` uses `--lk-anchor` as the anchor name you also set on
  the invoker. `lk-disclosure` lays out native `details`/`summary`.
  `panel="overlay"` takes the open panel out of flow and stacks it.
  `anchor` tethers that overlay the same way, with the absolute panel as the
  fallback. `--lk-popover-bg`, `--lk-popover-fg`, and `--lk-popover-border`
  theme both panels.
- **Switcher limit.** `limit` on `lk-switcher` (`2` through `6`) gives every child
  `flex-basis: 100%` when there are more children than that number. Fewer
  children keep the threshold. This is the Every Layout quantity guard, with
  no script.
- **Container size steps.** On `lk-grid`, `container="sm|md|lg|xl"` stacks fixed
  `cols` below 24rem, 32rem, 48rem, or 64rem. A bare `container` stays at 32rem.
  `responsive` and `min` are still auto-fit.
- **Center overlay.** `overlay` on `lk-center` absolutely covers its containing
  block (`--lk-overlay-inset`, default 0). The parent has to be positioned.
  Without the attribute, `lk-center` stays in flow.
- **Fluid space tokens.** `--lk-space-fluid-xs` through `--lk-space-fluid-3xl`
  are `clamp()` lengths (`vw`, then `vi`). They do not replace `--lk-space-*`.
  Point a `--space-*` or `--lk-space-*` token at one to opt that step in.
- **Columns.** `lk-columns` flows children across 2 columns by default, or
  `cols="2|3|4"`. `gap` sets `column-gap`. Direct children use
  `break-inside: avoid`.

## 1.4.0

Approved visual updates. Tags, attributes, classes, custom properties, and
export paths are unchanged. Modern browsers use the new rendering. Older
browsers keep the previous fallback. Unlayered author CSS still overrides
`@layer layoutkit`.

### Changed (visual behavior)

- **`full-height` and `lk-cover` fill the dynamic viewport.** The minimum is
  `100dvh` where supported, then `100svh`, then `100vh`. Each step is wrapped
  in `@supports` so an unsupported unit does not wipe the previous fallback.
  `lk-cover` still honors `--lk-cover-min` inside every step.
  - Restore the previous `full-height` size:

    ```css
    lk-stack[full-height],
    lk-row[full-height],
    lk-center[full-height] { min-block-size: 100vh; }
    ```

  - Restore the previous cover default with `--lk-cover-min: 100svh`.
- **The default divider follows the text color.** Supporting browsers use
  `color-mix(in srgb, currentColor 20%, transparent)`. Browsers without
  `color-mix()` keep `#e5e7eb`. `--lk-divider-color` still wins when it is set.
  - Restore the old gray line with `--lk-divider-color: #e5e7eb`.
- **Replaced children of `lk-aspect-ratio` fill the frame.** `img`, `video`,
  `iframe`, `canvas`, and `svg` are block boxes sized to the frame, with
  `width`/`height` before `inline-size`/`block-size`, and `object-fit: cover`.
  Other children are unchanged.
  - Restore intrinsic media size:

    ```css
    lk-aspect-ratio > img,
    lk-aspect-ratio > video,
    lk-aspect-ratio > iframe,
    lk-aspect-ratio > canvas,
    lk-aspect-ratio > svg {
      width: auto;
      height: auto;
      inline-size: auto;
      block-size: auto;
      object-fit: fill;
    }
    ```

- **`lk-grid[min]` uses `auto-fit` instead of `auto-fill`.** Empty tracks
  collapse and items grow to fill the row, matching `responsive`. `min` still
  overrides `responsive` and still clamps each track with `min(<size>, 100%)`.
  The enumerated sizes are `2xs` 8rem, `xs` 10rem, `sm` 12rem, `md` 16rem,
  `lg` 20rem, and `xl` 24rem.
  - Restore empty tracks for one size, for example:

    ```css
    lk-grid[min="md"] {
      grid-template-columns: repeat(auto-fill, minmax(min(16rem, 100%), 1fr));
    }
    ```

## 1.3.3

Layout bug fixes and a tighter public contract. Existing markup keeps its
layout, except where an attribute value was previously ignored or a grid track
overflowed a narrower container.

### Fixed
- Sized `lk-spacer` values set the flex main size as well as `block-size`. A
  spacer in a row now creates inline space. The vertical size is unchanged,
  including when the spacer is not a flex item.
- `flow` on `lk-box` and `lk-card` honors the full spacing scale. Values other
  than `xs`–`3xl` previously fell through to the `md` rhythm.
- `lk-grid[responsive]` and `lk-grid[min]` clamp each minimum track with
  `min(<size>, 100%)`, so a container narrower than the preferred track no
  longer forces horizontal overflow. Wider containers keep the same tracks.
- `place="between"`, `place="around"`, and `place="evenly"` on `lk-grid`
  distribute extra space. Those values previously had no effect. Position
  values are unchanged.

### Changed
- `jsx.d.ts` lists only the attributes each tag implements. Importing
  `layoutkit-css/layoutkit.css` resolves its types from that file.
- Docs describe `min` as an auto-fill override of `responsive`, `full-height`
  as `100vh` (distinct from `lk-cover`'s `100svh`), and the keyboard requirement
  for `lk-scroll-area`.
- Examples no longer use a fictional `<lk-text>` tag. `lk-text` is an attribute.
- Package checks compare the generated CSS, JSX attributes, version pins, and
  the two changelogs.

## 1.3.2

Publishing metadata patch.

### Changed
- Restored provenance publishing now that the GitHub repository is public.
- Updated pinned install examples to the latest patch version.

## 1.3.1

Small trust and developer-experience patch.

### Added
- `className`, `children`, and more permissive `style` values in the static JSX
  declarations.
- Package-local `CONTRIBUTING.md` so contribution and design rules are present
  in the npm tarball.
- Documentation that freezes `lk-card`, `lk-text`, and `lk-weight` as limited
  convenience helpers rather than a component or typography system.
- Corrected the optional Neovim plugin copy and snippets so they use `lk-*`
  tags instead of the retired React/Tailwind component model.

## 1.3.0

Positioning, documentation, package quality, and publish-readiness update.

### Added
- Dependency-free `jsx.d.ts` declarations for known `lk-*` elements and common
  attributes. These declarations are type-only and do not add runtime behavior.
- Security documentation with package verification guidance.
- No-dependency package validation for dependency, install-script, CSS, export,
  and package allowlist checks.

### Changed
- Documentation now describes LayoutKit as a tiny pure-CSS layout vocabulary for
  readable app structure.
- Accessibility guidance now clearly says LayoutKit wraps native semantic HTML
  and does not replace landmarks, headings, lists, forms, controls, buttons, or
  links.
- The npm package allowlist now ships only consumer-facing files.
- The trusted publishing workflow validates the package before publishing and
  uses npm provenance without token-based publishing.

### Removed
- Legacy CLI and VS Code extension folders were removed from the repository so
  LayoutKit stays focused on the CSS package and does not imply a binary,
  framework component installer, or editor-extension product surface.

## 1.2.0

Ergonomics pass: spend less effort styling, and stop thinking in raw-CSS
mechanics. All additive — nothing from 1.1 changes. The homepage was rebuilt
entirely on these primitives (zero inline styles) and is served under a strict
`style-src 'self'` CSP as proof.

### Added
- **`place` — axis-agnostic alignment.** One attribute names *where children
  sit* (`center`, `top`, `bottom`, `start`, `end`, `top-start`, `top-end`,
  `bottom-start`, `bottom-end`) plus distribution (`between`, `around`,
  `evenly`). It's resolved per container, so the same word is visually
  consistent on rows and stacks — no more tracking which axis `align` vs
  `justify` controls. Works on `lk-stack`, `lk-row`, `lk-center`, `lk-spread`,
  and `lk-grid`. `align`/`justify` keep working as the low-level escape.
- **`flow` — vertical rhythm without per-item margins.** `<lk-box flow>` (or
  `flow="lg"`) spaces every flowing child via the owl selector — no more
  hand-placed `margin-bottom`. Works on `lk-box` and `lk-card`.
- **`width` — constrain & center.** `width="prose | xs…xl | full"` sets
  `max-inline-size` (prose = the reading measure) and centers via
  `margin-inline:auto`. Works on `lk-box`, `lk-card`, `lk-stack`, `lk-center`,
  `lk-row`. Replaces inline `max-width`.
- **Type scale — `lk-text` / `lk-weight`.** Namespaced attributes usable on any
  element (`<h2 lk-text="2xl" lk-weight="semibold">`). Sizes `xs…4xl` resolve
  through `--lk-text-*` → your `--text-*` tokens; weights `normal…bold`.
  Replaces inline `font-size`/`font-weight`.
- **`lk-card` — token-driven surface.** Padded block with radius and a
  brand-neutral `currentColor` border by default. Attributes `padding`,
  `radius` (`none…full`), `surface` (tinted fill), `border="none"`. Radius
  resolves through `--lk-radius-*` → your `--radius-*` tokens.

- **Responsive intent primitives — no media queries.** Layouts that respond to
  their own available width via intrinsic sizing:
  - `lk-switcher` — a row that flips to a stack below `--lk-switch-at` (default
    30rem), using the flex-basis `calc` trick. No query, no JS.
  - `lk-sidebar` — a fixed-width side (`--lk-sidebar-width`, default 18rem) + a
    flexible content area that wraps under it below `--lk-sidebar-content-min`
    (default 50%). `side="end"` puts the sidebar last.
  - `lk-cluster` — a wrapping group (chips, tags, buttons); `gap` + `place`.
  - `lk-cover` — a `min-block-size` region (default `100svh`) whose `[center]`
    child (or lone child) is vertically centered while header/footer sit at the
    edges.
- **Enumerated free-form knobs (CSP-clean).** `ratio` (common aspect ratios),
  `min` (grid auto-fill min child width), and `max-h` (scroll-area max height)
  replace the inline `--lk-ratio` / `--lk-min-child-width` / `--lk-max-height`
  styles for the common cases — so they work under `style-src 'self'`.

All new spacing/type/radius values are **enumerated attributes** (external-CSS
attribute selectors), so they work under a strict `style-src 'self'` CSP with no
inline styles. Arbitrary values remain available via the inline `--lk-*` escape
hatch (`--lk-measure`, `--lk-surface`, `--lk-switch-at`, `--lk-sidebar-width`, …).

## 1.1.0

Architecture pass to make LayoutKit compose with a design system rather than
run parallel to one. Default rendering is unchanged when no tokens are defined,
so this is backward-compatible.

### Added
- **Design-token spacing.** The semantic scale (`xs … 3xl`) now resolves through
  `--lk-space-*` custom properties that default to your `--space-*` tokens:
  `--lk-space-md: var(--space-md, 1rem)`. Define `--space-*` in your app and the
  whole `gap`/`padding` scale remaps onto it — no override per component. You can
  also override `--lk-space-*` directly.

### Changed
- **Cascade layer.** All rules are now declared inside `@layer layoutkit`, so a
  host app controls specificity relative to its own layers. Unlayered author
  styles always win, which makes overriding LayoutKit more predictable. If you
  rely on cascade layers, place `layoutkit` where you want it in your order.
- **Logical properties.** Directional box-model now uses logical properties
  (`border-inline-start`, `border-block-start`, `inline-size`, `block-size`,
  `min-block-size`, `max-inline-size`, …) so layouts follow writing mode and RTL.
  In left-to-right, top-to-bottom contexts the rendering is identical.

## 1.0.0

First stable release: a complete rewrite to a single pure-CSS stylesheet.

### Changed
- LayoutKit is now **pure CSS** and styles `<lk-*>` layout tags via attribute
  selectors. No JavaScript, no runtime, no build step. (0.1.0 shipped
  React components that compiled to Tailwind.)

### Removed
- **`index.d.ts`** and all JavaScript/TypeScript entry points. A pure-CSS package
  has no JS API to type, so the type definitions were dropped. **Breaking** for
  anyone importing the 0.1.0 component/types API — there is no JS surface in 1.x;
  import the stylesheet instead: `import "layoutkit-css/layoutkit.css"`.
