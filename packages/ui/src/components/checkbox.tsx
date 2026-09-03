import * as React from "react";
import { cva } from "class-variance-authority";
import { CheckIcon } from "@uds/icons";
import { cn } from "../lib/utils.ts";

/**
 * Checkbox — the UDS "[Checkbox]" selection control, mirroring the Figma set.
 *
 * A `<label>`-wrapped native checkbox (real form semantics + keyboard/focus) with
 * a token-styled box. Figma axes map to code as:
 *   - `size` (medium|small)      → box 24/20px, label large(16)/medium(14), row padding
 *   - `fontWeight` (strong|base) → label weight bold(700)/medium(500)
 *   - `isChecked` / `isDisabled` → the native `checked` / `disabled` attributes; the
 *     box reflects them via `peer-*` (state is browser-driven, not a style prop).
 *
 * All 16 size×fontWeight×checked×disabled combinations are Figma-defined, so
 * `size`/`fontWeight` are independent optional props — no sparse union needed.
 * Every color is bound to a Figma design token.
 */
const checkboxVariants = cva(
  ["relative inline-flex cursor-pointer select-none items-center gap-gap-6 font-sans leading-none", "has-[:disabled]:cursor-not-allowed"],
  {
    variants: {
      size: {
        medium: "py-component-y-8 text-label-large",
        small: "py-component-y-10 text-label-medium",
      },
      fontWeight: {
        strong: "font-strong",
        base: "font-base",
      },
    },
    defaultVariants: { size: "medium", fontWeight: "strong" },
  }
);

// The visible box. `peer-*` reads the sibling <input> state; the nested check
// SVG is toggled via `peer-checked:[&>svg]:opacity-100`.
const boxVariants = cva(
  [
    "grid shrink-0 place-items-center rounded-small border-2 transition-colors",
    "border-icon-base-secondary bg-transparent text-icon-base-inverse-white",
    "[&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100",
    "peer-checked:border-status-icon-selected peer-checked:bg-status-icon-selected",
    "peer-disabled:border-status-icon-disabled-inverse-black peer-disabled:bg-transparent",
    "peer-checked:peer-disabled:border-status-icon-disabled-inverse-black peer-checked:peer-disabled:bg-status-icon-disabled-inverse-black",
    "peer-focus-visible:outline-none peer-focus-visible:ring-[1px] peer-focus-visible:ring-status-border-selected peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-frame-base-low",
  ],
  {
    variants: {
      size: {
        medium: "size-6 [&>svg]:size-4",
        small: "size-5 [&>svg]:size-3.5",
      },
    },
    defaultVariants: { size: "medium" },
  }
);

type CheckboxVariantProps = {
  /** Box + label scale. `medium` = 24px/label-large, `small` = 20px/label-medium. Defaults to `medium`. */
  size?: "medium" | "small";
  /** Label weight. `strong` = bold(700), `base` = medium(500). Defaults to `strong`. */
  fontWeight?: "strong" | "base";
};

// `size` is omitted from the native attrs (it's a number there) so our
// "medium"|"small" wins. `checked`/`defaultChecked`/`disabled`/`onChange` come
// from InputHTMLAttributes — that's how isChecked/isDisabled are expressed.
export type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> &
  CheckboxVariantProps;

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, size = "medium", fontWeight = "strong", children, ...props }, ref) => (
    <label className={cn(checkboxVariants({ size, fontWeight, className }))}>
      <input ref={ref} type="checkbox" className="peer sr-only" {...props} />
      <span className={cn(boxVariants({ size }))}>
        <CheckIcon />
      </span>
      {children != null && (
        <span className="text-text-base-primary peer-disabled:text-status-text-disabled">
          {children}
        </span>
      )}
    </label>
  )
);
Checkbox.displayName = "Checkbox";

export { Checkbox, checkboxVariants };
