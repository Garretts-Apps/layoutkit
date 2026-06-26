/**
 * layoutkit-css v0.1.0 — vendored single-file build.
 *
 * The first layout language for the web: 10 semantic components that compile
 * to native CSS. Zero dependencies, no build step, no Tailwind required.
 *
 * You own this file — edit it freely. Requires React 18+.
 *
 * Docs:    https://layoutkit.dev
 * Source:  https://github.com/Garrett-s-Apps/layoutkit
 * License: MIT
 *
 * Generated from packages/layoutkit/src — do not expect hand-edits here to
 * flow back upstream; this is a snapshot for vendoring.
 */

import { forwardRef, type CSSProperties, type ElementType, type ReactNode, type ComponentPropsWithoutRef } from "react";

// ---------------------------------------------------------------------------
// types.ts
// ---------------------------------------------------------------------------

export type GapSize =
  | "none" | "px" | "0.5"
  | "1" | "1.5" | "2" | "2.5" | "3" | "3.5" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12" | "14" | "16"
  | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

export type Padding =
  | "none" | "px" | "0.5"
  | "1" | "1.5" | "2" | "2.5" | "3" | "3.5" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12" | "14" | "16"
  | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export type Align = "start" | "center" | "end" | "stretch" | "baseline";
export type Justify = "start" | "center" | "end" | "between" | "around" | "evenly";

// Spacing scale -> native CSS length. The familiar 0.25rem-per-step scale, so
// every value is generated (`n * 0.25rem`) rather than hand-listed; semantic
// aliases reuse the numeric steps. Serves `gap`, `padding`, and `Spacer`.
const rem = (step: string) => `${Number(step) * 0.25}rem`;
const NUMERIC = ["0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4", "5", "6", "7", "8", "9", "10", "11", "12", "14", "16"];
const ALIAS: Record<string, string> = { xs: "1", sm: "2", md: "4", lg: "6", xl: "8", "2xl": "12", "3xl": "16" };

export const space = {
  none: "0",
  px: "1px",
  ...Object.fromEntries(NUMERIC.map((n) => [n, rem(n)])),
  ...Object.fromEntries(Object.entries(ALIAS).map(([k, n]) => [k, rem(n)])),
} as Record<GapSize, string>;

/** `Align` prop value -> CSS `align-items` value. */
export const alignItems: Record<Align, string> = {
  start: "flex-start", center: "center", end: "flex-end", stretch: "stretch", baseline: "baseline",
};

/** `Justify` prop value -> CSS `justify-content` value. */
export const justifyContent: Record<Justify, string> = {
  start: "flex-start", center: "center", end: "flex-end",
  between: "space-between", around: "space-around", evenly: "space-evenly",
};

// ---------------------------------------------------------------------------
// utils.ts
// ---------------------------------------------------------------------------

/**
 * Merge style objects left-to-right; later objects win on conflicting
 * properties. This is the native-CSS replacement for Tailwind class
 * conflict resolution: a consumer's `style` prop is applied last, so it
 * predictably overrides a component's defaults — no dependency required.
 */
export function mergeStyles(...styles: Array<CSSProperties | undefined>): CSSProperties {
  return Object.assign({}, ...styles);
}

// ---------------------------------------------------------------------------
// Box.tsx
// ---------------------------------------------------------------------------

interface BoxProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  fill?: boolean;
  padding?: Padding;
  center?: boolean;
  as?: ElementType;
}

export const Box = forwardRef<HTMLElement, BoxProps>(
  ({ children, fill, padding = "none", center, as: Tag = "div", style, ...props }, ref) => {
    const containerStyle: CSSProperties = {
      flex: fill ? "1 1 0%" : undefined,
      display: center ? "flex" : undefined,
      alignItems: center ? "center" : undefined,
      justifyContent: center ? "center" : undefined,
      padding: padding !== "none" ? space[padding] : undefined,
    };

    return (
      <Tag ref={ref} style={mergeStyles(containerStyle, style)} {...props}>
        {children}
      </Tag>
    );
  }
);

Box.displayName = "Box";

// ---------------------------------------------------------------------------
// Center.tsx
// ---------------------------------------------------------------------------

interface CenterProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  /** Grow to fill available space in the parent flex container. */
  fill?: boolean;
  /** Force a minimum full-viewport height — use for full-page centering. */
  fullHeight?: boolean;
  horizontal?: boolean;
  vertical?: boolean;
  inline?: boolean;
  as?: ElementType;
}

