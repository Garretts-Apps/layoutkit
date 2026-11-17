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
type LayoutKitWidth = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "prose" | "full";
type LayoutKitSquare = "xs" | "sm" | "md" | "lg" | "xl";
type LayoutKitSwitchAt = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "flex";
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
  /**
   * Moves this child first or last, and only where reading-flow exists.
   * Other browsers keep source order.
   */
  spot?: "first" | "last";
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
        /** Viewport minimum, or container to fill the query container. */
        "full-height"?: boolean | "" | "container";
        wrap?: boolean | "";
        width?: LayoutKitWidth;
        /** One child centers unless this is off. scroll is a scroller that becomes a list under 32rem. */
        adapt?: "solo" | "off" | "scroll";
        sticky?: boolean | "";
        /** Hairline on the children once the sticky box is stuck. Needs scroll-state queries. */
        stuck?: boolean | "";
        /** visual follows the picture where reading-flow exists. source keeps DOM order. */
        reading?: "visual" | "source";
        reveal?: boolean | "";
        layout?: "compact";
        /** Paint each child from --lk-base and sibling-index(), where that function exists. */
        bands?: boolean | "";
      };
      "lk-row": LayoutKitGlobalAttributes & {
        gap?: LayoutKitSpace;
        padding?: LayoutKitSpace;
        align?: LayoutKitAlign;
        justify?: LayoutKitJustify;
        place?: LayoutKitPlace;
        center?: boolean | "";
        fill?: boolean | "";
        /** Viewport minimum, or container to fill the query container. */
        "full-height"?: boolean | "" | "container";
        wrap?: boolean | "";
        width?: LayoutKitWidth;
        reverse?: boolean | "";
        /** One child centers unless this is off. scroll is a scroller that becomes a list under 32rem. */
        adapt?: "solo" | "off" | "scroll";
        sticky?: boolean | "";
        /** Horizontal snap carousel. Direct children are slides. */
        snap?: boolean | "" | "mandatory" | "proximity" | "center";
        /** Slide size along the snap axis. Assumes the row gap. */
        slide?: "full" | "half" | "third" | "peek";
        /** Paint each child from --lk-base and sibling-index(), where that function exists. */
        bands?: boolean | "";
        /** Hairline on the children once the sticky row is stuck. Needs scroll-state queries. */
        stuck?: boolean | "";
        /** Outlines the current slide's contents where scroll-state queries exist. */
        mark?: "current";
        /** visual follows the picture where reading-flow exists. source keeps DOM order. */
        reading?: "visual" | "source";
      };
      "lk-center": LayoutKitGlobalAttributes & {
        place?: LayoutKitPlace;
        fill?: boolean | "";
        /** Viewport minimum, or container to fill the query container. */
        "full-height"?: boolean | "" | "container";
        inline?: boolean | "";
        horizontal?: boolean | "";
        vertical?: boolean | "";
        width?: LayoutKitWidth;
        /** Covers the containing block unless off. */
        overlay?: boolean | "" | "off";
        square?: LayoutKitSquare;
      };
      "lk-box": LayoutKitGlobalAttributes & {
        padding?: LayoutKitSpace;
        fill?: boolean | "";
        width?: LayoutKitWidth;
        flow?: LayoutKitFlow;
        sticky?: boolean | "";
        /** Hairline on the children once the sticky box is stuck. Needs scroll-state queries. */
        stuck?: boolean | "";
        square?: LayoutKitSquare;
        reveal?: boolean | "";
        layout?: "compact";
        /** Gradient texture: checker, dots, or graph paper. */
        pattern?: "checker" | "dots" | "grid";
        /** background-blend-mode for layers the author supplies. */
        blend?: "color" | "saturation" | "multiply";
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
        reveal?: boolean | "";
      };
      "lk-spread": LayoutKitGlobalAttributes & {
        align?: LayoutKitAlign;
        padding?: LayoutKitSpace;
        place?: LayoutKitPlace;
        width?: LayoutKitWidth;
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
         * On by default. off restores a non-container grid.
         * sm 24rem, bare or md 32rem, lg 48rem, xl 64rem choose when fixed cols stack.
         */
        container?: boolean | "" | "off" | "sm" | "md" | "lg" | "xl";
        /** Share the parent grid's tracks. columns is the bare-attribute default. */
        subgrid?: boolean | "" | "columns" | "rows" | "both";
        /** visual follows dense packing where reading-flow exists. source keeps DOM order. */
        reading?: "visual" | "source";
      };
      "lk-cluster": LayoutKitGlobalAttributes & {
        gap?: LayoutKitSpace;
        place?: LayoutKitPlace;
      };
      "lk-switcher": LayoutKitGlobalAttributes & {
        gap?: LayoutKitSpace;
        /** On by default. off removes query containment. */
        container?: boolean | "" | "off";
        /** Stack every child when there are more than this many. Default is 4. off disables it. */
        limit?: "off" | "2" | "3" | "4" | "5" | "6";
        /** Hard container breakpoint. flex restores the --lk-switch-at formula. Default md is 30rem. */
        at?: LayoutKitSwitchAt;
      };
      "lk-sidebar": LayoutKitGlobalAttributes & {
        gap?: LayoutKitSpace;
        side?: "end";
        /** On by default. off removes query containment. */
        container?: boolean | "" | "off";
        layout?: "compact";
        /** Stick the side panel within the viewport while the content scrolls. */
        sticky?: boolean | "";
        /** Hairline on the side panel's children once that panel is stuck. */
        stuck?: boolean | "";
      };
      "lk-cover": LayoutKitGlobalAttributes & {
        gap?: LayoutKitSpace;
        /** container fills the query container instead of the viewport. */
        size?: "container";
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
        /** Horizontal scroll areas snap unless this is off. */
        snap?: boolean | "" | "off" | "mandatory" | "proximity" | "center";
        /** Slide size along the snap axis. */
        slide?: "full" | "half" | "third" | "peek";
        /** Outlines the current slide's contents where scroll-state queries exist. */
        mark?: "current";
        /** Fades the end of a vertical scroller while more content sits below. */
        cue?: boolean | "";
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
        /** At least as wide as the anchor, where anchor-size() exists. */
        match?: "width";
        /** Native popover state. hint is the light tooltip. The element does not set display. */
        popover?: "auto" | "manual" | "hint" | "";
      };
      /** Native details/summary. panel="overlay" stacks the panel; anchor tethers it where supported. */
      "lk-disclosure": LayoutKitGlobalAttributes & {
        panel?: "overlay";
        anchor?: boolean | "";
        side?: "end";
        /** Height animation is on unless off. Reduced motion disables it. */
        animate?: boolean | "" | "off";
        /** Bordered accordion. Put the same name on each details for a mutually exclusive group. */
        look?: "panel";
      };
      /** Pairs an invoker with lk-popover. The invoker is the first child. anchor tethers the panel. */
      "lk-menu": LayoutKitGlobalAttributes & {
        anchor?: boolean | "";
        side?: "end";
        /** The panel is at least as wide as the invoker, where anchor-size() exists. */
        match?: "width";
      };
      /** Multi-column text flow. Direct children avoid breaking across columns. */
      "lk-columns": LayoutKitGlobalAttributes & {
        cols?: "2" | "3" | "4";
        gap?: LayoutKitSpace;
      };
      /**
       * Full-width frame whose center column is a measure, not a max-width.
       * Gutters grow. width sets the measure. padding replaces the fluid gutter.
       */
      "lk-frame": LayoutKitGlobalAttributes & {
        width?: LayoutKitWidth;
        padding?: LayoutKitSpace;
      };
      /** Spans the frame edge to edge. With subgrid, its children sit back in the column. */
      "lk-bleed": LayoutKitGlobalAttributes & {
        padding?: LayoutKitSpace;
      };
      /** Hover grows an item and its neighbors. Direct children are the icons. */
      "lk-dock": LayoutKitGlobalAttributes & {
        gap?: LayoutKitSpace;
      };
      /**
       * Wraps a native select. appearance: base-select applies only where supported.
       * Other browsers keep the operating-system control.
       */
      "lk-select": LayoutKitGlobalAttributes & {
        width?: LayoutKitWidth;
      };
    }
  }
}

export {};
