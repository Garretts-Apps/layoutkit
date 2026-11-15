import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page, type TestInfo } from "@playwright/test";

const START = "/";

type Audit = {
  overflow: number;
  viewport: number;
  overlaps: string[];
  clips: string[];
  taps: string[];
  anchors: { hash: string; text: string }[];
  images: { src: string; ok: boolean }[];
  hrefs: string[];
};

const audit = () => {
  const visible = (el: Element) => {
    const s = getComputedStyle(el);
    if (s.display === "none" || s.visibility === "hidden" || Number(s.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 1 && r.height > 1;
  };
  const box = (el: Element) => {
    const r = el.getBoundingClientRect();
    return { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
  };
  const visibleBox = (el: Element) => {
    let rect = box(el);
    let node = el.parentElement;
    while (node) {
      if (node instanceof HTMLDetailsElement && !node.open && !node.querySelector("summary")?.contains(el)) {
        const dc = getComputedStyle(node, "::details-content");
        const hidden = dc.contentVisibility === "hidden" || ((dc.overflowY === "clip" || dc.overflowY === "hidden") && parseFloat(dc.height) === 0);
        if (hidden) return null;
      }
      const s = getComputedStyle(node);
      const clips = ["hidden", "clip", "auto", "scroll"].includes(s.overflowY) || ["hidden", "clip", "auto", "scroll"].includes(s.overflowX);
      if (clips) {
        const parent = box(node);
        rect = {
          left: Math.max(rect.left, parent.left),
          top: Math.max(rect.top, parent.top),
          right: Math.min(rect.right, parent.right),
          bottom: Math.min(rect.bottom, parent.bottom),
          width: 0,
          height: 0,
        };
        rect.width = Math.max(0, rect.right - rect.left);
        rect.height = Math.max(0, rect.bottom - rect.top);
        if (rect.width < 2 || rect.height < 2) return null;
      }
      node = node.parentElement;
    }
    return rect;
  };
  type Rect = { left: number; top: number; right: number; bottom: number; width: number; height: number };
  const hits = (a: Rect, b: Rect) => {
    const width = Math.min(a.right, b.right) - Math.max(a.left, b.left);
    const height = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
    return width > 4 && height > 4;
  };
  const onScreen = (r: { left: number; top: number; right: number; bottom: number }) =>
    r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
  const opaque = (el: Element) => {
    const bg = getComputedStyle(el).backgroundColor;
    const match = bg.match(/rgba?\(([^)]+)\)/);
    if (!match) return bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)";
    const parts = match[1].split(/[,\s/]+/).filter(Boolean);
    const alpha = parts.length >= 4 ? Number(parts[3]) : 1;
    return alpha >= 0.9;
  };
  const label = (el: Element) => {
    const text = (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 42);
    return `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}${text ? " “" + text + "”" : ""}`;
  };
  const covered = (el: Element, other: { left: number; top: number; right: number; bottom: number }) => {
    let node = el.parentElement;
    while (node) {
      const s = getComputedStyle(node);
      if ((s.position === "sticky" || s.position === "fixed" || s.position === "absolute") && opaque(node) && hits(box(node), other)) {
        return true;
      }
      node = node.parentElement;
    }
    return false;
  };

  const positioned = [...document.querySelectorAll("*")].filter((el) => {
    const p = getComputedStyle(el).position;
    return (p === "sticky" || p === "fixed" || p === "absolute") && visible(el);
  });
  const textSel = "h1,h2,h3,h4,p,a,pre,code,button,li";
  const texts = [...document.querySelectorAll(textSel)].filter((el) => visible(el) && (el.textContent || "").trim());
  const overlaps: string[] = [];
  for (const layer of positioned) {
    const layerBox = box(layer);
    if (!onScreen(layerBox)) continue;
    for (const text of texts) {
      if (layer.contains(text) || text.contains(layer)) continue;
      const textBox = visibleBox(text);
      if (!textBox || !onScreen(textBox) || !hits(layerBox, textBox)) continue;
      if (!opaque(layer)) overlaps.push(`${label(layer)} covers ${label(text)} without an opaque background`);
    }
  }
  const flow = [...document.querySelectorAll("h1,h2,h3,p,pre,li")].filter((el) => {
    if (!visible(el) || !(el.textContent || "").trim()) return false;
    const display = getComputedStyle(el).display;
    return display !== "inline" && display !== "contents";
  });
  for (let i = 0; i < flow.length; i++) {
    for (let j = i + 1; j < flow.length; j++) {
      const a = flow[i];
      const b = flow[j];
      if (a.contains(b) || b.contains(a)) continue;
      const ab = visibleBox(a);
      const bb = visibleBox(b);
      if (!ab || !bb || !onScreen(ab) || !onScreen(bb) || !hits(ab, bb)) continue;
      if (covered(a, bb) || covered(b, ab)) continue;
      overlaps.push(`${label(a)} overlaps ${label(b)}`);
      if (overlaps.length > 12) break;
    }
    if (overlaps.length > 12) break;
  }

  const clips: string[] = [];
  for (const el of document.querySelectorAll("h1,h2,h3,p,a,pre,code,button,li")) {
    if (!visible(el)) continue;
    const s = getComputedStyle(el);
    if ((s.overflowX === "hidden" || s.overflowX === "clip") && el.scrollWidth > el.clientWidth + 2) {
      clips.push(label(el));
    }
    if ((s.overflowY === "hidden" || s.overflowY === "clip") && el.scrollHeight > el.clientHeight + 2) {
      clips.push(label(el));
    }
  }

  const taps: string[] = [];
  if (innerWidth <= 400) {
    for (const el of document.querySelectorAll("a, button, summary, input, select, textarea")) {
      if (!visible(el)) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 24 || r.height < 24) taps.push(`${label(el)} is ${Math.round(r.width)}×${Math.round(r.height)}`);
    }
  }

  const anchors = [...document.querySelectorAll("a[href]")].flatMap((el) => {
    const href = el.getAttribute("href") || "";
    const hash = href.startsWith("#") ? href : new URL(href, location.href).hash;
    if (!hash || hash === "#") return [];
    return [{ hash, text: (el.textContent || "").trim().slice(0, 40) }];
  });

  return {
    overflow: document.documentElement.scrollWidth,
    viewport: innerWidth,
    overlaps,
    clips: [...new Set(clips)].slice(0, 12),
    taps: taps.slice(0, 12),
    anchors,
    images: [...document.querySelectorAll("img")].map((img) => ({
      src: img.currentSrc || img.src,
      ok: img.complete && img.naturalWidth > 0,
    })),
    hrefs: [...document.querySelectorAll("a[href]")].map((el) => (el as HTMLAnchorElement).href),
  } satisfies Audit;
};

