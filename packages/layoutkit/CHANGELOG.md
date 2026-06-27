# Changelog

All notable changes to `layoutkit-css` are documented here. This project
follows [Semantic Versioning](https://semver.org/).

## Unreleased (1.2.0)

Ergonomics pass: spend less effort styling, and stop thinking in raw-CSS
mechanics. All additive — nothing from 1.1 changes.

### Added
- **`place` — axis-agnostic alignment.** One attribute names *where children
  sit* (`center`, `top`, `bottom`, `start`, `end`, `top-start`, `top-end`,
  `bottom-start`, `bottom-end`) plus distribution (`between`, `around`,
  `evenly`). It's resolved per container, so the same word is visually
  consistent on rows and stacks — no more tracking which axis `align` vs
  `justify` controls. Works on `lk-stack`, `lk-row`, `lk-center`, `lk-spread`,
  and `lk-grid`. `align`/`justify` keep working as the low-level escape.

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
- LayoutKit is now **pure CSS** — it styles semantic `<lk-*>` tags via attribute
  selectors. No JavaScript, no runtime, no build step, no FOUC. (0.1.0 shipped
  React components that compiled to Tailwind.)

### Removed
- **`index.d.ts`** and all JavaScript/TypeScript entry points. A pure-CSS package
  has no JS API to type, so the type definitions were dropped. **Breaking** for
  anyone importing the 0.1.0 component/types API — there is no JS surface in 1.x;
  import the stylesheet instead: `import "layoutkit-css/layoutkit.css"`.