export const Center = forwardRef<HTMLElement, CenterProps>(
  ({ children, fill, fullHeight, horizontal, vertical, inline, as: Tag = "div", style, ...props }, ref) => {
    const bothAxes = !horizontal && !vertical;
    const containerStyle: CSSProperties = {
      display: inline ? "inline-flex" : "flex",
      flexDirection: "column",
      alignItems: bothAxes || horizontal ? "center" : undefined,
      justifyContent: bothAxes || vertical ? "center" : undefined,
      flex: fill ? "1 1 0%" : undefined,
      minHeight: fullHeight ? "100vh" : undefined,
    };

    return (
      <Tag ref={ref} style={mergeStyles(containerStyle, style)} {...props}>
        {children}
      </Tag>
    );
  }
);

Center.displayName = "Center";

// ---------------------------------------------------------------------------
// Stack.tsx
// ---------------------------------------------------------------------------

interface StackProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  gap?: GapSize;
  align?: Align;
  justify?: Justify;
  center?: boolean;
  /** Grow to fill available space in the parent flex container. */
  fill?: boolean;
  /** Force a minimum full-viewport height. */
  fullHeight?: boolean;
  padding?: Padding;
  wrap?: boolean;
  as?: ElementType;
}

export const Stack = forwardRef<HTMLElement, StackProps>(
  ({ children, gap = "md", align = "stretch", justify = "start", center, fill, fullHeight, padding = "none", wrap, as: Tag = "div", style, ...props }, ref) => {
    const containerStyle: CSSProperties = {
      display: "flex",
      flexDirection: "column",
      gap: space[gap],
      alignItems: center ? "center" : alignItems[align],
      justifyContent: center ? "center" : justifyContent[justify],
      flex: fill ? "1 1 0%" : undefined,
      minHeight: fullHeight ? "100vh" : undefined,
      padding: padding !== "none" ? space[padding] : undefined,
      flexWrap: wrap ? "wrap" : undefined,
    };

    return (
      <Tag ref={ref} style={mergeStyles(containerStyle, style)} {...props}>
        {children}
      </Tag>
    );
  }
);

Stack.displayName = "Stack";

// ---------------------------------------------------------------------------
// Row.tsx
// ---------------------------------------------------------------------------

interface RowProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  gap?: GapSize;
  align?: Align;
  justify?: Justify;
  center?: boolean;
  /** Grow to fill available space in the parent flex container. */
  fill?: boolean;
  /** Force a minimum full-viewport height. */
  fullHeight?: boolean;
  padding?: Padding;
  wrap?: boolean;
  reverse?: boolean;
  as?: ElementType;
}

export const Row = forwardRef<HTMLElement, RowProps>(
  ({ children, gap = "md", align = "center", justify = "start", center, fill, fullHeight, padding = "none", wrap, reverse, as: Tag = "div", style, ...props }, ref) => {
    const containerStyle: CSSProperties = {
      display: "flex",
      flexDirection: reverse ? "row-reverse" : "row",
      gap: space[gap],
      alignItems: center ? "center" : alignItems[align],
      justifyContent: center ? "center" : justifyContent[justify],
      flex: fill ? "1 1 0%" : undefined,
      minHeight: fullHeight ? "100vh" : undefined,
      padding: padding !== "none" ? space[padding] : undefined,
      flexWrap: wrap ? "wrap" : undefined,
    };

    return (
      <Tag ref={ref} style={mergeStyles(containerStyle, style)} {...props}>
        {children}
      </Tag>
    );
  }
);

Row.displayName = "Row";

// ---------------------------------------------------------------------------
// Spread.tsx
// ---------------------------------------------------------------------------

interface SpreadProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  align?: Align;
  padding?: Padding;
  as?: ElementType;
}

export const Spread = forwardRef<HTMLElement, SpreadProps>(
  ({ children, align = "center", padding = "none", as: Tag = "div", style, ...props }, ref) => {
    const containerStyle: CSSProperties = {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: alignItems[align],
      padding: padding !== "none" ? space[padding] : undefined,
    };

    return (
      <Tag ref={ref} style={mergeStyles(containerStyle, style)} {...props}>
        {children}
      </Tag>
    );
  }
);

Spread.displayName = "Spread";

// ---------------------------------------------------------------------------
// Grid.tsx
// ---------------------------------------------------------------------------

const flowMap = { row: "row", col: "column", dense: "dense" } as const;

interface GridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  /** Fixed column count. For breakpoint-free responsiveness use `responsive` + `minChildWidth`. */
  cols?: number;
  rows?: number;
  gap?: GapSize;
  colGap?: GapSize;
  rowGap?: GapSize;
  flow?: "row" | "col" | "dense";
  placeItems?: "start" | "center" | "end" | "stretch";
  /** Auto-fit columns that wrap based on available width (no media queries needed). */
  responsive?: boolean;
  minChildWidth?: string;
  as?: ElementType;
}

