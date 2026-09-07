import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../lib/utils.ts";

/**
 * Radio — the UDS "[Radio]" single-selection control, mirroring the Figma set.
 *
 * A `<label>`-wrapped native radio (real form semantics + keyboard/focus + group
 * behavior via a shared `name`) with a token-styled circle. Figma renders the mark
 * as a stroked circle whose ring thickness encodes state, so we reproduce it with a
 * single bordered circle — no inner dot:
 *   - unchecked → 1.5px ring (icon/base/secondary), hollow center
 *   - checked   → thick ring donut (status/icon/selected); the transparent center
 *                 hole (medium 8px · small 6px) shows the surface behind
 * Figma axes map to code as:
 *   - `size` (medium|small)      → control 24/20px, circle 20/16px, checked ring 6/5px,
 *                                  label large(16)/medium(14), row padding
 *   - `fontWeight` (strong|base) → label weight bold(700)/medium(500)
 *   - `isChecked` / `isDisabled` → the native `checked` / `disabled` attributes; the
 *     circle reflects them via `peer-*` (state is browser-driven, not a style prop).
 *
 * All 16 size×fontWeight×checked×disabled combinations are Figma-defined, so
 * `size`/`fontWeight` are independent optional props — no sparse union needed.
 * Every color is bound to a Figma design token.
 */
const radioVariants = cva(
  ["relative inline-flex cursor-pointer select-none items-center gap-gap-4 font-sans leading-none", "has-[:disabled]:cursor-not-allowed"],
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

// The control footprint (grid-centers the circle). `peer-*` reads the sibling
// <input> state; the circle is the child <span> targeted via `[&>span]`. The ring
// thickness is what changes on check — the center stays transparent (the hole).
const ringVariants = cva(
  [
    "grid shrink-0 place-items-center",
    "[&>span]:rounded-full [&>span]:border-solid [&>span]:bg-transparent [&>span]:transition-colors",
    "[&>span]:border-[1.5px] [&>span]:border-icon-base-secondary",
    "peer-checked:[&>span]:border-status-icon-selected",
    "peer-disabled:[&>span]:border-status-icon-disabled-inverse-black",
    "peer-focus-visible:[&>span]:outline-none peer-focus-visible:[&>span]:ring-[1px] peer-focus-visible:[&>span]:ring-status-border-selected peer-focus-visible:[&>span]:ring-offset-2 peer-focus-visible:[&>span]:ring-offset-frame-base-low",
  ],
  {
    variants: {
      size: {
        medium: "size-6 [&>span]:size-5 peer-checked:[&>span]:border-[6px]",
        small: "size-5 [&>span]:size-4 peer-checked:[&>span]:border-[5px]",
      },
    },
    defaultVariants: { size: "medium" },
  }
);

type RadioVariantProps = {
  /** Circle + label scale. `medium` = 20px circle·label-large, `small` = 16px circle·label-medium. Defaults to `medium`. */
  size?: "medium" | "small";
  /** Label weight. `strong` = bold(700), `base` = medium(500). Defaults to `strong`. */
  fontWeight?: "strong" | "base";
};

// `size` is omitted from the native attrs (it's a number there) so our
// "medium"|"small" wins. `checked`/`defaultChecked`/`disabled`/`name`/`onChange`
// come from InputHTMLAttributes — that's how isChecked/isDisabled + grouping are expressed.
export type RadioProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> &
  RadioVariantProps;

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, size = "medium", fontWeight = "strong", children, ...props }, ref) => (
    <label className={cn(radioVariants({ size, fontWeight, className }))}>
      <input ref={ref} type="radio" className="peer sr-only" {...props} />
      <span className={cn(ringVariants({ size }))}>
        <span />
      </span>
      {children != null && (
        <span className="text-text-base-primary peer-disabled:text-status-text-disabled">
          {children}
        </span>
      )}
    </label>
  )
);
Radio.displayName = "Radio";

export { Radio, radioVariants };
