import { describe, it, expect } from "vitest";
import { parseJSXToCSS } from "@/lib/compiler";

describe("Compiler", () => {
  it("compiles <lk-center> to flex with centering on both axes", () => {
    const { results } = parseJSXToCSS("<lk-center>");
    expect(results).toHaveLength(1);
    expect(results[0].component).toBe("lk-center");
    expect(results[0].css).toContain("display: flex");
    expect(results[0].css).toContain("align-items: center");
    expect(results[0].css).toContain("justify-content: center");
  });

  it("compiles <lk-center full-height> with min-height: 100vh", () => {
    const { results } = parseJSXToCSS("<lk-center full-height>");
    expect(results[0].css).toContain("min-height: 100vh");
  });

  it("compiles <lk-center inline> with inline-flex", () => {
    const { results } = parseJSXToCSS("<lk-center inline>");
    expect(results[0].css).toContain("display: inline-flex");
  });

  it("compiles <lk-stack> with default gap and align", () => {
    const { results } = parseJSXToCSS("<lk-stack>");
    expect(results[0].css).toContain("flex-direction: column");
    expect(results[0].css).toContain("gap: 1rem");
    expect(results[0].css).toContain("align-items: stretch");
  });

  it('compiles <lk-stack gap="lg"> with gap: 1.5rem', () => {
    const { results } = parseJSXToCSS('<lk-stack gap="lg">');
    expect(results[0].css).toContain("gap: 1.5rem");
  });

  it("compiles <lk-stack center> with centering", () => {
    const { results } = parseJSXToCSS("<lk-stack center>");
    expect(results[0].css).toContain("align-items: center");
    expect(results[0].css).toContain("justify-content: center");
  });

  it('compiles <lk-stack padding="md"> with padding: 1rem', () => {
    const { results } = parseJSXToCSS('<lk-stack padding="md">');
    expect(results[0].css).toContain("padding: 1rem");
  });

  it("compiles <lk-row> with flex-direction: row", () => {
    const { results } = parseJSXToCSS("<lk-row>");
    expect(results[0].css).toContain("flex-direction: row");
    expect(results[0].css).toContain("align-items: center");
  });

  it("compiles <lk-row reverse> with row-reverse", () => {
    const { results } = parseJSXToCSS("<lk-row reverse>");
    expect(results[0].css).toContain("flex-direction: row-reverse");
  });

  it("compiles <lk-box fill> with flex: 1 1 0%", () => {
    const { results } = parseJSXToCSS("<lk-box fill>");
    expect(results[0].css).toContain("flex: 1 1 0%");
  });

  it("compiles <lk-spread> with space-between", () => {
    const { results } = parseJSXToCSS("<lk-spread>");
    expect(results[0].css).toContain("justify-content: space-between");
    expect(results[0].css).toContain("align-items: center");
  });

  it('compiles <lk-grid cols="3"> with 3 columns', () => {
    const { results } = parseJSXToCSS('<lk-grid cols="3">');
    expect(results[0].css).toContain("display: grid");
    expect(results[0].css).toContain("grid-template-columns: repeat(3, minmax(0, 1fr))");
  });

  it("compiles <lk-grid responsive> with auto-fit", () => {
    const { results } = parseJSXToCSS("<lk-grid responsive>");
    expect(results[0].css).toContain("auto-fit");
    expect(results[0].css).toContain("var(--lk-min-child-width, 250px)");
  });

  it("compiles <lk-spacer> with flex: 1 1 0%", () => {
    const { results } = parseJSXToCSS("<lk-spacer>");
    expect(results[0].css).toContain("flex: 1 1 0%");
  });

  it('compiles <lk-spacer size="4"> with a fixed height', () => {
    const { results } = parseJSXToCSS('<lk-spacer size="4">');
    expect(results[0].css).toContain("flex: none");
    expect(results[0].css).toContain("height: 1rem");
  });

  it("compiles <lk-divider> with border-top", () => {
    const { results } = parseJSXToCSS("<lk-divider>");
    expect(results[0].css).toContain("border-top");
    expect(results[0].css).toContain("width: 100%");
  });

  it("compiles <lk-divider orientation=\"vertical\"> with border-left", () => {
    const { results } = parseJSXToCSS('<lk-divider orientation="vertical">');
    expect(results[0].css).toContain("border-left");
  });

  it("handles multiple tags in input", () => {
    const { results } = parseJSXToCSS("<lk-stack>\n  <lk-center>\n  </lk-center>\n</lk-stack>");
    expect(results).toHaveLength(2);
    expect(results[0].component).toBe("lk-stack");
    expect(results[1].component).toBe("lk-center");
  });

  it("generates HTML output with inline style", () => {
    const { results } = parseJSXToCSS("<lk-center>");
    expect(results[0].htmlOutput).toMatch(/^<lk-center style="/);
  });

  it("ignores non-LayoutKit tags", () => {
    const { results } = parseJSXToCSS("<div><span>hello</span></div>");
    expect(results).toHaveLength(0);
  });
});

describe("Compiler Linting", () => {
  it("warns on redundant lk-center axes", () => {
    const { lintWarnings } = parseJSXToCSS("<lk-center horizontal vertical>");
    expect(lintWarnings).toHaveLength(1);
    expect(lintWarnings[0].severity).toBe("warning");
    expect(lintWarnings[0].message).toContain("Redundant");
  });

  it('suggests lk-spread for lk-row justify="between"', () => {
    const { lintWarnings } = parseJSXToCSS('<lk-row justify="between">');
    expect(lintWarnings).toHaveLength(1);
    expect(lintWarnings[0].severity).toBe("suggestion");
    expect(lintWarnings[0].message).toContain("lk-spread");
  });

  it("warns on conflicting center and align", () => {
    const { lintWarnings } = parseJSXToCSS('<lk-stack center align="start">');
    expect(lintWarnings).toHaveLength(1);
    expect(lintWarnings[0].message).toContain("Conflicting");
  });

  it('warns on unnecessary gap="none"', () => {
    const { lintWarnings } = parseJSXToCSS('<lk-stack gap="none">');
    expect(lintWarnings).toHaveLength(1);
    expect(lintWarnings[0].severity).toBe("suggestion");
  });

  it("reports no warnings for clean code", () => {
    const { lintWarnings } = parseJSXToCSS('<lk-stack gap="lg" center>');
    expect(lintWarnings).toHaveLength(0);
  });
});
