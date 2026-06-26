"use client";

import { useState } from "react";

function VendorSection() {
  const [copied, setCopied] = useState(false);

  async function copyFile() {
    try {
      const res = await fetch("/layoutkit.css");
      await navigator.clipboard.writeText(await res.text());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="mb-12 rounded-xl border border-accent/30 bg-accent/5 p-6">
      <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-zinc-100">
        Vendor it — no package manager, no build, no JavaScript
      </h2>
      <p className="mb-4 font-sans text-[14px] text-muted">
        One pure-CSS stylesheet. Drop a single{" "}
        <code className="rounded bg-zinc-800 px-1.5 text-accent">&lt;link&gt;</code> tag into
        any HTML page — or any framework — and write the <code className="rounded bg-zinc-800 px-1.5 text-accent">&lt;lk-*&gt;</code> tags.
        No npm, no bundler, no JavaScript runtime. You own the file and can edit it freely.
      </p>

      <div className="mb-4 flex flex-wrap gap-3">
        <a
          href="/layoutkit.css"
          download="layoutkit.css"
          className="rounded-lg bg-accent px-4 py-2 text-[13px] font-bold text-background transition-opacity hover:opacity-90"
        >
          Download layoutkit.css
        </a>
        <button
          onClick={copyFile}
          className="rounded-lg border border-zinc-700 bg-background px-4 py-2 text-[13px] font-bold text-zinc-200 transition-colors hover:border-accent"
        >
          {copied ? "Copied ✓" : "Copy to clipboard"}
        </button>
      </div>

      <p className="mb-2 font-sans text-[13px] text-muted">
        Use it straight from the CDN — nothing to install:
      </p>
      <div className="mb-4 overflow-x-auto rounded-lg border border-zinc-700 bg-background p-4">
        <pre className="whitespace-pre-wrap break-words text-[13px] leading-relaxed text-zinc-300">
          <code>{`<link rel="stylesheet" href="https://unpkg.com/layoutkit-css/layoutkit.css">

<lk-stack gap="lg" padding="md">
  <lk-row gap="sm" justify="between">
    <span>Logo</span>
    <nav>…</nav>
  </lk-row>
  <lk-center full-height>You can finally center a div.</lk-center>
  <lk-grid cols="3" gap="md">
    <div>1</div><div>2</div><div>3</div>
  </lk-grid>
</lk-stack>`}</code>
        </pre>
      </div>
      <p className="font-sans text-[12px] text-zinc-500">
        Ten semantic tags (<code className="rounded bg-zinc-800 px-1 text-zinc-300">lk-stack</code>,{" "}
        <code className="rounded bg-zinc-800 px-1 text-zinc-300">lk-row</code>,{" "}
        <code className="rounded bg-zinc-800 px-1 text-zinc-300">lk-center</code>, …) styled by
        attribute selectors. Attributes are kebab-case (<code className="rounded bg-zinc-800 px-1 text-zinc-300">full-height</code>,{" "}
        <code className="rounded bg-zinc-800 px-1 text-zinc-300">col-gap</code>); free-form values use
        inline custom properties (<code className="rounded bg-zinc-800 px-1 text-zinc-300">--lk-min-child-width</code>).
        Pure CSS, zero dependencies, no FOUC, ~2 KB brotli.
      </p>
    </section>
  );
}

export function InstallPage() {
  return (
    <div className="mx-auto max-w-[840px] px-6 py-20">
      {/* Header */}
      <div className="mb-12">
        <div className="mb-4 inline-block rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-[11px] font-semibold text-green-400">
          PURE CSS · ZERO JAVASCRIPT
        </div>
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-zinc-100">
          Install LayoutKit
        </h1>
        <p className="font-sans text-[16px] text-muted">
          Link the stylesheet from a CDN, vendor it locally, or install the CSS package from npm.
        </p>
      </div>

      {/* Link the stylesheet */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-extrabold tracking-tight text-zinc-100">
          Link the stylesheet
        </h2>
        <p className="mb-4 font-sans text-[14px] text-muted">
          LayoutKit is just CSS. Add one render-blocking{" "}
          <code className="rounded bg-zinc-800 px-1.5 text-accent">&lt;link&gt;</code> and write
          semantic tags — no JavaScript, no build, no FOUC:
        </p>
        <div className="mb-4 overflow-x-auto rounded-lg border border-zinc-700 bg-background p-4">
          <pre className="whitespace-pre-wrap break-words text-[13px] leading-relaxed text-zinc-300">
            <code>{`<link rel="stylesheet" href="https://unpkg.com/layoutkit-css/layoutkit.css">

<lk-stack gap="lg" padding="md">
  <lk-row gap="sm" justify="between">
    <span>Logo</span>
    <nav>…</nav>
  </lk-row>
  <lk-center full-height>You can finally center a div.</lk-center>
  <lk-grid cols="3" gap="md">
    <div>1</div><div>2</div><div>3</div>
  </lk-grid>
</lk-stack>`}</code>
          </pre>
        </div>
        <p className="mt-3 font-sans text-[12px] text-zinc-500">
          Pure CSS, zero dependencies, no JavaScript runtime, no build step. ~2 KB brotli.
        </p>
      </section>

      {/* npm CSS package */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-extrabold tracking-tight text-zinc-100">
          npm (CSS package)
        </h2>
        <div className="mb-4 overflow-x-auto rounded-lg border border-zinc-700 bg-background p-4">
          <code className="text-[14px] text-green-400 break-all">npm install layoutkit-css</code>
        </div>
        <p className="mb-4 font-sans text-[14px] text-muted">
          It&apos;s a CSS package — import the stylesheet once, then write{" "}
          <code className="rounded bg-zinc-800 px-1.5 text-accent">&lt;lk-*&gt;</code> tags anywhere:
        </p>
        <div className="overflow-x-auto rounded-lg border border-zinc-700 bg-background p-4">
          <pre className="whitespace-pre-wrap break-words text-[13px] leading-relaxed text-zinc-300">
            <code>{`import "layoutkit-css/layoutkit.css"

<lk-stack gap="lg" padding="md">
  <lk-row gap="sm" align="center">
    <h1>Hello</h1>
    <span>World</span>
  </lk-row>
  <lk-center fill>Centered content</lk-center>
  <lk-grid cols="3" gap="md">
    <div>1</div><div>2</div><div>3</div>
  </lk-grid>
</lk-stack>`}</code>
          </pre>
        </div>
        <p className="mt-3 font-sans text-[12px] text-zinc-500">
          A single CSS import — no JavaScript, no Tailwind, no build step, no config.
        </p>
      </section>

      {/* Vendor without a package manager */}
      <VendorSection />

      {/* Components Reference */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-extrabold tracking-tight text-zinc-100">
          All Tags
        </h2>
        <div className="overflow-x-auto rounded-lg border border-zinc-700">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-zinc-700 bg-zinc-800/50">
                <th className="px-4 py-2 font-semibold text-zinc-300">Tag</th>
                <th className="px-4 py-2 font-semibold text-zinc-300">Description</th>
                <th className="px-4 py-2 font-semibold text-zinc-300">Key Attributes</th>
              </tr>
            </thead>
            <tbody className="text-[12px]">
              {[
                ["lk-stack", "Vertical flex layout", "gap, align, justify, padding, fill, full-height"],
                ["lk-row", "Horizontal flex layout", "gap, align, justify, padding, wrap, reverse"],
                ["lk-center", "Center content", "fill, full-height, horizontal, vertical, inline"],
                ["lk-box", "Container with padding", "padding, fill, center"],
                ["lk-grid", "CSS Grid", "cols, rows, gap, col-gap, row-gap, responsive"],
                ["lk-spread", "Space-between layout", "align, padding"],
                ["lk-spacer", "Flexible space", "size"],
                ["lk-divider", "Separator line", "orientation, thickness"],
                ["lk-aspect-ratio", "Fixed aspect ratio", "--lk-ratio"],
                ["lk-scroll-area", "Scrollable container", "direction, --lk-max-height, --lk-max-width"],
              ].map(([name, desc, props]) => (
                <tr key={name} className="border-b border-zinc-800">
                  <td className="px-4 py-2 font-mono font-bold text-accent">&lt;{name}&gt;</td>
                  <td className="px-4 py-2 text-zinc-400">{desc}</td>
                  <td className="px-4 py-2 font-mono text-zinc-500">{props}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="mb-3 mt-6 text-lg font-bold text-zinc-200">Free-form values</h3>
        <p className="mb-3 font-sans text-[13px] text-muted">
          Attributes are kebab-case. For values outside the preset scale, set an inline custom property:
        </p>
        <ul className="space-y-1 font-sans text-[13px] text-muted">
          <li><code className="rounded bg-zinc-800 px-1.5 text-zinc-300">--lk-ratio</code> — Custom aspect ratio (e.g. <code className="rounded bg-zinc-800 px-1 text-zinc-300">16/9</code>)</li>
          <li><code className="rounded bg-zinc-800 px-1.5 text-zinc-300">--lk-divider-color</code> — Divider line color</li>
          <li><code className="rounded bg-zinc-800 px-1.5 text-zinc-300">--lk-min-child-width</code> — Min child width for <code className="rounded bg-zinc-800 px-1 text-zinc-300">responsive</code> grids</li>
          <li><code className="rounded bg-zinc-800 px-1.5 text-zinc-300">--lk-max-height</code> / <code className="rounded bg-zinc-800 px-1.5 text-zinc-300">--lk-max-width</code> — Scroll-area limits</li>
        </ul>

        <h3 className="mb-3 mt-6 text-lg font-bold text-zinc-200">Size Scale</h3>
        <p className="mb-3 font-sans text-[13px] text-muted">
          Used for <code className="rounded bg-zinc-800 px-1.5 text-zinc-300">gap</code> and{" "}
          <code className="rounded bg-zinc-800 px-1.5 text-zinc-300">padding</code> attributes:
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <div className="mb-2 text-[12px] font-bold text-zinc-400">SEMANTIC</div>
            <div className="overflow-x-auto rounded-lg border border-zinc-700 bg-background p-3">
              <pre className="text-[12px] leading-relaxed text-zinc-300">
                <code>{`"xs"  → 0.25rem (4px)
"sm"  → 0.5rem  (8px)
"md"  → 1rem    (16px)
"lg"  → 1.5rem  (24px)
"xl"  → 2rem    (32px)
"2xl" → 3rem    (48px)
"3xl" → 4rem    (64px)`}</code>
              </pre>
            </div>
          </div>
          <div>
            <div className="mb-2 text-[12px] font-bold text-zinc-400">NUMERIC</div>
            <div className="overflow-x-auto rounded-lg border border-zinc-700 bg-background p-3">
              <pre className="text-[12px] leading-relaxed text-zinc-300">
                <code>{`"none" "px" "0.5"
"1" "1.5" "2" "2.5"
"3" "3.5" "4" "5"
"6" "7" "8" "9"
"10" "11" "12" "14" "16"`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Links */}
      <section>
        <h2 className="mb-4 text-2xl font-extrabold tracking-tight text-zinc-100">
          Links
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { label: "npm", url: "https://www.npmjs.com/package/layoutkit-css", desc: "layoutkit-css on npm" },
            { label: "GitHub", url: "https://github.com/Garrett-s-Apps/layoutkit", desc: "Source code + stylesheet" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-zinc-700 bg-surface p-4 transition-colors hover:border-accent"
            >
              <div className="text-[13px] font-bold text-accent">{link.label}</div>
              <div className="font-sans text-[11px] text-zinc-500">{link.desc}</div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
