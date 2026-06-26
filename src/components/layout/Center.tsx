import { forwardRef, type CSSProperties, type ElementType, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { mergeStyles } from "./utils";

interface CenterProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  /** Grow to fill available space in the parent flex container. */
  fill?: boolean;
  /** Force a minimum full-viewport height — use for full-page centering. */
  fullHeight?: boolean;
  horizontal?: boolean;
  vertical?: boolean;
  inline?: boolean;
  as?: ElementType;
}

export const Center = forwardRef<HTMLElement, CenterProps>(
  ({ children, fill, fullHeight, horizontal, vertical, inline, as: Tag = "div", style, ...props }, ref) => {
    const bothAxes = !horizontal && !vertical;
    const containerStyle: CSSProperties = {
      display: inline ? "inline-flex" : "flex",
      flexDirection: "column",
      alignItems: bothAxes || horizontal ? "center" : undefined,
      justifyContent: bothAxes || vertical ? "center" : undefined,
      flex: fill ? "1 1 0%" : undefined,
      minHeight: fullHeight ? "100vh" : undefined,
    };

    return (
      <Tag ref={ref} style={mergeStyles(containerStyle, style)} {...props}>
        {children}
      </Tag>
    );
  }
);

Center.displayName = "Center";