async function scrollAudit(page: Page) {
  const problems: string[] = [];
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = await page.evaluate(() => Math.max(240, Math.floor(innerHeight * 0.7)));
  for (let y = 0; y <= height; y += step) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    const report = await page.evaluate(audit);
    if (report.overflow > report.viewport + 1) problems.push(`horizontal overflow ${report.overflow}px in a ${report.viewport}px viewport`);
    problems.push(...report.overlaps, ...report.clips);
    if (problems.length > 20) break;
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  return [...new Set(problems)];
}

test.describe("site walk", () => {
  test("every page, anchor, and asset", async ({ page, request }, info: TestInfo) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto(START);
    const hrefs = new Set<string>();
    const queue = ["/"];
    const seen = new Set<string>();
    while (queue.length) {
      const next = queue.shift()!;
      if (seen.has(next)) continue;
      seen.add(next);
      const response = await page.goto(next);
      expect(response?.status(), next).toBeLessThan(400);
      const found = await page.evaluate(() =>
        [...document.querySelectorAll("a[href]")].map((el) => (el as HTMLAnchorElement).getAttribute("href") || ""),
      );
      for (const href of found) {
        if (!href || href.startsWith("mailto:") || href.startsWith("javascript:")) continue;
        const url = new URL(href, page.url());
        if (url.origin !== new URL(page.url()).origin) {
          hrefs.add(url.href);
          continue;
        }
        const local = url.pathname || "/";
        hrefs.add(local + url.hash);
        const asset = /\.(css|js|mjs|png|svg|jpe?g|gif|webp|json|txt|map|ico)$/i.test(local);
        if (!asset && !seen.has(local)) queue.push(local);
      }
    }

    const pages = [...seen].sort();
    expect(pages.length).toBeGreaterThan(3);

    const mobile = (info.project.use.viewport?.width || 1280) <= 400;
    const dir = path.join("artifacts", "screens", info.project.name);
    await mkdir(dir, { recursive: true });

    for (const pathname of pages) {
      await page.goto(pathname);
      await page.waitForLoadState("networkidle");
      const name = (pathname === "/" ? "home" : pathname.replace(/^\//, "").replace(/\.html$/, "")) || "page";
      await page.screenshot({ path: path.join(dir, `${name}.png`), fullPage: true, scale: "css" });

      const laidOut = await scrollAudit(page);
      expect(laidOut, pathname).toEqual([]);

      const report = await page.evaluate(audit);
      if (mobile) expect(report.taps, pathname).toEqual([]);
      for (const image of report.images) expect(image.ok, image.src).toBe(true);

      const axe = await new AxeBuilder({ page }).analyze();
      const serious = axe.violations.filter((item) => item.impact === "serious" || item.impact === "critical");
      expect(
        serious.map((item) => ({
          id: item.id,
          nodes: item.nodes.slice(0, 3).map((node) => `${node.target.join(" ")} ${node.html.slice(0, 140)}`),
        })),
        pathname,
      ).toEqual([]);

      const anchors = [...new Set(report.anchors.map((item) => item.hash))];
      for (const hash of anchors) {
        await page.goto(pathname + hash);
        const hidden = await page.evaluate((targetHash) => {
          const target = document.querySelector(targetHash);
          if (!target) return `missing ${targetHash}`;
          const focus = target.matches("h1,h2,h3") ? target : (target.querySelector("h1,h2,h3") || target);
          const rect = focus.getBoundingClientRect();
          const stickies = [...document.querySelectorAll("*")].filter((el) => {
            const s = getComputedStyle(el);
            return (s.position === "sticky" || s.position === "fixed") && s.display !== "none" && el.getBoundingClientRect().height > 1 && !focus.contains(el);
          });
          for (const sticky of stickies) {
            const box = sticky.getBoundingClientRect();
            const across = box.left < rect.right - 2 && box.right > rect.left + 2;
            const over = rect.top < box.bottom - 2 && rect.bottom > box.top + 2;
            if (across && over) return `${targetHash} is under ${sticky.tagName.toLowerCase()}${sticky.getAttribute("aria-label") ? " " + sticky.getAttribute("aria-label") : ""}`;
          }
          return "";
        }, hash);
        expect(hidden, `${pathname}${hash}`).toBe("");
      }
    }

    if (info.project.name === "desktop-light") {
      for (const href of hrefs) {
        const url = href.startsWith("http") ? href : new URL(href, "http://127.0.0.1:4173").href;
        const response = await request.get(url, {
          failOnStatusCode: false,
          timeout: 20_000,
          headers: { "user-agent": "Mozilla/5.0" },
        });
        const status = response.status();
        const npmBotWall = status === 403 && url.startsWith("https://www.npmjs.com/");
        expect(npmBotWall ? 200 : status, url).toBeLessThan(400);
      }
    }

    expect(errors, "console errors").toEqual([]);
    await writeFile(path.join(dir, "pages.json"), JSON.stringify(pages, null, 2));
  });
});
