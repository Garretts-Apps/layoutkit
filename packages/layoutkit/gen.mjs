// Generates layoutkit.css — pure-CSS layout primitives that style unregistered
// <lk-*> custom-element-shaped tags via attribute selectors. No JavaScript, no
// runtime, no dependencies.
//
//   node gen.mjs   ->   layoutkit.css
//
// Architecture notes:
//   - All rules live in `@layer layoutkit` so a host app controls specificity
//     relative to its own cascade layers (unlayered author styles always win).
//   - Named spacing resolves through --lk-space-* custom properties that default
//     to the host's --space-* tokens. Override --space-* (or --lk-space-*
//     directly) to remap the scale.
//   - Directional box-model uses logical properties (block/inline) so layouts
//     follow writing mode and RTL.
//   - Free-form values (color, ratio, min/max sizes) are driven by CSS custom
//     properties so they stay in pure CSS without enumerating every value.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const rem = (n) => `${Number(n) * 0.25}rem`;
const NUM = ["0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4", "5", "6", "7", "8", "9", "10", "11", "12", "14", "16"];
// Semantic t-shirt sizes — these are the design tokens. Each resolves through
// the host's --space-* token, falling back to LayoutKit's own value.
const TOKENS = { xs: rem("1"), sm: rem("2"), md: rem("4"), lg: rem("6"), xl: rem("8"), "2xl": rem("12"), "3xl": rem("16") };
// Resolved spacing values used inside rules. Named tokens point at the custom
// properties; the fixed numeric scale and none/px stay literal.
const SPACE = { none: "0", px: "1px" };
for (const t of Object.keys(TOKENS)) SPACE[t] = `var(--lk-space-${t})`;
for (const n of NUM) SPACE[n] = rem(n);
const ALIGN = { start: "flex-start", center: "center", end: "flex-end", stretch: "stretch", baseline: "baseline" };
const JUSTIFY = { start: "flex-start", center: "center", end: "flex-end", between: "space-between", around: "space-around", evenly: "space-evenly" };

// `place` — one axis-agnostic attribute for "where children sit". Each value is
// resolved per container so the same word is visually consistent regardless of
// the flex/grid main axis (no more align-vs-justify axis math in your head).
// Positions are [inline, block] visual anchors (start = inline/block-start, RTL-aware).
const PLACE = {
  center: ["center", "center"], top: ["center", "start"], bottom: ["center", "end"],
  start: ["start", "center"], end: ["end", "center"],
  "top-start": ["start", "start"], "top-end": ["end", "start"],
  "bottom-start": ["start", "end"], "bottom-end": ["end", "end"],
};
const DIST = { between: "space-between", around: "space-around", evenly: "space-evenly" };
const FLEX = { start: "flex-start", center: "center", end: "flex-end" };
const GRIDP = { start: "start", center: "center", end: "end" };

// Type scale, weights, radius, width — all token-backed where it makes sense.
const TEXT = { xs: "0.75rem", sm: "0.875rem", md: "1rem", lg: "1.125rem", xl: "1.25rem", "2xl": "1.5rem", "3xl": "2rem", "4xl": "3rem" };
const WEIGHT = { normal: "400", medium: "500", semibold: "600", bold: "700" };
const RADIUS = { none: "0", sm: "0.375rem", md: "0.75rem", lg: "1rem", full: "9999px" };
const WIDTH = { xs: "20rem", sm: "30rem", md: "40rem", lg: "50rem", xl: "64rem", prose: "var(--lk-measure, 65ch)", full: "100%" };
// Enumerated free-form values — CSP-clean alternatives to the inline --lk-* knobs.
const RATIO = ["1/1", "16/9", "4/3", "3/2", "2/1", "3/1", "9/16", "4/5"];
const MINW = { "2xs": "8rem", xs: "10rem", sm: "12rem", md: "16rem", lg: "20rem", xl: "24rem" };
const MAXH = { sm: "16rem", md: "24rem", lg: "32rem", screen: "100svh" };

const out = [];
const section = (title) => out.push(`\n  /* ${title} */`);
const rule = (sel, decls) => out.push(`  ${sel} { ${decls} }`);
// @supports keeps an unsupported unit or function from invalidating the
// previous declaration. A var() fallback that the browser cannot parse would
// unset the property instead of leaving the earlier fallback in place.
const atSupports = (condition, sel, decls) => {
  out.push(`  @supports ${condition} {`);
  out.push(`    ${sel} { ${decls} }`);
  out.push("  }");
};
// Multi-rule blocks (container queries, :has, anchor). The string is indented
// one level; this adds the @layer indent. A blank line stays blank.
const lines = (block) => {
  const text = block.replace(/^\n/, "").replace(/\n\s*$/, "");
  for (const line of text.split("\n")) out.push(line.trim() === "" ? "" : `  ${line}`);
};
const DIVIDER_FALLBACK = "var(--lk-divider-color, #e5e7eb)";
const DIVIDER_MIX = "var(--lk-divider-color, color-mix(in srgb, currentColor 20%, transparent))";
const FULL_HEIGHT = "lk-center[full-height], lk-stack[full-height], lk-row[full-height]";
// One grouped rule per attribute value across the given tags.
const variants = (tags, attr, map, render) => {
  for (const [k, v] of Object.entries(map)) {
    rule(tags.map((t) => `${t}[${attr}="${k}"]`).join(",\n  "), render(v));
  }
};

