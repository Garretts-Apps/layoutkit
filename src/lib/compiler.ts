// Compiles LayoutKit JSX to the native CSS the components actually emit (via
// the inline `style` prop). Mirrors packages/layoutkit/src so the Playground
// and Tutorial show exactly what ships — no Tailwind, no classes.

const SPACE: Record<string, string> = {
  none: "0", px: "1px", "0.5": "0.125rem", "1": "0.25rem", "1.5": "0.375rem",
  "2": "0.5rem", "2.5": "0.625rem", "3": "0.75rem", "3.5": "0.875rem", "4": "1rem",
  "5": "1.25rem", "6": "1.5rem", "7": "1.75rem", "8": "2rem", "9": "2.25rem",
  "10": "2.5rem", "11": "2.75rem", "12": "3rem", "14": "3.5rem", "16": "4rem",
  xs: "0.25rem", sm: "0.5rem", md: "1rem", lg: "1.5rem", xl: "2rem", "2xl": "3rem", "3xl": "4rem",
};
const ALIGN: Record<string, string> = {
  start: "flex-start", center: "center", end: "flex-end", stretch: "stretch", baseline: "baseline",
};
const JUSTIFY: Record<string, string> = {
  start: "flex-start", center: "center", end: "flex-end",
  between: "space-between", around: "space-around", evenly: "space-evenly",
};

type Props = Record<string, string | number | boolean>;
type Decl = [string, string];

const has = (p: Props, k: string) => Boolean(p[k]);
const str = (p: Props, k: string, fallback: string) => (typeof p[k] === "string" ? (p[k] as string) : fallback);

// One builder per component, returning ordered CSS declarations that match the
// real component output in packages/layoutkit/src.
const STYLE_BUILDERS: Record<string, (p: Props) => Decl[]> = {
  Center(p) {
    const both = !has(p, "horizontal") && !has(p, "vertical");
    const d: Decl[] = [
      ["display", has(p, "inline") ? "inline-flex" : "flex"],
      ["flex-direction", "column"],
    ];
    if (both || has(p, "horizontal")) d.push(["align-items", "center"]);
    if (both || has(p, "vertical")) d.push(["justify-content", "center"]);
    if (has(p, "fill")) d.push(["flex", "1 1 0%"]);
    if (has(p, "fullHeight")) d.push(["min-height", "100vh"]);
    return d;
  },
  Stack(p) {
    const d: Decl[] = [
      ["display", "flex"],
      ["flex-direction", "column"],
      ["gap", SPACE[str(p, "gap", "md")]],
      ["align-items", has(p, "center") ? "center" : ALIGN[str(p, "align", "stretch")]],
      ["justify-content", has(p, "center") ? "center" : JUSTIFY[str(p, "justify", "start")]],
    ];
    if (has(p, "fill")) d.push(["flex", "1 1 0%"]);
    if (has(p, "fullHeight")) d.push(["min-height", "100vh"]);
    if (p.padding && p.padding !== "none") d.push(["padding", SPACE[str(p, "padding", "none")]]);
    if (has(p, "wrap")) d.push(["flex-wrap", "wrap"]);
    return d;
  },
  Row(p) {
    const d: Decl[] = [
      ["display", "flex"],
      ["flex-direction", has(p, "reverse") ? "row-reverse" : "row"],
      ["gap", SPACE[str(p, "gap", "md")]],
      ["align-items", has(p, "center") ? "center" : ALIGN[str(p, "align", "center")]],
      ["justify-content", has(p, "center") ? "center" : JUSTIFY[str(p, "justify", "start")]],
    ];
    if (has(p, "fill")) d.push(["flex", "1 1 0%"]);
    if (has(p, "fullHeight")) d.push(["min-height", "100vh"]);
    if (p.padding && p.padding !== "none") d.push(["padding", SPACE[str(p, "padding", "none")]]);
    if (has(p, "wrap")) d.push(["flex-wrap", "wrap"]);
    return d;
  },
  Box(p) {
    const d: Decl[] = [];
    if (has(p, "fill")) d.push(["flex", "1 1 0%"]);
    if (has(p, "center")) d.push(["display", "flex"], ["align-items", "center"], ["justify-content", "center"]);
    if (p.padding && p.padding !== "none") d.push(["padding", SPACE[str(p, "padding", "none")]]);
    return d;
  },
  Spread(p) {
    return [
      ["display", "flex"],
      ["flex-direction", "row"],
      ["justify-content", "space-between"],
      ["align-items", ALIGN[str(p, "align", "center")]],
      ...(p.padding && p.padding !== "none" ? [["padding", SPACE[str(p, "padding", "none")]] as Decl] : []),
    ];
  },
  Grid(p) {
    const cols = typeof p.cols === "number" ? p.cols : 1;
    return [
      ["display", "grid"],
      ["grid-template-columns", `repeat(${cols}, minmax(0, 1fr))`],
      ["gap", SPACE[str(p, "gap", "md")]],
    ];
  },
  Spacer(p) {
    const size = str(p, "size", "auto");
    return size === "auto" ? [["flex", "1 1 0%"]] : [["height", SPACE[size] ?? "0"]];
  },
  Divider() {
    return [
      ["width", "100%"],
      ["border-top", "1px solid #e5e7eb"],
    ];
  },
  ScrollArea() {
    return [["overflow-y", "auto"]];
  },
  AspectRatio(p) {
    const ratio = typeof p.ratio === "number" ? p.ratio : 1;
    return [
      ["position", "relative"],
      ["padding-bottom", `${((1 / ratio) * 100).toFixed(4).replace(/\.?0+$/, "")}%`],
    ];
  },
};

