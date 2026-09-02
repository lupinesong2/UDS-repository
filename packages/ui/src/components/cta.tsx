import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../lib/utils.ts";

/**
 * Cta — the UDS "[CTA]" screen-bottom action area.
 *
 * A bottom-anchored container that holds a page-level action (compose a
 * `ButtonGroup` as its children) and, by default, the OS bottom system UI
 * (iOS home indicator). It mirrors the Figma `[CTA]` set, whose only variant
 * axis is `onFrameHigh`:
 *   - `onFrameHigh` (false | true) → background matched to the underlying frame
 *     (`background/base/low` #fcfcfc vs `background/base/high` #f2f2f2).
 *   - `hasSystemUiBottom` (default true) → render the bottom system-UI safe area.
 *   - `systemUi` → replace the default home indicator with a custom node.
 *
 * Layout per Figma: the action wrapper pads `component/x/20` · `component/y/16`;
 * the action itself is whatever `ButtonGroup`/`Button`s you pass as `children`.
 * Colors/size of those buttons are owned by `Button`, not this container.
 *
 * Note: this is a *layout container*, not an interactive control — so it uses a
 * minimal `cva` for the background axis only (no focus ring / state overlay).
 */
const ctaVariants = cva("flex w-full flex-col items-stretch", {
  variants: {
    onFrameHigh: {
      false: "bg-background-base-low",
      true: "bg-background-base-high",
    },
  },
  defaultVariants: {
    onFrameHigh: false,
  },
});

export type CtaProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Match the background to the underlying frame — `true` = base/high, `false` = base/low. Defaults to `false`. */
  onFrameHigh?: boolean;
  /** Render the bottom OS system-UI safe area (iOS home indicator). Defaults to `true`. */
  hasSystemUiBottom?: boolean;
  /** Replace the default home indicator with a custom system-UI node. */
  systemUi?: React.ReactNode;
};

const Cta = React.forwardRef<HTMLDivElement, CtaProps>(
  (
    { className, onFrameHigh = false, hasSystemUiBottom = true, systemUi, children, ...props },
    ref
  ) => (
    <div ref={ref} className={cn(ctaVariants({ onFrameHigh, className }))} {...props}>
      {/* Action wrapper — put a <ButtonGroup> here. */}
      <div className="flex w-full flex-col items-stretch px-component-x-20 py-component-y-16">
        {children}
      </div>
      {/* Bottom system UI (iOS home indicator) — overridable via `systemUi`. */}
      {hasSystemUiBottom &&
        (systemUi ?? (
          <div className="flex w-full items-center justify-center pb-2 pt-[21px]">
            <div className="h-[5px] w-[134px] rounded-full bg-container-base-black" />
          </div>
        ))}
    </div>
  )
);
Cta.displayName = "Cta";

export { Cta, ctaVariants };
