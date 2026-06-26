import { forwardRef, type CSSProperties, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { mergeStyles } from "./utils";

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
