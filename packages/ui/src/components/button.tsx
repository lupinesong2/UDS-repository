import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../lib/utils.ts";

/**
 * Button — the unified UDS button, mirroring the Figma "[Button]" component sets.
 *
 * A single component with a `category` axis that maps 1:1 to Figma:
 *   - `page`   → "[Button] Page"   · 55px · page-level CTA        (filled·ghost)
 *   - `module` → "[Button] Module" · 44px · module/content action (filled·outline·ghost, +tertiary on filled)
 *   - `inline` → "[Button] Inline" · 33px · inline/text action    (filled·outline·ghost)
 *
 * Only the `category × variant × hierarchy` combinations that Figma actually
 * defines are valid — the `ButtonProps` union makes every other combination a
 * compile error (e.g. an outline `page` button, or a `tertiary` outline).
 *
 * Interaction states are CSS, not props (Figma exposes a `state` variant for
 * design only; in code hover/pressed/focus are browser-driven and `disabled`
 * is the native attribute):
 *   - hover / pressed → state-layer overlay (::before)
 *   - focused         → 1px ring, status/border/selected, 4px offset
 *   - disabled        → status/container|border|text/disabled
 *
 * Every value is bound to a Figma design token (no raw Tailwind scale).
 */
const buttonVariants = cva(
  [
    "relative isolate inline-flex select-none items-center justify-center",
    "gap-gap-4 rounded-small font-sans font-base leading-none transition-colors",
    "focus-visible:outline-none focus-visible:ring-[1px] focus-visible:ring-status-border-selected focus-visible:ring-offset-[4px] focus-visible:ring-offset-frame-base-low",
    "disabled:pointer-events-none [&_svg]:shrink-0",
    // state-layer overlay for hover & pressed (color set per compound variant below)
    "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:opacity-0 before:transition-opacity hover:before:opacity-100 active:before:opacity-100",
  ],
  {
    variants: {
      // Geometry + typography per category. Colors live in compoundVariants.
      category: {
        page: "px-component-x-20 py-component-y-14 text-label-large [&_svg]:size-6",
        module: "px-component-x-20 py-component-y-10 text-label-large [&_svg]:size-6",
        inline: "min-h-[33px] px-component-x-12 py-component-y-8 text-label-medium [&_svg]:size-4",
      },
      variant: { filled: "", outline: "border", ghost: "" },
      hierarchy: { primary: "", secondary: "", tertiary: "" },
    },
    compoundVariants: [
      // ── page ("[Button] Page", 55px) ──────────────────────────────────
      {
        category: "page",
        variant: "filled",
        hierarchy: "primary",
        className:
          "bg-container-brand-primary-high text-text-base-white before:bg-state-state-layer-pressed-inverse-black disabled:bg-status-container-disabled disabled:text-status-text-disabled",
      },
      {
        category: "page",
        variant: "filled",
        hierarchy: "secondary",
        className:
          "bg-container-brand-secondary text-text-base-white before:bg-state-state-layer-pressed-white disabled:bg-status-container-disabled disabled:text-status-text-disabled",
      },
      {
        // page ghost has a single (secondary) style in Figma — hierarchy-agnostic.
        category: "page",
        variant: "ghost",
        className:
          "bg-transparent text-text-base-primary before:bg-state-state-layer-pressed-inverse-black disabled:bg-transparent disabled:text-status-text-disabled",
      },

      // ── module ("[Button] Module", 44px) ──────────────────────────────
      {
        category: "module",
        variant: "filled",
        hierarchy: "primary",
        className:
          "bg-container-brand-primary-high text-text-base-white before:bg-state-state-layer-pressed-inverse-black disabled:bg-status-container-disabled disabled:text-status-text-disabled",
      },
      {
        category: "module",
        variant: "filled",
        hierarchy: "secondary",
        className:
          "bg-container-brand-secondary text-text-base-white before:bg-state-state-layer-pressed-white disabled:bg-status-container-disabled disabled:text-status-text-disabled",
      },
      {
        category: "module",
        variant: "filled",
        hierarchy: "tertiary",
        className:
          "bg-container-base-higher-level1 text-text-base-primary before:bg-state-state-layer-pressed-inverse-black disabled:bg-status-container-disabled disabled:text-status-text-disabled",
      },
      {
        category: "module",
        variant: "outline",
        hierarchy: "primary",
        className:
          "border-border-brand-secondary bg-container-base-low text-text-base-primary before:bg-state-state-layer-pressed-inverse-black disabled:border-status-border-disabled disabled:text-status-text-disabled",
      },
      {
        category: "module",
        variant: "outline",
        hierarchy: "secondary",
        className:
          "border-border-base-higher bg-container-base-low text-text-base-primary before:bg-state-state-layer-pressed-inverse-black disabled:border-status-border-disabled disabled:text-status-text-disabled",
      },
      {
        category: "module",
        variant: "ghost",
        hierarchy: "primary",
        className:
          "bg-transparent text-text-brand-primary-high before:bg-state-state-layer-pressed-inverse-black disabled:text-status-text-disabled",
      },
      {
        category: "module",
        variant: "ghost",
        hierarchy: "secondary",
        className:
          "bg-transparent text-text-base-primary before:bg-state-state-layer-pressed-inverse-black disabled:text-status-text-disabled",
      },

      // ── inline ("[Button] Inline", 33px) ──────────────────────────────
      {
        category: "inline",
        variant: "filled",
        hierarchy: "primary",
        className:
          "bg-container-brand-secondary text-text-base-white before:bg-state-state-layer-pressed-white disabled:bg-status-container-disabled disabled:text-status-text-disabled",
      },
      {
        category: "inline",
        variant: "filled",
        hierarchy: "secondary",
        className:
          "bg-container-base-higher-level1 text-text-base-primary before:bg-state-state-layer-pressed-inverse-black disabled:bg-status-container-disabled disabled:text-status-text-disabled",
      },
      {
        category: "inline",
        variant: "outline",
        hierarchy: "primary",
        className:
          "border-border-brand-secondary bg-container-base-low text-text-base-primary before:bg-state-state-layer-pressed-inverse-black disabled:bg-status-container-disabled disabled:border-status-border-disabled disabled:text-status-text-disabled",
      },
      {
        category: "inline",
        variant: "outline",
        hierarchy: "secondary",
        className:
          "border-border-base-higher bg-container-base-low text-text-base-primary before:bg-state-state-layer-pressed-inverse-black disabled:bg-status-container-disabled disabled:border-status-border-disabled disabled:text-status-text-disabled",
      },
      {
        category: "inline",
        variant: "ghost",
        hierarchy: "primary",
        className:
          "bg-transparent text-text-brand-primary-high before:bg-state-state-layer-pressed-inverse-black disabled:text-status-text-disabled",
      },
      {
        category: "inline",
        variant: "ghost",
        hierarchy: "secondary",
        className:
          "bg-transparent text-text-base-primary before:bg-state-state-layer-pressed-inverse-black disabled:text-status-text-disabled",
      },
    ],
    defaultVariants: {
      category: "page",
      variant: "filled",
      hierarchy: "primary",
    },
  }
);

