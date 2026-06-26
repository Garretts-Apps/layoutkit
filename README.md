# LayoutKit

**10 semantic layout components that compile to native CSS.** Zero dependencies, no Tailwind, no build step, no config — works on import in any React 18+ app.

You can finally center a div. We're as shocked as you are.

## Why

LayoutKit emits native CSS through React's inline `style` prop. There's no Tailwind to install, no runtime to ship, and nothing to configure. Import a component and it works — in Next.js, Vite, Remix, or any React framework.

- **Zero runtime dependencies.** No `clsx`, no `tailwind-merge`, nothing.
- **No Tailwind required.** Components render plain inline styles.
- **No build step, no config.** It works the moment you import it.
- **Tiny over the wire.** ~1.4 KB brotli / ~1.7 KB gzip (~4.4 KB minified).
- **Full IntelliSense.** Typed props for every component.

## Install

```bash
npm install layoutkit-css
```

Requires React 18+. That's the whole list of requirements.

## Usage

```tsx
import { Stack, Center, Row, Grid } from "layoutkit-css";

<Stack gap="lg" padding="md">
  <Center fill>
    <h1>Hello World</h1>
  </Center>
</Stack>
```

## Components

All 10 semantic components:

`Stack` · `Row` · `Center` · `Box` · `Spread` · `Grid` · `Spacer` · `Divider` · `AspectRatio` · `ScrollArea`

Centering a div: the CSS final boss, defeated in one component.

## Scaffold instead

Prefer to own the source? Copy all 10 components into your project (shadcn-style):

```bash
npx layoutkit init
```

---

## The docs website (this repo)

This repository hosts the LayoutKit docs site, a [Next.js](https://nextjs.org) app. The website styles itself with Tailwind CSS — that's the *site's* own styling and has nothing to do with what the LayoutKit library requires.

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.
