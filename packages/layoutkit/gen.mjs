// Generates layoutkit.css — pure-CSS layout primitives that style <lk-*>
// custom-element-named tags (unregistered, styled purely by CSS) via
// attribute selectors. No JS, no runtime, no FOUC: a render-blocking <link>
// styles the tags before first paint.
//
//   node gen.mjs   ->   layoutkit.css
//
// Architecture notes:
//   - All rules live in `@layer layoutkit` so a host app controls specificity
//     relative to its own cascade layers (unlayered author styles always win).
//   - Semantic spacing resolves through --lk-space-* custom properties that
//     default to the host's --space-* tokens, so the scale consumes a design
//     system instead of running parallel to it. Override --space-* (or
//     --lk-space-* directly) to remap.
//   - Directional box-model uses logical properties (block/inline) so layouts
//     follow writing mode and RTL.
//   - Free-form values (color, ratio, min/max sizes) are driven by CSS custom
//     properties so they stay in pure CSS without enumerating every value.

import { writeFileSync } from "node:fs";
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

const out = [];
const section = (title) => out.push(`\n  /* ${title} */`);
const rule = (sel, decls) => out.push(`  ${sel} { ${decls} }`);
// One grouped rule per attribute value across the given tags.
const variants = (tags, attr, map, render) => {
  for (const [k, v] of Object.entries(map)) {
    rule(tags.map((t) => `${t}[${attr}="${k}"]`).join(",\n  "), render(v));
  }
};

out.push("/*");
out.push(" * layoutkit-css — a layout language for the web, as pure CSS.");
out.push(" * Zero dependencies. No JavaScript. No build step. No FOUC.");
out.push(" *");
out.push(' *   <link rel="stylesheet" href="layoutkit.css">');
out.push(' *   <lk-stack gap="lg" padding="md">');
out.push(" *     <lk-center full-height>You can finally center a div.</lk-center>");
out.push(" *   </lk-stack>");
out.push(" *");
out.push(" * Theming: remap the scale onto your design tokens by defining --space-*");
out.push(" * (or override --lk-space-* directly). All rules are in @layer layoutkit.");
out.push(" * Free-form values use custom properties:");
out.push(" *   --lk-ratio, --lk-divider-color, --lk-min-child-width, --lk-max-height, --lk-max-width.");
out.push(" */");

out.push("@layer layoutkit {");

section("Design tokens — remap via your --space-* / --text-* / --radius-* tokens, or override --lk-* directly");
rule(":root", [
  ...Object.entries(TOKENS).map(([k, v]) => `--lk-space-${k}: var(--space-${k}, ${v});`),
  ...Object.entries(TEXT).map(([k, v]) => `--lk-text-${k}: var(--text-${k}, ${v});`),
  ...Object.entries(RADIUS).filter(([k]) => k !== "none" && k !== "full").map(([k, v]) => `--lk-radius-${k}: var(--radius-${k}, ${v});`),
].join(" "));

section("Base — every primitive sets its own display + box model");
rule("lk-stack,\n  lk-row,\n  lk-center,\n  lk-box,\n  lk-card,\n  lk-spread,\n  lk-grid,\n  lk-spacer,\n  lk-divider,\n  lk-aspect-ratio,\n  lk-scroll-area", "box-sizing: border-box;");
rule("lk-stack", "display: flex; flex-direction: column; gap: var(--lk-space-md); align-items: stretch; justify-content: flex-start;");
rule("lk-row", "display: flex; flex-direction: row; gap: var(--lk-space-md); align-items: center; justify-content: flex-start;");
rule("lk-center", "display: flex; flex-direction: column; align-items: center; justify-content: center;");
rule("lk-box", "display: block;");
rule("lk-spread", "display: flex; flex-direction: row; justify-content: space-between; align-items: center;");
rule("lk-grid", "display: grid; grid-template-columns: repeat(1, minmax(0, 1fr)); gap: var(--lk-space-md);");
rule("lk-spacer", "display: block; flex: 1 1 0%;");
rule("lk-divider", "display: block; inline-size: 100%; border-block-start: 1px solid var(--lk-divider-color, #e5e7eb);");
rule("lk-aspect-ratio", "display: block; aspect-ratio: var(--lk-ratio, 1);");
rule("lk-scroll-area", "display: block; overflow-y: auto; max-block-size: var(--lk-max-height, none); max-inline-size: var(--lk-max-width, none);");
rule("lk-card", "display: block; padding: var(--lk-space-lg); border-radius: var(--lk-radius-md); border: 1px solid var(--lk-card-border, color-mix(in srgb, currentColor 12%, transparent));");

section("Type scale — lk-text / lk-weight (namespaced; work on any element)");
for (const k of Object.keys(TEXT)) rule(`[lk-text="${k}"]`, `font-size: var(--lk-text-${k});`);
for (const [k, v] of Object.entries(WEIGHT)) rule(`[lk-weight="${k}"]`, `font-weight: ${v};`);

section("Width — constrain & center content");
const WIDTH_TAGS = ["lk-box", "lk-card", "lk-stack", "lk-center", "lk-row"];
for (const [k, v] of Object.entries(WIDTH)) {
  rule(WIDTH_TAGS.map((t) => `${t}[width="${k}"]`).join(",\n  "), `max-inline-size: ${v};${k === "full" ? "" : " margin-inline: auto;"}`);
}

