# Competitor analysis

This note lives in `notes/` so it is not served as `/docs`, which is `docs.html`.

Research for layoutkit-css 1.5.0. LayoutKit is a tiny pure-CSS vocabulary:
custom tags, enumerated attributes, one cascade layer, no runtime. The
comparison is about layout that replaces JavaScript, and about the developer
experience around it. It is not a request to become a utility framework, a
theme, or a React kit.

Sources checked in November 2026: [Every Layout](https://every-layout.dev/layouts/),
[Open Props](https://open-props.style/), [Utopia](https://utopia.fyi/space/calculator/),
[Tailwind CSS](https://tailwindcss.com/) layout and container-query utilities,
[Pico CSS](https://github.com/picocss/pico) (final release 2.1.1, now archived),
Bootstrap 5.3 grid and the 6.0 alpha direction, Bulma columns plus its CSS Grid
module, Chakra `Stack` / `SimpleGrid`, Mantine `Stack` / `Group` / `SimpleGrid`
(`type="container"`), [CUBE CSS](https://cube.fyi/), Elastic Next, Chia,
[dot-grid](https://www.npmjs.com/package/@lobergdesign/dot-grid), and CoralCSS.

## What they offer

| Product | Kind | Notable layout capabilities | DX worth noticing |
| --- | --- | --- | --- |
| Every Layout | Intrinsic primitives, custom elements | Stack, Box, Center, Cluster, Sidebar, Switcher (threshold **and** a child-count limit), Cover, Grid, Frame, Reel, Imposter, Icon. Almost no `@media`. | Code generators per layout. Props are free-form strings, so they need inline style or a runtime. The book is the docs. |
| Tailwind CSS | Utility classes, build step | Flex, grid, 12-column spans, `columns-*`, container queries (`@container`, `@sm:`), subgrid utilities, aspect, sticky, scroll snap, `break-inside`. | Best-in-class editor autocomplete, a huge docs site, and official framework guides. Arbitrary values need the compiler. |
| Open Props | Token stylesheet | Fluid size and type scales via `clamp()`, aspect ratios, easings, shadows, z-index layers, `@media` tokens. Not a layout system. | Import one file. `:where(html)` keeps specificity at zero. No layout tags. |
| Utopia | Token generator | Fluid type, fluid space, and space **pairs** (`--space-s-l`) between min and max viewports. Container-relative clamps exist in the SCSS helper. | Calculator and copy-paste CSS. You own the output. Clamp on font-size can fight user text zoom. |
| Pico CSS | Classless semantic CSS | `.container` and an equal-column `.grid` that stacks under a viewport breakpoint. Final release styles native controls. | One classless stylesheet and a CDN. Archived in 2026. No popover, anchor, or cascade-layer story. |
| Bootstrap / Bulma | Class frameworks | Bootstrap: flex 12-column grid, six viewport tiers, gutters, a Sass flag for CSS Grid. Bulma: flex `.columns` / `.column` plus a newer grid module. Both include multi-column helpers. | Familiar class names, huge docs, themes. Responsiveness is viewport breakpoints, which is the JavaScript-era habit container queries replace. |
| Chakra / Mantine | React layout components | `Stack`, `Group`/`Wrap`, `SimpleGrid`, `Grid`, `Center`, `AspectRatio`, `ScrollArea`, `Container`. Mantine SimpleGrid can switch on **container** type instead of viewport breakpoints. | Typed props, style props, and theme tokens. They ship a runtime. Breakpoint objects (`cols={{ base: 1, md: 3 }}`) are the API people reach for when they would otherwise write JS. |
| CUBE CSS | Methodology | Composition, Utility, Block, Exception. Composition is global layout, exceptions are local. | A way to think, not a package. LayoutKit already sits in the composition slot. |
| Elastic Next, Chia, dot-grid | Newer pure-CSS systems | Elastic and dot-grid: 12-column grids, subgrid, container-query column steps, cascade layers, logical properties. Chia: attribute selectors (`data-grid`) for auto-fill, fixed columns, sidebar templates, and subgrid. | Close to LayoutKit's "one file, no build" idea, but class or data-attribute based. Elastic adds a toolbar-safe viewport height. |
| CoralCSS | Utility framework plus headless components | Container queries, anchor positioning, scroll-driven animation utilities, subgrid. | Rust build step and hundreds of utilities. Shows the modern CSS checklist; it is not a vocabulary. |

## Where layoutkit was behind

Before 1.5.0, layoutkit already had the Every Layout core (stack, box, center,
cluster, sidebar, switcher, cover, grid, frame-as-aspect-ratio, scroll area)
plus logical properties and a cascade layer. It did not have:

- A switcher child-count limit, so a wide row of many equal items still needed
  script or a hand-written nth-child rule.
- Container-query sizing. The flex-basis trick is container-relative, but it
  is not `container-type` / `cqi`, and a fixed `cols` grid never stacked.
- `:has()` adaptations, subgrid, scroll-snap carousels, sticky sidebars,
  scroll-timeline progress, or popover / details anchoring.
- An imposter-style overlay that centers over a parent without taking flow space.
- Multi-column text flow (Bootstrap, Bulma, and Tailwind all have this).
- Fluid space. Tokens were static rem steps. Utopia and Open Props ship
  `clamp()` scales so spacing tracks the viewport without breakpoints.
- Enumerated container widths. Mantine, Tailwind, Elastic, and dot-grid let you
  pick a step. A single 32rem cutoff is harder to reuse.

DX gaps that are real but should not turn layoutkit into those products:

- Tailwind and the React kits win on autocomplete, searchable docs, and
  framework starters. LayoutKit's `jsx.d.ts` only covers the attributes the CSS
  implements, which is the right size, and the playground shows the CSS a tag
  replaces. There is no React, Vue, or Svelte wrapper, on purpose.
- Open Props and Utopia are better token foundries. LayoutKit should keep
  consuming `--space-*` rather than shipping a color, shadow, and easing system.
- Pico's classless control theme is a different product. LayoutKit wraps
  semantic HTML and does not style buttons, forms, or type beyond `lk-text`.
- Named grid areas, 12-column span props, and breakpoint objects (`cols={{ md: 3 }}`)
  are how teams still reach for JavaScript or a compiler. They also blow up a
  small attribute vocabulary. Container queries plus `cols` cover the layout
  need without a viewport map.

## Shipped in 1.5.0 from this list

- Container queries on `lk-switcher`, `lk-sidebar`, and `lk-grid`, including
  `cqi` and `container="sm|md|lg|xl"` stack thresholds.
- `:has()` `adapt` for a solo row or stack and a card with a figure.
- `subgrid` on `lk-grid`.
- `snap` carousels on `lk-row` and `lk-scroll-area`.
- `sticky` sidebars and `lk-progress` scroll timelines, with static fallbacks.
- `lk-popover`, `lk-menu`, and `lk-disclosure` with anchor positioning and an
  absolute or user-agent fallback.
- `limit` on `lk-switcher` (Every Layout's quantity threshold).
- `overlay` on `lk-center` (the Imposter, without taking a new tag name).
- `lk-columns` for multi-column flow.
- `--lk-space-fluid-*` clamp tokens. The static `--lk-space-*` scale is
  unchanged until an author points `--space-*` at a fluid token.

## Prioritized for a later run

Shipped since this note was written:

- 2.0.0: `::scroll-button()` / `::scroll-marker`, `view()` reveal, `interpolate-size` on disclosure, container style queries (`layout="compact"`), and `sibling-count()` on the switcher limit. Each stays behind `@supports`.
- 2.1.0: `sibling-index()` on `bands`.
- 2.2.0: `reading-flow` on reversed rows and dense grids. `spot` reorders a child only inside that same `@supports`, so a browser that cannot fix tab order does not move the picture. `stuck`, `mark="current"`, and vertical `cue` use scroll-state queries. `match="width"` uses `anchor-size()`. `--lk-cover-min` is documented as the toolbar clearance. There is still no second full-height attribute.

Still deferred:

1. **Masonry.** The shared syntax is now `display: grid-lanes`, not `grid-template-rows: masonry`. As of November 2026 Safari 26.4 ships it and Chrome and Firefox do not ship it unflagged. `reading-flow` is not in Safari, so a lanes attribute would reorder the picture in the browser that cannot correct reading order. Do not ship it yet.
2. **Full Utopia space pairs.** Still a generator product. Hosts can assign a clamp to `--space-*`.
3. **Framework packages.** Still no React wrapper.
4. **12-column spans and viewport breakpoint props.** Leave these to normal CSS or to Tailwind.
5. **Auto separators, icon squares, and classless control skins.** `lk-divider` stays an explicit element. `lk-select` remains the only control skin, and only inside `@supports (appearance: base-select)`.

## Breaking proposals (need owner approval)

2.0.0 took the container, limit, overlay, fluid-space, and horizontal-snap
defaults, with opt-outs. 2.2.0 makes centered alignment `safe` where the
keyword exists. Content that fits does not move. Content that overflows aligns
to the start. The restore rule is in `MIGRATION.md`.
