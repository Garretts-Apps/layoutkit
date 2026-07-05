# Changelog

All notable changes to `layoutkit-css` are documented here. This project
follows [Semantic Versioning](https://semver.org/).

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
