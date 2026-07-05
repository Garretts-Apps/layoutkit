# Contributing

LayoutKit is intentionally small: a dependency-free, pure-CSS layout vocabulary
for readable app structure. Contributions should preserve that scope.

## Design Rules

- Add a tag only if it represents a common layout primitive.
- Add an attribute only if it maps to stable layout behavior.
- Do not add attributes for branding, colors, typography systems, shadows,
  one-off component variants, or application-specific styling.
- Do not duplicate every CSS property as an attribute.
- Prefer a small finite scale over arbitrary values.
- Preserve readable markup.
- Preserve low specificity.
- Preserve cascade-layer friendliness.
- Preserve zero JavaScript.
- Preserve zero dependencies.

## Out Of Scope

LayoutKit should not become a component library, design system, button kit,
form kit, icon system, animation library, or app shell. When a layout needs named
grid areas, complex container-query logic, dense responsive rules, or
component-specific behavior, use normal CSS.
