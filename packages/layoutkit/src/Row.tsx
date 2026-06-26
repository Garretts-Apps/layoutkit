import { forwardRef, type CSSProperties, type ElementType, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { mergeStyles } from "./utils";
import { space, alignItems, justifyContent, type GapSize, type Align, type Justify, type Padding } from "./types";

interface RowProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
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
  reverse?: boolean;
  as?: ElementType;
}

export const Row = forwardRef<HTMLElement, RowProps>(
  ({ children, gap = "md", align = "center", justify = "start", center, fill, fullHeight, padding = "none", wrap, reverse, as: Tag = "div", style, ...props }, ref) => {
    const containerStyle: CSSProperties = {
      display: "flex",
      flexDirection: reverse ? "row-reverse" : "row",
      gap: space[gap],
      alignItems: center ? "center" : alignItems[align],
      justifyContent: center ? "center" : justifyContent[justify],
      flex: fill ? "1 1 0%" : undefined,
      minHeight: fullHeight ? "100vh" : undefined,
      padding: padding !== "none" ? space[padding] : undefined,
      flexWrap: wrap ? "wrap" : undefined,
    };

    return (
      <Tag ref={ref} style={mergeStyles(containerStyle, style)} {...props}>
        {children}
      </Tag>
    );
  }
);

Row.displayName = "Row";
