/**
 * LayoutKit — drop-in layout web components. v0.1.0
 *
 * The first layout language for the web, as native custom elements.
 * Zero dependencies. No build step. No React. No Tailwind. No npm.
 *
 * Drop one tag into any HTML page (or any framework):
 *
 *   <script src="https://layoutkit.dev/layoutkit.js"></script>
 *
 *   <lk-stack gap="lg" padding="md">
 *     <lk-row gap="sm" justify="between"><span>Logo</span><nav>…</nav></lk-row>
 *     <lk-center full-height>You can finally center a div.</lk-center>
 *     <lk-grid cols="3" gap="md"><div>1</div><div>2</div><div>3</div></lk-grid>
 *   </lk-stack>
 *
 * Every element styles itself with native CSS via the inline style attribute.
 * Attributes are kebab-case (full-height, min-child-width, col-gap, …).
 * You own this file — edit it freely. License: MIT.
 */
(() => {
  if (typeof window === "undefined" || !window.customElements) return;

  const rem = (n) => `${Number(n) * 0.25}rem`;
  const SPACE = {
    none: "0", px: "1px", xs: rem(1), sm: rem(2), md: rem(4), lg: rem(6), xl: rem(8), "2xl": rem(12), "3xl": rem(16),
    ...Object.fromEntries(
      ["0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4", "5", "6", "7", "8", "9", "10", "11", "12", "14", "16"].map((n) => [n, rem(n)])
    ),
  };
  const ALIGN = { start: "flex-start", center: "center", end: "flex-end", stretch: "stretch", baseline: "baseline" };
  const JUSTIFY = { start: "flex-start", center: "center", end: "flex-end", between: "space-between", around: "space-around", evenly: "space-evenly" };
  const sp = (v) => SPACE[v] ?? "0";

  // Register a custom element whose host styles itself from its attributes.
  // `build(el, a, b, g)` returns [property, value] pairs; falsy entries drop.
  //   a(name) -> attribute string | null   b(name) -> boolean presence
  //   g(name, fallback) -> attribute or fallback
  function define(tag, observed, build) {
    customElements.define(
      tag,
      class extends HTMLElement {
        static observedAttributes = observed;
        connectedCallback() { this.#render(); }
        attributeChangedCallback() { this.#render(); }
        #render() {
          const a = (n) => this.getAttribute(n);
          const b = (n) => this.hasAttribute(n);
          const g = (n, d) => this.getAttribute(n) ?? d;
          const decls = build(this, a, b, g).filter(Boolean);
          this.style.cssText = decls.map(([k, v]) => `${k}: ${v}`).join("; ");
        }
      }
    );
  }

  const pad = (a) => (a("padding") && a("padding") !== "none") && ["padding", sp(a("padding"))];

  define("lk-center", ["inline", "horizontal", "vertical", "fill", "full-height"], (el, a, b) => {
    const both = !b("horizontal") && !b("vertical");
    return [
      ["display", b("inline") ? "inline-flex" : "flex"],
      ["flex-direction", "column"],
      (both || b("horizontal")) && ["align-items", "center"],
      (both || b("vertical")) && ["justify-content", "center"],
      b("fill") && ["flex", "1 1 0%"],
      b("full-height") && ["min-height", "100vh"],
    ];
  });

  define("lk-stack", ["gap", "align", "justify", "center", "fill", "full-height", "padding", "wrap"], (el, a, b, g) => [
    ["display", "flex"],
    ["flex-direction", "column"],
    ["gap", sp(g("gap", "md"))],
    ["align-items", b("center") ? "center" : ALIGN[g("align", "stretch")]],
    ["justify-content", b("center") ? "center" : JUSTIFY[g("justify", "start")]],
    b("fill") && ["flex", "1 1 0%"],
    b("full-height") && ["min-height", "100vh"],
    pad(a),
    b("wrap") && ["flex-wrap", "wrap"],
  ]);

  define("lk-row", ["gap", "align", "justify", "center", "fill", "full-height", "padding", "wrap", "reverse"], (el, a, b, g) => [
    ["display", "flex"],
    ["flex-direction", b("reverse") ? "row-reverse" : "row"],
    ["gap", sp(g("gap", "md"))],
    ["align-items", b("center") ? "center" : ALIGN[g("align", "center")]],
    ["justify-content", b("center") ? "center" : JUSTIFY[g("justify", "start")]],
    b("fill") && ["flex", "1 1 0%"],
    b("full-height") && ["min-height", "100vh"],
    pad(a),
    b("wrap") && ["flex-wrap", "wrap"],
  ]);

  define("lk-box", ["fill", "padding", "center"], (el, a, b) => [
    ["display", b("center") ? "flex" : "block"],
    b("fill") && ["flex", "1 1 0%"],
    b("center") && ["align-items", "center"],
    b("center") && ["justify-content", "center"],
    pad(a),
  ]);

  define("lk-spread", ["align", "padding"], (el, a, b, g) => [
    ["display", "flex"],
    ["flex-direction", "row"],
    ["justify-content", "space-between"],
    ["align-items", ALIGN[g("align", "center")]],
    pad(a),
  ]);

  define("lk-grid", ["cols", "rows", "gap", "col-gap", "row-gap", "flow", "place-items", "responsive", "min-child-width"], (el, a, b, g) => {
    const perAxis = a("col-gap") || a("row-gap");
    return [
      ["display", "grid"],
      ["grid-template-columns", b("responsive")
        ? `repeat(auto-fit, minmax(${g("min-child-width", "250px")}, 1fr))`
        : `repeat(${g("cols", "1")}, minmax(0, 1fr))`],
      a("rows") && ["grid-template-rows", `repeat(${a("rows")}, minmax(0, 1fr))`],
      !perAxis && ["gap", sp(g("gap", "md"))],
      a("col-gap") && ["column-gap", sp(a("col-gap"))],
      a("row-gap") && ["row-gap", sp(a("row-gap"))],
      a("flow") && ["grid-auto-flow", { row: "row", col: "column", dense: "dense" }[a("flow")]],
      a("place-items") && ["place-items", a("place-items")],
    ];
  });

  define("lk-spacer", ["size"], (el, a, b, g) => {
    el.setAttribute("aria-hidden", "true");
    const size = g("size", "auto");
    return size === "auto" ? [["display", "block"], ["flex", "1 1 0%"]] : [["display", "block"], ["height", sp(size)]];
  });

  define("lk-divider", ["orientation", "color", "thickness"], (el, a, b, g) => {
    const orientation = g("orientation", "horizontal");
    el.setAttribute("role", "separator");
    el.setAttribute("aria-orientation", orientation);
    const width = { thin: "1px", medium: "2px", thick: "4px" }[g("thickness", "thin")] ?? "1px";
    const color = g("color", "#e5e7eb");
    return orientation === "horizontal"
      ? [["display", "block"], ["width", "100%"], ["border-top", `${width} solid ${color}`]]
      : [["display", "block"], ["align-self", "stretch"], ["height", "100%"], ["border-left", `${width} solid ${color}`]];
  });

  define("lk-aspect-ratio", ["ratio"], (el, a, b, g) => [
    ["display", "block"],
    ["aspect-ratio", String(Number(g("ratio", "1")) || 1)],
  ]);

  define("lk-scroll-area", ["direction", "max-height", "max-width"], (el, a, b, g) => {
    const dir = g("direction", "vertical");
    return [
      ["display", "block"],
      (dir === "horizontal" || dir === "both") && ["overflow-x", "auto"],
      (dir === "vertical" || dir === "both") && ["overflow-y", "auto"],
      a("max-height") && ["max-height", a("max-height")],
      a("max-width") && ["max-width", a("max-width")],
    ];
  });
})();
