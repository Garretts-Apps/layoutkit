import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef } from "react";
import { mergeStyles } from "./utils";

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