out.push("/*");
out.push(" * layoutkit-css — a tiny pure-CSS layout vocabulary for readable app structure.");
out.push(" * Zero dependencies. No JavaScript. No build step.");
out.push(" *");
out.push(' *   <link rel="stylesheet" href="layoutkit.css">');
out.push(' *   <main>');
out.push(' *     <lk-stack gap="lg">');
out.push(" *       <h1>Dashboard</h1>");
out.push(" *     </lk-stack>");
out.push(" *   </main>");
out.push(" *");
out.push(" * Tokens: remap the scale onto your design tokens by defining --space-*");
out.push(" * (or override --lk-space-* directly). All rules are in @layer layoutkit.");
out.push(" * Free-form values use custom properties:");
out.push(" *   --lk-ratio, --lk-divider-color, --lk-min-child-width, --lk-max-height, --lk-max-width,");
out.push(" *   --lk-switch-at, --lk-sidebar-width, --lk-sidebar-content-min, --lk-sticky-top,");
out.push(" *   --lk-snap-gap, --lk-pad, --lk-anchor, --lk-progress-color, --lk-popover-bg, --lk-popover-fg,");
out.push(" *   --lk-space-fluid-*, --lk-overlay-inset, --lk-overlay-z.");
out.push(" */");

out.push("@layer layoutkit {");

section("Design tokens — remap via your --space-* / --text-* / --radius-* tokens, or override --lk-* directly");
rule(":root", [
  ...Object.entries(TOKENS).map(([k, v]) => `--lk-space-${k}: var(--space-${k}, ${v});`),
  ...Object.entries(TEXT).map(([k, v]) => `--lk-text-${k}: var(--text-${k}, ${v});`),
  ...Object.entries(RADIUS).filter(([k]) => k !== "none" && k !== "full").map(([k, v]) => `--lk-radius-${k}: var(--radius-${k}, ${v});`),
].join(" "));

section("Fluid space — opt-in tokens. Assign one to --space-* or --lk-space-* to opt in; the static scale is unchanged");
const FLUID = {
  xs: ["0.25rem", "0.2rem + 0.25", "0.5rem"],
  sm: ["0.5rem", "0.35rem + 0.5", "0.75rem"],
  md: ["0.75rem", "0.55rem + 0.8", "1.25rem"],
  lg: ["1rem", "0.7rem + 1.2", "1.75rem"],
  xl: ["1.5rem", "1rem + 2", "2.5rem"],
  "2xl": ["2rem", "1.25rem + 3", "4rem"],
  "3xl": ["3rem", "1.5rem + 4.5", "6rem"],
};
const fluidDecls = (unit) => Object.entries(FLUID).map(([k, [min, pref, max]]) => `--lk-space-fluid-${k}: clamp(${min}, ${pref}${unit}, ${max});`).join(" ");
rule(":root", fluidDecls("vw"));
atSupports("(width: 1vi)", ":root", fluidDecls("vi"));

section("Base — every primitive sets its own display + box model");
rule("lk-stack,\n  lk-row,\n  lk-center,\n  lk-box,\n  lk-card,\n  lk-spread,\n  lk-grid,\n  lk-cluster,\n  lk-switcher,\n  lk-sidebar,\n  lk-cover,\n  lk-spacer,\n  lk-divider,\n  lk-aspect-ratio,\n  lk-scroll-area,\n  lk-progress,\n  lk-popover,\n  lk-disclosure,\n  lk-menu,\n  lk-columns", "box-sizing: border-box;");
rule("lk-stack", "display: flex; flex-direction: column; gap: var(--lk-space-md); align-items: stretch; justify-content: flex-start;");
rule("lk-row", "display: flex; flex-direction: row; gap: var(--lk-space-md); align-items: center; justify-content: flex-start;");
rule("lk-center", "display: flex; flex-direction: column; align-items: center; justify-content: center;");
rule("lk-box", "display: block;");
rule("lk-spread", "display: flex; flex-direction: row; justify-content: space-between; align-items: center;");
rule("lk-grid", "display: grid; grid-template-columns: repeat(1, minmax(0, 1fr)); gap: var(--lk-space-md);");
rule("lk-spacer", "display: block; flex: 1 1 0%;");
rule("lk-divider", `display: block; inline-size: 100%; border-block-start: 1px solid ${DIVIDER_FALLBACK};`);
rule("lk-aspect-ratio", "display: block; aspect-ratio: var(--lk-ratio, 1);");
rule("lk-scroll-area", "display: block; overflow-y: auto; max-block-size: var(--lk-max-height, none); max-inline-size: var(--lk-max-width, none);");
rule("lk-card", "display: block; padding: var(--lk-space-lg); --lk-pad: var(--lk-space-lg); border-radius: var(--lk-radius-md); border: 1px solid var(--lk-card-border, color-mix(in srgb, currentColor 12%, transparent));");

