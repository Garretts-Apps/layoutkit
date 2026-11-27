# Unreleased: reveal removed

`reveal` on `lk-box`, `lk-card`, and `lk-stack` no longer does anything. It
faded a block in and slid it up as it scrolled into view. Content is now
shown as it is, which is what every browser without `animation-timeline:
view()` and every reduced-motion reader already got. Markup that sets
`reveal` keeps working and needs no change; the attribute stays in
`jsx.d.ts`, marked deprecated. To keep the effect, paste the 2.2.0 rule
into your own stylesheet; it is in the git history of
`packages/layoutkit/gen.mjs`.

# Migrating to layoutkit-css 2.2.0

2.2.0 keeps every tag name, attribute name, and export path. One default
changes, and only when centered content overflows its container.

## Restore plain centering

Load this after LayoutKit. It is unlayered, so it beats `@layer layoutkit`.

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

Content that fits is centered either way. `safe center` is what moves an item
that is wider or taller than the container, back to the start. Browsers
without the keyword never applied it.

## Opt-in, off until you set them

- `reading="visual"` or `reading="source"` on a row, stack, or grid. A reversed row and a dense grid already follow the picture where `reading-flow` exists. `source` opts out.
- `spot="first"` or `spot="last"` on a child. Ignored where `reading-flow` is missing, so the source order stays the picture.
- `stuck` on a sticky box, stack, row, or sidebar. A hairline on the children, where scroll-state queries exist.
- `mark="current"` on a snap row or scroll area. An outline on the current slide's contents.
- `cue` on a vertical scroll area. A fade while more content sits below.
- `match="width"` on a menu or popover.
- `popover="hint"` on `lk-popover`. Pair it with `popovertarget`. `interestfor` is the hover path where that attribute exists.

Nothing else from 2.1.0 changes meaning.

# Migrating to layoutkit-css 2.1.0

2.1.0 adds tags and opt-in attributes. It does not change a 2.0.0 default.
Existing tags, attribute names, and export paths still work. There is no
restore snippet for 2.1.0, because nothing you already shipped moves.

New, all opt-in by using the tag or attribute:

- `lk-frame` and `lk-bleed` for a measured column with full-width bands.
- `lk-dock` for hover magnification.
- `lk-select` around a native `<select>`. Styling requires `appearance: base-select`.
- `look="panel"` on `lk-disclosure`. Exclusive groups are the HTML `name` on `<details>`.
- `pattern` and `blend` on `lk-box`.
- `bands` on `lk-stack` or `lk-row`.
- `--lk-base` and the OKLCH relatives derived from it. They do not paint on their own.

The rest of this file is the 2.0.0 guide, from 1.5.0.

# Migrating to layoutkit-css 2.0.0

2.0.0 keeps every tag name, attribute name, and export path. It changes
defaults. Load your own stylesheet after LayoutKit. Rules outside
`@layer layoutkit` beat the library, so the restore snippets below win
without `!important`.

## Restore the 1.5.0 look

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

## What changed

### Containers

`lk-switcher`, `lk-sidebar`, and `lk-grid` set `container-type: inline-size`.
A grid with fixed `cols` stacks its children below 32rem. `responsive` and
`min` still use auto-fit and do not stack that way.

Opt out with `container="off"`. `container="sm"`, `md`, `lg`, and `xl` still
choose 24rem, 32rem, 48rem, and 64rem.

### Switcher threshold

Children sit in a row above 30rem and take `flex-basis: 100%` below it.
`flex-direction` stays `row`, so `place` and `align` keep their meaning.

| `at` | Breakpoint |
| --- | --- |
| `xs` | 20rem |
| `sm` | 24rem |
| omitted or `md` | 30rem |
| `lg` | 40rem |
| `xl` | 48rem |
| `2xl` | 64rem |
| `flex` | the 1.5.0 formula, and `--lk-switch-at` names any length |

Container queries cannot read a custom property as the breakpoint, so an
arbitrary length uses `at="flex"`.

### Switcher limit

Five or more children each take a full row. Set `limit="2"` through `limit="6"`
for another count, or `limit="off"` to disable it. Where `sibling-count()`
exists, the same count is the basis.

### One child

An `lk-row` or `lk-stack` with one element child is centered. `justify` and
`place` still win. `adapt="off"` restores start alignment. `adapt="solo"`
still means the same centering. `adapt="figure"` is unchanged and only applies
to `lk-card`.

### Center overlay

`lk-center` is absolutely positioned and covers its containing block. Set
`overlay="off"` when the center should stay in flow, including brand marks
and empty states. The parent must be positioned for the overlay to cover it
rather than a further ancestor.

### Fluid space

`--lk-space-*` is `var(--space-*, var(--lk-space-fluid-*))`. A host `--space-*`
token still wins. `--lk-space-static-*` is the old rem scale. Point
`--lk-space-md` at `--lk-space-static-md` to restore one step, or use the
`:root` block above for the whole scale.

### Horizontal snap

`lk-scroll-area direction="horizontal"` snaps its children unless `snap="off"`.
Vertical snapping still requires `snap`. `lk-scroll-area` also sets
`min-inline-size: 0` so a flex row can shrink it and scroll instead of forcing
the page wider.

### Width

| Value | 1.5.0 | 2.0.0 |
| --- | --- | --- |
| `lg` | 50rem | 50rem |
| `xl` | 64rem | 56rem |
| `2xl` |  | 64rem |
| `3xl` |  | 80rem |

Rename a previous `width="xl"` to `width="2xl"`, or set `max-inline-size: 64rem`
on that element. `lk-spread` accepts `width`.

## New opt-in behavior

These do nothing until you set the attribute.

- `sticky` on `lk-box`, `lk-stack`, and `lk-row`. `--lk-sticky-top` is the offset. Sidebar sticky is unchanged.
- `square="xs|sm|md|lg|xl"` on `lk-center` and `lk-box` (1.25rem, 1.75rem, 2.5rem, 4rem, 6rem).
- `full-height="container"` and `lk-cover size="container"` use the query container (`100%`, then `100cqb`). A boolean `full-height` and a plain cover still use the viewport.
- `adapt="scroll"` on `lk-row` is a horizontal snap scroller that becomes a column below 32rem.
- `reveal` on `lk-box`, `lk-card`, and `lk-stack` faded in on `animation-timeline: view()`. It was removed after 2.2.0 and now does nothing; see "Unreleased: reveal removed" above.
- `layout="compact"` sets `--lk-layout: compact`. Inside `@container style(--lk-layout: compact)`, rows become columns. Browsers without style queries ignore that at-rule.
- Snap scrollers gain `::scroll-button()` and `::scroll-marker` where `selector(::scroll-button(inline-start))` matches. The buttons are named Previous and Next.
- `lk-disclosure` animates its height where `interpolate-size: allow-keywords` exists. `animate="off"` skips it. Reduced motion skips it. Closed content stays closed.

## Accessibility

Focus order follows source order. The switcher does not change `flex-direction`
when it stacks, so `place` does not reverse reading order. Reveal and
disclosure animation are disabled under `prefers-reduced-motion`. Scroll
buttons, when the browser provides them, are extra controls and do not replace
keyboard scrolling. A horizontal snap region still needs `tabindex="0"` and a
name if the region itself must be a keyboard stop.
