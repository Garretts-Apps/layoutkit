// Parses LayoutKit HTML (<lk-*> custom-element tags with kebab-case attributes)
// into the native CSS the layoutkit.css stylesheet applies via attribute
// selectors. Mirrors packages/layoutkit/layoutkit.css so the Playground and
// Tutorial show exactly the CSS each tag/attribute produces — no classes, no
// runtime, no build.

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

type Props = Record<string, string | boolean>;
type Decl = [string, string];

const has = (p: Props, k: string) => Boolean(p[k]);
const str = (p: Props, k: string, fallback: string) => (typeof p[k] === "string" ? (p[k] as string) : fallback);

// One builder per tag, returning ordered CSS declarations that match the
// attribute-selector rules in packages/layoutkit/layoutkit.css.
const STYLE_BUILDERS: Record<string, (p: Props) => Decl[]> = {
  "lk-stack"(p) {
    const d: Decl[] = [
      ["display", "flex"],
      ["flex-direction", "column"],
      ["gap", SPACE[str(p, "gap", "md")] ?? "1rem"],
      ["align-items", has(p, "center") ? "center" : ALIGN[str(p, "align", "stretch")]],
      ["justify-content", has(p, "center") ? "center" : JUSTIFY[str(p, "justify", "start")]],
    ];
    if (p.padding && p.padding !== "none") d.push(["padding", SPACE[str(p, "padding", "none")]]);
    if (has(p, "fill")) d.push(["flex", "1 1 0%"]);
    if (has(p, "full-height")) d.push(["min-height", "100vh"]);
    if (has(p, "wrap")) d.push(["flex-wrap", "wrap"]);
    return d;
  },
  "lk-row"(p) {
    const d: Decl[] = [
      ["display", "flex"],
      ["flex-direction", has(p, "reverse") ? "row-reverse" : "row"],
      ["gap", SPACE[str(p, "gap", "md")] ?? "1rem"],
      ["align-items", has(p, "center") ? "center" : ALIGN[str(p, "align", "center")]],
      ["justify-content", has(p, "center") ? "center" : JUSTIFY[str(p, "justify", "start")]],
    ];
    if (p.padding && p.padding !== "none") d.push(["padding", SPACE[str(p, "padding", "none")]]);
    if (has(p, "fill")) d.push(["flex", "1 1 0%"]);
    if (has(p, "full-height")) d.push(["min-height", "100vh"]);
    if (has(p, "wrap")) d.push(["flex-wrap", "wrap"]);
    return d;
  },
  "lk-center"(p) {
    const both = !has(p, "horizontal") && !has(p, "vertical");
    const d: Decl[] = [
      ["display", has(p, "inline") ? "inline-flex" : "flex"],
      ["flex-direction", "column"],
    ];
    // Base lk-center centers both axes; single-axis attrs override the other.
    d.push(["align-items", both || has(p, "horizontal") ? "center" : "stretch"]);
    d.push(["justify-content", both || has(p, "vertical") ? "center" : "flex-start"]);
    if (has(p, "fill")) d.push(["flex", "1 1 0%"]);
    if (has(p, "full-height")) d.push(["min-height", "100vh"]);
    return d;
  },
  "lk-box"(p) {
    const d: Decl[] = [["display", "block"]];
    if (p.padding && p.padding !== "none") d.push(["padding", SPACE[str(p, "padding", "none")]]);
    if (has(p, "fill")) d.push(["flex", "1 1 0%"]);
    return d;
  },
  "lk-spread"(p) {
    const d: Decl[] = [
      ["display", "flex"],
      ["flex-direction", "row"],
      ["justify-content", "space-between"],
      ["align-items", ALIGN[str(p, "align", "center")]],
    ];
    if (p.padding && p.padding !== "none") d.push(["padding", SPACE[str(p, "padding", "none")]]);
    return d;
  },
  "lk-grid"(p) {
    const d: Decl[] = [["display", "grid"]];
    if (has(p, "responsive")) {
      d.push(["grid-template-columns", "repeat(auto-fit, minmax(var(--lk-min-child-width, 250px), 1fr))"]);
    } else {
      const cols = str(p, "cols", "1");
      d.push(["grid-template-columns", `repeat(${cols}, minmax(0, 1fr))`]);
    }
    if (p.rows) d.push(["grid-template-rows", `repeat(${str(p, "rows", "1")}, minmax(0, 1fr))`]);
    d.push(["gap", SPACE[str(p, "gap", "md")] ?? "1rem"]);
    if (p["col-gap"]) d.push(["column-gap", SPACE[str(p, "col-gap", "none")]]);
    if (p["row-gap"]) d.push(["row-gap", SPACE[str(p, "row-gap", "none")]]);
    if (p.flow === "row") d.push(["grid-auto-flow", "row"]);
    if (p.flow === "col") d.push(["grid-auto-flow", "column"]);
    if (p.flow === "dense") d.push(["grid-auto-flow", "dense"]);
    if (p["place-items"]) d.push(["place-items", str(p, "place-items", "stretch")]);
    return d;
  },
  "lk-spacer"(p) {
    const size = str(p, "size", "auto");
    if (size === "auto" || !(size in SPACE)) return [["display", "block"], ["flex", "1 1 0%"]];
    return [["display", "block"], ["flex", "none"], ["height", SPACE[size]]];
  },
  "lk-divider"(p) {
    if (p.orientation === "vertical") {
      const width = p.thickness === "thick" ? "4px" : p.thickness === "medium" ? "2px" : "1px";
      return [
        ["display", "block"],
        ["height", "100%"],
        ["align-self", "stretch"],
        ["border-left", `${width} solid var(--lk-divider-color, #e5e7eb)`],
      ];
    }
    const width = p.thickness === "thick" ? "4px" : p.thickness === "medium" ? "2px" : "1px";
    return [
      ["display", "block"],
      ["width", "100%"],
      ["border-top", `${width} solid var(--lk-divider-color, #e5e7eb)`],
    ];
  },
  "lk-aspect-ratio"() {
    return [
      ["display", "block"],
      ["aspect-ratio", "var(--lk-ratio, 1)"],
    ];
  },
  "lk-scroll-area"(p) {
    const d: Decl[] = [["display", "block"]];
    if (p.direction === "horizontal") {
      d.push(["overflow-x", "auto"], ["overflow-y", "hidden"]);
    } else if (p.direction === "both") {
      d.push(["overflow", "auto"]);
    } else {
      d.push(["overflow-y", "auto"]);
      if (p.direction === "vertical") d.push(["overflow-x", "hidden"]);
    }
    d.push(["max-height", "var(--lk-max-height, none)"]);
    d.push(["max-width", "var(--lk-max-width, none)"]);
    return d;
  },
};