section("Responsive intent primitives — respond to available space, no media queries");
// Cluster: a wrapping group (chips, tags, buttons). align via `place`, gap via `gap`.
rule("lk-cluster", "display: flex; flex-wrap: wrap; gap: var(--lk-space-sm); align-items: center;");
// Switcher: a row that flips to a stack when narrower than --lk-switch-at — pure
// intrinsic sizing (the flex-basis calc trick), no query, no JS.
rule("lk-switcher", "display: flex; flex-wrap: wrap; gap: var(--lk-space-md);");
rule("lk-switcher > *", "flex-grow: 1; flex-basis: calc((var(--lk-switch-at, 30rem) - 100%) * 999);");
// Sidebar: a fixed-width side + a flexible content area that wraps under it when
// the content would get narrower than --lk-sidebar-content-min.
rule("lk-sidebar", "display: flex; flex-wrap: wrap; gap: var(--lk-space-md);");
rule("lk-sidebar > :first-child", "flex-grow: 1; flex-basis: var(--lk-sidebar-width, 18rem);");
rule("lk-sidebar > :last-child", "flex-grow: 999; flex-basis: 0; min-inline-size: var(--lk-sidebar-content-min, 50%);");
rule('lk-sidebar[side="end"] > :first-child', "flex-grow: 999; flex-basis: 0; min-inline-size: var(--lk-sidebar-content-min, 50%);");
rule('lk-sidebar[side="end"] > :last-child', "flex-grow: 1; flex-basis: var(--lk-sidebar-width, 18rem); min-inline-size: 0;");
// Cover: a min-height region; the [center] child (or a lone child) is vertically
// centered while header/footer children sit at the edges.
rule("lk-cover", "display: flex; flex-direction: column; min-block-size: var(--lk-cover-min, 100vh); gap: var(--lk-space-md); padding: var(--lk-space-md);");
atSupports("(min-block-size: 100svh)", "lk-cover", "min-block-size: var(--lk-cover-min, 100svh);");
atSupports("(min-block-size: 100dvh)", "lk-cover", "min-block-size: var(--lk-cover-min, 100dvh);");
rule("lk-cover > [center],\n  lk-cover > :only-child", "margin-block: auto;");

section("Type scale — lk-text / lk-weight (namespaced; work on any element)");
for (const k of Object.keys(TEXT)) rule(`[lk-text="${k}"]`, `font-size: var(--lk-text-${k});`);
for (const [k, v] of Object.entries(WEIGHT)) rule(`[lk-weight="${k}"]`, `font-weight: ${v};`);

section("Width — constrain & center content");
const WIDTH_TAGS = ["lk-box", "lk-card", "lk-stack", "lk-center", "lk-row"];
for (const [k, v] of Object.entries(WIDTH)) {
  rule(WIDTH_TAGS.map((t) => `${t}[width="${k}"]`).join(",\n  "), `max-inline-size: ${v};${k === "full" ? "" : " margin-inline: auto;"}`);
}

section("Flow — vertical rhythm between flowing children (the owl)");
// Bare `flow` keeps the md rhythm. Every enumerated spacing value, including the
// numeric scale, overrides it. These rules share specificity with the bare
// attribute, so they have to come after it.
rule("lk-box[flow] > * + *,\n  lk-card[flow] > * + *", "margin-block-start: var(--lk-space-md);");
for (const [k, v] of Object.entries(SPACE)) rule(`lk-box[flow="${k}"] > * + *,\n  lk-card[flow="${k}"] > * + *`, `margin-block-start: ${v};`);

section("Card — padding, radius, surface, border");
variants(["lk-card"], "padding", SPACE, (v) => `padding: ${v}; --lk-pad: ${v};`);
for (const k of Object.keys(RADIUS)) rule(`lk-card[radius="${k}"]`, `border-radius: ${k === "none" ? "0" : k === "full" ? "9999px" : `var(--lk-radius-${k})`};`);
rule("lk-card[surface]", "background: var(--lk-surface, color-mix(in srgb, currentColor 6%, transparent));");
rule('lk-card[border="none"]', "border: 0;");

section("Gap (lk-stack, lk-row, lk-grid, lk-cluster, lk-switcher, lk-sidebar, lk-cover, lk-scroll-area)");
variants(["lk-stack", "lk-row", "lk-grid", "lk-cluster", "lk-switcher", "lk-sidebar", "lk-cover", "lk-scroll-area"], "gap", SPACE, (v) => `gap: ${v};`);

section("Padding (lk-stack, lk-row, lk-box, lk-spread)");
variants(["lk-stack", "lk-row", "lk-box", "lk-spread"], "padding", SPACE, (v) => `padding: ${v};`);

section("Align-items (lk-stack, lk-row, lk-spread)");
variants(["lk-stack", "lk-row", "lk-spread"], "align", ALIGN, (v) => `align-items: ${v};`);

