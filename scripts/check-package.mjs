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

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log("layoutkit-css package checks passed");
