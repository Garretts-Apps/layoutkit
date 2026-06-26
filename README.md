# LayoutKit

**The first layout language for the web, as pure CSS.** A single stylesheet that styles semantic `<lk-*>` tags through attribute selectors. Zero dependencies, zero JavaScript, no build step, no FOUC.

You can finally center a div. We're as shocked as you are.

## Why

LayoutKit is just CSS. You load one render-blocking stylesheet and write semantic tags in plain HTML — the browser styles them before the first paint. No JavaScript runtime, no bundler, no config, no flash of unstyled content.

- **Pure CSS.** No JavaScript, no runtime, nothing to hydrate.
- **Zero dependencies.** One stylesheet. That's the whole supply chain.
- **No build step, no config.** Link it and write tags.
- **No FOUC.** Render-blocking CSS styles your tags before the first paint.
- **Hypermedia-native.** Works with any server-rendered HTML — plain HTML, htmx, Hotwire, Rails, Django, PHP, or any framework.
- **Tiny over the wire.** ~2 KB brotli.

## Install

Link it from a CDN:

```html
<link rel="stylesheet" href="https://unpkg.com/layoutkit-css/layoutkit.css">
```

Or install the CSS package from npm and import the stylesheet:

```bash
npm install layoutkit-css
```

```js
import "layoutkit-css/layoutkit.css";
```

Or download `layoutkit.css` and vendor it locally — you own the file and can edit it freely.

## Usage

Write semantic tags in plain HTML:

```html
<lk-stack gap="lg" padding="md">
  <lk-row gap="sm" justify="between">
    <span>Logo</span>
    <nav>…</nav>
  </lk-row>
  <lk-center full-height>You can finally center a div.</lk-center>
  <lk-grid cols="3" gap="md">
    <div>1</div><div>2</div><div>3</div>
  </lk-grid>
</lk-stack>
```

## Tags

All 10 semantic tags:

`lk-stack` · `lk-row` · `lk-center` · `lk-box` · `lk-spread` · `lk-grid` · `lk-spacer` · `lk-divider` · `lk-aspect-ratio` · `lk-scroll-area`

Attributes are kebab-case: `gap`, `padding`, `align`, `justify`, `center`, `fill`, `full-height`, `wrap`, `reverse`, `cols`, `col-gap`, `row-gap`, `responsive`, `size`, `orientation`, `thickness`, `direction`.

Free-form values use inline custom properties: `--lk-ratio`, `--lk-divider-color`, `--lk-min-child-width`, `--lk-max-height`, `--lk-max-width`.

```html
<lk-aspect-ratio style="--lk-ratio: 16/9"><img src="…"></lk-aspect-ratio>
<lk-grid responsive style="--lk-min-child-width: 200px"><div>…</div></lk-grid>
```

Centering a div: the CSS final boss, defeated in one tag.

---

## The docs website (this repo)

This repository hosts the LayoutKit docs site, a [Next.js](https://nextjs.org) app. The website happens to style itself with Tailwind CSS — that's the *site's* own implementation and has nothing to do with what the LayoutKit library requires. The library is just a stylesheet.

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.