section("Justify-content (lk-stack, lk-row)");
variants(["lk-stack", "lk-row"], "justify", JUSTIFY, (v) => `justify-content: ${v};`);

section("Place — axis-agnostic alignment (the same word works on rows and stacks)");
// Flex containers: for a column the block axis is main (justify) and inline is cross (align);
// for a row it's the reverse. Encoding both keeps `place` visually consistent.
const placeFlex = (tag, mainIsBlock) => {
  for (const [val, [inl, blk]] of Object.entries(PLACE)) {
    const [jc, ai] = mainIsBlock ? [FLEX[blk], FLEX[inl]] : [FLEX[inl], FLEX[blk]];
    rule(`${tag}[place="${val}"]`, `justify-content: ${jc}; align-items: ${ai};`);
  }
  for (const [val, jc] of Object.entries(DIST)) rule(`${tag}[place="${val}"]`, `justify-content: ${jc};`);
};
placeFlex("lk-stack", true);
placeFlex("lk-center", true);
placeFlex("lk-row", false);
placeFlex("lk-spread", false);
placeFlex("lk-cluster", false);
// Grid: items align within their cells via justify-items (inline) + align-items (block).
for (const [val, [inl, blk]] of Object.entries(PLACE)) {
  rule(`lk-grid[place="${val}"]`, `justify-items: ${GRIDP[inl]}; align-items: ${GRIDP[blk]};`);
}
// Distribution is extra space between tracks, not item alignment inside them.
for (const [val, jc] of Object.entries(DIST)) {
  rule(`lk-grid[place="${val}"]`, `justify-content: ${jc}; align-content: ${jc};`);
}

section("Boolean modifiers");
rule("lk-stack[center],\n  lk-row[center]", "align-items: center; justify-content: center;");
rule("lk-center[fill],\n  lk-stack[fill],\n  lk-row[fill],\n  lk-box[fill]", "flex: 1 1 0%;");
rule(FULL_HEIGHT, "min-block-size: 100vh;");
atSupports("(min-block-size: 100svh)", FULL_HEIGHT, "min-block-size: 100svh;");
atSupports("(min-block-size: 100dvh)", FULL_HEIGHT, "min-block-size: 100dvh;");
rule("lk-stack[wrap],\n  lk-row[wrap]", "flex-wrap: wrap;");
rule("lk-row[reverse]", "flex-direction: row-reverse;");

section("Center — single-axis overrides");
rule("lk-center[inline]", "display: inline-flex;");
rule("lk-center[horizontal]:not([vertical])", "justify-content: flex-start;");
rule("lk-center[vertical]:not([horizontal])", "align-items: stretch;");

section("Grid columns / rows / flow / placement");
for (let n = 1; n <= 12; n++) rule(`lk-grid[cols="${n}"]`, `grid-template-columns: repeat(${n}, minmax(0, 1fr));`);
for (let n = 1; n <= 12; n++) rule(`lk-grid[rows="${n}"]`, `grid-template-rows: repeat(${n}, minmax(0, 1fr));`);
// Clamp the track minimum to the container so a viewport narrower than the
// preferred track does not force horizontal overflow. At wider sizes min()
// resolves to the same preferred length as before.
rule("lk-grid[responsive]", "grid-template-columns: repeat(auto-fit, minmax(min(var(--lk-min-child-width, 250px), 100%), 1fr));");
// `min` is the enumerated auto-fit track size. It replaces `responsive` when
// both are set. Empty tracks collapse, same as `responsive`, and min() still
// stops a narrow container from overflowing.
for (const [k, v] of Object.entries(MINW)) rule(`lk-grid[min="${k}"]`, `grid-template-columns: repeat(auto-fit, minmax(min(${v}, 100%), 1fr));`);
variants(["lk-grid"], "col-gap", SPACE, (v) => `column-gap: ${v};`);
variants(["lk-grid"], "row-gap", SPACE, (v) => `row-gap: ${v};`);
rule('lk-grid[flow="row"]', "grid-auto-flow: row;");
rule('lk-grid[flow="col"]', "grid-auto-flow: column;");
rule('lk-grid[flow="dense"]', "grid-auto-flow: dense;");
for (const p of ["start", "center", "end", "stretch"]) rule(`lk-grid[place-items="${p}"]`, `place-items: ${p};`);

section("Spacer — fixed sizes (default is flexible)");
rule('lk-spacer[size="auto"]', "flex: 1 1 0%;");
// flex-basis is the main size, so the same size separates siblings in a row or
// a stack. block-size preserves the previous vertical size, including when the
// spacer is not a flex item.
variants(["lk-spacer"], "size", SPACE, (v) => `flex: 0 0 ${v}; block-size: ${v};`);

