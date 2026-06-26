import { forwardRef, type CSSProperties, type ElementType, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { mergeStyles } from "./utils";
import { space, type Padding } from "./types";

interface BoxProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  fill?: boolean;
  padding?: Padding;
  center?: boolean;
  as?: ElementType;
}

export const Box = forwardRef<HTMLElement, BoxProps>(
  ({ children, fill, padding = "none", center, as: Tag = "div", style, ...props }, ref) => {
    const containerStyle: CSSProperties = {
      flex: fill ? "1 1 0%" : undefined,
      display: center ? "flex" : undefined,
      alignItems: center ? "center" : undefined,
      justifyContent: center ? "center" : undefined,
      padding: padding !== "none" ? space[padding] : undefined,
    };

    return (
      <Tag ref={ref} style={mergeStyles(containerStyle, style)} {...props}>
        {children}
      </Tag>
    );
  }
);

Box.displayName = "Box";