export const Grid = forwardRef<HTMLElement, GridProps>(
  ({ children, cols = 1, rows, gap = "md", colGap, rowGap, flow, placeItems, responsive, minChildWidth = "250px", as: Tag = "div", style, ...props }, ref) => {
    const perAxisGap = Boolean(colGap || rowGap);
    const containerStyle: CSSProperties = {
      display: "grid",
      gridTemplateColumns: responsive
        ? `repeat(auto-fit, minmax(${minChildWidth}, 1fr))`
        : `repeat(${cols}, minmax(0, 1fr))`,
      gridTemplateRows: rows ? `repeat(${rows}, minmax(0, 1fr))` : undefined,
      gap: perAxisGap ? undefined : space[gap],
      columnGap: colGap ? space[colGap] : undefined,
      rowGap: rowGap ? space[rowGap] : undefined,
      gridAutoFlow: flow ? flowMap[flow] : undefined,
      placeItems: placeItems,
    };

    return (
      <Tag ref={ref} style={mergeStyles(containerStyle, style)} {...props}>
        {children}
      </Tag>
    );
  }
);

Grid.displayName = "Grid";

// ---------------------------------------------------------------------------
// Spacer.tsx
// ---------------------------------------------------------------------------

interface SpacerProps extends ComponentPropsWithoutRef<"div"> {
  size?: GapSize | "auto";
}

export const Spacer = forwardRef<HTMLDivElement, SpacerProps>(
  ({ size = "auto", style, ...props }, ref) => {
    const spacerStyle: CSSProperties =
      size === "auto" ? { flex: "1 1 0%" } : { height: space[size] };

    return (
      <div ref={ref} aria-hidden="true" style={mergeStyles(spacerStyle, style)} {...props} />
    );
  }
);

Spacer.displayName = "Spacer";

// ---------------------------------------------------------------------------
// Divider.tsx
// ---------------------------------------------------------------------------

const thicknessWidth = { thin: "1px", medium: "2px", thick: "4px" } as const;

interface DividerProps extends ComponentPropsWithoutRef<"div"> {
  orientation?: "horizontal" | "vertical";
  /** Any CSS color. Defaults to a light gray. */
  color?: string;
  thickness?: "thin" | "medium" | "thick";
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({ orientation = "horizontal", color = "#e5e7eb", thickness = "thin", style, ...props }, ref) => {
    const width = thicknessWidth[thickness];
    const dividerStyle: CSSProperties =
      orientation === "horizontal"
        ? { width: "100%", borderTopStyle: "solid", borderTopWidth: width, borderTopColor: color }
        : { height: "100%", alignSelf: "stretch", borderLeftStyle: "solid", borderLeftWidth: width, borderLeftColor: color };

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        style={mergeStyles(dividerStyle, style)}
        {...props}
      />
    );
  }
);

Divider.displayName = "Divider";

// ---------------------------------------------------------------------------
// AspectRatio.tsx
// ---------------------------------------------------------------------------

interface AspectRatioProps extends ComponentPropsWithoutRef<"div"> {
  ratio?: number;
  children: ReactNode;
}

const fillStyle: CSSProperties = { position: "absolute", inset: 0 };

export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = 1, children, style, ...props }, ref) => {
    const containerStyle: CSSProperties = {
      position: "relative",
      paddingBottom: `${(1 / ratio) * 100}%`,
    };

    return (
      <div ref={ref} style={mergeStyles(containerStyle, style)} {...props}>
        <div style={fillStyle}>{children}</div>
      </div>
    );
  }
);

AspectRatio.displayName = "AspectRatio";

// ---------------------------------------------------------------------------
// ScrollArea.tsx
// ---------------------------------------------------------------------------

interface ScrollAreaProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  direction?: "vertical" | "horizontal" | "both";
  /** Any CSS length, e.g. "24rem" or "400px". */
  maxHeight?: string;
  maxWidth?: string;
}

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ children, direction = "vertical", maxHeight, maxWidth, style, ...props }, ref) => {
    const scrollStyle: CSSProperties = {
      overflowX: direction === "horizontal" || direction === "both" ? "auto" : undefined,
      overflowY: direction === "vertical" || direction === "both" ? "auto" : undefined,
      maxHeight,
      maxWidth,
    };

    return (
      <div ref={ref} style={mergeStyles(scrollStyle, style)} {...props}>
        {children}
      </div>
    );
  }
);

ScrollArea.displayName = "ScrollArea";