section("Divider — thickness + vertical orientation");
rule('lk-divider[thickness="medium"]', "border-block-start-width: 2px;");
rule('lk-divider[thickness="thick"]', "border-block-start-width: 4px;");
rule('lk-divider[orientation="vertical"]', `inline-size: auto; block-size: 100%; align-self: stretch; border-block-start: 0; border-inline-start: 1px solid ${DIVIDER_FALLBACK};`);
rule('lk-divider[orientation="vertical"][thickness="medium"]', "border-inline-start-width: 2px;");
rule('lk-divider[orientation="vertical"][thickness="thick"]', "border-inline-start-width: 4px;");
// Color only, so thickness set above is preserved. currentColor follows the
// page foreground on light and dark backgrounds.
atSupports("(color: color-mix(in srgb, currentColor 20%, transparent))", "lk-divider", `border-block-start-color: ${DIVIDER_MIX}; border-inline-start-color: ${DIVIDER_MIX};`);

section("Scroll-area — direction + enumerated max height");
rule('lk-scroll-area[direction="vertical"]', "overflow-x: hidden; overflow-y: auto;");
rule('lk-scroll-area[direction="horizontal"]', "overflow-x: auto; overflow-y: hidden;");
rule('lk-scroll-area[direction="both"]', "overflow: auto;");
for (const [k, v] of Object.entries(MAXH)) rule(`lk-scroll-area[max-h="${k}"]`, `max-block-size: ${v};`);

section("Aspect-ratio — common ratios (enumerated, CSP-clean)");
for (const r of RATIO) rule(`lk-aspect-ratio[ratio="${r}"]`, `aspect-ratio: ${r};`);
// Physical size first, then logical size, so older browsers still fill the
// frame and writing-mode-aware browsers use the logical axes.
rule(["img", "video", "iframe", "canvas", "svg"].map((tag) => `lk-aspect-ratio > ${tag}`).join(",\n  "), "display: block; width: 100%; height: 100%; inline-size: 100%; block-size: 100%; object-fit: cover;");

section("Container queries — opt-in. Without [container], switcher, sidebar, and grid keep their intrinsic layout");
// cqi is read on the children, so it resolves against this element once it is
// the query container. Percentage flex-basis stays in place when cqi or
// container-type is unsupported. A fixed cols grid stacks its children when
// the grid itself is under 32rem; container queries cannot read a custom
// property as the threshold, so 32rem is the enumerated cutoff.
lines(`
@supports (container-type: inline-size) and (width: 1cqi) {
  lk-switcher[container] {
    container-type: inline-size;
    container-name: lk-switcher;
  }
  lk-sidebar[container] {
    container-type: inline-size;
    container-name: lk-sidebar;
  }
  lk-grid[container] {
    container-type: inline-size;
    container-name: lk-grid;
  }
  lk-switcher[container] > * {
    flex-basis: calc((var(--lk-switch-at, 30rem) - 100cqi) * 999);
  }
  lk-sidebar[container]:not([side="end"]) > :last-child,
  lk-sidebar[container][side="end"] > :first-child {
    min-inline-size: var(--lk-sidebar-content-min, 50cqi);
  }
  lk-grid[container] > * {
    min-inline-size: 0;
    max-inline-size: 100cqi;
  }
  lk-grid[container] > * :is(img, video, svg, canvas) {
    max-width: 100%;
    height: auto;
    max-inline-size: 100%;
    block-size: auto;
  }
  @container lk-grid (inline-size < 24rem) {
    lk-grid[container="sm"][cols]:not([responsive]):not([min]) > * {
      grid-column: 1 / -1;
    }
  }
  @container lk-grid (inline-size < 32rem) {
    lk-grid[container=""][cols]:not([responsive]):not([min]) > *,
    lk-grid[container="md"][cols]:not([responsive]):not([min]) > * {
      grid-column: 1 / -1;
    }
  }
  @container lk-grid (inline-size < 48rem) {
    lk-grid[container="lg"][cols]:not([responsive]):not([min]) > * {
      grid-column: 1 / -1;
    }
  }
  @container lk-grid (inline-size < 64rem) {
    lk-grid[container="xl"][cols]:not([responsive]):not([min]) > * {
      grid-column: 1 / -1;
    }
  }
}
`);

section("Switcher limit — opt-in quantity threshold. More than N children each take a full row");
for (const limit of [2, 3, 4, 5, 6]) {
  const from = limit + 1;
  rule(
    `lk-switcher[limit="${limit}"] > :nth-last-child(n + ${from}),\n  lk-switcher[limit="${limit}"] > :nth-last-child(n + ${from}) ~ *`,
    "flex-basis: 100%;",
  );
}

section("Center overlay — opt-in imposter. The parent supplies the containing block");
rule("lk-center[overlay]", "position: absolute; inset: var(--lk-overlay-inset, 0); z-index: var(--lk-overlay-z, 1);");

