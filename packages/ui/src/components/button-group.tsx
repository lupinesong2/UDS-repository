import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../lib/utils.ts";

/**
 * ButtonGroup — the UDS button group, mirroring the Figma sets.
 *
 * Maps 1:1 to ALL FOUR Figma button-group sets — they share one layout
 * (gap/8, two buttons max) and differ only in which `Button` you compose,
 * which this layout-only wrapper delegates entirely:
 *   - `[Button Group] CTA`         → page `Button`s (55px)   · page-bottom CTA
 *   - `[Button Group] Bottom Sheet`→ page `Button`s (55px)   · inside a sheet
 *   - `[Button Group] Dialog`      → module `Button`s (44px) · confirm/cancel
 *   - `[Button Group] Card`        → module `Button`s (44px) · neutral card action
 *
 * A composition wrapper that arranges CTA `Button`s at the bottom of a screen,
 * a sheet, a dialog, or a card. It owns only *layout* (direction + gap + child
 * sizing); each button's size/color comes from the `Button` component, so every
 * Figma content pattern is expressed by the children you pass:
 *   - filled         → one filled `<Button>`                        · direction="row"
 *   - filled+filled  → two filled `<Button>`s, equal width          · direction="row"
 *   - filled+outline → an outline `<Button>` + a filled `<Button>`  · direction="row"
 *   - filled+ghost   → a filled `<Button>` + a ghost `<Button>`     · direction="column"
 *
 * Contexts differ only in the child `Button` props (all from `Button`, never
 * this wrapper):
 *   - CTA/Bottom Sheet (page): main = filled/primary (magenta); the paired
 *     secondary is a dark filled/secondary.
 *   - Dialog (module): main = filled/primary (magenta); paired secondary is a
 *     gray filled/tertiary (container/base/higher).
 *   - Card (module): main = neutral filled/secondary (dark); paired secondary
 *     is an outline/primary (filled+outline) or ghost/secondary.
 *
 * Layout per Figma (spacing/gap/8 between buttons):
 *   - row    → buttons share the width equally (flex-1)
 *   - column → buttons stack, each full width
 */
const buttonGroupVariants = cva("flex w-full gap-gap-8", {
  variants: {
    // The only Figma axis: how the buttons are laid out. Colors live on the
    // child `Button`s, not here.
    direction: {
      row: "flex-row items-stretch [&>*]:min-w-0 [&>*]:flex-1 [&>*]:basis-0",
      column: "flex-col items-stretch [&>*]:w-full",
    },
  },
  defaultVariants: {
    direction: "row",
  },
});

export type ButtonGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * Row = equal-width buttons side by side (filled · filled+filled);
   * column = full-width buttons stacked (filled+ghost). Defaults to `row`.
   */
  direction?: "row" | "column";
};

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, direction, children, ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      className={cn(buttonGroupVariants({ direction, className }))}
      {...props}
    >
      {children}
    </div>
  )
);
ButtonGroup.displayName = "ButtonGroup";

export { ButtonGroup, buttonGroupVariants };