section("Flow — vertical rhythm between flowing children (the owl)");
rule("lk-box[flow] > * + *,\n  lk-card[flow] > * + *", "margin-block-start: var(--lk-space-md);");
for (const k of Object.keys(TOKENS)) rule(`lk-box[flow="${k}"] > * + *,\n  lk-card[flow="${k}"] > * + *`, `margin-block-start: var(--lk-space-${k});`);

section("Card — padding, radius, surface, border");
variants(["lk-card"], "padding", SPACE, (v) => `padding: ${v};`);
for (const k of Object.keys(RADIUS)) rule(`lk-card[radius="${k}"]`, `border-radius: ${k === "none" ? "0" : k === "full" ? "9999px" : `var(--lk-radius-${k})`};`);
rule("lk-card[surface]", "background: var(--lk-surface, color-mix(in srgb, currentColor 6%, transparent));");
rule('lk-card[border="none"]', "border: 0;");

section("Gap (lk-stack, lk-row, lk-grid)");
variants(["lk-stack", "lk-row", "lk-grid"], "gap", SPACE, (v) => `gap: ${v};`);

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
// Grid: items align within their cells via justify-items (inline) + align-items (block).
for (const [val, [inl, blk]] of Object.entries(PLACE)) {
  rule(`lk-grid[place="${val}"]`, `justify-items: ${GRIDP[inl]}; align-items: ${GRIDP[blk]};`);
}

section("Boolean modifiers");
rule("lk-stack[center],\n  lk-row[center]", "align-items: center; justify-content: center;");
rule("lk-center[fill],\n  lk-stack[fill],\n  lk-row[fill],\n  lk-box[fill]", "flex: 1 1 0%;");
rule("lk-center[full-height],\n  lk-stack[full-height],\n  lk-row[full-height]", "min-block-size: 100vh;");
rule("lk-stack[wrap],\n  lk-row[wrap]", "flex-wrap: wrap;");
rule("lk-row[reverse]", "flex-direction: row-reverse;");

section("Center — single-axis overrides");
rule("lk-center[inline]", "display: inline-flex;");
rule("lk-center[horizontal]:not([vertical])", "justify-content: flex-start;");
rule("lk-center[vertical]:not([horizontal])", "align-items: stretch;");

section("Grid columns / rows / flow / placement");
for (let n = 1; n <= 12; n++) rule(`lk-grid[cols="${n}"]`, `grid-template-columns: repeat(${n}, minmax(0, 1fr));`);
for (let n = 1; n <= 12; n++) rule(`lk-grid[rows="${n}"]`, `grid-template-rows: repeat(${n}, minmax(0, 1fr));`);
rule("lk-grid[responsive]", "grid-template-columns: repeat(auto-fit, minmax(var(--lk-min-child-width, 250px), 1fr));");
variants(["lk-grid"], "col-gap", SPACE, (v) => `column-gap: ${v};`);
variants(["lk-grid"], "row-gap", SPACE, (v) => `row-gap: ${v};`);
rule('lk-grid[flow="row"]', "grid-auto-flow: row;");
rule('lk-grid[flow="col"]', "grid-auto-flow: column;");
rule('lk-grid[flow="dense"]', "grid-auto-flow: dense;");
for (const p of ["start", "center", "end", "stretch"]) rule(`lk-grid[place-items="${p}"]`, `place-items: ${p};`);

section("Spacer — fixed sizes (default is flexible)");
rule('lk-spacer[size="auto"]', "flex: 1 1 0%;");
variants(["lk-spacer"], "size", SPACE, (v) => `flex: none; block-size: ${v};`);

section("Divider — thickness + vertical orientation");
rule('lk-divider[thickness="medium"]', "border-block-start-width: 2px;");
rule('lk-divider[thickness="thick"]', "border-block-start-width: 4px;");
rule('lk-divider[orientation="vertical"]', "inline-size: auto; block-size: 100%; align-self: stretch; border-block-start: 0; border-inline-start: 1px solid var(--lk-divider-color, #e5e7eb);");
rule('lk-divider[orientation="vertical"][thickness="medium"]', "border-inline-start-width: 2px;");
rule('lk-divider[orientation="vertical"][thickness="thick"]', "border-inline-start-width: 4px;");

section("Scroll-area — direction");
rule('lk-scroll-area[direction="vertical"]', "overflow-x: hidden; overflow-y: auto;");
rule('lk-scroll-area[direction="horizontal"]', "overflow-x: auto; overflow-y: hidden;");
rule('lk-scroll-area[direction="both"]', "overflow: auto;");

out.push("}");

const css = out.join("\n") + "\n";
const pkgDir = dirname(fileURLToPath(import.meta.url));
// Write the canonical package copy AND the docs-site download copy from the
// same source so they can never drift.
const targets = [
  join(pkgDir, "layoutkit.css"),
  join(pkgDir, "..", "..", "layoutkit.css"), // site root — dogfooded by the docs + offered as the download
];
for (const target of targets) writeFileSync(target, css);
const kb = (Buffer.byteLength(css, "utf8") / 1024).toFixed(1);
console.log(`Wrote layoutkit.css (${kb} KB, ${out.filter((l) => l.includes("{") && !l.includes("@layer")).length} rules) -> ${targets.length} targets`);
