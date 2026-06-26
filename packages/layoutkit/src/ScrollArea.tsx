import { layout } from "./utils";

export interface ScrollAreaProps {
  direction?: "vertical" | "horizontal" | "both";
  /** Any CSS length, e.g. "24rem" or "400px". */
  maxHeight?: string;
  maxWidth?: string;
}

export const ScrollArea = layout<ScrollAreaProps>(
  "ScrollArea",
  ["direction", "maxHeight", "maxWidth"],
  ({ direction = "vertical", maxHeight, maxWidth }) => ({
    overflowX: direction === "horizontal" || direction === "both" ? "auto" : undefined,
    overflowY: direction === "vertical" || direction === "both" ? "auto" : undefined,
    maxHeight,
    maxWidth,
  })
);
