"use client";

import { COMPONENT_DOCS } from "@/lib/docs-data";
import type { Section } from "./Navbar";

interface HomePageProps {
  onNavigate: (section: Section) => void;
  onSelectComponent: (index: number) => void;
}

export function HomePage({ onNavigate, onSelectComponent }: HomePageProps) {
  return (
    <div className="mx-auto max-w-[840px] px-6 py-12 sm:py-20">
      {/* Hero */}
      <div className="mb-14 text-center sm:mb-20">
        <div className="mb-6 inline-block rounded-full border border-accent/20 bg-gradient-to-r from-accent/15 to-purple/15 px-3 py-1 text-[10px] font-semibold text-accent sm:text-[11px]">
          YOU CAN FINALLY CENTER A DIV
        </div>
        <h1 className="mb-5 bg-gradient-to-br from-zinc-100 to-zinc-400 bg-clip-text text-[34px] font-extrabold leading-[1.08] tracking-tighter text-transparent sm:text-[56px] sm:leading-[1.05]">
          10 semantic tags.
          <br />
          One pure-CSS stylesheet.
        </h1>
        <p className="mx-auto mb-10 max-w-[560px] font-sans text-[17px] leading-relaxed text-muted">
          Zero dependencies. Zero JavaScript. No build. No FOUC.
          <br />
          Centering a div: the CSS final boss, defeated in one tag.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => onNavigate("playground")}
            className="rounded-lg bg-gradient-to-br from-accent to-purple px-6 py-2.5 text-[13px] font-bold text-background transition-opacity hover:opacity-90"
          >
            Try the Compiler &rarr;
          </button>
          <a
            href="https://github.com/Garrett-s-Apps/layoutkit"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-zinc-700 px-6 py-2.5 text-[13px] font-bold text-foreground transition-colors hover:border-zinc-500"
          >
            View on GitHub
          </a>
        </div>
      </div>

      {/* Drop in a link tag */}
      <div className="mb-8 rounded-xl border border-purple/30 bg-purple/5 p-8">
        <div className="mb-2 inline-block rounded-full border border-purple/20 bg-purple/10 px-3 py-1 text-[11px] font-semibold text-purple">
          NO BUILD · NO JAVASCRIPT · NO FOUC
        </div>
        <h2 className="mb-4 text-2xl font-extrabold tracking-tight text-zinc-100">
          Drop in one link tag
        </h2>
        <p className="mb-4 font-sans text-[14px] text-muted">
          LayoutKit is pure CSS. Load one render-blocking stylesheet and write semantic{" "}
          <code className="rounded bg-zinc-800 px-1.5 text-purple">&lt;lk-*&gt;</code> tags in plain
          HTML — the browser styles them before the first paint. Zero JavaScript, zero dependencies,
          no flash of unstyled content.
        </p>
        <div className="overflow-x-auto rounded-lg border border-zinc-700 bg-background p-4">
          <pre className="whitespace-pre-wrap break-words text-[12px] leading-relaxed text-zinc-300"><code>{`<link rel="stylesheet" href="https://unpkg.com/layoutkit-css/layoutkit.css">

<lk-stack gap="lg" padding="md">
  <lk-row gap="sm" justify="between">
    <span>Logo</span>
    <nav>…</nav>
  </lk-row>
  <lk-center full-height>You can finally center a div.</lk-center>
  <lk-grid cols="3" gap="md">
    <div>1</div><div>2</div><div>3</div>
  </lk-grid>
</lk-stack>`}</code></pre>
        </div>
        <button
          onClick={() => onNavigate("install")}
          className="mt-4 text-[13px] font-semibold text-purple hover:underline"
        >
          Vendor it — download the stylesheet &rarr;
        </button>
      </div>

      {/* npm CSS package */}
      <div className="mb-16 rounded-xl border border-green-500/30 bg-green-500/5 p-8">
        <div className="mb-2 inline-block rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-[11px] font-semibold text-green-400">
          ON NPM AS A CSS PACKAGE
        </div>
        <h2 className="mb-4 text-2xl font-extrabold tracking-tight text-zinc-100">
          Or install the stylesheet from npm
        </h2>
        <div className="mb-4 overflow-x-auto rounded-lg border border-zinc-700 bg-background p-4">
          <code className="text-[13px] text-green-400 break-all">npm install layoutkit-css</code>
        </div>
        <p className="mb-4 font-sans text-[14px] text-muted">
          Then import the stylesheet once and write <code className="rounded bg-zinc-800 px-1.5 text-green-400">&lt;lk-*&gt;</code> tags anywhere:
        </p>
        <div className="overflow-x-auto rounded-lg border border-zinc-700 bg-background p-4">
          <pre className="whitespace-pre-wrap break-words text-[12px] leading-relaxed text-zinc-300">
            <code>{`import "layoutkit-css/layoutkit.css"

<lk-stack gap="lg" padding="md">
  <lk-center fill>You can finally center a div.</lk-center>
</lk-stack>`}</code>
          </pre>
        </div>
        <p className="mt-4 font-sans text-[12px] text-zinc-500">
          It&apos;s a CSS package — just a stylesheet. No JavaScript runtime, no build step, no config. ~2 KB brotli.
        </p>
      </div>

      {/* Features Grid */}
      <h2 className="mb-5 text-2xl font-extrabold tracking-tight text-zinc-100">
        Why pure CSS wins
      </h2>
      <div className="mb-16 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {[
          { name: "Pure CSS", desc: "One stylesheet, no JavaScript runtime" },
          { name: "Zero Dependencies", desc: "Nothing to install but the .css file" },
          { name: "No Build Step", desc: "Link it and write tags — no bundler" },
          { name: "No FOUC", desc: "Render-blocking CSS styles tags before first paint" },
          { name: "Hypermedia-native", desc: "Works with any server-rendered HTML" },
          { name: "~2 KB Brotli", desc: "Tiny over the wire, fully cacheable" },
        ].map((feature) => (
          <div
            key={feature.name}
            className="rounded-lg border border-border bg-surface p-4"
          >
            <div className="mb-1 text-[13px] font-bold text-accent">
              {feature.name}
            </div>
            <div className="font-sans text-[11px] text-zinc-600">
              {feature.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Comparison grid */}
      <div className="mb-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            label: "Raw CSS",
            lines: [
              "display: flex;",
              "flex-direction: column;",
              "align-items: center;",
              "justify-content: center;",
              "min-height: 100vh;",
            ],
            count: "5 properties",
          },
          {
            label: "Tailwind utilities",
            lines: ["flex flex-col", "items-center", "justify-center", "min-h-screen"],
            count: "4 classes",
          },
          {
            label: "LayoutKit",
            lines: ["<lk-center full-height>"],
            count: "1 tag",
            highlight: true,
          },
        ].map((col) => (
          <div
            key={col.label}
            className={`rounded-xl p-5 ${
              col.highlight
                ? "border border-accent/30 bg-accent/5"
                : "border border-border bg-surface"
            }`}
          >
            <div
              className={`mb-3 text-[10px] font-bold uppercase tracking-widest ${
                col.highlight ? "text-accent" : "text-zinc-600"
              }`}
            >
              {col.label}
            </div>
            <div className="mb-3">
              {col.lines.map((l) => (
                <div
                  key={l}
                  className={`text-xs leading-7 ${
                    col.highlight ? "font-bold text-accent" : "text-zinc-400"
                  }`}
                >
                  {l}
                </div>
              ))}
            </div>
            <div
              className={`text-[11px] font-semibold ${
                col.highlight ? "text-accent" : "text-zinc-600"
              }`}
            >
              {col.count}
            </div>
          </div>
        ))}
      </div>

      {/* Component grid */}
      <h2 className="mb-5 text-2xl font-extrabold tracking-tight text-zinc-100">
        10 tags. Every layout.
      </h2>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {COMPONENT_DOCS.map((comp, i) => (
          <button
            key={comp.name}
            onClick={() => {
              onSelectComponent(i);
              onNavigate("docs");
            }}
            className="flex items-center gap-3.5 rounded-lg border border-border bg-surface p-4 text-left transition-colors hover:border-zinc-600"
          >
            <span className="text-[13px] font-bold text-accent">
              &lt;{comp.name} /&gt;
            </span>
            <span className="font-sans text-[11px] text-zinc-600">
              {comp.tagline}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
