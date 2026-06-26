"use client";

import { useState } from "react";
import { parseJSXToCSS } from "@/lib/compiler";
import { LivePreview } from "@/lib/jsx-renderer";

type OutputTab = "compiled" | "preview";

const PRESETS = [
  { label: "Center", code: '<lk-center full-height>\n  <h1>Hello World</h1>\n</lk-center>' },
  { label: "Stack", code: '<lk-stack gap="lg" center>\n  <div>Item 1</div>\n  <div>Item 2</div>\n  <div>Item 3</div>\n</lk-stack>' },
  { label: "Page Layout", code: '<lk-stack fill>\n  <lk-spread padding="md">\n    <span>Logo</span>\n    <lk-row gap="sm">\n      <a>Home</a>\n      <a>About</a>\n    </lk-row>\n  </lk-spread>\n  <lk-box fill padding="lg">\n    <lk-center>\n      <h1>Content</h1>\n    </lk-center>\n  </lk-box>\n</lk-stack>' },
  { label: "Grid", code: '<lk-grid cols="3" gap="lg">\n  <div>Card 1</div>\n  <div>Card 2</div>\n  <div>Card 3</div>\n</lk-grid>' },
];

interface PlaygroundPageProps {
  code: string;
  onCodeChange: (code: string) => void;
}

export function PlaygroundPage({ code, onCodeChange }: PlaygroundPageProps) {
  const [outputTab, setOutputTab] = useState<OutputTab>("preview");
  const result = parseJSXToCSS(code);

  return (
    <div className="flex h-[calc(100vh-49px)] flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-zinc-100">Interactive Compiler</span>
          <span className="hidden text-[11px] text-zinc-600 sm:inline">
            Type LayoutKit HTML &rarr; see the CSS it&apos;s styled with
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => onCodeChange(preset.code)}
              className="shrink-0 rounded border border-zinc-700 bg-surface px-2.5 py-1 text-[11px] font-semibold text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-200"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Split pane — stacks vertically on mobile, side-by-side on desktop */}
      <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
        {/* Input */}
        <div className="flex min-h-0 flex-1 flex-col border-b border-border md:border-b-0 md:border-r">
          <div className="flex items-center gap-2 border-b border-border px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
            <span className="h-2 w-2 rounded-full bg-accent" />
            LayoutKit HTML
          </div>
          <textarea
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
            spellCheck={false}
            className="flex-1 resize-none bg-background p-5 text-[13px] leading-7 text-accent"
          />
        </div>

        {/* Output */}
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-border px-4 py-2">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setOutputTab("preview")}
                className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                  outputTab === "preview"
                    ? "text-accent"
                    : "text-zinc-600 hover:text-zinc-400"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${outputTab === "preview" ? "bg-accent" : "bg-zinc-700"}`} />
                Live Preview
              </button>
              <button
                onClick={() => setOutputTab("compiled")}
                className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                  outputTab === "compiled"
                    ? "text-purple"
                    : "text-zinc-600 hover:text-zinc-400"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${outputTab === "compiled" ? "bg-purple" : "bg-zinc-700"}`} />
                Compiled Output
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto bg-background p-5">
            {/* Live Preview Tab */}
            {outputTab === "preview" && (
              <LivePreview code={code} />
            )}

            {/* Compiled Output Tab */}
            {outputTab === "compiled" && (
              <>
                {result.results.length === 0 && (
                  <div className="text-[13px] italic text-zinc-700">
                    Type a LayoutKit tag to see compiled output...
                  </div>
                )}
                {result.results.map((r, i) => (
                  <div
                    key={i}
                    className="mb-4 overflow-hidden rounded-lg border border-border bg-surface"
                  >
                    <div className="flex items-center justify-between border-b border-border px-3 py-2">
                      <span className="text-xs font-bold text-accent">
                        &lt;{r.component}&gt;
                      </span>
                      <span className="text-[10px] text-zinc-600">
                        {r.declarations} CSS {r.declarations === 1 ? "declaration" : "declarations"}
                      </span>
                    </div>
                    <div className="px-3 py-2.5">
                      <div className="mb-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-600">
                        Native CSS
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {r.css
                          .split(";")
                          .map((decl) => decl.trim())
                          .filter(Boolean)
                          .map((decl, j) => (
                            <span
                              key={j}
                              className="rounded border border-purple/20 bg-purple/10 px-2 py-0.5 text-[11px] font-medium text-purple"
                            >
                              {decl}
                            </span>
                          ))}
                      </div>
                    </div>
                    <div className="border-t border-border px-3 py-2.5">
                      <div className="mb-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-600">
                        HTML Output
                      </div>
                      <code className="block break-words text-xs text-green">{r.htmlOutput}</code>
                    </div>
                  </div>
                ))}

                {/* Lint warnings */}
                {result.lintWarnings.length > 0 && (
                  <div className="mt-5">
                    <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-yellow">
                      Lint Warnings
                    </div>
                    {result.lintWarnings.map((w, i) => (
                      <div
                        key={i}
                        className="mb-2 rounded-lg border border-yellow/20 bg-yellow/5 p-3"
                      >
                        <div className="mb-1 text-xs font-semibold text-yellow">
                          Line {w.line}:{" "}
                          {w.severity === "suggestion" ? "Suggestion" : "Warning"}
                        </div>
                        <div className="font-sans text-xs leading-relaxed text-zinc-400">
                          {w.message}
                        </div>
                        {w.fix && (
                          <div className="mt-1.5 text-[11px] text-green">
                            Fix: <code>{w.fix}</code>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
