import { layout } from "./utils";

export interface CenterProps {
  /** Grow to fill available space in the parent flex container. */
  fill?: boolean;
  /** Force a minimum full-viewport height — use for full-page centering. */
  fullHeight?: boolean;
  horizontal?: boolean;
  vertical?: boolean;
  inline?: boolean;
}

export const Center = layout<CenterProps>(
  "Center",
  ["fill", "fullHeight", "horizontal", "vertical", "inline"],
  ({ fill, fullHeight, horizontal, vertical, inline }) => {
    const bothAxes = !horizontal && !vertical;
    return {
      display: inline ? "inline-flex" : "flex",
      flexDirection: "column",
      alignItems: bothAxes || horizontal ? "center" : undefined,
      justifyContent: bothAxes || vertical ? "center" : undefined,
      flex: fill ? "1 1 0%" : undefined,
      minHeight: fullHeight ? "100vh" : undefined,
    };
  }
);
