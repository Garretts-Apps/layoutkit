import { spawnSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const pkgDir = join(root, "packages", "layoutkit");
const errors = [];

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
const fail = (message) => errors.push(message);

const rootPackage = readJson(join(root, "package.json"));
const packageJson = readJson(join(pkgDir, "package.json"));

const rootTestDeps = new Set(["@playwright/test", "@axe-core/playwright"]);
for (const [label, pkg] of [["root package", rootPackage], ["layoutkit-css package", packageJson]]) {
  if (pkg.dependencies && Object.keys(pkg.dependencies).length) fail(`${label} must not declare dependencies`);
  const devDeps = Object.keys(pkg.devDependencies || {});
  if (label === "layoutkit-css package" && devDeps.length) fail(`${label} must not declare devDependencies`);
  if (label === "root package") {
    for (const name of devDeps) {
      if (!rootTestDeps.has(name)) fail(`unexpected root devDependency: ${name}`);
    }
  }
  for (const script of ["preinstall", "install", "postinstall"]) {
    if (pkg.scripts?.[script]) fail(`${label} must not define a ${script} lifecycle script`);
  }
  if (pkg.bin) fail(`${label} must not define a binary`);
}

const requiredRootFiles = ["README.md", "LICENSE", "SECURITY.md", "CONTRIBUTING.md"];
for (const file of requiredRootFiles) {
  if (!existsSync(join(root, file))) fail(`${file} must exist`);
}

const requiredPackageFiles = ["layoutkit.css", "jsx.d.ts", "README.md", "CONTRIBUTING.md", "CHANGELOG.md", "MIGRATION.md", "LICENSE", "SECURITY.md"];
for (const file of requiredPackageFiles) {
  if (!existsSync(join(pkgDir, file))) fail(`packages/layoutkit/${file} must exist`);
}

const cssPath = join(pkgDir, "layoutkit.css");
const css = existsSync(cssPath) ? readFileSync(cssPath, "utf8") : "";
if (!css.includes("@layer layoutkit")) fail("layoutkit.css must declare @layer layoutkit");
for (const [label, pattern] of [
  ["@import", /@import/i],
  ["http:// or https://", /https?:\/\//i],
  ["javascript:", /javascript:/i],
  ["data URLs", /url\(\s*['"]?data:/i],
  ["!important", /!important/i],
]) {
  if (pattern.test(css)) fail(`layoutkit.css must not contain ${label}`);
}

const expectedFiles = new Set(requiredPackageFiles);
for (const file of packageJson.files ?? []) {
  if (!expectedFiles.has(file)) fail(`unexpected package files entry: ${file}`);
}
for (const file of expectedFiles) {
  if (!(packageJson.files ?? []).includes(file)) fail(`package files allowlist must include ${file}`);
}

const assertExistingExport = (target, label) => {
  if (typeof target === "string") {
    if (!existsSync(join(pkgDir, target))) fail(`${label} points to missing file ${target}`);
    return;
  }
  if (target && typeof target === "object") {
    for (const [condition, value] of Object.entries(target)) {
      assertExistingExport(value, `${label}.${condition}`);
    }
  }
};

for (const [subpath, target] of Object.entries(packageJson.exports ?? {})) {
  assertExistingExport(target, `exports.${subpath}`);
}

for (const field of ["main", "style", "unpkg", "jsdelivr", "types"]) {
  if (packageJson[field] && !existsSync(join(pkgDir, packageJson[field]))) {
    fail(`${field} points to missing file ${packageJson[field]}`);
  }
}

const generated = spawnSync(process.execPath, [join(pkgDir, "gen.mjs"), "--check"], { cwd: root, encoding: "utf8" });
if (generated.status !== 0) fail((generated.stdout || generated.stderr || "generated CSS check failed").trim());

const version = packageJson.version;
const pinFiles = [
  ["README.md", join(root, "README.md")],
  ["SECURITY.md", join(root, "SECURITY.md")],
  ["packages/layoutkit/README.md", join(pkgDir, "README.md")],
  ["packages/layoutkit/SECURITY.md", join(pkgDir, "SECURITY.md")],
  ["install.html", join(root, "install.html")],
];
for (const [label, path] of pinFiles) {
  const text = readFileSync(path, "utf8");
  if (!text.includes(`layoutkit-css@${version}`)) fail(`${label} must pin layoutkit-css@${version}`);
}

const rootChangelog = readFileSync(join(root, "CHANGELOG.md"), "utf8");
const packageChangelog = readFileSync(join(pkgDir, "CHANGELOG.md"), "utf8");
if (rootChangelog !== packageChangelog) fail("root CHANGELOG.md and packages/layoutkit/CHANGELOG.md must match");
if (!packageChangelog.includes(`## ${version}`)) fail(`changelog must document ${version}`);

const cssExport = packageJson.exports?.["./layoutkit.css"];
if (!cssExport || cssExport.default !== "./layoutkit.css" || cssExport.style !== "./layoutkit.css" || cssExport.types !== "./jsx.d.ts") {
  fail("exports['./layoutkit.css'] must type as jsx.d.ts and default to layoutkit.css");
}

if (!/lk-spacer\[size="md"\] \{ flex: 0 0 /.test(css)) fail("sized lk-spacer must set a main-axis flex basis");
if (!css.includes('lk-box[flow="5"]')) fail("flow must honor the numeric spacing scale");
if (!css.includes("minmax(min(var(--lk-min-child-width, 250px), 100%), 1fr)")) fail("responsive grids must clamp their minimum track to the container");
if (!css.includes('lk-grid[place="between"]')) fail("lk-grid must implement place distribution");
if (!css.includes("min-block-size: 100vh")) fail("viewport minimums must keep a 100vh fallback");
if (!css.includes("@supports (min-block-size: 100svh)")) fail("viewport minimums must use 100svh where supported");
if (!css.includes("@supports (min-block-size: 100dvh)")) fail("viewport minimums must use 100dvh where supported");
if (!css.includes("color-mix(in srgb, currentColor 20%, transparent)")) fail("dividers must default to a currentColor mix");
if (!css.includes("var(--lk-divider-color, #e5e7eb)")) fail("dividers must keep the #e5e7eb fallback");
if (!css.includes("object-fit: cover")) fail("lk-aspect-ratio replaced children must use object-fit: cover");
if (css.includes("auto-fill")) fail("lk-grid[min] must use auto-fit, not auto-fill");
if (!css.includes("repeat(auto-fit, minmax(min(16rem, 100%), 1fr))")) fail("lk-grid[min] must auto-fit its enumerated tracks");
if (!packageChangelog.includes("### Changed (visual behavior)")) fail("changelog must label visual behavior changes");
if (!css.includes("flex-basis: calc((var(--lk-switch-at, 30rem) - 100%) * 999)")) fail("switcher must keep the percentage flex-basis");
if (!css.includes("100cqi")) fail("container opt-in must use cqi");
if (!css.includes("container-type: inline-size")) fail("container opt-in must set container-type");
if (!css.includes("@container lk-grid (inline-size < 32rem)")) fail("container grids must stack fixed columns from the grid's own size");
if (!css.includes('lk-grid[container=""]')) fail("a boolean container grid must keep the 32rem threshold");
if (!css.includes('lk-switcher[limit="4"]')) fail("switcher limit must stack once the child count passes the threshold");
if (!css.includes('lk-center[overlay="off"]')) fail("center overlay must have an off opt-out");
if (!css.includes("--lk-space-fluid-md")) fail("fluid space tokens must exist");
if (!css.includes("--lk-space-md: var(--space-md, var(--lk-space-fluid-md))")) fail("the default space scale must be fluid unless the host sets --space-md");
if (!css.includes("lk-columns[cols=\"3\"]")) fail("lk-columns must set an enumerated column count");
if (!css.includes('lk-switcher[at="xs"]')) fail("switcher must expose an enumerated threshold");
if (!css.includes("min-inline-size: 0")) fail("scroll areas must be allowed to shrink");
if (!css.includes("sibling-count()")) fail("switcher limit must use sibling-count where supported");
if (!css.includes("animation-timeline: view()")) fail("reveal must use a view timeline");
if (!css.includes("interpolate-size: allow-keywords")) fail("disclosure animation must use interpolate-size");
if (!packageChangelog.includes("## 2.0.0")) fail("changelog must document 2.0.0");
if (!packageChangelog.includes("### Breaking changes")) fail("changelog must label breaking changes");
if (!css.includes("grid-template-columns: subgrid")) fail("subgrid opt-in must share parent columns");
if (!css.includes("scroll-snap-type: x mandatory")) fail("snap carousels must declare a physical scroll-snap fallback");
if (!css.includes("scroll-snap-type: inline mandatory")) fail("snap carousels must use logical scroll-snap where supported");
if (!css.includes("animation-timeline: scroll(root)")) fail("progress must use a root scroll timeline");
if (!css.includes("position: sticky")) fail("sticky sidebars must use position: sticky");
if (!css.includes(":has(> :only-child)")) fail("solo adaptation must use :has()");
if (!css.includes("anchor-scope: --lk-menu")) fail("menus must scope their anchor name");
if (!css.includes("position-area: block-end span-inline-end")) fail("anchored panels must declare position-area");
if (!css.includes("justify-self: start")) fail("anchored panels must align to the invoker's start edge");
if (css.includes("lk-popover {") && /lk-popover \{\s*[^}]*\bdisplay\s*:/.test(css)) fail("lk-popover must not set display; that would override the UA popover hide");

const cssAttrs = new Map();
for (const match of css.matchAll(/(lk-[a-z0-9-]+)\[([a-z][\w-]*)/g)) {
  if (!cssAttrs.has(match[1])) cssAttrs.set(match[1], new Set());
  cssAttrs.get(match[1]).add(match[2]);
}
if (!css.includes('[lk-text="md"]')) fail("lk-text scale must be declared");
if (!css.includes('[lk-weight="normal"]')) fail("lk-weight scale must be declared");

const dts = readFileSync(join(pkgDir, "jsx.d.ts"), "utf8");
const typeAttrs = new Map();
const elementPattern = /"(lk-[a-z0-9-]+)":\s*LayoutKitGlobalAttributes\s*&\s*\{([\s\S]*?)\n\s*\};/g;
for (const match of dts.matchAll(elementPattern)) {
  const props = new Set();
  for (const prop of match[2].matchAll(/(?:^|\n)\s*(?:"([^"]+)"|([A-Za-z][\w-]*))\??:/g)) props.add(prop[1] || prop[2]);
  typeAttrs.set(match[1], props);
}
const cssTags = [...cssAttrs.keys()].sort();
const typeTags = [...typeAttrs.keys()].sort();
if (cssTags.join() !== typeTags.join()) {
  fail(`JSX tags and CSS tags differ\nCSS: ${cssTags.join(", ")}\nJSX: ${typeTags.join(", ")}`);
}
for (const tag of cssTags) {
  const fromCss = [...cssAttrs.get(tag)].sort();
  const fromTypes = [...typeAttrs.get(tag)].sort();
  if (fromCss.join() !== fromTypes.join()) {
    fail(`${tag} attributes differ\nCSS: ${fromCss.join(", ")}\nJSX: ${fromTypes.join(", ")}`);
  }
}

const playground = readFileSync(join(root, "assets", "playground.js"), "utf8");
for (const tag of cssTags) {
  if (!playground.includes(`"${tag}"`)) fail(`playground builders must include ${tag}`);
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log("layoutkit-css package checks passed");
