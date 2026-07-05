# layoutkit.nvim

Neovim plugin for [LayoutKit](https://layoutkit.dev) snippets and completions.

LayoutKit is a tiny pure-CSS layout vocabulary for readable app structure. This
plugin only inserts `lk-*` layout wrapper markup. It does not add JavaScript,
register custom elements, or provide React/Tailwind components.

## Install

### lazy.nvim

```lua
{
  "Garretts-Apps/layoutkit",
  config = function()
    require("layoutkit").setup()
  end,
  ft = { "html", "typescriptreact", "javascriptreact" },
  subdirectory = "neovim-plugin",
}
```

### Manual (any plugin manager)

Clone and add the `neovim-plugin/` directory to your runtimepath:

```bash
git clone https://github.com/Garretts-Apps/layoutkit.git ~/.local/share/nvim/layoutkit
```

Then in your `init.lua`:

```lua
vim.opt.runtimepath:append("~/.local/share/nvim/layoutkit/neovim-plugin")
require("layoutkit").setup()
```

## Features

### Snippets (requires LuaSnip)

| Trigger | Component |
|---------|-----------|
| `lkstack` | `<lk-stack>` |
| `lkrow` | `<lk-row>` |
| `lkcenter` | `<lk-center>` |
| `lkbox` | `<lk-box>` |
| `lkgrid` | `<lk-grid>` |
| `lkspread` | `<lk-spread>` |
| `lkspacer` | `<lk-spacer>` |
| `lkdivider` | `<lk-divider>` |
| `lkaspect` | `<lk-aspect>` |
| `lkscroll` | `<lk-scroll-area>` |

### Completions (requires nvim-cmp)

- LayoutKit tag names after `<`
- Gap/padding size values after `"`

### Commands

| Command | Description |
|---------|-------------|
| `:LayoutKitList` | List LayoutKit tags and attributes |

## Requirements

- Neovim >= 0.9
- Optional: [LuaSnip](https://github.com/L3MON4D3/LuaSnip) for snippets
- Optional: [nvim-cmp](https://github.com/hrsh7th/nvim-cmp) for completions
