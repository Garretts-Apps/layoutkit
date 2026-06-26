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
    <nav className="sticky top-0 z-50 flex items-center gap-2 border-b border-border bg-background px-4 py-3 sm:gap-3 sm:px-6">
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-accent to-purple text-sm font-extrabold text-background">
          L
        </div>
        <span className="hidden text-base font-bold tracking-tight sm:inline">LayoutKit</span>
        <span className="hidden rounded bg-border px-1.5 py-0.5 text-[10px] font-semibold text-muted sm:inline">
          CSS
        </span>
      </div>
      {/* Scrollable on small screens so the nav never pushes the page wider than the viewport */}
      <div className="flex flex-1 justify-end gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {(Object.keys(SECTION_LABELS) as Section[]).map((s) => (
          <button
            key={s}
            onClick={() => onNavigate(s)}
            className={`shrink-0 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-all sm:px-3.5 ${
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
