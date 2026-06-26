import { forwardRef, type CSSProperties, type ElementType, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { mergeStyles } from "./utils";
import { space, alignItems, type Align, type Padding } from "./types";

interface SpreadProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  align?: Align;
  padding?: Padding;
  as?: ElementType;
}

export const Spread = forwardRef<HTMLElement, SpreadProps>(
  ({ children, align = "center", padding = "none", as: Tag = "div", style, ...props }, ref) => {
    const containerStyle: CSSProperties = {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: alignItems[align],
      padding: padding !== "none" ? space[padding] : undefined,
    };

    return (
      <Tag ref={ref} style={mergeStyles(containerStyle, style)} {...props}>
        {children}
      </Tag>
    );
  }
);

Spread.displayName = "Spread";
