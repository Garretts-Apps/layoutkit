export type GapSize =
  | "none" | "px" | "0.5"
  | "1" | "1.5" | "2" | "2.5" | "3" | "3.5" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12" | "14" | "16"
  | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

export type Padding =
  | "none" | "px" | "0.5"
  | "1" | "1.5" | "2" | "2.5" | "3" | "3.5" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12" | "14" | "16"
  | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export type Align = "start" | "center" | "end" | "stretch" | "baseline";
export type Justify = "start" | "center" | "end" | "between" | "around" | "evenly";

// Spacing scale -> native CSS length. The familiar 0.25rem-per-step scale, so
// every value is generated (`n * 0.25rem`) rather than hand-listed; semantic
// aliases reuse the numeric steps. Serves `gap`, `padding`, and `Spacer`.
const rem = (step: string) => `${Number(step) * 0.25}rem`;
const NUMERIC = ["0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4", "5", "6", "7", "8", "9", "10", "11", "12", "14", "16"];
const ALIAS: Record<string, string> = { xs: "1", sm: "2", md: "4", lg: "6", xl: "8", "2xl": "12", "3xl": "16" };

export const space = {
  none: "0",
  px: "1px",
  ...Object.fromEntries(NUMERIC.map((n) => [n, rem(n)])),
  ...Object.fromEntries(Object.entries(ALIAS).map(([k, n]) => [k, rem(n)])),
} as Record<GapSize, string>;

/** `Align` prop value -> CSS `align-items` value. */
export const alignItems: Record<Align, string> = {
  start: "flex-start", center: "center", end: "flex-end", stretch: "stretch", baseline: "baseline",
};

/** `Justify` prop value -> CSS `justify-content` value. */
export const justifyContent: Record<Justify, string> = {
  start: "flex-start", center: "center", end: "flex-end",
  between: "space-between", around: "space-around", evenly: "space-evenly",
};
