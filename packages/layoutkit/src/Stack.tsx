import { layout } from "./utils";
import { space, alignItems, justifyContent, type GapSize, type Align, type Justify, type Padding } from "./types";

export interface StackProps {
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
}

export const Stack = layout<StackProps>(
  "Stack",
  ["gap", "align", "justify", "center", "fill", "fullHeight", "padding", "wrap"],
  ({ gap = "md", align = "stretch", justify = "start", center, fill, fullHeight, padding = "none", wrap }) => ({
    display: "flex",
    flexDirection: "column",
    gap: space[gap],
    alignItems: center ? "center" : alignItems[align],
    justifyContent: center ? "center" : justifyContent[justify],
    flex: fill ? "1 1 0%" : undefined,
    minHeight: fullHeight ? "100vh" : undefined,
    padding: padding !== "none" ? space[padding] : undefined,
    flexWrap: wrap ? "wrap" : undefined,
  })
);
