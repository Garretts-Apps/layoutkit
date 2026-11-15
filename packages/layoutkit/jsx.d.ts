type LayoutKitSpace =
  | "none"
  | "px"
  | "0.5"
  | "1"
  | "1.5"
  | "2"
  | "2.5"
  | "3"
  | "3.5"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12"
  | "14"
  | "16"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl";

type LayoutKitAlign = "start" | "center" | "end" | "stretch" | "baseline";
type LayoutKitJustify = "start" | "center" | "end" | "between" | "around" | "evenly";
type LayoutKitPlace =
  | "center"
  | "top"
  | "bottom"
  | "start"
  | "end"
  | "top-start"
  | "top-end"
  | "bottom-start"
  | "bottom-end"
  | "between"
  | "around"
  | "evenly";
type LayoutKitWidth = "xs" | "sm" | "md" | "lg" | "xl" | "prose" | "full";
type LayoutKitText = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
type LayoutKitWeight = "normal" | "medium" | "semibold" | "bold";
type LayoutKitFlow = LayoutKitSpace | boolean | "";

interface LayoutKitGlobalAttributes {
  class?: string;
  className?: string;
  children?: unknown;
  id?: string;
  role?: string;
  style?: string | Record<string, string | number | undefined>;
  title?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-hidden"?: boolean | "true" | "false";
  "lk-text"?: LayoutKitText;
  "lk-weight"?: LayoutKitWeight;
  [attribute: `aria-${string}`]: unknown;
  [attribute: `data-${string}`]: unknown;
}

declare global {
  namespace JSX {
    interface IntrinsicAttributes extends LayoutKitGlobalAttributes {}

    interface IntrinsicElements {
      "lk-stack": LayoutKitGlobalAttributes & {
        gap?: LayoutKitSpace;
        padding?: LayoutKitSpace;
        align?: LayoutKitAlign;
        justify?: LayoutKitJustify;
        place?: LayoutKitPlace;
        center?: boolean | "";
        fill?: boolean | "";
        "full-height"?: boolean | "";
        wrap?: boolean | "";
        width?: LayoutKitWidth;
      };
      "lk-row": LayoutKitGlobalAttributes & {
        gap?: LayoutKitSpace;
        padding?: LayoutKitSpace;
        align?: LayoutKitAlign;
        justify?: LayoutKitJustify;
        place?: LayoutKitPlace;
        center?: boolean | "";
        fill?: boolean | "";
        "full-height"?: boolean | "";
        wrap?: boolean | "";
        width?: LayoutKitWidth;
        reverse?: boolean | "";
      };
      "lk-center": LayoutKitGlobalAttributes & {
        place?: LayoutKitPlace;
        fill?: boolean | "";
        "full-height"?: boolean | "";
        inline?: boolean | "";
        horizontal?: boolean | "";
        vertical?: boolean | "";
        width?: LayoutKitWidth;
      };
      "lk-box": LayoutKitGlobalAttributes & {
        padding?: LayoutKitSpace;
        fill?: boolean | "";
        width?: LayoutKitWidth;
        flow?: LayoutKitFlow;
      };
      "lk-card": LayoutKitGlobalAttributes & {
        padding?: LayoutKitSpace;
        width?: LayoutKitWidth;
        flow?: LayoutKitFlow;
        radius?: "none" | "sm" | "md" | "lg" | "full";
        surface?: boolean | "";
        border?: "none";
      };
      "lk-spread": LayoutKitGlobalAttributes & {
        align?: LayoutKitAlign;
        padding?: LayoutKitSpace;
        place?: LayoutKitPlace;
      };
      "lk-grid": LayoutKitGlobalAttributes & {
        cols?: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12";
        rows?: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12";
        responsive?: boolean | "";
        min?: "2xs" | "xs" | "sm" | "md" | "lg" | "xl";
        gap?: LayoutKitSpace;
        "col-gap"?: LayoutKitSpace;
        "row-gap"?: LayoutKitSpace;
        flow?: "row" | "col" | "dense";
        "place-items"?: "start" | "center" | "end" | "stretch";
        place?: LayoutKitPlace;
      };
      "lk-cluster": LayoutKitGlobalAttributes & {
        gap?: LayoutKitSpace;
        place?: LayoutKitPlace;
      };
      "lk-switcher": LayoutKitGlobalAttributes & {
        gap?: LayoutKitSpace;
      };
      "lk-sidebar": LayoutKitGlobalAttributes & {
        gap?: LayoutKitSpace;
        side?: "end";
      };
      "lk-cover": LayoutKitGlobalAttributes & {
        gap?: LayoutKitSpace;
      };
      "lk-spacer": LayoutKitGlobalAttributes & {
        size?: LayoutKitSpace | "auto";
      };
      "lk-divider": LayoutKitGlobalAttributes & {
        orientation?: "vertical";
        thickness?: "medium" | "thick";
      };
      "lk-aspect-ratio": LayoutKitGlobalAttributes & {
        ratio?: "1/1" | "16/9" | "4/3" | "3/2" | "2/1" | "3/1" | "9/16" | "4/5";
      };
      "lk-scroll-area": LayoutKitGlobalAttributes & {
        direction?: "vertical" | "horizontal" | "both";
        "max-h"?: "sm" | "md" | "lg" | "screen";
      };
    }
  }
}

export {};