section(":has() adaptation — opt-in. Explicit place/justify still wins on a solo row or stack");
lines(`
@supports selector(:has(> :only-child)) {
  lk-row[adapt="solo"]:not([justify]):not([place]):has(> :only-child),
  lk-stack[adapt="solo"]:not([justify]):not([place]):has(> :only-child) {
    justify-content: center;
  }
}
@supports selector(:has(> figure)) {
  lk-card[adapt="figure"]:has(> figure) {
    padding: 0;
    overflow: hidden;
  }
  lk-card[adapt="figure"]:has(> figure) > figure {
    margin: 0;
  }
  lk-card[adapt="figure"]:has(> figure) > figure > :is(img, video) {
    display: block;
    width: 100%;
    height: auto;
    inline-size: 100%;
    block-size: auto;
  }
  lk-card[adapt="figure"]:has(> figure) > :not(figure) {
    margin-inline: var(--lk-pad, var(--lk-space-lg));
  }
  lk-card[adapt="figure"]:has(> figure) > :not(figure):first-child {
    margin-block-start: var(--lk-pad, var(--lk-space-lg));
  }
  lk-card[adapt="figure"]:has(> figure) > figure + :not(figure) {
    margin-block-start: var(--lk-space-md);
  }
  lk-card[adapt="figure"]:has(> figure) > :not(figure):last-child {
    margin-block-end: var(--lk-pad, var(--lk-space-lg));
  }
}
@supports selector(:has(> figure)) and (overflow: clip) {
  lk-card[adapt="figure"]:has(> figure) {
    overflow: clip;
  }
}
`);

section("Subgrid — opt-in. The nested grid spans the parent and shares its tracks; cols/rows remain the fallback");
lines(`
@supports (grid-template-columns: subgrid) {
  lk-grid[subgrid]:not([subgrid="rows"]) {
    grid-template-columns: subgrid;
    grid-column: 1 / -1;
  }
  lk-grid[subgrid="columns"] {
    grid-template-columns: subgrid;
    grid-column: 1 / -1;
  }
  lk-grid[subgrid="rows"],
  lk-grid[subgrid="both"] {
    grid-template-rows: subgrid;
    grid-row: 1 / -1;
  }
  lk-grid[subgrid]:not([gap]):not([col-gap]):not([row-gap]) {
    gap: inherit;
  }
}
`);

section("Scroll snap — opt-in carousels. Direct children are the slides. snap overrides wrap");
const snapGap = Object.entries(SPACE).map(([k, v]) => `  lk-row[snap][gap="${k}"],\n  lk-scroll-area[snap][gap="${k}"] { --lk-snap-gap: ${v}; }`).join("\n");
lines(`
@supports (scroll-snap-type: x mandatory) {
  lk-row[snap],
  lk-scroll-area[snap] {
    display: flex;
    flex-flow: row nowrap;
    --lk-snap-gap: var(--lk-space-md);
    overflow-x: auto;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    overscroll-behavior-inline: contain;
  }
  lk-row[snap]:not([align]):not([place]) {
    align-items: stretch;
  }
  lk-scroll-area[snap]:not([gap]) {
    gap: var(--lk-space-md);
  }
  lk-row[snap] > *,
  lk-scroll-area[snap] > * {
    scroll-snap-align: start;
    flex: 0 0 auto;
    min-inline-size: 0;
  }
  lk-row[snap="proximity"],
  lk-scroll-area[snap="proximity"] {
    scroll-snap-type: x proximity;
  }
  lk-row[snap="mandatory"],
  lk-scroll-area[snap="mandatory"] {
    scroll-snap-type: x mandatory;
  }
  lk-row[snap="center"] > *,
  lk-scroll-area[snap="center"] > * {
    scroll-snap-align: center;
  }
  lk-row[slide="full"][snap] > *,
  lk-scroll-area[slide="full"][snap] > * {
    flex: 0 0 100%;
  }
  lk-row[slide="half"][snap] > *,
  lk-scroll-area[slide="half"][snap] > * {
    flex: 0 0 calc((100% - var(--lk-snap-gap, var(--lk-space-md))) / 2);
  }
  lk-row[slide="third"][snap] > *,
  lk-scroll-area[slide="third"][snap] > * {
    flex: 0 0 calc((100% - 2 * var(--lk-snap-gap, var(--lk-space-md))) / 3);
  }
  lk-row[slide="peek"][snap] > *,
  lk-scroll-area[slide="peek"][snap] > * {
    flex: 0 0 80%;
  }
  lk-row[snap] :is(img, video, svg, canvas),
  lk-scroll-area[snap] :is(img, video, svg, canvas) {
    max-width: 100%;
    height: auto;
    max-inline-size: 100%;
    block-size: auto;
  }
  lk-scroll-area[snap][direction="vertical"] {
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: auto;
    scroll-snap-type: y mandatory;
    overscroll-behavior-inline: auto;
    overscroll-behavior-block: contain;
  }
  lk-scroll-area[snap="proximity"][direction="vertical"] {
    scroll-snap-type: y proximity;
  }
${snapGap}
}
@supports (scroll-snap-type: inline mandatory) {
  lk-row[snap],
  lk-scroll-area[snap],
  lk-row[snap="mandatory"],
  lk-scroll-area[snap="mandatory"],
  lk-row[snap="center"] {
    scroll-snap-type: inline mandatory;
  }
  lk-row[snap="proximity"],
  lk-scroll-area[snap="proximity"] {
    scroll-snap-type: inline proximity;
  }
  lk-scroll-area[snap][direction="vertical"],
  lk-scroll-area[snap="mandatory"][direction="vertical"] {
    scroll-snap-type: block mandatory;
  }
  lk-scroll-area[snap="proximity"][direction="vertical"] {
    scroll-snap-type: block proximity;
  }
}
`);

