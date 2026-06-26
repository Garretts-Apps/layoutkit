"use client";

export type Section = "home" | "install" | "docs" | "playground" | "tutorial";

const SECTION_LABELS: Record<Section, string> = {
  home: "Home",
  install: "Install",
  docs: "Docs",
  playground: "Compiler",
  tutorial: "Tutorial",
};

interface NavbarProps {
  section: Section;
  onNavigate: (section: Section) => void;
}

export function Navbar({ section, onNavigate }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-background px-6 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-accent to-purple text-sm font-extrabold text-background">
          L
        </div>
        <span className="text-base font-bold tracking-tight">LayoutKit</span>
        <span className="rounded bg-border px-1.5 py-0.5 text-[10px] font-semibold text-muted">
          CSS
        </span>
      </div>
      <div className="flex gap-1">
        {(Object.keys(SECTION_LABELS) as Section[]).map((s) => (
          <button
            key={s}
            onClick={() => onNavigate(s)}
            className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition-all ${
              section === s
                ? "bg-border text-accent"
                : "text-muted hover:text-foreground"
            }`}
          >
            {SECTION_LABELS[s]}
          </button>
        ))}
      </div>
    </nav>
  );
}
