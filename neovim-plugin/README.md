# layoutkit.nvim

Neovim plugin for [LayoutKit](https://layoutkit.dev) — snippets, completions, and utilities for the 10 semantic layout components.

## Install

### lazy.nvim

```lua
{
  "Garretts-Apps/layoutkit",
  config = function()
    require("layoutkit").setup()
  end,
  ft = { "typescriptreact", "javascriptreact" },
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
| `lkimport` | Import statement |
| `lkstack` | `<Stack>` |
| `lkrow` | `<Row>` |
| `lkcenter` | `<Center>` |
| `lkbox` | `<Box>` |
| `lkgrid` | `<Grid>` |
| `lkspread` | `<Spread>` |
| `lkspacer` | `<Spacer />` |
| `lkdivider` | `<Divider />` |
| `lkaspect` | `<AspectRatio>` |
| `lkscroll` | `<ScrollArea>` |

### Completions (requires nvim-cmp)

- Component names after `<`
- Gap/padding size values after `"`

### Commands

| Command | Description |
|---------|-------------|
| `:LayoutKitList` | List all components and their props |
| `:LayoutKitImport` | Insert full import statement at cursor |

## Requirements

- Neovim >= 0.9
- Optional: [LuaSnip](https://github.com/L3MON4D3/LuaSnip) for snippets
- Optional: [nvim-cmp](https://github.com/hrsh7th/nvim-cmp) for completions