section("Sticky sidebar — opt-in. The side panel sticks; without sticky support the sidebar layout is unchanged");
lines(`
@supports (position: sticky) {
  lk-sidebar[sticky]:not([side="end"]) > :first-child,
  lk-sidebar[sticky][side="end"] > :last-child {
    position: sticky;
    inset-block-start: var(--lk-sticky-top, 0px);
    align-self: start;
    z-index: 1;
    max-block-size: 100vh;
    overflow-y: auto;
    overscroll-behavior-block: contain;
  }
}
@supports (position: sticky) and (max-block-size: 100svh) {
  lk-sidebar[sticky]:not([side="end"]) > :first-child,
  lk-sidebar[sticky][side="end"] > :last-child {
    max-block-size: 100svh;
  }
}
@supports (position: sticky) and (max-block-size: 100dvh) {
  lk-sidebar[sticky]:not([side="end"]) > :first-child,
  lk-sidebar[sticky][side="end"] > :last-child {
    max-block-size: 100dvh;
  }
}
`);

section("Scroll progress — static bar unless animation-timeline: scroll() is supported");
lines(`
@keyframes lk-scroll-progress {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
lk-progress {
  display: block;
  block-size: 0.25rem;
  inline-size: 100%;
  margin: 0;
  transform-origin: inline-start;
  background: var(--lk-progress-color, var(--lk-divider-color, #e5e7eb));
}
@supports (animation-timeline: scroll(root)) {
  lk-progress,
  lk-progress[scope="root"] {
    position: fixed;
    inset-block-start: 0;
    inset-inline: 0;
    z-index: var(--lk-progress-z, 2);
    inline-size: 100%;
    pointer-events: none;
    animation-name: lk-scroll-progress;
    animation-duration: auto;
    animation-timing-function: linear;
    animation-fill-mode: both;
    animation-timeline: scroll(root);
  }
  lk-progress[scope="nearest"] {
    position: sticky;
    inset-block-start: 0;
    inset-inline: 0;
    z-index: var(--lk-progress-z, 2);
    pointer-events: none;
    animation-name: lk-scroll-progress;
    animation-duration: auto;
    animation-timing-function: linear;
    animation-fill-mode: both;
    animation-timeline: scroll(nearest);
  }
}
@media (prefers-reduced-motion: reduce) {
  lk-progress,
  lk-progress[scope="root"],
  lk-progress[scope="nearest"] {
    animation: none;
    position: static;
    transform: none;
    pointer-events: none;
  }
}
`);
atSupports("(color: color-mix(in srgb, currentColor 55%, transparent))", "lk-progress", "background: var(--lk-progress-color, color-mix(in srgb, currentColor 55%, transparent));");

