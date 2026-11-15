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
        /** Viewport minimum: 100dvh, then 100svh, then 100vh. */
        "full-height"?: boolean | "";
        wrap?: boolean | "";
        width?: LayoutKitWidth;
        /** Center the only child. place and justify still win. */
        adapt?: "solo";
      };
      "lk-row": LayoutKitGlobalAttributes & {
        gap?: LayoutKitSpace;
        padding?: LayoutKitSpace;
        align?: LayoutKitAlign;
        justify?: LayoutKitJustify;
        place?: LayoutKitPlace;
        center?: boolean | "";
        fill?: boolean | "";
        /** Viewport minimum: 100dvh, then 100svh, then 100vh. */
        "full-height"?: boolean | "";
        wrap?: boolean | "";
        width?: LayoutKitWidth;
        reverse?: boolean | "";
        /** Center the only child. place and justify still win. */
        adapt?: "solo";
        /** Horizontal snap carousel. Direct children are slides. */
        snap?: boolean | "" | "mandatory" | "proximity" | "center";
        /** Slide size along the snap axis. Assumes the row gap. */
        slide?: "full" | "half" | "third" | "peek";
      };
      "lk-center": LayoutKitGlobalAttributes & {
        place?: LayoutKitPlace;
        fill?: boolean | "";
        /** Viewport minimum: 100dvh, then 100svh, then 100vh. */
        "full-height"?: boolean | "";
        inline?: boolean | "";
        horizontal?: boolean | "";
        vertical?: boolean | "";
        width?: LayoutKitWidth;
        /** Cover the containing block. The parent must be positioned. */
        overlay?: boolean | "";
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
        /** Bleed a direct child figure to the card edges. */
        adapt?: "figure";
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
        /** Auto-fit minimum track. Empty tracks collapse. Overrides responsive. */
        min?: "2xs" | "xs" | "sm" | "md" | "lg" | "xl";
        gap?: LayoutKitSpace;
        "col-gap"?: LayoutKitSpace;
        "row-gap"?: LayoutKitSpace;
        flow?: "row" | "col" | "dense";
        "place-items"?: "start" | "center" | "end" | "stretch";
        place?: LayoutKitPlace;
        /**
         * Query container. Fixed cols stack below a container width:
         * sm 24rem, bare or md 32rem, lg 48rem, xl 64rem.
         */
        container?: boolean | "" | "sm" | "md" | "lg" | "xl";
        /** Share the parent grid's tracks. columns is the bare-attribute default. */
        subgrid?: boolean | "" | "columns" | "rows" | "both";
      };
      "lk-cluster": LayoutKitGlobalAttributes & {
        gap?: LayoutKitSpace;
        place?: LayoutKitPlace;
      };
      "lk-switcher": LayoutKitGlobalAttributes & {
        gap?: LayoutKitSpace;
        /** Measure the switch threshold with cqi instead of a percentage. */
        container?: boolean | "";
        /** Stack every child when there are more than this many. */
        limit?: "2" | "3" | "4" | "5" | "6";
      };
      "lk-sidebar": LayoutKitGlobalAttributes & {
        gap?: LayoutKitSpace;
        side?: "end";
        /** Measure the content minimum with cqi instead of a percentage. */
        container?: boolean | "";
        /** Stick the side panel within the viewport while the content scrolls. */
        sticky?: boolean | "";
      };
      "lk-cover": LayoutKitGlobalAttributes & {
        gap?: LayoutKitSpace;
      };
      "lk-spacer": LayoutKitGlobalAttributes & {
        size?: LayoutKitSpace | "auto";
      };
      /** Default rule color follows currentColor, with a #e5e7eb fallback. */
      "lk-divider": LayoutKitGlobalAttributes & {
        orientation?: "vertical";
        thickness?: "medium" | "thick";
      };
      "lk-aspect-ratio": LayoutKitGlobalAttributes & {
        /** Replaced children fill this frame with object-fit: cover. */
        ratio?: "1/1" | "16/9" | "4/3" | "3/2" | "2/1" | "3/1" | "9/16" | "4/5";
      };
      "lk-scroll-area": LayoutKitGlobalAttributes & {
        direction?: "vertical" | "horizontal" | "both";
        "max-h"?: "sm" | "md" | "lg" | "screen";
        /** Used once snap turns the region into a flex scroller. */
        gap?: LayoutKitSpace;
        /** Snap carousel. Direct children are slides. Vertical when direction is vertical. */
        snap?: boolean | "" | "mandatory" | "proximity" | "center";
        /** Slide size along the snap axis. */
        slide?: "full" | "half" | "third" | "peek";
      };
      /** Page or nearest-scroller progress. Static bar when scroll timelines are unsupported. */
      "lk-progress": LayoutKitGlobalAttributes & {
        scope?: "root" | "nearest";
      };
      /**
       * Top-layer panel. Set the popover attribute in HTML.
       * anchor positions it when --lk-anchor matches an anchor-name, or when it sits in lk-menu[anchor].
       */
      "lk-popover": LayoutKitGlobalAttributes & {
        anchor?: boolean | "";
      };
      /** Native details/summary. panel="overlay" stacks the panel; anchor tethers it where supported. */
      "lk-disclosure": LayoutKitGlobalAttributes & {
        panel?: "overlay";
        anchor?: boolean | "";
        side?: "end";
      };
      /** Pairs an invoker with lk-popover. The invoker is the first child. anchor tethers the panel. */
      "lk-menu": LayoutKitGlobalAttributes & {
        anchor?: boolean | "";
        side?: "end";
      };
      /** Multi-column text flow. Direct children avoid breaking across columns. */
      "lk-columns": LayoutKitGlobalAttributes & {
        cols?: "2" | "3" | "4";
        gap?: LayoutKitSpace;
      };
    }
  }
}

export {};
