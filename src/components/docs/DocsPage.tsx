"use client";

import { COMPONENT_DOCS } from "@/lib/docs-data";
import type { Section } from "./Navbar";

interface DocsPageProps {
  selectedComponent: number;
  onSelectComponent: (index: number) => void;
  onNavigate: (section: Section) => void;
  onSetPlaygroundCode: (code: string) => void;
}

export function DocsPage({
  selectedComponent,
  onSelectComponent,
  onNavigate,
  onSetPlaygroundCode,
}: DocsPageProps) {
  const comp = COMPONENT_DOCS[selectedComponent];

  return (
    <div className="flex min-h-[calc(100vh-49px)]">
      {/* Sidebar */}
      <div className="sticky top-[49px] h-[calc(100vh-49px)] w-[220px] shrink-0 overflow-y-auto border-r border-border py-5">
        <div className="mb-2 px-4 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
          Components
        </div>
        {COMPONENT_DOCS.map((c, i) => (
          <button
            key={c.name}
            onClick={() => onSelectComponent(i)}
            className={`block w-full border-l-2 px-4 py-2 text-left text-[13px] ${
              selectedComponent === i
                ? "border-accent bg-border font-bold text-accent"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            {c.name}
          </button>
        ))}
        <div className="mt-5 px-4 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
          Attribute Values
        </div>
        {["gap / size", "padding", "align", "justify"].map((t) => (
          <div
            key={t}
            className="border-l-2 border-transparent px-4 py-1.5 text-xs text-zinc-600"
          >
            {t}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="min-w-0 max-w-[760px] flex-1 px-5 py-10 sm:px-12">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
          Tag
        </div>
        <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-zinc-100">
          &lt;{comp.name}&gt;
        </h1>
        <p className="mb-9 font-sans text-[15px] leading-relaxed text-muted">
          {comp.tagline}
        </p>

        {/* Usage */}
        <div className="mb-8 space-y-1 overflow-x-auto whitespace-nowrap rounded-lg border border-border bg-surface px-4 py-3 text-xs">
          <div>
            <span className="text-foreground">&lt;</span>
            <span className="text-purple">link</span>
            <span className="text-accent"> rel</span>
            <span className="text-foreground">=</span>
            <span className="text-green">&quot;stylesheet&quot;</span>
            <span className="text-accent"> href</span>
            <span className="text-foreground">=</span>
            <span className="text-green">
              &quot;https://unpkg.com/layoutkit-css/layoutkit.css&quot;
            </span>
            <span className="text-foreground">&gt;</span>
          </div>
          <div>
            <span className="text-foreground">&lt;</span>
            <span className="text-accent">{comp.name}</span>
            <span className="text-foreground">&gt;</span>
            <span className="text-muted"> … </span>
            <span className="text-foreground">&lt;/</span>
            <span className="text-accent">{comp.name}</span>
            <span className="text-foreground">&gt;</span>
          </div>
        </div>

        {/* Attributes table */}
        <h3 className="mb-3 text-base font-bold tracking-tight text-zinc-100">
          Attributes
        </h3>
        <div className="mb-9 overflow-x-auto rounded-lg border border-border bg-surface">
          <div className="grid min-w-[520px] grid-cols-[120px_140px_80px_1fr] border-b border-border px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-zinc-600">
            <div>Attribute</div>
            <div>Type</div>
            <div>Default</div>
            <div>Description</div>
          </div>
          {comp.props.map((p, i) => (
            <div
              key={p.name}
              className={`grid min-w-[520px] grid-cols-[120px_140px_80px_1fr] items-center px-4 py-2.5 text-xs ${
                i < comp.props.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="font-semibold text-accent">{p.name}</div>
              <div className="text-[11px] text-purple">{p.type}</div>
              <div className="text-zinc-600">{p.default}</div>
              <div className="font-sans text-xs text-zinc-400">{p.desc}</div>
            </div>
          ))}
        </div>

        {/* Examples */}
        <h3 className="mb-4 text-base font-bold tracking-tight text-zinc-100">
          Examples
        </h3>
        {comp.examples.map((ex) => (
          <div
            key={ex.label}
            className="mb-5 overflow-hidden rounded-lg border border-border bg-surface"
          >
            <div className="border-b border-border px-4 py-2.5 text-[11px] font-semibold text-muted">
              {ex.label}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="border-b border-border p-4 sm:border-b-0 sm:border-r">
                <div className="mb-2 text-[9px] font-bold uppercase tracking-widest text-zinc-600">
                  HTML
                </div>
                <pre className="whitespace-pre-wrap text-xs leading-relaxed text-accent">
                  {ex.code}
                </pre>
              </div>
              <div className="p-4">
                <div className="mb-2 text-[9px] font-bold uppercase tracking-widest text-zinc-600">
                  Applied CSS
                </div>
                <div className="rounded-md bg-background px-3 py-2 text-xs font-medium leading-relaxed text-purple">
                  {ex.output}
                </div>
              </div>
            </div>
            <div className="flex justify-end border-t border-border px-4 py-2">
              <button
                onClick={() => {
                  onSetPlaygroundCode(ex.code);
                  onNavigate("playground");
                }}
                className="text-[11px] font-semibold text-accent hover:underline"
              >
                Open in Compiler &rarr;
              </button>
            </div>
          </div>
        ))}

        {/* CSS Property Map */}
        <h3 className="mb-3 mt-9 text-base font-bold tracking-tight text-zinc-100">
          CSS Property Map
        </h3>
        <p className="mb-4 font-sans text-[13px] leading-relaxed text-zinc-500">
          Exact native CSS the stylesheet applies for each attribute value — matched via attribute selectors, no JavaScript.
        </p>
        <div className="mb-9 overflow-x-auto rounded-lg border border-border bg-surface">
          <div className="grid min-w-[520px] grid-cols-[140px_180px_1fr] border-b border-border px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-zinc-600">
            <div>Attribute</div>
            <div>Value</div>
            <div>Applied CSS</div>
          </div>
          {comp.classMap.map((mapping, i) => (
            <div
              key={`${mapping.prop}-${mapping.value}-${i}`}
              className={`grid min-w-[520px] grid-cols-[140px_180px_1fr] items-center px-4 py-2.5 text-xs ${
                i < comp.classMap.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="font-semibold text-accent">{mapping.prop}</div>
              <div className="text-[11px] text-muted">{mapping.value}</div>
              <div className="flex flex-wrap gap-1.5">
                {mapping.classes
                  .split(";")
                  .map((decl) => decl.trim())
                  .filter(Boolean)
                  .map((decl, idx) => (
                    <span
                      key={idx}
                      className="rounded bg-purple/10 px-2 py-0.5 text-[11px] font-medium text-purple"
                    >
                      {decl}
                    </span>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Type reference for first 4 components */}
        {selectedComponent <= 3 && (
          <>
            <h3 className="mb-3 mt-9 text-base font-bold tracking-tight text-zinc-100">
              Attribute Value Reference
            </h3>
            <div className="overflow-x-auto break-words rounded-lg border border-border bg-surface p-4 text-xs leading-7">
              <div>
                <span className="text-accent">gap / size</span> ={" "}
                <span className="text-green">
                  none | px | xs | sm | md | lg | xl | 2xl | 3xl | 0.5 … 16
                </span>
              </div>
              <div>
                <span className="text-accent">padding</span> ={" "}
                <span className="text-green">
                  none | px | xs | sm | md | lg | xl | 2xl | 3xl | 0.5 … 16
                </span>
              </div>
              <div>
                <span className="text-accent">align</span> ={" "}
                <span className="text-green">
                  start | center | end | stretch | baseline
                </span>
              </div>
              <div>
                <span className="text-accent">justify</span> ={" "}
                <span className="text-green">
                  start | center | end | between | around | evenly
                </span>
              </div>
              <div className="mt-3">
                <div className="mb-1 text-[11px] text-zinc-600">
                  Gap / size value &rarr; CSS length
                </div>
                <div>
                  <span className="text-muted">xs</span> &rarr;{" "}
                  <span className="text-purple">0.25rem</span> (4px)&nbsp;&nbsp;
                  <span className="text-muted">sm</span> &rarr;{" "}
                  <span className="text-purple">0.5rem</span> (8px)&nbsp;&nbsp;
                  <span className="text-muted">md</span> &rarr;{" "}
                  <span className="text-purple">1rem</span> (16px)
                </div>
                <div>
                  <span className="text-muted">lg</span> &rarr;{" "}
                  <span className="text-purple">1.5rem</span> (24px)&nbsp;&nbsp;
                  <span className="text-muted">xl</span> &rarr;{" "}
                  <span className="text-purple">2rem</span> (32px)&nbsp;&nbsp;
                  <span className="text-muted">2xl</span> &rarr;{" "}
                  <span className="text-purple">3rem</span> (48px)
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
