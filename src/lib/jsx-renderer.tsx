"use client";

// Renders the user's raw <lk-*> HTML directly into the DOM and lets the global
// layoutkit.css stylesheet style it via attribute selectors. No React layout
// components, no parsing — what you type is what the browser renders.

// Light sanitize: strip <script> tags and on*= event-handler attributes to
// avoid obvious injection. Everything else is rendered as-is.
function sanitize(html: string): string {
  return html
    .replace(/<\s*script\b[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, "")
    .replace(/<\s*script\b[^>]*>/gi, "")
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son\w+\s*=\s*'[^']*'/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, "");
}

export function LivePreview({ code }: { code: string }) {
  if (!code.trim()) {
    return (
      <div className="flex h-full items-center justify-center text-[13px] italic text-zinc-700">
        Type LayoutKit HTML to see a live preview...
      </div>
    );
  }

  return (
    <div
      className="min-h-[200px] rounded-lg border border-border bg-zinc-900/50 p-4"
      dangerouslySetInnerHTML={{ __html: sanitize(code) }}
    />
  );
}
