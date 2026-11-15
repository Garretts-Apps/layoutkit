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

for (const [label, pkg] of [["root package", rootPackage], ["layoutkit-css package", packageJson]]) {
  if (pkg.dependencies && Object.keys(pkg.dependencies).length) fail(`${label} must not declare dependencies`);
  if (pkg.devDependencies && Object.keys(pkg.devDependencies).length) fail(`${label} must not declare devDependencies`);
  for (const script of ["preinstall", "install", "postinstall"]) {
    if (pkg.scripts?.[script]) fail(`${label} must not define a ${script} lifecycle script`);
  }
  if (pkg.bin) fail(`${label} must not define a binary`);
}

const requiredRootFiles = ["README.md", "LICENSE", "SECURITY.md", "CONTRIBUTING.md"];
for (const file of requiredRootFiles) {
  if (!existsSync(join(root, file))) fail(`${file} must exist`);
}

const requiredPackageFiles = ["layoutkit.css", "jsx.d.ts", "README.md", "CONTRIBUTING.md", "CHANGELOG.md", "LICENSE", "SECURITY.md"];
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