/**
 * Figma-defined `category × variant × hierarchy` combinations — and only those.
 * `category` is optional and defaults to `page`, so `<Button>` alone is a
 * page/filled/primary button.
 */
type ButtonVariantProps =
  // page — "[Button] Page": filled(primary·secondary), ghost(secondary)
  | { category?: "page"; variant?: "filled"; hierarchy?: "primary" | "secondary" }
  | { category?: "page"; variant: "ghost"; hierarchy?: "secondary" }
  // module — "[Button] Module": filled(primary·secondary·tertiary), outline·ghost(primary·secondary)
  | { category: "module"; variant?: "filled"; hierarchy?: "primary" | "secondary" | "tertiary" }
  | { category: "module"; variant: "outline" | "ghost"; hierarchy?: "primary" | "secondary" }
  // inline — "[Button] Inline": filled·outline·ghost(primary·secondary)
  | { category: "inline"; variant?: "filled" | "outline" | "ghost"; hierarchy?: "primary" | "secondary" };

type ButtonOwnProps = {
  /** Render as the child element (e.g. an `<a>`) instead of a `<button>`. Icons are ignored in this mode. */
  asChild?: boolean;
  /** Leading icon (24px for page/module, 16px for inline). */
  iconStart?: React.ReactNode;
  /** Trailing icon (24px for page/module, 16px for inline). */
  iconEnd?: React.ReactNode;
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonOwnProps &
  ButtonVariantProps;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, category, variant, hierarchy, asChild = false, iconStart, iconEnd, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ category, variant, hierarchy, className }))}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {iconStart}
            {children}
            {iconEnd}
          </>
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
