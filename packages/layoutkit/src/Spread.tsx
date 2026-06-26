import { layout } from "./utils";
import { space, alignItems, type Align, type Padding } from "./types";

export interface SpreadProps {
  align?: Align;
  padding?: Padding;
}

export const Spread = layout<SpreadProps>(
  "Spread",
  ["align", "padding"],
  ({ align = "center", padding = "none" }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: alignItems[align],
    padding: padding !== "none" ? space[padding] : undefined,
  })
);
