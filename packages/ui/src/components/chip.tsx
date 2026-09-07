import * as React from "react";
import { cva } from "class-variance-authority";
import { ChevronDownIcon } from "@uds/icons";
import { cn } from "../lib/utils.ts";

/**
 * Chip — the UDS chip atom, mirroring the Figma "[Chip … Item]" symbols used by
 * the "[Chip Group] Filter / Trigger / Selection" sets. A `<button>` with a
 * token-styled pill/rectangle. Figma axes map to code as:
 *   - `variant`  → filter (pill, toggle) · trigger (pill + chevron, opens a menu) ·
 *                  selection (rounded-rect, outlined toggle)
 *   - `size`     → medium/small padding (filter·trigger only; selection is single-size)
 *   - `selected` → toggle state for filter·selection (trigger has no selected)
 *
 * Only Figma-defined combinations compile — the props are a hand-written
 * discriminated union (selection has no `size`, trigger has no `selected`).
 * Every color is bound to a Figma design token.
 */
const chipVariants = cva(
  [
    "relative isolate inline-flex select-none items-center justify-center gap-gap-4",
    "font-sans leading-none whitespace-nowrap transition-colors",
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-status-border-selected focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-40 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        selection: "min-h-10 rounded-small border-[1px] border-solid px-component-x-16 py-component-y-8 text-label-medium",
        filter:
          "rounded-full px-component-x-16 text-label-medium before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-state-state-layer-pressed-inverse-black before:opacity-0 before:transition-opacity active:before:opacity-100",
        trigger: "rounded-full pl-component-x-16 pr-component-x-12 text-label-medium [&_svg]:size-4",
      },
      size: { medium: "", small: "" },
      selected: { true: "", false: "" },
    },
    compoundVariants: [
      // padding / height — filter·trigger only (selection carries its own py)
      { variant: "filter", size: "medium", class: "min-h-10 py-component-y-10" },
      { variant: "filter", size: "small", class: "min-h-[33px] py-component-y-8" },
      { variant: "trigger", size: "medium", class: "min-h-10 py-component-y-10" },
      { variant: "trigger", size: "small", class: "min-h-[33px] py-component-y-8" },
      // colors — keyed by the axes that actually change
      { variant: "selection", selected: false, class: "border-border-base-low text-text-base-primary font-base" },
      { variant: "selection", selected: true, class: "border-status-border-selected text-text-base-primary font-strong" },
      { variant: "filter", selected: false, class: "bg-container-base-higher-level1 text-text-base-primary font-base" },
      { variant: "filter", selected: true, class: "bg-status-container-selected text-text-base-inverse-white font-base" },
      { variant: "trigger", class: "bg-container-base-higher-level1 text-text-base-primary font-base" },
    ],
    defaultVariants: { variant: "filter", size: "medium", selected: false },
  }
);

type ChipVariantProps =
  | { variant?: "filter"; size?: "medium" | "small"; selected?: boolean }
  | { variant: "selection"; selected?: boolean }
  | { variant: "trigger"; size?: "medium" | "small" };

export type ChipProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> &
  ChipVariantProps;

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>((props, ref) => {
  // The public props are a discriminated union; widen internally so we can read
  // the variant-specific keys and keep them out of the DOM spread.
  const {
    className,
    children,
    variant = "filter",
    size,
    selected,
    ...domRest
  } = props as React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "filter" | "trigger" | "selection";
    size?: "medium" | "small";
    selected?: boolean;
  };

  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={variant === "trigger" ? undefined : !!selected}
      className={cn(chipVariants({ variant, size, selected, className }))}
      {...domRest}
    >
      {children}
      {variant === "trigger" && <ChevronDownIcon />}
    </button>
  );
});
Chip.displayName = "Chip";

export { Chip, chipVariants };
