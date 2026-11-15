import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, sep } from "node:path";

const root = process.cwd();
const port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".json": "application/json",
};

const fileFor = (pathname) => {
  const decoded = decodeURIComponent(pathname.split("?")[0]);
  const rel = decoded.replace(/^\/+/, "");
  const candidates = [];
  if (rel === "") candidates.push("index.html");
  else {
    candidates.push(rel);
    if (!extname(rel)) {
      candidates.push(`${rel}.html`);
      candidates.push(join(rel, "index.html"));
    }
  }
  for (const candidate of candidates) {
    const full = normalize(join(root, candidate));
    if (!full.startsWith(root + sep) && full !== root) continue;
    if (existsSync(full) && statSync(full).isFile()) return full;
  }
  return null;
};

createServer((req, res) => {
  const file = fileFor(req.url || "/");
  if (!file) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("not found");
    return;
  }
  res.writeHead(200, { "content-type": types[extname(file)] || "application/octet-stream" });
  createReadStream(file).pipe(res);
}).listen(port, "127.0.0.1", () => {
  console.log(`site http://127.0.0.1:${port}`);
});
