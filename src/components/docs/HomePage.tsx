"use client";

import { COMPONENT_DOCS } from "@/lib/docs-data";
import type { Section } from "./Navbar";

interface HomePageProps {
  onNavigate: (section: Section) => void;
  onSelectComponent: (index: number) => void;
}

export function HomePage({ onNavigate, onSelectComponent }: HomePageProps) {
  return (
    <div className="mx-auto max-w-[840px] px-6 py-20">
      {/* Hero */}
      <div className="mb-20 text-center">
        <div className="mb-6 inline-block rounded-full border border-accent/20 bg-gradient-to-r from-accent/15 to-purple/15 px-3 py-1 text-[11px] font-semibold text-accent">
          YOU CAN FINALLY CENTER A DIV
        </div>
        <h1 className="mb-5 bg-gradient-to-br from-zinc-100 to-zinc-400 bg-clip-text text-[56px] font-extrabold leading-[1.05] tracking-tighter text-transparent">
          10 semantic components
          <br />
          that compile to native CSS.
        </h1>
        <p className="mx-auto mb-10 max-w-[560px] font-sans text-[17px] leading-relaxed text-muted">
          Zero dependencies. Full IntelliSense. Framework-agnostic.
          <br />
          Centering a div: the CSS final boss, defeated in one component.
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

      {/* Install from npm */}
      <div className="mb-8 rounded-xl border border-green-500/30 bg-green-500/5 p-8">
        <div className="mb-2 inline-block rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-[11px] font-semibold text-green-400">
          NOW ON NPM
        </div>
        <h2 className="mb-4 text-2xl font-extrabold tracking-tight text-zinc-100">
          Install as a package
        </h2>
        <div className="mb-4 overflow-x-auto rounded-lg border border-zinc-700 bg-background p-4">
          <code className="text-[13px] text-green-400 break-all">npm install layoutkit-css</code>
        </div>
        <p className="mb-4 font-sans text-[14px] text-muted">
          Then import and use — auto-complete works out of the box:
        </p>
        <div className="overflow-x-auto rounded-lg border border-zinc-700 bg-background p-4">
          <pre className="whitespace-pre-wrap break-words text-[12px] leading-relaxed text-zinc-300">
            <code>{`import { Stack, Center, Row, Grid } from "layoutkit-css"

<Stack gap="lg" padding="md">
  <Center fill>
    <h1>Hello World</h1>
  </Center>
</Stack>`}</code>
          </pre>
        </div>
        <p className="mt-4 font-sans text-[12px] text-zinc-500">
          Requires React 18+. Zero dependencies, no Tailwind, no build step. Works with Next.js, Vite, Remix, and any React framework.
        </p>
      </div>

      {/* No build, no React — web components */}
      <div className="mb-8 rounded-xl border border-purple/30 bg-purple/5 p-8">
        <div className="mb-2 inline-block rounded-full border border-purple/20 bg-purple/10 px-3 py-1 text-[11px] font-semibold text-purple">
          NO BUILD · NO REACT
        </div>
        <h2 className="mb-4 text-2xl font-extrabold tracking-tight text-zinc-100">
          Or drop in a script tag
        </h2>
        <p className="mb-4 font-sans text-[14px] text-muted">
          Not using React? Same 10 primitives ship as native web components. One{" "}
          <code className="rounded bg-zinc-800 px-1.5 text-purple">&lt;script&gt;</code>, zero build,
          zero dependencies — usable in plain HTML or any framework.
        </p>
        <div className="overflow-x-auto rounded-lg border border-zinc-700 bg-background p-4">
          <pre className="whitespace-pre-wrap break-words text-[12px] leading-relaxed text-zinc-300"><code>{`<script src="https://layoutkit.dev/layoutkit.js"></script>

<lk-center full-height>
  <h1>You can finally center a div.</h1>
</lk-center>`}</code></pre>
        </div>
        <button
          onClick={() => onNavigate("install")}
          className="mt-4 text-[13px] font-semibold text-purple hover:underline"
        >
          Vendor it — no package manager &rarr;
        </button>
      </div>

      {/* Platform install instructions */}
      <div className="mb-8 rounded-xl border border-zinc-700 bg-surface p-8">
        <h3 className="mb-4 text-lg font-extrabold tracking-tight text-zinc-100">
          Platform Setup
        </h3>
        <div className="space-y-4">
          <div>
            <div className="mb-2 text-[13px] font-bold text-accent">macOS</div>
            <div className="overflow-x-auto rounded-lg border border-zinc-700 bg-background p-3">
              <pre className="whitespace-pre-wrap break-words text-[12px] leading-relaxed text-zinc-300"><code>{`# Install Node.js (if needed)
brew install node

# In any React project:
npm install layoutkit-css`}</code></pre>
            </div>
          </div>
          <div>
            <div className="mb-2 text-[13px] font-bold text-accent">Windows</div>
            <div className="overflow-x-auto rounded-lg border border-zinc-700 bg-background p-3">
              <pre className="whitespace-pre-wrap break-words text-[12px] leading-relaxed text-zinc-300"><code>{`# Install Node.js from https://nodejs.org
# Then in PowerShell or CMD:
npm install layoutkit-css`}</code></pre>
            </div>
          </div>
          <div>
            <div className="mb-2 text-[13px] font-bold text-accent">Linux</div>
            <div className="overflow-x-auto rounded-lg border border-zinc-700 bg-background p-3">
              <pre className="whitespace-pre-wrap break-words text-[12px] leading-relaxed text-zinc-300"><code>{`# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# In your project:
npm install layoutkit-css`}</code></pre>
            </div>
          </div>
        </div>
      </div>

      {/* CLI scaffolding alternative */}
      <div className="mb-16 rounded-xl border border-accent/30 bg-accent/5 p-8">
        <h2 className="mb-4 text-2xl font-extrabold tracking-tight text-zinc-100">
          Or scaffold components directly
        </h2>
        <div className="mb-4 overflow-x-auto rounded-lg border border-zinc-700 bg-background p-4">
          <code className="text-[13px] text-accent break-all">npx layoutkit init</code>
        </div>
        <p className="font-sans text-[14px] text-muted">
          This copies all 10 components into your project (shadcn-style). You own the source code and can customize freely.
        </p>
      </div>

      {/* Features Grid */}
      <h2 className="mb-5 text-2xl font-extrabold tracking-tight text-zinc-100">
        Complete tooling ecosystem
      </h2>
      <div className="mb-16 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {[
          { name: "Compiler + Playground", desc: "Real-time compilation in your browser" },
          { name: "Linter", desc: "6 semantic rules for layout quality" },
          { name: "ESLint Plugin", desc: "Catch layout mistakes during development" },
          { name: "HTML Compiler", desc: "Works with any framework or vanilla HTML" },
          { name: "VS Code Extension", desc: "Full IntelliSense and autocomplete" },
          { name: "Zero Dependencies", desc: "Native inline styles — no Tailwind, no runtime" },
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
            label: "Inline styles",
            lines: [
              "display: flex,",
              "flexDirection: column,",
              "alignItems: center,",
              "justifyContent: center,",
              "minHeight: 100vh,",
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
            lines: ["<Center fullHeight>"],
            count: "1 prop",
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
        10 components. Every layout.
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
