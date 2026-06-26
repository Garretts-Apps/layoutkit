"use client";

import { LINT_RULES } from "@/lib/docs-data";

export function LintingPage() {
  return (
    <div className="mx-auto max-w-[800px] px-6 py-10">
      <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-zinc-100">
        Built-in Linting
      </h1>
      <p className="mb-3 font-sans text-sm leading-relaxed text-muted">
        LayoutKit includes a linter that catches redundant props, anti-patterns,
        and suggests better alternatives. It runs automatically in the compiler
        and is available as an ESLint plugin.
      </p>
      <p className="mb-9 font-sans text-[13px] text-zinc-600">
        Try the lint rules live in the Compiler — warnings appear automatically
        as you type.
      </p>

      {/* Rules */}
      {LINT_RULES.map((rule) => (
        <div
          key={rule.id}
          className="mb-3 overflow-hidden rounded-lg border border-border bg-surface"
        >
          <div className="flex items-center gap-3 border-b border-border px-5 py-3.5">
            <span className="rounded bg-yellow px-1.5 py-0.5 text-[10px] font-bold text-background">
              {rule.id}
            </span>
            <span className="text-[13px] font-bold text-zinc-100">
              {rule.name}
            </span>
          </div>
          <div className="px-5 py-3.5">
            <p className="mb-3.5 mt-0 font-sans text-[13px] leading-relaxed text-zinc-400">
              {rule.description}
            </p>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <div className="rounded-md border border-red/15 bg-red/5 p-3">
                <div className="mb-1.5 text-[9px] font-bold uppercase tracking-widest text-red">
                  Bad
                </div>
                <code className="block break-words text-xs text-red/70">{rule.example.bad}</code>
              </div>
              <div className="rounded-md border border-green/60 bg-green/5 p-3">
                <div className="mb-1.5 text-[9px] font-bold uppercase tracking-widest text-green">
                  Good
                </div>
                <code className="block break-words text-xs text-green">{rule.example.good}</code>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* ESLint config */}
      <h2 className="mb-4 mt-10 text-xl font-extrabold tracking-tight text-zinc-100">
        ESLint Plugin Setup
      </h2>
      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <div className="border-b border-border px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
          eslint.config.js
        </div>
        <pre className="m-0 overflow-auto whitespace-pre-wrap break-words p-4 text-xs leading-7 text-zinc-400">
          {`import layoutkit from "eslint-plugin-layoutkit";

export default [
  {
    plugins: { layoutkit },
    rules: {
      "layoutkit/redundant-center-axes": "warn",
      "layoutkit/prefer-spread": "warn",
      "layoutkit/conflicting-center-align": "error",
      "layoutkit/unnecessary-gap-none": "warn",
      "layoutkit/raw-tailwind-layout": "warn",
      "layoutkit/nested-center": "warn",
    }
  }
];`}
        </pre>
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-lg border border-accent/20 bg-accent/5 px-5 py-4">
        <span className="text-xl">&#128161;</span>
        <div>
          <div className="mb-0.5 text-[13px] font-semibold text-accent">
            Try it live
          </div>
          <div className="font-sans text-xs text-muted">
            The compiler playground shows lint warnings in real-time. Try typing{" "}
            <code className="text-yellow">
              &lt;Center horizontal vertical&gt;
            </code>{" "}
            or{" "}
            <code className="text-yellow">
              &lt;Row justify=&quot;between&quot;&gt;
            </code>{" "}
            to see them in action.
          </div>
        </div>
      </div>
    </div>
  );
}
