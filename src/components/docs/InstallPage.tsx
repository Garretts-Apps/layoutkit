"use client";

import { useState } from "react";

function VendorSection() {
  const [copied, setCopied] = useState(false);

  async function copyFile() {
    try {
      const res = await fetch("/layoutkit.tsx");
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
        Vendor it — no package manager
      </h2>
      <p className="mb-4 font-sans text-[14px] text-muted">
        LayoutKit is zero-dependency native CSS, so the whole library fits in one
        file. Download it, drop it in your project, and import — no npm, no
        Tailwind, no build config. You own the code and can edit it freely.
      </p>

      <div className="mb-4 flex flex-wrap gap-3">
        <a
          href="/layoutkit.tsx"
          download="layoutkit.tsx"
          className="rounded-lg bg-accent px-4 py-2 text-[13px] font-bold text-background transition-opacity hover:opacity-90"
        >
          Download layoutkit.tsx
        </a>
        <button
          onClick={copyFile}
          className="rounded-lg border border-zinc-700 bg-background px-4 py-2 text-[13px] font-bold text-zinc-200 transition-colors hover:border-accent"
        >
          {copied ? "Copied ✓" : "Copy to clipboard"}
        </button>
      </div>

      <p className="mb-2 font-sans text-[13px] text-muted">Or pull it from the command line:</p>
      <div className="mb-4 rounded-lg border border-zinc-700 bg-background p-4">
        <code className="text-[14px] text-green-400">curl -O https://layoutkit.dev/layoutkit.tsx</code>
      </div>

      <p className="mb-2 font-sans text-[13px] text-muted">Then import from wherever you put it:</p>
      <div className="rounded-lg border border-zinc-700 bg-background p-4">
        <pre className="text-[13px] leading-relaxed text-zinc-300">
          <code>{`import { Stack, Row, Center, Grid } from "./layoutkit"

export default function App() {
  return (
    <Stack gap="lg" padding="md">
      <Center fill>Centered — works on import</Center>
    </Stack>
  )
}`}</code>
        </pre>
      </div>
      <p className="mt-3 font-sans text-[12px] text-zinc-500">
        One file, ~1.4 KB over the wire (brotli), zero runtime dependencies. Requires React 18+.
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
          NOW ON NPM
        </div>
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-zinc-100">
          Install LayoutKit
        </h1>
        <p className="font-sans text-[16px] text-muted">
          Get the npm package, editor extensions, and platform-specific setup.
        </p>
      </div>

      {/* npm Install */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-extrabold tracking-tight text-zinc-100">
          npm Package
        </h2>
        <div className="mb-4 rounded-lg border border-zinc-700 bg-background p-4">
          <code className="text-[14px] text-green-400">npm install layoutkit-css</code>
        </div>
        <p className="mb-4 font-sans text-[14px] text-muted">
          Then import and use — TypeScript IntelliSense works out of the box:
        </p>
        <div className="rounded-lg border border-zinc-700 bg-background p-4">
          <pre className="text-[13px] leading-relaxed text-zinc-300">
            <code>{`import { Stack, Row, Center, Grid } from "layoutkit-css"

export default function App() {
  return (
    <Stack gap="lg" padding="md">
      <Row gap="sm" align="center">
        <h1>Hello</h1>
        <span>World</span>
      </Row>
      <Center fill>
        <p>Centered content</p>
      </Center>
      <Grid cols={3} gap="md">
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </Grid>
    </Stack>
  )
}`}</code>
          </pre>
        </div>
        <p className="mt-3 font-sans text-[12px] text-zinc-500">
          Requires React 18+. Zero runtime dependencies, no Tailwind. Works with Next.js, Vite, Remix, and any React framework.
        </p>
      </section>

      {/* Vendor without a package manager */}
      <VendorSection />

      {/* Alternative: CLI scaffolding */}
      <section className="mb-12 rounded-xl border border-accent/30 bg-accent/5 p-6">
        <h3 className="mb-3 text-lg font-bold text-zinc-100">
          Alternative: Scaffold components (shadcn-style)
        </h3>
        <div className="mb-3 rounded-lg border border-zinc-700 bg-background p-4">
          <code className="text-[14px] text-accent">npx layoutkit init</code>
        </div>
        <p className="font-sans text-[13px] text-muted">
          Copies all 10 components into your project. You own the source code and can customize freely.
        </p>
      </section>

      {/* Platform Setup */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-extrabold tracking-tight text-zinc-100">
          Platform Setup
        </h2>

        <div className="space-y-6">
          {/* macOS */}
          <div className="rounded-xl border border-zinc-700 bg-surface p-6">
            <h3 className="mb-3 text-lg font-bold text-accent">macOS</h3>
            <div className="rounded-lg border border-zinc-700 bg-background p-4">
              <pre className="text-[13px] leading-relaxed text-zinc-300">
                <code>{`# Install Node.js (if you don't have it)
brew install node

# In any React project:
npm install layoutkit-css`}</code>
              </pre>
            </div>
          </div>

          {/* Windows */}
          <div className="rounded-xl border border-zinc-700 bg-surface p-6">
            <h3 className="mb-3 text-lg font-bold text-accent">Windows</h3>
            <div className="rounded-lg border border-zinc-700 bg-background p-4">
              <pre className="text-[13px] leading-relaxed text-zinc-300">
                <code>{`# 1. Install Node.js from https://nodejs.org (LTS recommended)
# 2. Open PowerShell or Command Prompt
# 3. In your project directory:
npm install layoutkit-css`}</code>
              </pre>
            </div>
          </div>

          {/* Linux */}
          <div className="rounded-xl border border-zinc-700 bg-surface p-6">
            <h3 className="mb-3 text-lg font-bold text-accent">Linux</h3>
            <div className="rounded-lg border border-zinc-700 bg-background p-4">
              <pre className="text-[13px] leading-relaxed text-zinc-300">
                <code>{`# Install Node.js (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# In your project:
npm install layoutkit-css`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* VS Code Extension */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-extrabold tracking-tight text-zinc-100">
          VS Code Extension
        </h2>
        <p className="mb-4 font-sans text-[14px] text-muted">
          Snippets and IntelliSense for all 10 components. Type a component name and Tab to expand.
        </p>

        <h3 className="mb-3 text-lg font-bold text-zinc-200">Install</h3>
        <div className="mb-6 rounded-lg border border-zinc-700 bg-background p-4">
          <pre className="text-[13px] leading-relaxed text-zinc-300">
            <code>{`# Clone the repo
git clone https://github.com/Garrett-s-Apps/layoutkit.git
cd layoutkit/vscode-extension

# Build and install
npm install
npx @vscode/vsce package --allow-missing-repository
code --install-extension layoutkit-0.1.0.vsix`}</code>
          </pre>
        </div>

        <h3 className="mb-3 text-lg font-bold text-zinc-200">Snippets</h3>
        <p className="mb-3 font-sans text-[13px] text-muted">
          Open any <code className="rounded bg-zinc-800 px-1.5 text-accent">.tsx</code> or <code className="rounded bg-zinc-800 px-1.5 text-accent">.jsx</code> file and start typing:
        </p>
        <div className="overflow-hidden rounded-lg border border-zinc-700">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-zinc-700 bg-zinc-800/50">
                <th className="px-4 py-2 font-semibold text-zinc-300">Type</th>
                <th className="px-4 py-2 font-semibold text-zinc-300">Expands to</th>
              </tr>
            </thead>
            <tbody className="font-mono text-[12px]">
              {[
                ["Stack", "<Stack gap=\"md\">...</Stack>"],
                ["Row", "<Row gap=\"md\">...</Row>"],
                ["Center", "<Center fill>...</Center>"],
                ["Grid", "<Grid cols={3} gap=\"md\">...</Grid>"],
                ["Box", "<Box padding=\"md\">...</Box>"],
                ["Spread", "<Spread>...</Spread>"],
                ["Spacer", "<Spacer />"],
                ["Divider", "<Divider />"],
                ["AspectRatio", "<AspectRatio ratio={16/9}>...</AspectRatio>"],
                ["ScrollArea", "<ScrollArea maxHeight=\"...\">...</ScrollArea>"],
                ["lk-page", "Full page layout with nav + content"],
              ].map(([trigger, result]) => (
                <tr key={trigger} className="border-b border-zinc-800">
                  <td className="px-4 py-2 text-accent">{trigger}</td>
                  <td className="px-4 py-2 text-zinc-400">{result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="mb-3 mt-6 text-lg font-bold text-zinc-200">TypeScript IntelliSense</h3>
        <p className="font-sans text-[13px] text-muted">
          Since <code className="rounded bg-zinc-800 px-1.5 text-accent">layoutkit-css</code> ships
          with <code className="rounded bg-zinc-800 px-1.5 text-zinc-300">.d.ts</code> type
          declarations, VS Code provides full IntelliSense automatically:
        </p>
        <ul className="mt-3 space-y-2 font-sans text-[13px] text-muted">
          <li className="flex gap-2"><span className="text-green-400">&#10003;</span> Auto-import suggestions when you type a component name</li>
          <li className="flex gap-2"><span className="text-green-400">&#10003;</span> Prop autocomplete with type unions (<code className="rounded bg-zinc-800 px-1 text-zinc-300">{'"xs" | "sm" | "md" | ...'}</code>)</li>
          <li className="flex gap-2"><span className="text-green-400">&#10003;</span> Hover documentation for every prop</li>
          <li className="flex gap-2"><span className="text-green-400">&#10003;</span> Go-to-definition support</li>
        </ul>
      </section>

      {/* Neovim Plugin */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-extrabold tracking-tight text-zinc-100">
          Neovim Plugin
        </h2>
        <p className="mb-4 font-sans text-[14px] text-muted">
          LuaSnip snippets, nvim-cmp completions, and utility commands.
        </p>

        <h3 className="mb-3 text-lg font-bold text-zinc-200">Install with lazy.nvim</h3>
        <div className="mb-6 rounded-lg border border-zinc-700 bg-background p-4">
          <pre className="text-[13px] leading-relaxed text-zinc-300">
            <code>{`-- Add to your lazy.nvim plugin spec:
{
  "Garrett-s-Apps/layoutkit",
  subdirectory = "neovim-plugin",
  ft = { "typescriptreact", "javascriptreact" },
  config = function()
    require("layoutkit").setup()
  end,
}`}</code>
          </pre>
        </div>

        <h3 className="mb-3 text-lg font-bold text-zinc-200">Manual Install</h3>
        <div className="mb-6 rounded-lg border border-zinc-700 bg-background p-4">
          <pre className="text-[13px] leading-relaxed text-zinc-300">
            <code>{`# Clone the repo
git clone https://github.com/Garrett-s-Apps/layoutkit.git \\
  ~/.local/share/nvim/layoutkit

# Add to your init.lua
vim.opt.runtimepath:append(
  "~/.local/share/nvim/layoutkit/neovim-plugin"
)
require("layoutkit").setup()`}</code>
          </pre>
        </div>

        <h3 className="mb-3 text-lg font-bold text-zinc-200">Snippets (LuaSnip)</h3>
        <div className="overflow-hidden rounded-lg border border-zinc-700">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-zinc-700 bg-zinc-800/50">
                <th className="px-4 py-2 font-semibold text-zinc-300">Trigger</th>
                <th className="px-4 py-2 font-semibold text-zinc-300">Component</th>
              </tr>
            </thead>
            <tbody className="font-mono text-[12px]">
              {[
                ["lkimport", "Import statement"],
                ["lkstack", "<Stack>"],
                ["lkrow", "<Row>"],
                ["lkcenter", "<Center>"],
                ["lkbox", "<Box>"],
                ["lkgrid", "<Grid>"],
                ["lkspread", "<Spread>"],
                ["lkspacer", "<Spacer />"],
                ["lkdivider", "<Divider />"],
                ["lkaspect", "<AspectRatio>"],
                ["lkscroll", "<ScrollArea>"],
              ].map(([trigger, comp]) => (
                <tr key={trigger} className="border-b border-zinc-800">
                  <td className="px-4 py-2 text-accent">{trigger}</td>
                  <td className="px-4 py-2 text-zinc-400">{comp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="mb-3 mt-6 text-lg font-bold text-zinc-200">Commands</h3>
        <div className="overflow-hidden rounded-lg border border-zinc-700">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-zinc-700 bg-zinc-800/50">
                <th className="px-4 py-2 font-semibold text-zinc-300">Command</th>
                <th className="px-4 py-2 font-semibold text-zinc-300">Description</th>
              </tr>
            </thead>
            <tbody className="font-mono text-[12px]">
              <tr className="border-b border-zinc-800">
                <td className="px-4 py-2 text-accent">:LayoutKitList</td>
                <td className="px-4 py-2 text-zinc-400">List all components and their props</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="px-4 py-2 text-accent">:LayoutKitImport</td>
                <td className="px-4 py-2 text-zinc-400">Insert full import statement at cursor</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mb-3 mt-6 text-lg font-bold text-zinc-200">Autocomplete (nvim-cmp)</h3>
        <p className="font-sans text-[13px] text-muted">
          When nvim-cmp is installed, the plugin registers a completion source that triggers on{" "}
          <code className="rounded bg-zinc-800 px-1.5 text-zinc-300">&lt;</code> for component names
          and inside prop values for gap/padding sizes.
        </p>
      </section>

      {/* Components Reference */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-extrabold tracking-tight text-zinc-100">
          All Components
        </h2>
        <div className="overflow-hidden rounded-lg border border-zinc-700">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-zinc-700 bg-zinc-800/50">
                <th className="px-4 py-2 font-semibold text-zinc-300">Component</th>
                <th className="px-4 py-2 font-semibold text-zinc-300">Description</th>
                <th className="px-4 py-2 font-semibold text-zinc-300">Key Props</th>
              </tr>
            </thead>
            <tbody className="text-[12px]">
              {[
                ["Stack", "Vertical flex layout", "gap, align, justify, padding, fill, fullHeight"],
                ["Row", "Horizontal flex layout", "gap, align, justify, padding, wrap, reverse"],
                ["Center", "Center content", "fill, fullHeight, horizontal, vertical, inline"],
                ["Box", "Container with padding", "padding, fill, center"],
                ["Grid", "CSS Grid", "cols, rows, gap, responsive, minChildWidth"],
                ["Spread", "Space-between layout", "align, padding"],
                ["Spacer", "Flexible space", "size"],
                ["Divider", "Separator line", "orientation, color, thickness"],
                ["AspectRatio", "Fixed aspect ratio", "ratio"],
                ["ScrollArea", "Scrollable container", "direction, maxHeight, maxWidth"],
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

        <h3 className="mb-3 mt-6 text-lg font-bold text-zinc-200">Shared Props</h3>
        <p className="mb-3 font-sans text-[13px] text-muted">
          All components support:
        </p>
        <ul className="space-y-1 font-sans text-[13px] text-muted">
          <li><code className="rounded bg-zinc-800 px-1.5 text-zinc-300">as</code> — Render as a different HTML element</li>
          <li><code className="rounded bg-zinc-800 px-1.5 text-zinc-300">className</code> — Additional CSS classes (passed through)</li>
          <li><code className="rounded bg-zinc-800 px-1.5 text-zinc-300">ref</code> — Forwarded ref</li>
          <li>All native HTML div props</li>
        </ul>

        <h3 className="mb-3 mt-6 text-lg font-bold text-zinc-200">Size Scale</h3>
        <p className="mb-3 font-sans text-[13px] text-muted">
          Used for <code className="rounded bg-zinc-800 px-1.5 text-zinc-300">gap</code> and{" "}
          <code className="rounded bg-zinc-800 px-1.5 text-zinc-300">padding</code> props:
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="mb-2 text-[12px] font-bold text-zinc-400">SEMANTIC</div>
            <div className="rounded-lg border border-zinc-700 bg-background p-3">
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
            <div className="rounded-lg border border-zinc-700 bg-background p-3">
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
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "npm", url: "https://www.npmjs.com/package/layoutkit-css", desc: "layoutkit-css on npm" },
            { label: "GitHub", url: "https://github.com/Garrett-s-Apps/layoutkit", desc: "Source code + extensions" },
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
