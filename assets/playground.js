/* LayoutKit Playground — vanilla JS, no dependencies.
   Parses <lk-*> markup and reports the native CSS the stylesheet applies via
   attribute selectors (mirrors packages/layoutkit/layoutkit.css), plus a live
   preview rendered by the real stylesheet. Nothing is "compiled" — this just
   explains which rules match. */
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
      results.push({ tag, css: decls.map(([k, v]) => k + ": " + v).join("; ") });
    }
    return results;
  }

  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  // Render the markup so the real stylesheet styles it. Strip scripts + inline handlers.
  const sanitize = (s) => s.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/\son\w+="[^"]*"/gi, "");

  const PRESETS = [
    { label: "Center", code: '<lk-center full-height>\n  <h2>Hello World</h2>\n  <p>Centered perfectly</p>\n</lk-center>' },
    { label: "Stack", code: '<lk-stack gap="lg" center>\n  <div>Item 1</div>\n  <div>Item 2</div>\n  <div>Item 3</div>\n</lk-stack>' },
    { label: "Page", code: '<lk-stack fill>\n  <lk-spread padding="md">\n    <strong>Logo</strong>\n    <lk-row gap="sm"><a>Home</a><a>About</a></lk-row>\n  </lk-spread>\n  <lk-box fill padding="lg"><lk-center><h1>Content</h1></lk-center></lk-box>\n</lk-stack>' },
    { label: "Grid", code: '<lk-grid cols="3" gap="lg">\n  <div>1</div><div>2</div><div>3</div>\n</lk-grid>' },
  ];

  function render() {
    const code = input.value;
    preview.innerHTML = sanitize(code);
    const results = parse(code);
    if (!results.length) {
      applied.innerHTML = '<p class="muted sans" style="font-style:italic;">Type a &lt;lk-…&gt; tag to see the CSS it’s styled with.</p>';
      return;
    }
    applied.innerHTML = results.map((r) => {
      const chips = r.css.split(";").map((d) => d.trim()).filter(Boolean)
        .map((d) => '<span class="decl">' + esc(d) + "</span>").join("");
      return '<div class="applied-block"><div class="applied-tag">&lt;' + esc(r.tag) + "&gt;</div><div class=\"decls\">" + chips + "</div></div>";
    }).join("");
  }

  const input = document.getElementById("pg-input");
  const preview = document.getElementById("pg-preview");
  const applied = document.getElementById("pg-applied");
  const presetBar = document.getElementById("pg-presets");
  if (!input) return;

  PRESETS.forEach((p) => {
    const b = document.createElement("button");
    b.className = "navlink"; b.type = "button"; b.textContent = p.label;
    b.addEventListener("click", () => { input.value = p.code; render(); });
    presetBar.appendChild(b);
  });

  // Tabs (preview / applied css)
  document.querySelectorAll("[data-tab]").forEach((t) => {
    t.addEventListener("click", () => {
      document.querySelectorAll("[data-tab]").forEach((x) => x.setAttribute("aria-selected", "false"));
      t.setAttribute("aria-selected", "true");
      const which = t.getAttribute("data-tab");
      preview.parentElement.hidden = which !== "preview";
      applied.parentElement.hidden = which !== "applied";
    });
  });

  input.addEventListener("input", render);
  input.value = PRESETS[0].code;
  render();
})();
