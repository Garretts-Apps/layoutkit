-- layoutkit.nvim — LayoutKit snippets and utilities for Neovim
-- Pure-CSS lk-* layout vocabulary snippets.

local M = {}

M.components = {
  ["lk-stack"] = {
    prefix = "lkstack",
    body = '<lk-stack gap="${1:4}">\n  $0\n</lk-stack>',
    description = "Vertical flex layout",
    props = { "gap", "align", "justify", "padding", "wrap" },
  },
  ["lk-row"] = {
    prefix = "lkrow",
    body = '<lk-row gap="${1:4}" align="${2:center}">\n  $0\n</lk-row>',
    description = "Horizontal flex layout",
    props = { "gap", "align", "justify", "padding", "wrap" },
  },
  ["lk-center"] = {
    prefix = "lkcenter",
    body = "<lk-center>\n  $0\n</lk-center>",
    description = "Center content horizontally and vertically",
    props = { "place", "min-h", "padding" },
  },
  ["lk-box"] = {
    prefix = "lkbox",
    body = '<lk-box padding="${1:4}">\n  $0\n</lk-box>',
    description = "Basic container with padding",
    props = { "padding", "surface", "border", "radius" },
  },
  ["lk-grid"] = {
    prefix = "lkgrid",
    body = '<lk-grid cols="${1:3}" gap="${2:4}" responsive>\n  $0\n</lk-grid>',
    description = "CSS Grid with responsive columns",
    props = { "cols", "gap", "responsive", "min-child-width" },
  },
  ["lk-spread"] = {
    prefix = "lkspread",
    body = '<lk-spread align="${1:center}">\n  $0\n</lk-spread>',
    description = "Push children to opposite ends (space-between)",
    props = { "align", "gap", "padding" },
  },
  ["lk-spacer"] = {
    prefix = "lkspacer",
    body = '<lk-spacer size="${1:4}"></lk-spacer>',
    description = "Flexible space between elements",
    props = { "size" },
  },
  ["lk-divider"] = {
    prefix = "lkdivider",
    body = '<lk-divider orientation="${1:horizontal}"></lk-divider>',
    description = "Horizontal or vertical divider line",
    props = { "orientation", "thickness" },
  },
  ["lk-aspect"] = {
    prefix = "lkaspect",
    body = '<lk-aspect ratio="${1:16/9}">\n  $0\n</lk-aspect>',
    description = "Constrain children to an aspect ratio",
    props = { "ratio" },
  },
  ["lk-scroll-area"] = {
    prefix = "lkscroll",
    body = '<lk-scroll-area max-h="${1:24rem}">\n  $0\n</lk-scroll-area>',
    description = "Scrollable container",
    props = { "max-h", "direction" },
  },
}

--- Setup function
---@param opts? table
function M.setup(opts)
  opts = opts or {}

  -- Register snippets with LuaSnip if available
  local has_luasnip, ls = pcall(require, "luasnip")
  if has_luasnip then
    local s = ls.snippet
    local t = ls.text_node
    local i = ls.insert_node

    local snippets = {}

    -- Layout wrapper snippets
    for name, comp in pairs(M.components) do
      table.insert(snippets, s(comp.prefix, {
        t("<" .. name), i(1, ""), t(">"),
        t({ "", "  " }), i(2),
        t({ "", "</" .. name .. ">" }),
      }))
    end

    ls.add_snippets("typescriptreact", snippets)
    ls.add_snippets("javascriptreact", snippets)
    ls.add_snippets("html", snippets)
  end

  -- Register completion source for nvim-cmp if available
  local has_cmp, cmp = pcall(require, "cmp")
  if has_cmp then
    local source = {}
    source.new = function()
      return setmetatable({}, { __index = source })
    end
    source.get_trigger_characters = function()
      return { "<", '"' }
    end
    source.complete = function(self, request, callback)
      local items = {}

      -- LayoutKit tag completions (after <)
      for name, comp in pairs(M.components) do
        table.insert(items, {
          label = name,
          kind = cmp.lsp.CompletionItemKind.Module,
          detail = "LayoutKit: " .. comp.description,
          documentation = "Props: " .. table.concat(comp.props, ", "),
        })
      end

      -- Gap/padding size completions (after ")
      local sizes = {
        "none", "px", "0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4",
        "5", "6", "7", "8", "9", "10", "11", "12", "14", "16",
        "xs", "sm", "md", "lg", "xl", "2xl", "3xl",
      }
      for _, size in ipairs(sizes) do
        table.insert(items, {
          label = size,
          kind = cmp.lsp.CompletionItemKind.Value,
          detail = "LayoutKit gap/padding size",
        })
      end

      callback({ items = items })
    end

    cmp.register_source("layoutkit", source.new())
  end

  -- User commands
  vim.api.nvim_create_user_command("LayoutKitList", function()
    local lines = { "LayoutKit tags:", "" }
    for name, comp in pairs(M.components) do
      table.insert(lines, string.format("  <%s> — %s", name, comp.description))
      table.insert(lines, string.format("    Attributes: %s", table.concat(comp.props, ", ")))
      table.insert(lines, "")
    end
    vim.api.nvim_echo({{ table.concat(lines, "\n"), "Normal" }}, true, {})
  end, { desc = "List all LayoutKit tags and attributes" })
end

return M
