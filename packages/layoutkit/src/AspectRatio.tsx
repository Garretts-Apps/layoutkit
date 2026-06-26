import { forwardRef, type CSSProperties, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { mergeStyles } from "./utils";

interface AspectRatioProps extends ComponentPropsWithoutRef<"div"> {
  ratio?: number;
  children: ReactNode;
}

const fillStyle: CSSProperties = { position: "absolute", inset: 0 };

export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = 1, children, style, ...props }, ref) => {
    const containerStyle: CSSProperties = {
      position: "relative",
      paddingBottom: `${(1 / ratio) * 100}%`,
    };

    return (
      <div ref={ref} style={mergeStyles(containerStyle, style)} {...props}>
        <div style={fillStyle}>{children}</div>
      </div>
    );
  }
);

AspectRatio.displayName = "AspectRatio";
