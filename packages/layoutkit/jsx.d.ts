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

interface LayoutKitGlobalAttributes {
  class?: string;
  id?: string;
  role?: string;
  style?: string | Record<string, string | number>;
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

interface LayoutKitCommonAttributes extends LayoutKitGlobalAttributes {
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
}

interface LayoutKitGridAttributes extends LayoutKitCommonAttributes {
  cols?: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12";
  rows?: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12";
  responsive?: boolean | "";
  min?: "2xs" | "xs" | "sm" | "md" | "lg" | "xl";
  "col-gap"?: LayoutKitSpace;
  "row-gap"?: LayoutKitSpace;
  flow?: "row" | "col" | "dense";
  "place-items"?: "start" | "center" | "end" | "stretch";
}

interface LayoutKitCardAttributes extends LayoutKitCommonAttributes {
  radius?: "none" | "sm" | "md" | "lg" | "full";
  surface?: boolean | "";
  border?: "none";
  flow?: LayoutKitSpace | boolean | "";
}

declare global {
  namespace JSX {
    interface IntrinsicAttributes extends LayoutKitGlobalAttributes {}

    interface IntrinsicElements {
      "lk-stack": LayoutKitCommonAttributes;
      "lk-row": LayoutKitCommonAttributes & { reverse?: boolean | "" };
      "lk-center": LayoutKitCommonAttributes & { inline?: boolean | ""; horizontal?: boolean | ""; vertical?: boolean | "" };
      "lk-box": LayoutKitCommonAttributes & { flow?: LayoutKitSpace | boolean | "" };
      "lk-card": LayoutKitCardAttributes;
      "lk-spread": LayoutKitCommonAttributes;
      "lk-grid": LayoutKitGridAttributes;
      "lk-cluster": LayoutKitCommonAttributes;
      "lk-switcher": LayoutKitCommonAttributes;
      "lk-sidebar": LayoutKitCommonAttributes & { side?: "end" };
      "lk-cover": LayoutKitCommonAttributes;
      "lk-spacer": LayoutKitGlobalAttributes & { size?: LayoutKitSpace | "auto" };
      "lk-divider": LayoutKitGlobalAttributes & { orientation?: "vertical"; thickness?: "medium" | "thick" };
      "lk-aspect-ratio": LayoutKitGlobalAttributes & { ratio?: "1/1" | "16/9" | "4/3" | "3/2" | "2/1" | "3/1" | "9/16" | "4/5" };
      "lk-scroll-area": LayoutKitGlobalAttributes & { direction?: "vertical" | "horizontal" | "both"; "max-h"?: "sm" | "md" | "lg" | "screen" };
    }
  }
}

export {};
