/**
 * UDS Design Tokens — single source of truth.
 *
 * Extracted 1:1 from the Figma "Core Foundation v1.0.0" file
 * (fileKey `CzlSHJumy6SGUMdTIvSjq8`). CSS variable names mirror the Figma token
 * paths exactly: `color/container/brand/primary` → `--color-container-brand-primary`.
 * camelCase segments are kebab-cased (`primaryHigh` → `primary-high`).
 *
 * Layers:
 *   - `primitive`: raw palette values. Reference only — not emitted as utilities.
 *   - `color`:     semantic color tokens (LIGHT mode). Emitted as CSS vars + Tailwind theme.
 *   - `radius` / `spacing` / `fontSize` / `font`: foundation scales.
 *
 * NOTE — dark mode: the Figma collection is dual-mode (light + dark). Only light
 * values are transcribed here; `get_variable_defs` reads a single mode at a time.
 * A complete dark harvest (via the Plugin API `valuesByMode`) is a follow-up task.
 * The four dark values confirmed so far are recorded in `colorDarkKnown` below.
 */

// ── Primitives (reference; incomplete ramps — only referenced steps captured) ──
export const primitive = {
  neutralGray: {
    "light-10": "#fcfcfc",
    "light-800": "#474747",
    "light-900": "#1a1a1a",
    "dark-50": "#1f1f1f",
  },
  magenta: {
    300: "#fa2993",
    500: "#e10975",
    700: "#a30554",
    800: "#72043b",
  },
  alpha: {
    "black-8": "#1a1a1a14",
    "black-16": "#1a1a1a29",
    "black-40": "#1a1a1a66",
  },
} as const;

// ── Semantic colors (LIGHT mode). Keys = kebab of the Figma path after `color/`. ──
export const color = {
  // text
  "text-base-primary": "#1a1a1a",
  "text-base-secondary": "#474747",
  "text-base-tertiary": "#696969",
  "text-base-white": "#ffffff",
  "text-base-black": "#1a1a1a",
  "text-base-inverse-white": "#ffffff",
  "text-brand-primary": "#fa2993",
  "text-brand-primary-high": "#e10975",
  "text-brand-primary-higher": "#d5076e",
  // background
  "background-base-low": "#fcfcfc",
  "background-base-low-level1": "#fcfcfc",
  "background-base-low-level2": "#fcfcfc",
  "background-base-low-level3": "#fcfcfc",
  "background-base-high": "#f2f2f2",
  "background-base-high-level1": "#f2f2f2",
  // container
  "container-base-low": "#fcfcfc",
  "container-base-low-level1": "#fcfcfc",
  "container-base-high": "#f2f2f2",
  "container-base-high-level2": "#f2f2f2",
  "container-base-higher-level1": "#e0e0e0",
  "container-base-black": "#1a1a1a",
  "container-base-inverse-white": "#050505",
  "container-brand-primary": "#fa2993",
  "container-brand-primary-high": "#e10975",
  "container-brand-secondary": "#1a1a1a",
  // border
  "border-base-low": "#ebebeb",
  "border-base-low-level1": "#ebebeb",
  "border-base-higher": "#bdbdbd",
  "border-base-highest": "#1a1a1a",
  "border-base-highest-level1": "#1a1a1a",
  "border-brand-primary": "#fa2993",
  "border-brand-secondary": "#1a1a1a",
  // frame
  "frame-base-low": "#fcfcfc",
  "frame-base-high": "#f2f2f2",
  // icon
  "icon-base-primary": "#1a1a1a",
  "icon-base-tertiary": "#969696",
  // status
  "status-text-positive": "#018303",
  "status-text-negative": "#da0707",
  "status-text-informative": "#064ad0",
  "status-text-disabled": "#1a1a1a29",
  "status-border-negative": "#e51a1a",
  "status-border-selected": "#1a1a1a",
  "status-border-disabled": "#1a1a1a29",
  "status-icon-warning": "#f8cc1b",
  "status-container-selected": "#1a1a1a",
  "status-container-disabled": "#ebebeb",
  "status-white": "#ffffff",
  // state layers (alpha overlays for pressed/hover)
  "state-state-layer-pressed-white": "#ffffff29",
  "state-state-layer-pressed-inverse-black": "#1a1a1a29",
} as const;

/** Confirmed dark-mode overrides so far (partial — see file header). */
export const colorDarkKnown: Partial<Record<keyof typeof color, string>> = {
  "text-base-primary": "#fafafa",
  "text-base-tertiary": "#d1d1d1",
  "background-base-low-level1": "#1f1f1f",
  "frame-base-high": "#0a0a0a",
};

// ── Radius ──
export const radius = {
  none: "0px",
  small: "4px",
  medium: "8px",
  large: "12px",
  full: "9999px",
} as const;

// ── Spacing (keys = kebab of Figma path after `spacing/`) ──
export const spacing = {
  "gap-none": "0px", "gap-2": "2px", "gap-4": "4px", "gap-6": "6px",
  "gap-8": "8px", "gap-10": "10px", "gap-12": "12px", "gap-16": "16px",
  "gap-20": "20px", "gap-24": "24px", "gap-40": "40px",
  "component-x-none": "0px", "component-x-4": "4px", "component-x-8": "8px",
  "component-x-10": "10px", "component-x-12": "12px", "component-x-16": "16px",
  "component-x-20": "20px",
  "component-y-none": "0px", "component-y-4": "4px", "component-y-6": "6px",
  "component-y-8": "8px", "component-y-10": "10px", "component-y-14": "14px",
  "component-y-16": "16px", "component-y-20": "20px", "component-y-24": "24px",
  "component-y-28": "28px",
  "layout-x-none": "0px", "layout-x-20": "20px", "layout-x-40": "40px",
  "layout-y-none": "0px", "layout-y-16": "16px", "layout-y-20": "20px",
  "layout-y-24": "24px", "layout-y-40": "40px", "layout-y-64": "64px",
  "layout-y-80": "80px",
} as const;

// ── Typography ──
export const fontSize = {
  "label-small": "12px", "label-medium": "14px", "label-large": "16px",
  "body-small": "14px", "body-medium": "16px", "body-large": "18px",
  "title-small": "18px", "title-medium": "20px", "title-large": "24px",
  "display-medium": "28px", "display-large": "36px",
} as const;

export const font = {
  sans: "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
  weightBase: "500",
  weightStrong: "700",
} as const;

export const tokens = { primitive, color, colorDarkKnown, radius, spacing, fontSize, font };
export type Tokens = typeof tokens;
export type SemanticColor = keyof typeof color;
