/* LayoutKit Playground — vanilla JS, no dependencies.
   Left: LayoutKit markup. Right: the rendered output (styled by the real
   stylesheet). Below: the raw CSS you'd have written by hand to get the same
   layout — i.e. what LayoutKit saves you. Nothing is compiled; these are the
   attribute-selector rules layoutkit.css already applies. */
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
  const has = (p, k) => Boolean(p[k]);
  const str = (p, k, f) => (typeof p[k] === "string" ? p[k] : f);
  const sp = (v) => SPACE[v] ?? "0";

  const BUILDERS = {
    "lk-stack"(p) {
      const d = [["display", "flex"], ["flex-direction", "column"], ["gap", sp(str(p, "gap", "md"))],
        ["align-items", has(p, "center") ? "center" : ALIGN[str(p, "align", "stretch")]],
        ["justify-content", has(p, "center") ? "center" : JUSTIFY[str(p, "justify", "start")]]];
      if (p.padding && p.padding !== "none") d.push(["padding", sp(p.padding)]);
      if (has(p, "fill")) d.push(["flex", "1 1 0%"]);
      if (has(p, "full-height")) d.push(["min-height", "100vh"]);
      if (has(p, "wrap")) d.push(["flex-wrap", "wrap"]);
      return d;
    },
    "lk-row"(p) {
      const d = [["display", "flex"], ["flex-direction", has(p, "reverse") ? "row-reverse" : "row"], ["gap", sp(str(p, "gap", "md"))],
        ["align-items", has(p, "center") ? "center" : ALIGN[str(p, "align", "center")]],
        ["justify-content", has(p, "center") ? "center" : JUSTIFY[str(p, "justify", "start")]]];
      if (p.padding && p.padding !== "none") d.push(["padding", sp(p.padding)]);
      if (has(p, "fill")) d.push(["flex", "1 1 0%"]);
      if (has(p, "full-height")) d.push(["min-height", "100vh"]);
      if (has(p, "wrap")) d.push(["flex-wrap", "wrap"]);
      return d;
    },
    "lk-center"(p) {
      const both = !has(p, "horizontal") && !has(p, "vertical");
      const d = [["display", has(p, "inline") ? "inline-flex" : "flex"], ["flex-direction", "column"],
        ["align-items", both || has(p, "horizontal") ? "center" : "stretch"],
        ["justify-content", both || has(p, "vertical") ? "center" : "flex-start"]];
      if (has(p, "fill")) d.push(["flex", "1 1 0%"]);
      if (has(p, "full-height")) d.push(["min-height", "100vh"]);
      return d;
    },
    "lk-box"(p) {
      const d = [["display", "block"]];
      if (p.padding && p.padding !== "none") d.push(["padding", sp(p.padding)]);
      if (has(p, "fill")) d.push(["flex", "1 1 0%"]);
      return d;
    },
    "lk-spread"(p) {
      const d = [["display", "flex"], ["flex-direction", "row"], ["justify-content", "space-between"], ["align-items", ALIGN[str(p, "align", "center")]]];
      if (p.padding && p.padding !== "none") d.push(["padding", sp(p.padding)]);
      return d;
    },
    "lk-grid"(p) {
      const d = [["display", "grid"]];
      d.push(["grid-template-columns", has(p, "responsive")
        ? "repeat(auto-fit, minmax(var(--lk-min-child-width, 250px), 1fr))"
        : `repeat(${str(p, "cols", "1")}, minmax(0, 1fr))`]);
      if (p.rows) d.push(["grid-template-rows", `repeat(${str(p, "rows", "1")}, minmax(0, 1fr))`]);
      if (!p["col-gap"] && !p["row-gap"]) d.push(["gap", sp(str(p, "gap", "md"))]);
      if (p["col-gap"]) d.push(["column-gap", sp(p["col-gap"])]);
      if (p["row-gap"]) d.push(["row-gap", sp(p["row-gap"])]);
      if (p.flow === "col") d.push(["grid-auto-flow", "column"]);
      else if (p.flow === "dense") d.push(["grid-auto-flow", "dense"]);
      if (p["place-items"]) d.push(["place-items", str(p, "place-items", "stretch")]);
      return d;
    },
    "lk-spacer"(p) {
      const size = str(p, "size", "auto");
      return size === "auto" || !(size in SPACE) ? [["display", "block"], ["flex", "1 1 0%"]] : [["display", "block"], ["flex", "none"], ["height", sp(size)]];
    },
    "lk-divider"(p) {
      const w = p.thickness === "thick" ? "4px" : p.thickness === "medium" ? "2px" : "1px";
      return p.orientation === "vertical"
        ? [["display", "block"], ["height", "100%"], ["align-self", "stretch"], ["border-left", w + " solid var(--lk-divider-color, #e5e7eb)"]]
        : [["display", "block"], ["width", "100%"], ["border-top", w + " solid var(--lk-divider-color, #e5e7eb)"]];
    },
    "lk-aspect-ratio"() { return [["display", "block"], ["aspect-ratio", "var(--lk-ratio, 1)"]]; },
    "lk-scroll-area"(p) {
      const d = [["display", "block"]];
      if (p.direction === "horizontal") d.push(["overflow-x", "auto"], ["overflow-y", "hidden"]);
      else if (p.direction === "both") d.push(["overflow", "auto"]);
      else { d.push(["overflow-y", "auto"]); if (p.direction === "vertical") d.push(["overflow-x", "hidden"]); }
      d.push(["max-height", "var(--lk-max-height, none)"], ["max-width", "var(--lk-max-width, none)"]);
      return d;
    },
  };

  function parse(input) {
    const results = [];
    for (const m of input.matchAll(/<([a-z][\w-]*)((?:[^>"]|"[^"]*")*?)\/?>/g)) {
      const tag = m[1];
      if (!BUILDERS[tag]) continue;
      const attrs = {};
      for (const a of m[2].matchAll(/(?:^|\s)([a-z][\w-]*)(?!\s*=)\b/g)) attrs[a[1]] = true;
      for (const a of m[2].matchAll(/([a-z][\w-]*)="([^"]*)"/g)) attrs[a[1]] = a[2];
      const decls = BUILDERS[tag](attrs).filter(([, v]) => v != null && v !== "");
      results.push({ tag, raw: m[0].replace(/\s+/g, " ").trim(), decls });
    }
    return results;
  }

  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const sanitize = (s) => s.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/\son\w+="[^"]*"/gi, "");

  // The hand-written CSS equivalent: one rule per element, real and readable.
  function toCSS(results) {
    if (!results.length) return '<span class="tok-com">/* Type a &lt;lk-…&gt; tag to see the raw CSS it replaces */</span>';
    const seen = new Set();
    const blocks = [];
    for (const r of results) {
      const sel = "." + r.tag.replace(/^lk-/, "");
      const key = sel + "|" + r.decls.map(([k, v]) => k + v).join();
      if (seen.has(key)) continue;
      seen.add(key);
      const body = r.decls
        .map(([k, v]) => '  <span class="tok-attr">' + esc(k) + "</span>: <span class=\"tok-str\">" + esc(v) + "</span>;")
        .join("\n");
      blocks.push('<span class="tok-com">/* ' + esc(r.raw) + " */</span>\n<span class=\"tok-tag\">" + esc(sel) + " {</span>\n" + body + "\n<span class=\"tok-tag\">}</span>");
    }
    return blocks.join("\n\n");
  }

  const PRESETS = [
    { label: "Center", code: '<lk-center full-height>\n  <h2>Hello World</h2>\n  <p>Centered perfectly</p>\n</lk-center>' },
    { label: "Stack", code: '<lk-stack gap="lg" center>\n  <div>Item 1</div>\n  <div>Item 2</div>\n  <div>Item 3</div>\n</lk-stack>' },
    { label: "Page", code: '<lk-stack fill>\n  <lk-spread padding="md">\n    <strong>Logo</strong>\n    <lk-row gap="sm"><a>Home</a><a>About</a></lk-row>\n  </lk-spread>\n  <lk-box fill padding="lg"><lk-center><h2>Content</h2></lk-center></lk-box>\n</lk-stack>' },
    { label: "Grid", code: '<lk-grid cols="3" gap="lg">\n  <div>1</div><div>2</div><div>3</div>\n</lk-grid>' },
  ];

  const input = document.getElementById("pg-input");
  const preview = document.getElementById("pg-preview");
  const cssOut = document.getElementById("pg-css");
  const presetBar = document.getElementById("pg-presets");
  if (!input) return;

  function render() {
    preview.innerHTML = sanitize(input.value);
    cssOut.innerHTML = toCSS(parse(input.value));
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
