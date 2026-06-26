import { forwardRef, type CSSProperties, type ElementType, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { mergeStyles } from "./utils";
import { space, type GapSize } from "./types";

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
