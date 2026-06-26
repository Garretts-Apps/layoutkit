import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef } from "react";
import { mergeStyles } from "./utils";
import { space, type GapSize } from "./types";

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
