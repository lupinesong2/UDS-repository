import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../lib/utils.ts";

/**
 * ChipGroup — layout container for `Chip`s, mirroring the Figma "[Chip Group]"
 * sets (Filter / Trigger / Selection). Pure layout: it arranges the chips you
 * pass as `children` and optionally shows a `[Field Text Set] Label` header with
 * a required asterisk. The chip look (filter/trigger/selection) is owned by each
 * `Chip`, not the group — same relationship as `ButtonGroup` ↔ `Button`.
 *
 * Figma axes map to code as:
 *   - `isWrap`  → `wrap` (true = flex-wrap to multiple rows · false = single scrollable row)
 *   - label / hasRequired → `label` + `required` (the Selection set's header)
 *   - `chipCount` is not a prop — it is simply how many `Chip` children you render.
 */
const chipGroupRowVariants = cva("flex items-center gap-gap-8", {
  variants: {
    wrap: { true: "flex-wrap", false: "overflow-x-auto" },
  },
  defaultVariants: { wrap: false },
});

export type ChipGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Optional header label (Figma `[Field Text Set] Label`). Omit to hide the header row. */
  label?: React.ReactNode;
  /** Show the magenta required asterisk next to the label. */
  required?: boolean;
  /** Wrap chips onto multiple rows (Figma `isWrap=true`). Default `false` = single scrollable row. */
  wrap?: boolean;
};

const ChipGroup = React.forwardRef<HTMLDivElement, ChipGroupProps>(
  ({ className, label, required = false, wrap = false, children, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-gap-12", className)} {...props}>
      {label != null && (
        <div className="flex items-center gap-gap-2 text-label-large font-strong text-text-base-primary">
          <span>{label}</span>
          {required && <span className="text-text-brand-primary">*</span>}
        </div>
      )}
      <div className={cn(chipGroupRowVariants({ wrap }))}>{children}</div>
    </div>
  )
);
ChipGroup.displayName = "ChipGroup";

export { ChipGroup, chipGroupRowVariants };
