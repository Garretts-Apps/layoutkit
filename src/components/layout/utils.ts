import type { CSSProperties } from "react";

/**
 * Merge style objects left-to-right; later objects win on conflicting
 * properties. This is the native-CSS replacement for Tailwind class
 * conflict resolution: a consumer's `style` prop is applied last, so it
 * predictably overrides a component's defaults — no dependency required.
 */
export function mergeStyles(...styles: Array<CSSProperties | undefined>): CSSProperties {
  return Object.assign({}, ...styles);
}
