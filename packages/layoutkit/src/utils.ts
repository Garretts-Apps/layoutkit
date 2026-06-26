import {
  createElement,
  forwardRef,
  type CSSProperties,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from "react";

/**
 * Merge style objects left-to-right; later objects win on conflicting
 * properties. The native-CSS replacement for Tailwind class conflict
 * resolution: a consumer's `style` prop is applied last, so it predictably
 * overrides a component's defaults — no dependency required.
 */
export function mergeStyles(...styles: Array<CSSProperties | undefined>): CSSProperties {
  return Object.assign({}, ...styles);
}

/**
 * Build a polymorphic layout component from a style function. Handles the
 * shared boilerplate (forwardRef, `as`, `style` merging, ref + prop/children
 * forwarding) once. `ownKeys` are the component's layout props — they drive
 * the style and are kept off the rendered DOM element; everything else
 * (className, data-*, handlers…) passes straight through.
 */
export function layout<P extends object>(
  displayName: string,
  ownKeys: readonly (keyof P)[],
  build: (props: P) => CSSProperties
) {
  const keys = new Set<PropertyKey>(ownKeys);
  const Component = forwardRef<HTMLElement, P & { as?: ElementType } & ComponentPropsWithoutRef<"div">>(
    (props, ref) => {
      const { as: Tag = "div", style, children, ...rest } = props as Record<string, unknown> & {
        as?: ElementType;
        style?: CSSProperties;
        children?: ReactNode;
      };
      const own: Record<string, unknown> = {};
      const dom: Record<string, unknown> = {};
      for (const key in rest) (keys.has(key) ? own : dom)[key] = rest[key];
      return createElement(Tag, { ref, style: mergeStyles(build(own as P), style), ...dom }, children);
    }
  );
  Component.displayName = displayName;
  return Component;
}
