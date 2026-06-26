import { layout } from "./utils";
import { space, type GapSize } from "./types";

const flowMap = { row: "row", col: "column", dense: "dense" } as const;

export interface GridProps {
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
}

export const Grid = layout<GridProps>(
  "Grid",
  ["cols", "rows", "gap", "colGap", "rowGap", "flow", "placeItems", "responsive", "minChildWidth"],
  ({ cols = 1, rows, gap = "md", colGap, rowGap, flow, placeItems, responsive, minChildWidth = "250px" }) => ({
    display: "grid",
    gridTemplateColumns: responsive
      ? `repeat(auto-fit, minmax(${minChildWidth}, 1fr))`
      : `repeat(${cols}, minmax(0, 1fr))`,
    gridTemplateRows: rows ? `repeat(${rows}, minmax(0, 1fr))` : undefined,
    gap: colGap || rowGap ? undefined : space[gap],
    columnGap: colGap ? space[colGap] : undefined,
    rowGap: rowGap ? space[rowGap] : undefined,
    gridAutoFlow: flow ? flowMap[flow] : undefined,
    placeItems,
  })
);
