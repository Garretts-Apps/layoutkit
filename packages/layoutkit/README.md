# layoutkit-css

**The first layout language for the web — pure CSS.** Style semantic `<lk-*>` tags with attribute selectors. Zero dependencies, no JavaScript, no build step, no FOUC.

You can finally center a div. We're as shocked as you are.

## Use it

Link the stylesheet, then write semantic layout tags in plain HTML — works with any server, any framework, no client runtime:

```html
<link rel="stylesheet" href="https://unpkg.com/layoutkit-css/layoutkit.css">

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

Or install and bundle it:

```bash
npm install layoutkit-css
```

```js
import "layoutkit-css/layoutkit.css";
```

## Why pure CSS

- **No JavaScript, no FOUC.** A render-blocking `<link>` styles the tags before first paint. Nothing flashes, nothing hydrates.
- **Hypermedia-native.** It's just HTML + CSS — server-render the markup and it works. No client runtime, no framework.
- **Zero dependencies, no build.** Ten semantic primitives, ~2 KB over the wire (brotli).
- **Real CSS.** Tags are styled by attribute selectors (`lk-stack[gap="lg"] { gap: 1.5rem }`). Inspect it, override it, own it.

## Primitives

`lk-stack` · `lk-row` · `lk-center` · `lk-box` · `lk-spread` · `lk-grid` · `lk-spacer` · `lk-divider` · `lk-aspect-ratio` · `lk-scroll-area`

Attributes are kebab-case: `gap`, `padding`, `align`, `justify`, `center`, `fill`, `full-height`, `wrap`, `reverse`, `cols`, `col-gap`, `row-gap`, `flow`, `place-items`, `responsive`, `size`, `orientation`, `thickness`, `direction`. Free-form values use custom properties: `--lk-ratio`, `--lk-divider-color`, `--lk-min-child-width`, `--lk-max-height`, `--lk-max-width`.

Centering a div: the CSS final boss, defeated in one tag.

## Good to know

Pure CSS means there's no JavaScript to add semantics or fill children — a deliberate trade for zero runtime and no FOUC:

- **Accessibility.** `lk-divider`/`lk-spacer` are presentational by default. If a divider needs to be announced, add the role yourself: `<lk-divider role="separator" aria-orientation="vertical">`.
- **AspectRatio children.** The box sizes itself via `aspect-ratio`; size the child to fill it, e.g. `<lk-aspect-ratio style="--lk-ratio: 16/9"><img style="width:100%;height:100%;object-fit:cover"></lk-aspect-ratio>`.
- **Grid range.** `cols` and `rows` are enumerated 1–12. For more columns, use `responsive` (`auto-fit`) with `--lk-min-child-width`.

## Build

The stylesheet is generated from `gen.mjs` (the spacing scale and selectors are computed, not hand-listed):

```bash
npm run build   # node gen.mjs -> layoutkit.css
```

## License

MIT