export interface CompilerResult {
  /** The tag name, e.g. "lk-center". */
  component: string;
  props: Props;
  /** Native CSS declarations, e.g. "display: flex; flex-direction: column; gap: 1rem". */
  css: string;
  /** Number of CSS declarations produced. */
  declarations: number;
  /** The element with its computed inline style, e.g. `<lk-center style="display: flex; …">`. */
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
  // Match opening tags only (skip closing </lk-*> tags).
  const allMatches = input.matchAll(/<([a-z][\w-]*)((?:[^>"]|"[^"]*")*?)\/?>/g);
  for (const m of allMatches) {
    if (m[0].startsWith("</")) continue;
    matches.push({ tagName: m[1], propsStr: m[2], index: m.index ?? 0 });
  }
  return matches;
}

function parseBooleanAttrs(propsStr: string): string[] {
  const found: string[] = [];
  // Standalone kebab-case words that aren't part of key="value".
  for (const m of propsStr.matchAll(/(?:^|\s)([a-z][\w-]*)(?!\s*=)\b/g)) {
    found.push(m[1]);
  }
  return found;
}

function parseStringAttrs(propsStr: string): Array<[string, string]> {
  const found: Array<[string, string]> = [];
  for (const m of propsStr.matchAll(/([a-z][\w-]*)="([^"]*)"/g)) {
    found.push([m[1], m[2]]);
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
    for (const attr of parseBooleanAttrs(propsStr)) propsFound[attr] = true;
    for (const [attr, val] of parseStringAttrs(propsStr)) propsFound[attr] = val;

    const decls = build(propsFound).filter(([, v]) => v != null && v !== "");
    const css = decls.map(([k, v]) => `${k}: ${v}`).join("; ");

    // Linting — a couple of useful hygiene hints.
    const lineNum = input.substring(0, index).split("\n").length;

    if (tagName === "lk-center" && propsFound.horizontal && propsFound.vertical) {
      lintWarnings.push({
        line: lineNum,
        message: "Redundant attributes: <lk-center horizontal vertical> is the same as <lk-center>. Remove both.",
        severity: "warning",
        fix: `<lk-center${propsFound.fill ? " fill" : ""}>`,
      });
    }
    if (tagName === "lk-row" && propsFound.justify === "between") {
      lintWarnings.push({
        line: lineNum,
        message: 'Consider <lk-spread> instead of <lk-row justify="between"> for better semantics.',
        severity: "suggestion",
        fix: "<lk-spread>",
      });
    }
    if ((tagName === "lk-stack" || tagName === "lk-row") && propsFound.center && propsFound.align) {
      lintWarnings.push({
        line: lineNum,
        message: 'Conflicting attributes: "center" overrides "align". Remove one.',
        severity: "warning",
      });
    }
    if ((tagName === "lk-stack" || tagName === "lk-row" || tagName === "lk-grid") && propsFound.gap === "none") {
      lintWarnings.push({
        line: lineNum,
        message: 'Unnecessary attribute: gap="none" resolves to gap: 0, which has no visual effect. Remove it.',
        severity: "suggestion",
      });
    }

    results.push({
      component: tagName,
      props: propsFound,
      css,
      declarations: decls.length,
      htmlOutput: `<${tagName} style="${css}">`,
    });
  }

  return { results, lintWarnings };
}
