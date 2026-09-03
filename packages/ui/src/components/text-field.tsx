import * as React from "react";
import { cva } from "class-variance-authority";
import { CloseCircleIcon, ErrorCircleIcon } from "@uds/icons";
import { cn } from "../lib/utils.ts";

/**
 * TextField — the UDS "[Text Field] Text" input, mirroring the Figma set.
 *
 * A labelled single-line text input composed of three Figma parts:
 *   - `[Field Text Set] Label`     → `label` + `required` asterisk
 *   - `[Text Field Slot] Text`     → the input box (placeholder, caret, end slot)
 *   - `[Field Text Set] Supporting`→ up to 3 stacked `messages` (icon + text)
 *
 * The Figma axes map to code the same way Button's do — interaction states are
 * CSS/native, not style props:
 *   - `isTyping` (focused)  → `:focus-within` 1px ring (status/border/selected)
 *                             + native caret (container/brand/primary) + `onClear`
 *   - `isDisabled`          → the native `disabled` attribute
 *   - `isError`             → the `error` prop (red ring + red messages)
 *
 * `error` and `disabled` are independent booleans (every combination is valid;
 * Figma's disabled+error symbol renders error-styled, so `error` wins here too).
 * Every color is bound to a Figma design token (no raw hex).
 */
const textFieldVariants = cva(
  [
    "relative flex min-h-[55px] w-full items-center gap-gap-16",
    "rounded-small bg-container-base-high px-component-x-16 py-component-y-14",
  ],
  {
    variants: {
      // Figma isError. The focused (isTyping) ring only applies when not errored.
      error: {
        false:
          "focus-within:ring-1 focus-within:ring-inset focus-within:ring-status-border-selected",
        true: "ring-1 ring-inset ring-status-border-negative",
      },
    },
    defaultVariants: { error: false },
  }
);

type TextFieldOwnProps = {
  /** Label above the field (Figma `[Field Text Set] Label`). Omit to hide the label row. */
  label?: React.ReactNode;
  /** Show the magenta required asterisk (Figma `hasRequired`) — also sets the native `required`. */
  required?: boolean;
  /** Error state (Figma `isError`): red ring + red supporting messages. */
  error?: boolean;
  /** Supporting messages under the field (Figma `[Field Text Set] Supporting`, 도움말 메세지 — up to 3). */
  messages?: React.ReactNode[];
  /** Trailing 24px slot inside the field (Figma end slot, e.g. a mic icon). */
  iconEnd?: React.ReactNode;
  /** Show the clear button (Figma typing-state close-circle) and call this on click. */
  onClear?: () => void;
};

export type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & TextFieldOwnProps;

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    { className, label, required, error = false, messages, iconEnd, onClear, disabled, ...props },
    ref
  ) => {
    // Supporting-message color follows the state; the icon inherits it via currentColor.
    const messageColor = error
      ? "text-status-text-negative"
      : disabled
        ? "text-status-text-disabled"
        : "text-text-base-tertiary";

    return (
      <div className={cn("flex w-full flex-col gap-gap-8", className)}>
        <div className="flex flex-col gap-gap-12">
          {label != null && (
            <div className="flex items-center gap-gap-2 text-label-large font-strong leading-none">
              <span className="text-text-base-primary">{label}</span>
              {required && <span className="text-text-brand-primary">*</span>}
            </div>
          )}

          <div className={cn(textFieldVariants({ error }))}>
            <input
              ref={ref}
              required={required}
              disabled={disabled}
              className={cn(
                "min-w-0 flex-1 bg-transparent outline-none",
                "text-body-large font-base leading-normal caret-container-brand-primary",
                "text-text-base-primary placeholder:text-text-base-quaternary",
                "disabled:cursor-not-allowed disabled:text-status-text-disabled disabled:placeholder:text-status-text-disabled"
              )}
              {...props}
            />
            {onClear && !disabled && (
              <button
                type="button"
                onClick={onClear}
                aria-label="지우기"
                className="flex shrink-0 text-icon-base-secondary"
              >
                <CloseCircleIcon className="size-6" />
              </button>
            )}
            {iconEnd && <span className="flex shrink-0 [&_svg]:size-6">{iconEnd}</span>}
          </div>
        </div>

        {messages && messages.length > 0 && (
          <div className="flex flex-col gap-gap-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn("flex items-start gap-gap-4 text-body-small font-base leading-normal", messageColor)}
              >
                <span className="flex shrink-0 items-start pt-[2px]">
                  <ErrorCircleIcon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">{m}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);
TextField.displayName = "TextField";

export { TextField, textFieldVariants };
