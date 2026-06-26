import { layout } from "./utils";
import { space, type Padding } from "./types";

export interface BoxProps {
  fill?: boolean;
  padding?: Padding;
  center?: boolean;
}

export const Box = layout<BoxProps>(
  "Box",
  ["fill", "padding", "center"],
  ({ fill, padding = "none", center }) => ({
    flex: fill ? "1 1 0%" : undefined,
    display: center ? "flex" : undefined,
    alignItems: center ? "center" : undefined,
    justifyContent: center ? "center" : undefined,
    padding: padding !== "none" ? space[padding] : undefined,
  })
);