export interface CompilerResult {
  component: string;
  props: Props;
  /** Native CSS declarations, e.g. "display: flex; flex-direction: column; gap: 1rem". */
  css: string;
  /** Number of CSS declarations produced. */
  declarations: number;
  htmlOutput: string;
}

export interface LintWarning {
  line: number;
  message: string;
  severity: "warning" | "suggestion";
  fix?: string;
}

function findAllTagMatches(input: string): Array<{ tagName: string; propsStr: string; index: number }> {
  const matches: Array<{ tagName: string; propsStr: string; index: number }> = [];
  const allMatches = input.matchAll(/<(\w+)([^>]*)>/g);
  for (const m of allMatches) {
    matches.push({ tagName: m[1], propsStr: m[2], index: m.index ?? 0 });
  }
  return matches;
}

function parseBooleanProps(propsStr: string): string[] {
  const found: string[] = [];
  // Match standalone words that aren't part of key="value" or key={value} patterns
  const allMatches = propsStr.matchAll(/\b(\w+)\b(?!\s*=)/g);
  for (const m of allMatches) {
    found.push(m[1]);
  }
  return found;
}

function parseStringProps(propsStr: string): Array<[string, string]> {
  const found: Array<[string, string]> = [];
  const allMatches = propsStr.matchAll(/(\w+)="([^"]+)"/g);
  for (const m of allMatches) {
    found.push([m[1], m[2]]);
  }
  return found;
}

function parseNumericProps(propsStr: string): Array<[string, number]> {
  const found: Array<[string, number]> = [];
  const allMatches = propsStr.matchAll(/(\w+)=\{(\d+)\}/g);
  for (const m of allMatches) {
    found.push([m[1], parseInt(m[2])]);
  }
  return found;
}

export function parseJSXToCSS(input: string): { results: CompilerResult[]; lintWarnings: LintWarning[] } {
  const results: CompilerResult[] = [];
  const lintWarnings: LintWarning[] = [];
  const tagMatches = findAllTagMatches(input);

  for (const { tagName, propsStr, index } of tagMatches) {
    const build = STYLE_BUILDERS[tagName];
    if (!build) continue;

    const propsFound: Props = {};
    for (const prop of parseBooleanProps(propsStr)) propsFound[prop] = true;
    for (const [prop, val] of parseStringProps(propsStr)) propsFound[prop] = val;
    for (const [prop, val] of parseNumericProps(propsStr)) propsFound[prop] = val;

    const decls = build(propsFound).filter(([, v]) => v != null && v !== "");
    const css = decls.map(([k, v]) => `${k}: ${v}`).join("; ");
    const styleAttr = decls.map(([k, v]) => `${k}: ${v}`).join("; ");

    // Linting — prop-usage hygiene, unchanged by the native-CSS switch.
    const lineNum = input.substring(0, index).split("\n").length;

    if (tagName === "Center" && propsFound.horizontal && propsFound.vertical) {
      lintWarnings.push({
        line: lineNum,
        message: "Redundant props: <Center horizontal vertical> is the same as <Center>. Remove both props.",
        severity: "warning",
        fix: `<Center${propsFound.fill ? " fill" : ""}>`,
      });
    }
    if (tagName === "Row" && propsFound.justify === "between") {
      lintWarnings.push({
        line: lineNum,
        message: 'Consider using <Spread> instead of <Row justify="between"> for better semantics.',
        severity: "suggestion",
        fix: "<Spread>",
      });
    }
    if (tagName === "Stack" && propsFound.center && propsFound.align) {
      lintWarnings.push({
        line: lineNum,
        message: 'Conflicting props: "center" overrides "align". Remove one.',
        severity: "warning",
      });
    }
    if ((tagName === "Stack" || tagName === "Row") && propsFound.gap === "none") {
      lintWarnings.push({
        line: lineNum,
        message: 'Unnecessary prop: gap="none" resolves to gap: 0, which has no visual effect. Remove it.',
        severity: "suggestion",
      });
    }

    results.push({
      component: tagName,
      props: propsFound,
      css,
      declarations: decls.length,
      htmlOutput: `<div style="${styleAttr}">`,
    });
  }

  return { results, lintWarnings };
}