section("Popover and disclosure — native open/close. Anchor positioning is opt-in and scoped per control");
const panelChrome = [
  "box-sizing: border-box",
  "padding: var(--lk-space-md)",
  "border-radius: var(--lk-radius-md)",
  "border: 1px solid var(--lk-popover-border, var(--lk-divider-color, #e5e7eb))",
  "background: var(--lk-popover-bg, canvas)",
  "color: var(--lk-popover-fg, canvastext)",
  "width: max-content",
  "inline-size: max-content",
  "max-width: min(20rem, calc(100vw - 2rem))",
  "max-inline-size: min(20rem, calc(100vw - 2rem))",
  "max-height: min(70vh, calc(100vh - 2rem))",
  "max-block-size: min(70vh, calc(100vh - 2rem))",
  "overflow: auto",
  "overscroll-behavior: contain",
].join("; ");
rule("lk-menu", "display: inline-block; position: relative; max-inline-size: 100%;");
rule("lk-popover", panelChrome);
rule("lk-disclosure", "display: block;");
rule("lk-disclosure > details > :not(summary)", "margin-block-start: var(--lk-space-sm);");
rule('lk-disclosure[panel="overlay"] > details', "position: relative;");
rule('lk-disclosure[panel="overlay"] > details[open]', "z-index: 1;");
rule('lk-disclosure[panel="overlay"] > details > :not(summary)', `${panelChrome}; position: absolute; z-index: 1; inset-block-start: calc(100% + var(--lk-space-xs)); inset-inline-start: 0; margin-block-start: 0;`);
rule('lk-disclosure[side="end"][panel="overlay"] > details > :not(summary)', "inset-inline-start: auto; inset-inline-end: 0;");
atSupports("(max-inline-size: 1vi)", "lk-popover, lk-disclosure[panel=\"overlay\"] > details > :not(summary)", "max-inline-size: min(20rem, calc(100vi - 2rem));");
atSupports("(max-block-size: 100dvh)", "lk-popover, lk-disclosure[panel=\"overlay\"] > details > :not(summary)", "max-block-size: min(70dvh, calc(100dvh - 2rem));");
atSupports("(color: color-mix(in srgb, currentColor 20%, transparent))", "lk-popover, lk-disclosure[panel=\"overlay\"] > details > :not(summary)", "border-color: var(--lk-popover-border, color-mix(in srgb, currentColor 20%, transparent));");
// anchor-scope keeps one --lk-menu / --lk-disclosure name from colliding across
// instances. position-area attaches the panel to the invoker; without it the
// popover keeps the UA top-layer centering and the disclosure keeps the
// absolute overlay above. inset-area is the earlier name of position-area.
lines(`
@supports (anchor-scope: --lk-menu) {
  lk-menu[anchor] {
    anchor-scope: --lk-menu;
  }
  lk-menu[anchor] > button:first-child,
  lk-menu[anchor] > a:first-child,
  lk-menu[anchor] > summary:first-child {
    anchor-name: --lk-menu;
  }
  lk-disclosure[anchor] {
    anchor-scope: --lk-disclosure;
  }
  lk-disclosure[anchor] > details > summary {
    anchor-name: --lk-disclosure;
  }
  lk-menu[anchor] > lk-popover {
    position-anchor: --lk-menu;
  }
  lk-popover[anchor] {
    position-anchor: var(--lk-anchor, --lk-menu);
  }
}
@supports (anchor-scope: --lk-menu) and (inset-area: block-end) {
  lk-menu[anchor] > lk-popover {
    position-anchor: --lk-menu;
    margin: 0;
    inset: unset;
    inset-area: block-end span-inline-end;
    justify-self: start;
    position-try-options: flip-block;
  }
  lk-popover[anchor] {
    margin: 0;
    inset: unset;
    inset-area: block-end span-inline-end;
    justify-self: start;
    position-try-options: flip-block;
  }
  lk-menu[side="end"][anchor] > lk-popover {
    inset-area: block-end span-inline-start;
    justify-self: end;
  }
  lk-disclosure[anchor][panel="overlay"] > details > :not(summary) {
    position: fixed;
    margin: 0;
    inset: unset;
    position-anchor: --lk-disclosure;
    inset-area: block-end span-inline-end;
    justify-self: start;
    position-try-options: flip-block;
  }
  lk-disclosure[side="end"][anchor][panel="overlay"] > details > :not(summary) {
    inset-area: block-end span-inline-start;
    justify-self: end;
  }
}
@supports (anchor-scope: --lk-menu) and (position-area: block-end) {
  lk-menu[anchor] > lk-popover {
    position-anchor: --lk-menu;
    margin: 0;
    inset: unset;
    position-area: block-end span-inline-end;
    justify-self: start;
    position-try-fallbacks: flip-block;
  }
  lk-popover[anchor] {
    margin: 0;
    inset: unset;
    position-area: block-end span-inline-end;
    justify-self: start;
    position-try-fallbacks: flip-block;
  }
  lk-menu[side="end"][anchor] > lk-popover {
    position-area: block-end span-inline-start;
    justify-self: end;
  }
  lk-disclosure[anchor][panel="overlay"] > details > :not(summary) {
    position: fixed;
    margin: 0;
    inset: unset;
    position-anchor: --lk-disclosure;
    position-area: block-end span-inline-end;
    justify-self: start;
    position-try-fallbacks: flip-block;
  }
  lk-disclosure[side="end"][anchor][panel="overlay"] > details > :not(summary) {
    position-area: block-end span-inline-start;
    justify-self: end;
  }
}
`);

section("Columns — multi-column text flow. Children avoid splitting across columns");
rule("lk-columns", "display: block; column-count: 2; column-gap: var(--lk-space-md);");
rule("lk-columns > *", "break-inside: avoid;");
for (const n of [2, 3, 4]) rule(`lk-columns[cols="${n}"]`, `column-count: ${n};`);
for (const [k, v] of Object.entries(SPACE)) rule(`lk-columns[gap="${k}"]`, `column-gap: ${v};`);

out.push("}");

const css = out.join("\n") + "\n";
const pkgDir = dirname(fileURLToPath(import.meta.url));
// Write the canonical package copy AND the docs-site download copy from the
// same source so they can never drift.
const targets = [
  join(pkgDir, "layoutkit.css"),
  join(pkgDir, "..", "..", "layoutkit.css"), // site root — dogfooded by the docs + offered as the download
];
const check = process.argv.includes("--check");
if (check) {
  const drifted = targets.filter((target) => !existsSync(target) || readFileSync(target, "utf8") !== css);
  if (drifted.length) {
    console.error(`layoutkit.css is out of date:\n${drifted.map((target) => `- ${target}`).join("\n")}\nRun: npm run build`);
    process.exit(1);
  }
  console.log("generated layoutkit.css matches the committed files");
} else {
  for (const target of targets) writeFileSync(target, css);
  const kb = (Buffer.byteLength(css, "utf8") / 1024).toFixed(1);
  console.log(`Wrote layoutkit.css (${kb} KB, ${out.filter((l) => l.includes("{") && !l.includes("@layer")).length} rules) -> ${targets.length} targets`);
}
