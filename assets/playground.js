/* LayoutKit Playground - vanilla JS, no dependencies.
   Left: LayoutKit markup. Right: the rendered output (styled by the real
   stylesheet). Below: equivalent layout CSS by hand. Nothing is compiled; the
   live preview is just the attribute-selector rules layoutkit.css already
   applies. */
(() => {
  const SPACE = {
    none: "0", px: "1px", "0.5": "0.125rem", "1": "0.25rem", "1.5": "0.375rem",
    "2": "0.5rem", "2.5": "0.625rem", "3": "0.75rem", "3.5": "0.875rem", "4": "1rem",
    "5": "1.25rem", "6": "1.5rem", "7": "1.75rem", "8": "2rem", "9": "2.25rem",
    "10": "2.5rem", "11": "2.75rem", "12": "3rem", "14": "3.5rem", "16": "4rem",
    xs: "0.25rem", sm: "0.5rem", md: "1rem", lg: "1.5rem", xl: "2rem", "2xl": "3rem", "3xl": "4rem",
  };
  const ALIGN = { start: "flex-start", center: "center", end: "flex-end", stretch: "stretch", baseline: "baseline" };
  const JUSTIFY = { start: "flex-start", center: "center", end: "flex-end", between: "space-between", around: "space-around", evenly: "space-evenly" };
  const WIDTH = { xs: "20rem", sm: "30rem", md: "40rem", lg: "50rem", xl: "64rem", prose: "var(--lk-measure, 65ch)", full: "100%" };
  const MINW = { "2xs": "8rem", xs: "10rem", sm: "12rem", md: "16rem", lg: "20rem", xl: "24rem" };
  const MAXH = { sm: "16rem", md: "24rem", lg: "32rem", screen: "100svh" };
  const PLACE = {
    center: ["center", "center"], top: ["center", "start"], bottom: ["center", "end"],
    start: ["start", "center"], end: ["end", "center"],
    "top-start": ["start", "start"], "top-end": ["end", "start"],
    "bottom-start": ["start", "end"], "bottom-end": ["end", "end"],
  };
  const FLEX = { start: "flex-start", center: "center", end: "flex-end" };
  const has = (p, k) => Boolean(p[k]);
  const str = (p, k, f) => (typeof p[k] === "string" ? p[k] : f);
  const sp = (v) => SPACE[v] ?? "0";
  const widthDecls = (p) => {
    if (!WIDTH[p.width]) return [];
    const decls = [["max-inline-size", WIDTH[p.width]]];
    if (p.width !== "full") decls.push(["margin-inline", "auto"]);
    return decls;
  };
  const placeDecls = (p, mainIsBlock) => {
    const value = str(p, "place", "");
    if (PLACE[value]) {
      const [inl, blk] = PLACE[value];
      const [jc, ai] = mainIsBlock ? [FLEX[blk], FLEX[inl]] : [FLEX[inl], FLEX[blk]];
      return [["justify-content", jc], ["align-items", ai]];
    }
    if (value === "between" || value === "around" || value === "evenly") return [["justify-content", JUSTIFY[value]]];
    return [];
  };

  const BUILDERS = {
    "lk-stack"(p) {
      const placed = placeDecls(p, true);
      const d = [["display", "flex"], ["flex-direction", "column"], ["gap", sp(str(p, "gap", "md"))],
        ["align-items", has(p, "center") ? "center" : ALIGN[str(p, "align", "stretch")]],
        ["justify-content", has(p, "center") ? "center" : JUSTIFY[str(p, "justify", "start")]]];
      if (p.padding) d.push(["padding", sp(p.padding)]);
      if (has(p, "fill")) d.push(["flex", "1 1 0%"]);
      if (has(p, "full-height")) d.push(["min-block-size", "100vh"]);
      if (has(p, "wrap")) d.push(["flex-wrap", "wrap"]);
      d.push(...widthDecls(p), ...placed);
      return d;
    },
    "lk-row"(p) {
      const d = [["display", "flex"], ["flex-direction", has(p, "reverse") ? "row-reverse" : "row"], ["gap", sp(str(p, "gap", "md"))],
        ["align-items", has(p, "center") ? "center" : ALIGN[str(p, "align", "center")]],
        ["justify-content", has(p, "center") ? "center" : JUSTIFY[str(p, "justify", "start")]]];
      if (p.padding) d.push(["padding", sp(p.padding)]);
      if (has(p, "fill")) d.push(["flex", "1 1 0%"]);
      if (has(p, "full-height")) d.push(["min-block-size", "100vh"]);
      if (has(p, "wrap")) d.push(["flex-wrap", "wrap"]);
      if (has(p, "snap")) d.push(["flex-wrap", "nowrap"], ["overflow-x", "auto"], ["overflow-y", "hidden"], ["scroll-snap-type", "x mandatory"]);
      d.push(...widthDecls(p), ...placeDecls(p, false));
      return d;
    },
    "lk-center"(p) {
      const both = !has(p, "horizontal") && !has(p, "vertical");
      const d = [["display", has(p, "inline") ? "inline-flex" : "flex"], ["flex-direction", "column"],
        ["align-items", both || has(p, "horizontal") ? "center" : "stretch"],
        ["justify-content", both || has(p, "vertical") ? "center" : "flex-start"]];
      if (has(p, "fill")) d.push(["flex", "1 1 0%"]);
      if (has(p, "full-height")) d.push(["min-block-size", "100vh"]);
      if (has(p, "overlay")) d.push(["position", "absolute"], ["inset", "var(--lk-overlay-inset, 0)"]);
      d.push(...widthDecls(p), ...placeDecls(p, true));
      return d;
    },
    "lk-box"(p) {
      const d = [["display", "block"]];
      if (p.padding) d.push(["padding", sp(p.padding)]);
      if (has(p, "fill")) d.push(["flex", "1 1 0%"]);
      d.push(...widthDecls(p));
      return d;
    },
    "lk-card"(p) {
      const radius = p.radius === "none" ? "0" : p.radius === "full" ? "9999px" : p.radius ? `var(--lk-radius-${p.radius})` : "var(--lk-radius-md)";
      const d = [["display", "block"], ["padding", sp(str(p, "padding", "lg"))], ["border-radius", radius],
        ["border", p.border === "none" ? "0" : "1px solid var(--lk-card-border, color-mix(in srgb, currentColor 12%, transparent))"]];
      if (has(p, "surface")) d.push(["background", "var(--lk-surface, color-mix(in srgb, currentColor 6%, transparent))"]);
      if (p.adapt === "figure") d.push(["padding", "0"], ["overflow", "clip"]);
      d.push(...widthDecls(p));
      return d;
    },
    "lk-spread"(p) {
      const d = [["display", "flex"], ["flex-direction", "row"], ["justify-content", "space-between"], ["align-items", ALIGN[str(p, "align", "center")]]];
      if (p.padding) d.push(["padding", sp(p.padding)]);
      d.push(...placeDecls(p, false));
      return d;
    },
    "lk-grid"(p) {
      const d = [["display", "grid"]];
      if (MINW[p.min]) d.push(["grid-template-columns", `repeat(auto-fit, minmax(min(${MINW[p.min]}, 100%), 1fr))`]);
      else if (has(p, "responsive")) d.push(["grid-template-columns", "repeat(auto-fit, minmax(min(var(--lk-min-child-width, 250px), 100%), 1fr))"]);
      else d.push(["grid-template-columns", `repeat(${str(p, "cols", "1")}, minmax(0, 1fr))`]);
      if (p.rows) d.push(["grid-template-rows", `repeat(${str(p, "rows", "1")}, minmax(0, 1fr))`]);
      if (!p["col-gap"] && !p["row-gap"]) d.push(["gap", sp(str(p, "gap", "md"))]);
      if (p["col-gap"]) d.push(["column-gap", sp(p["col-gap"])]);
      if (p["row-gap"]) d.push(["row-gap", sp(p["row-gap"])]);
      if (p.flow === "col") d.push(["grid-auto-flow", "column"]);
      else if (p.flow === "dense") d.push(["grid-auto-flow", "dense"]);
      else if (p.flow === "row") d.push(["grid-auto-flow", "row"]);
      if (p["place-items"]) d.push(["place-items", str(p, "place-items", "stretch")]);
      const place = str(p, "place", "");
      if (PLACE[place]) d.push(["justify-items", PLACE[place][0]], ["align-items", PLACE[place][1]]);
      else if (place === "between" || place === "around" || place === "evenly") d.push(["justify-content", JUSTIFY[place]], ["align-content", JUSTIFY[place]]);
      if (has(p, "subgrid") && p.subgrid !== "rows") d.push(["grid-template-columns", "subgrid"], ["grid-column", "1 / -1"]);
      if (p.subgrid === "rows" || p.subgrid === "both") d.push(["grid-template-rows", "subgrid"], ["grid-row", "1 / -1"]);
      if (has(p, "container")) d.push(["container-type", "inline-size"], ["container-name", "lk-grid"]);
      return d;
    },
    "lk-cluster"(p) {
      return [["display", "flex"], ["flex-wrap", "wrap"], ["gap", sp(str(p, "gap", "sm"))], ["align-items", "center"], ...placeDecls(p, false)];
    },
    "lk-switcher"(p) {
      const d = [["display", "flex"], ["flex-wrap", "wrap"], ["gap", sp(str(p, "gap", "md"))]];
      if (has(p, "container")) d.push(["container-type", "inline-size"], ["container-name", "lk-switcher"]);
      return d;
    },
    "lk-columns"(p) {
      const count = ["2", "3", "4"].includes(p.cols) ? p.cols : "2";
      const d = [["display", "block"], ["column-count", count], ["column-gap", p.gap ? sp(p.gap) : "var(--lk-space-md)"]];
      return d;
    },
    "lk-sidebar"(p) {
      const d = [["display", "flex"], ["flex-wrap", "wrap"], ["gap", sp(str(p, "gap", "md"))]];
      if (has(p, "container")) d.push(["container-type", "inline-size"], ["container-name", "lk-sidebar"]);
      return d;
    },
    "lk-cover"(p) {
      return [["display", "flex"], ["flex-direction", "column"], ["min-block-size", "var(--lk-cover-min, 100vh)"], ["gap", sp(str(p, "gap", "md"))], ["padding", sp("md")]];
    },
    "lk-spacer"(p) {
      const size = str(p, "size", "auto");
      if (size === "auto" || !(size in SPACE)) return [["display", "block"], ["flex", "1 1 0%"]];
      const v = sp(size);
      return [["display", "block"], ["flex", `0 0 ${v}`], ["block-size", v]];
    },
    "lk-divider"(p) {
      const w = p.thickness === "thick" ? "4px" : p.thickness === "medium" ? "2px" : "1px";
      return p.orientation === "vertical"
        ? [["display", "block"], ["height", "100%"], ["align-self", "stretch"], ["border-left", w + " solid var(--lk-divider-color, #e5e7eb)"]]
        : [["display", "block"], ["width", "100%"], ["border-top", w + " solid var(--lk-divider-color, #e5e7eb)"]];
    },
    "lk-aspect-ratio"(p) {
      const ratio = typeof p.ratio === "string" ? p.ratio : "var(--lk-ratio, 1)";
      return [["display", "block"], ["aspect-ratio", ratio]];
    },
    "lk-scroll-area"(p) {
      const d = [["display", "block"]];
      if (p.direction === "horizontal") d.push(["overflow-x", "auto"], ["overflow-y", "hidden"]);
      else if (p.direction === "both") d.push(["overflow", "auto"]);
      else { d.push(["overflow-y", "auto"]); if (p.direction === "vertical") d.push(["overflow-x", "hidden"]); }
      d.push(["max-block-size", MAXH[p["max-h"]] || "var(--lk-max-height, none)"], ["max-inline-size", "var(--lk-max-width, none)"]);
      if (p.gap) d.push(["gap", sp(p.gap)]);
      if (has(p, "snap")) {
        const vertical = p.direction === "vertical";
        d.push(
          ["display", "flex"],
          ["flex-flow", vertical ? "column nowrap" : "row nowrap"],
          ["overflow-x", vertical ? "hidden" : "auto"],
          ["overflow-y", vertical ? "auto" : "hidden"],
          ["scroll-snap-type", vertical ? "y mandatory" : p.snap === "proximity" ? "x proximity" : "x mandatory"],
        );
      }
      return d;
    },
    "lk-progress"(p) {
      return [["display", "block"], ["block-size", "0.25rem"], ["inline-size", "100%"], ["animation-timeline", p.scope === "nearest" ? "scroll(nearest)" : "scroll(root)"]];
    },
    "lk-popover"() {
      return [["padding", sp("md")], ["inline-size", "max-content"], ["max-inline-size", "min(20rem, calc(100vw - 2rem))"], ["background", "var(--lk-popover-bg, canvas)"]];
    },
    "lk-disclosure"(p) {
      return [["display", "block"], ["position", p.panel === "overlay" ? "relative" : "static"]];
    },
    "lk-menu"(p) {
      const d = [["display", "inline-block"], ["position", "relative"], ["max-inline-size", "100%"]];
      if (has(p, "anchor")) d.push(["anchor-scope", "--lk-menu"]);
      return d;
    },
  };

  function childRules(tag, attrs) {
    const rules = [];
    if ((tag === "lk-box" || tag === "lk-card") && has(attrs, "flow")) {
      const key = typeof attrs.flow === "string" && attrs.flow in SPACE ? attrs.flow : "md";
      rules.push([" > * + *", [["margin-block-start", sp(key)]]]);
    }
    if (tag === "lk-switcher") {
      const basis = has(attrs, "container") ? "calc((var(--lk-switch-at, 30rem) - 100cqi) * 999)" : "calc((var(--lk-switch-at, 30rem) - 100%) * 999)";
      rules.push([" > *", [["flex-grow", "1"], ["flex-basis", basis]]]);
      const limit = Number(attrs.limit);
      if (limit >= 2 && limit <= 6) {
        const from = limit + 1;
        rules.push([` > :nth-last-child(n + ${from})`, [["flex-basis", "100%"]]]);
        rules.push([` > :nth-last-child(n + ${from}) ~ *`, [["flex-basis", "100%"]]]);
      }
    }
    if (tag === "lk-columns") {
      rules.push([" > *", [["break-inside", "avoid"]]]);
    }
    if (tag === "lk-sidebar") {
      const end = attrs.side === "end";
      const contentMin = has(attrs, "container") ? "var(--lk-sidebar-content-min, 50cqi)" : "var(--lk-sidebar-content-min, 50%)";
      rules.push(
        [" > :first-child", end
          ? [["flex-grow", "999"], ["flex-basis", "0"], ["min-inline-size", contentMin]]
          : [["flex-grow", "1"], ["flex-basis", "var(--lk-sidebar-width, 18rem)"]]],
        [" > :last-child", end
          ? [["flex-grow", "1"], ["flex-basis", "var(--lk-sidebar-width, 18rem)"], ["min-inline-size", "0"]]
          : [["flex-grow", "999"], ["flex-basis", "0"], ["min-inline-size", contentMin]]],
      );
      if (has(attrs, "sticky")) {
        const stickySel = end ? " > :last-child" : " > :first-child";
        rules.push([stickySel, [["position", "sticky"], ["inset-block-start", "var(--lk-sticky-top, 0px)"], ["align-self", "start"], ["max-block-size", "100dvh"]]]);
      }
    }
    if (tag === "lk-cover") {
      rules.push([" > :is([center], :only-child)", [["margin-block", "auto"]]]);
    }
    if ((tag === "lk-row" || tag === "lk-stack") && attrs.adapt === "solo" && !attrs.justify && !attrs.place) {
      rules.push([":has(> :only-child)", [["justify-content", "center"]]]);
    }
    if ((tag === "lk-row" || tag === "lk-scroll-area") && has(attrs, "snap")) {
      const slide = attrs.slide === "full" ? "100%"
        : attrs.slide === "half" ? "calc((100% - var(--lk-snap-gap, var(--lk-space-md))) / 2)"
        : attrs.slide === "third" ? "calc((100% - 2 * var(--lk-snap-gap, var(--lk-space-md))) / 3)"
        : attrs.slide === "peek" ? "80%"
        : "auto";
      rules.push([" > *", [["scroll-snap-align", attrs.snap === "center" ? "center" : "start"], ["flex", `0 0 ${slide}`]]]);
    }
    if (tag === "lk-menu" && has(attrs, "anchor")) {
      rules.push([" > button:first-child", [["anchor-name", "--lk-menu"]]]);
      rules.push([" > lk-popover", [["position-anchor", "--lk-menu"], ["position-area", attrs.side === "end" ? "block-end span-inline-start" : "block-end span-inline-end"], ["justify-self", attrs.side === "end" ? "end" : "start"]]]);
    }
    if (tag === "lk-aspect-ratio") {
      rules.push([" > :is(img, video, iframe, canvas, svg)", [
        ["display", "block"],
        ["width", "100%"],
        ["height", "100%"],
        ["inline-size", "100%"],
        ["block-size", "100%"],
        ["object-fit", "cover"],
      ]]);
    }
    return rules;
  }

  const VIEWPORT_SUPPORTS = [
    { condition: "(min-block-size: 100svh)", value: "100svh" },
    { condition: "(min-block-size: 100dvh)", value: "100dvh" },
  ];
  function supportBlocks(tag, attrs) {
    if ((tag === "lk-stack" || tag === "lk-row" || tag === "lk-center") && has(attrs, "full-height")) {
      return VIEWPORT_SUPPORTS.map((step) => ({ condition: step.condition, decls: [["min-block-size", step.value]] }));
    }
    if (tag === "lk-cover") {
      return VIEWPORT_SUPPORTS.map((step) => ({ condition: step.condition, decls: [["min-block-size", "var(--lk-cover-min, " + step.value + ")"]] }));
    }
    if (tag === "lk-divider") {
      const mix = "var(--lk-divider-color, color-mix(in srgb, currentColor 20%, transparent))";
      return [{
        condition: "(color: color-mix(in srgb, currentColor 20%, transparent))",
        decls: [["border-top-color", mix], ["border-left-color", mix]],
      }];
    }
    return [];
  }

  function parse(input) {
    const results = [];
    for (const m of input.matchAll(/<([a-z][\w-]*)((?:[^>"]|"[^"]*")*?)\/?>/g)) {
      const tag = m[1];
      if (!BUILDERS[tag]) continue;
      const attrs = {};
      for (const a of m[2].matchAll(/(?:^|\s)([a-z][\w-]*)(?!\s*=)\b/g)) attrs[a[1]] = true;
      for (const a of m[2].matchAll(/([a-z][\w-]*)="([^"]*)"/g)) attrs[a[1]] = a[2];
      const decls = BUILDERS[tag](attrs).filter(([, v]) => v != null && v !== "");
      results.push({ tag, raw: m[0].replace(/\s+/g, " ").trim(), decls, children: childRules(tag, attrs), supports: supportBlocks(tag, attrs) });
    }
    return results;
  }

  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const sanitize = (s) => s.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/\son\w+="[^"]*"/gi, "");

  // Assign each element a class name. Same tag + same declarations share a
  // class; the same tag with different attributes gets a numbered suffix.
  function assignClasses(results) {
    const byKey = new Map();
    const count = new Map();
    for (const r of results) {
      const base = r.tag.replace(/^lk-/, "");
      const childKey = (r.children || []).map(([sel, decls]) => sel + decls.map(([k, v]) => k + ":" + v).join(";")).join("|");
      const supportKey = (r.supports || []).map((block) => block.condition + block.decls.map(([k, v]) => k + ":" + v).join(";")).join("|");
      const key = base + "|" + r.decls.map(([k, v]) => k + ":" + v).join(";") + "|" + childKey + "|" + supportKey;
      if (byKey.has(key)) { r.cls = byKey.get(key); continue; }
      const n = (count.get(base) || 0) + 1;
      count.set(base, n);
      r.cls = n === 1 ? base : base + "-" + n;
      byKey.set(key, r.cls);
    }
  }

  // Rewrite the LayoutKit markup as plain HTML: each <lk-tag …> becomes a
  // <div class="…"> with the class it was assigned; other tags are untouched.
  function vanillaText(input, results) {
    let i = 0;
    return input.replace(/<(\/?)([a-z][\w-]*)((?:[^>"]|"[^"]*")*?)(\/?)>/g, (m, slash, tag, _a, sc) => {
      if (!BUILDERS[tag]) return m;
      if (slash) return "</div>";
      const cls = (results[i++] || {}).cls || tag.replace(/^lk-/, "");
      return sc ? '<div class="' + cls + '"></div>' : '<div class="' + cls + '">';
    });
  }

  // Lightweight HTML syntax highlight over an escaped string.
  function hlHTML(raw) {
    return esc(raw).replace(/&lt;(\/?)([a-zA-Z][\w-]*)([^]*?)&gt;/g, (m, slash, tag, attrs) => {
      const a = attrs.replace(/([a-zA-Z-]+)=(&quot;[^]*?&quot;)/g,
        '<span class="tok-attr">$1</span>=<span class="tok-str">$2</span>');
      return '<span class="tok-tag">&lt;' + slash + tag + "</span>" + a + '<span class="tok-tag">&gt;</span>';
    });
  }

  // The CSS rules: one per distinct class, in document order.
  function cssRules(results) {
    const seen = new Set();
    const blocks = [];
    for (const r of results) {
      if (seen.has(r.cls)) continue;
      seen.add(r.cls);
      const body = r.decls
        .map(([k, v]) => '  <span class="tok-attr">' + esc(k) + '</span>: <span class="tok-str">' + esc(v) + "</span>;")
        .join("\n");
      const declBlock = (decls) => decls
        .map(([k, v]) => '  <span class="tok-attr">' + esc(k) + '</span>: <span class="tok-str">' + esc(v) + "</span>;")
        .join("\n");
      blocks.push('<span class="tok-com">/* ' + esc(r.raw) + ' */</span>\n<span class="tok-tag">.' + esc(r.cls) + " {</span>\n" + body + '\n<span class="tok-tag">}</span>');
      for (const block of r.supports || []) {
        blocks.push('<span class="tok-tag">@supports ' + esc(block.condition) + " {</span>\n<span class=\"tok-tag\">  ." + esc(r.cls) + " {</span>\n" + declBlock(block.decls) + '\n<span class="tok-tag">  }</span>\n<span class="tok-tag">}</span>');
      }
      for (const [sel, decls] of r.children || []) {
        blocks.push('<span class="tok-tag">.' + esc(r.cls) + esc(sel) + " {</span>\n" + declBlock(decls) + '\n<span class="tok-tag">}</span>');
      }
    }
    return blocks.join("\n\n");
  }

  // The hand-written layout equivalent: semantic HTML stays semantic while
  // LayoutKit wrappers are shown as plain divs with generated layout classes.
  function toByHand(input, results) {
    if (!results.length) return '<span class="tok-com">/* Type a &lt;lk-…&gt; tag to see the HTML + CSS it replaces */</span>';
    assignClasses(results);
    return '<span class="tok-com">&lt;!-- HTML --&gt;</span>\n' + hlHTML(vanillaText(input, results)) +
      '\n\n<span class="tok-com">/* CSS */</span>\n' + cssRules(results);
  }

  const PRESETS = [
    { label: "Empty state", code: '<section aria-labelledby="empty-heading">\n  <lk-center full-height>\n    <lk-stack gap="sm" align="center">\n      <h2 id="empty-heading">No results</h2>\n      <p>Try changing the filters.</p>\n      <button type="button">Reset filters</button>\n    </lk-stack>\n  </lk-center>\n</section>' },
    { label: "Form", code: '<form action="/settings" method="post">\n  <lk-stack gap="md">\n    <label>\n      Display name\n      <input name="name" autocomplete="name">\n    </label>\n    <lk-row gap="sm" wrap>\n      <button type="submit">Save</button>\n      <a href="/settings">Cancel</a>\n    </lk-row>\n  </lk-stack>\n</form>' },
    { label: "Page", code: '<lk-stack style="min-block-size: 16rem;">\n  <header>\n    <lk-spread padding="md" align="center">\n      <a href="/">Acme</a>\n      <nav aria-label="Primary"><lk-row gap="sm"><a href="/docs">Docs</a><a href="/pricing">Pricing</a></lk-row></nav>\n    </lk-spread>\n  </header>\n  <lk-box fill padding="lg">\n    <main><lk-center><h1>Dashboard</h1></lk-center></main>\n  </lk-box>\n</lk-stack>' },
    { label: "Grid", code: '<section aria-labelledby="projects-heading">\n  <lk-stack gap="md">\n    <h2 id="projects-heading">Projects</h2>\n    <lk-grid cols="3" gap="lg" responsive>\n      <article><h3>Website</h3><p>Updated today</p></article>\n      <article><h3>Docs</h3><p>Ready for review</p></article>\n      <article><h3>API</h3><p>Stable</p></article>\n    </lk-grid>\n  </lk-stack>\n</section>' },
    { label: "Snap", code: '<section aria-labelledby="slides-heading">\n  <lk-stack gap="sm">\n    <h2 id="slides-heading">Highlights</h2>\n    <lk-row snap slide="peek" tabindex="0" aria-label="Highlights">\n      <article><h3>One</h3><p>First slide</p></article>\n      <article><h3>Two</h3><p>Second slide</p></article>\n      <article><h3>Three</h3><p>Third slide</p></article>\n    </lk-row>\n  </lk-stack>\n</section>' },
    { label: "Menu", code: '<lk-menu anchor>\n  <button type="button" popovertarget="demo-menu">Menu</button>\n  <lk-popover id="demo-menu" popover>\n    <nav aria-label="Demo">\n      <lk-stack gap="xs">\n        <a href="/docs">Docs</a>\n        <a href="/install">Install</a>\n      </lk-stack>\n    </nav>\n  </lk-popover>\n</lk-menu>' },
  ];

  const input = document.getElementById("pg-input");
  const preview = document.getElementById("pg-preview");
  const cssOut = document.getElementById("pg-css");
  const presetBar = document.getElementById("pg-presets");
  if (!input) return;

  function render() {
    preview.innerHTML = sanitize(input.value);
    cssOut.innerHTML = toByHand(input.value, parse(input.value));
  }

  const buttons = [];
  const setActive = (idx) => buttons.forEach((b, i) => b.setAttribute("aria-pressed", String(i === idx)));
  PRESETS.forEach((p, i) => {
    const b = document.createElement("button");
    b.className = "preset"; b.type = "button"; b.textContent = p.label; b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", () => { input.value = p.code; setActive(i); render(); });
    presetBar.appendChild(b);
    buttons.push(b);
  });

  input.addEventListener("input", () => { setActive(-1); render(); });
  input.value = PRESETS[0].code;
  setActive(0);
  render();
})();
