// Generates a single self-contained `public/layoutkit.tsx` from the
// published package source (packages/layoutkit/src). Because layoutkit-css
// is now zero-dependency native CSS, the entire library collapses into one
// file whose only import is `react` — ideal for vendoring without a package
// manager: download it, drop it in your project, import from it.
//
// Run via `npm run vendor`; also runs automatically before `next build`
// (see the "prebuild" script) so layoutkit.dev always serves the latest.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "packages", "layoutkit", "src");
const outFile = join(root, "public", "layoutkit.tsx");

const pkg = JSON.parse(readFileSync(join(root, "packages", "layoutkit", "package.json"), "utf8"));

// Concatenation order: shared values/types first, then the helper, then the
// components. Order is not strictly required (top-level consts are only read
// at render time), but this keeps the file readable top to bottom.
const order = [
  "types.ts",
  "utils.ts",
  "Box.tsx",
  "Center.tsx",
  "Stack.tsx",
  "Row.tsx",
  "Spread.tsx",
  "Grid.tsx",
  "Spacer.tsx",
  "Divider.tsx",
  "AspectRatio.tsx",
  "ScrollArea.tsx",
];

// Drop intra-package imports (react / ./utils / ./types). The react symbols
// they need are re-declared once, below, in a single combined import.
const isInternalImport = (line) =>
  /^\s*import\s.*\sfrom\s+["'](react|\.\/utils|\.\/types)["'];?\s*$/.test(line);

const sections = order.map((name) => {
  const body = readFileSync(join(srcDir, name), "utf8")
    .split("\n")
    .filter((line) => !isInternalImport(line))
    .join("\n")
    .trim();
  return `// ---------------------------------------------------------------------------\n// ${name}\n// ---------------------------------------------------------------------------\n\n${body}`;
});

const banner = `/**
 * layoutkit-css v${pkg.version} — vendored single-file build.
 *
 * The first layout language for the web: 10 semantic components that compile
 * to native CSS. Zero dependencies, no build step, no Tailwind required.
 *
 * You own this file — edit it freely. Requires React 18+.
 *
 * Docs:    https://layoutkit.dev
 * Source:  https://github.com/Garrett-s-Apps/layoutkit
 * License: ${pkg.license}
 *
 * Generated from packages/layoutkit/src — do not expect hand-edits here to
 * flow back upstream; this is a snapshot for vendoring.
 */`;

const combinedReactImport =
  'import { forwardRef, type CSSProperties, type ElementType, type ReactNode, type ComponentPropsWithoutRef } from "react";';

const output = `${banner}\n\n${combinedReactImport}\n\n${sections.join("\n\n")}\n`;

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, output);

const kb = (Buffer.byteLength(output, "utf8") / 1024).toFixed(1);
console.log(`Wrote ${outFile} (${kb} KB, layoutkit-css v${pkg.version})`);
