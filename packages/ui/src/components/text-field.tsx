import * as React from "react";
import { cva } from "class-variance-authority";
import { CloseCircleIcon, ErrorCircleIcon, EyeIcon, EyeOffIcon } from "@uds/icons";
import { cn } from "../lib/utils.ts";

/**
 * TextField — the UDS "[Text Field]" input, merging the six Figma sets under a
 * `variant` axis (mirrors the Button merge pattern):
 *   - `text`     → "[Text Field] Text"     · 자유 입력 (기본)
 *   - `password` → "[Text Field] Password" · type=password 마스킹 + 표시/숨김(eye) 토글
 *   - `card`     → "[Text Field] Card"     · 카드번호 (0000-0000-0000-0000, 숫자)
 *   - `rrn`      → "[Text Field] RRN"      · 주민번호 (생년월일 6자리 + 뒤 7자리, 숫자)
 *   - `phone`    → "[Text Field] Phone"    · 통신사 select(`leading`) + 번호
 *   - `email`    → "[Text Field] Email"    · 이메일 + 도메인 select(`trailing`)
 *
 * `variant` picks the native `type`/`inputMode`/`autoComplete` and default
 * placeholder. Relationships are wired programmatically (not just visually):
 *   - label ──htmlFor──▶ input   (a `useId()`-generated id)
 *   - messages ──aria-describedby──▶ input
 *   - error → `aria-invalid`
 * States are CSS/native: `isTyping` = `:focus-within`, `isDisabled` = native
 * `disabled`, `isError` = the `error` prop. Every color binds to a Figma token.
 */
const textFieldVariants = cva(
  [
    "relative flex min-h-[55px] items-center gap-gap-16", // 55px = Figma field height
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

// focus-visible ring for the icon buttons (clear / reveal).
const iconButton =
  "flex shrink-0 rounded-small text-icon-base-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-status-border-selected focus-visible:ring-offset-2 focus-visible:ring-offset-frame-base-low";

type Variant = "text" | "password" | "card" | "rrn" | "phone" | "email";

type VariantConfig = {
  type: React.HTMLInputTypeAttribute;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  placeholder?: string;
  maxLength?: number;
  autoComplete?: string;
};

// native type/inputMode/autoComplete + default placeholder per Figma variant.
const VARIANT_CONFIG: Record<Variant, VariantConfig> = {
  text: { type: "text", placeholder: "플레이스홀더" },
  password: { type: "password", placeholder: "비밀번호", autoComplete: "current-password" },
  card: { type: "text", inputMode: "numeric", placeholder: "0000 - 0000 - 0000 - 0000", maxLength: 25, autoComplete: "cc-number" },
  rrn: { type: "text", inputMode: "numeric", placeholder: "생년월일 6자리 - 뒤 7자리", autoComplete: "off" },
  phone: { type: "tel", inputMode: "tel", placeholder: "휴대폰 번호", autoComplete: "tel" },
  email: { type: "email", inputMode: "email", placeholder: "uplus@email.com", autoComplete: "email" },
};

type TextFieldOwnProps = {
  /** Figma set — `text`(기본) · `password` · `card` · `rrn` · `phone` · `email`. */
  variant?: Variant;
  /** Label above the field (Figma `[Field Text Set] Label`). Omit to hide the label row — then pass `aria-label`. */
  label?: React.ReactNode;
  /** Show the magenta required asterisk (Figma `hasRequired`) — also sets the native `required`. */
  required?: boolean;
  /** Error state (Figma `isError`): red ring + red supporting messages + `aria-invalid`. */
  error?: boolean;
  /** Supporting messages under the field (Figma `[Field Text Set] Supporting`, 도움말 메세지 — up to 3). Wired via `aria-describedby`. */
  messages?: React.ReactNode[];
  /** Leading sibling box before the field — the phone carrier `select` (give it its own label). */
  leading?: React.ReactNode;
  /** Trailing sibling box after the field — the email domain `select` (give it its own label). */
  trailing?: React.ReactNode;
  /** Trailing 24px slot inside the field (Figma end slot, e.g. a mic icon). */
  iconEnd?: React.ReactNode;
  /** Called when the (auto-shown) clear button is clicked. */
  onClear?: () => void;
};

export type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & TextFieldOwnProps;

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      className,
      variant = "text",
      label,
      required,
      error = false,
      messages,
      leading,
      trailing,
      iconEnd,
      onClear,
      disabled,
      type,
      inputMode,
      placeholder,
      autoComplete,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      maxLength,
      ...props
    },
    ref
  ) => {
    const cfg = VARIANT_CONFIG[variant];
    const id = React.useId();
    const messageIds =
      messages && messages.length > 0
        ? messages.map((_, i) => `${id}-msg-${i}`).join(" ")
        : undefined;

    // password uses native type="password" (never CSS masking) — reveal toggles to text.
    const [reveal, setReveal] = React.useState(false);
    const [focused, setFocused] = React.useState(false);
    const inputType =
      variant === "password" ? (reveal ? "text" : "password") : (type ?? cfg.type);

    // Per-variant input formatting: card / rrn accept digits only and auto-insert separators.
    const format = React.useCallback(
      (raw: string) => {
        if (variant === "card") {
          return raw
            .replace(/\D/g, "")
            .slice(0, 16)
            .replace(/(\d{4})(?=\d)/g, "$1 - ");
        }
        if (variant === "rrn") {
          const d = raw.replace(/\D/g, "").slice(0, 13);
          return d.length > 6 ? `${d.slice(0, 6)} - ${d.slice(6)}` : d;
        }
        return raw;
      },
      [variant]
    );

    // The field controls its own value (from defaultValue) unless the consumer
    // passes `value` — so the clear button + formatting work out of the box.
    const isControlled = value !== undefined;
    const [innerValue, setInnerValue] = React.useState(() =>
      defaultValue != null ? format(String(defaultValue)) : ""
    );
    const currentValue = isControlled ? String(value ?? "") : innerValue;
    // Password masking: keep native `type="password"` (secure) but hide its dots
    // (text-transparent) and paint token-styled circle dots in an overlay — full control of
    // the ● size/color/spacing, and being absolutely positioned it never affects field height.
    const isPwMasked = variant === "password" && !reveal;
    // Once there is a value we paint dots + our own caret bar, so the native caret is hidden
    // (its position follows the real glyph widths and would drift under the fixed-pitch dots).
    const showDots = isPwMasked && currentValue.length > 0;

    const innerRef = React.useRef<HTMLInputElement>(null);
    const setRefs = (node: HTMLInputElement | null) => {
      innerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
    };

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      const formatted = format(e.target.value);
      e.target.value = formatted;
      if (!isControlled) setInnerValue(formatted);
      onChange?.(e);
    };

    const clear = () => {
      const node = innerRef.current;
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      )?.set;
      if (node && setter) {
        setter.call(node, "");
        node.dispatchEvent(new Event("input", { bubbles: true }));
        node.focus();
      } else if (!isControlled) {
        setInnerValue("");
      }
      onClear?.();
    };

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
            <label
              htmlFor={id}
              className="flex w-fit items-center gap-gap-2 text-label-large font-strong leading-none"
            >
              <span className="text-text-base-primary">{label}</span>
              {required && <span className="text-text-brand-primary">*</span>}
            </label>
          )}

          {/* field row — phone/email add a sibling dropdown box via leading/trailing */}
          <div className="flex w-full items-stretch gap-gap-8">
            {leading}
            <div className={cn(textFieldVariants({ error }), "min-w-0 flex-1")}>
              <input
                ref={setRefs}
                id={id}
                type={inputType}
                inputMode={inputMode ?? cfg.inputMode}
                autoComplete={autoComplete ?? cfg.autoComplete}
                placeholder={placeholder ?? cfg.placeholder}
                maxLength={maxLength ?? cfg.maxLength}
                required={required}
                disabled={disabled}
                aria-invalid={error || undefined}
                aria-describedby={messageIds}
                value={currentValue}
                onChange={handleChange}
                onFocus={(e) => {
                  setFocused(true);
                  onFocus?.(e);
                }}
                onBlur={(e) => {
                  setFocused(false);
                  onBlur?.(e);
                }}
                className={cn(
                  // fixed 18px/leading-normal in every state → the 55px field height never moves
                  "min-w-0 flex-1 bg-transparent font-base text-body-large leading-normal outline-none",
                  "placeholder:text-text-base-quaternary",
                  "disabled:cursor-not-allowed disabled:text-status-text-disabled disabled:placeholder:text-status-text-disabled",
                  // masked: hide the native glyphs (dot overlay paints them). No tracking — it would
                  // space out the placeholder ("비 밀 번 호"). caret hidden once dots show (we draw our own).
                  isPwMasked ? "text-transparent" : "text-text-base-primary",
                  showDots ? "caret-transparent" : "caret-container-brand-primary"
                )}
                {...props}
              />
              {/* Password dots — real token-styled circles (● @ Figma size) + the Figma caret bar
                  (2px×24px, brand). aria-hidden; absolutely positioned so it never affects height. */}
              {showDots && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-component-x-16 right-[72px] flex items-center gap-[6px] overflow-hidden"
                >
                  {Array.from({ length: currentValue.length }).map((_, i) => (
                    <span
                      key={i}
                      className={cn(
                        "size-[13px] shrink-0 rounded-full",
                        disabled ? "bg-status-text-disabled" : "bg-text-base-primary"
                      )}
                    />
                  ))}
                  {/* caret bar right after the last dot — only while focused */}
                  {focused && !disabled && (
                    <span className="h-[24px] w-[2px] shrink-0 rounded-full bg-container-brand-primary" />
                  )}
                </div>
              )}
              {/* clear button — shows whenever there is an (editable) value (Figma typing state) */}
              {currentValue.length > 0 && !disabled && !props.readOnly && (
                <button type="button" onClick={clear} aria-label="지우기" className={iconButton}>
                  <CloseCircleIcon className="size-6" />
                </button>
              )}
              {variant === "password" && !disabled && (
                <button
                  type="button"
                  onClick={() => setReveal((v) => !v)}
                  aria-label="비밀번호 표시"
                  aria-pressed={reveal}
                  className={iconButton}
                >
                  {reveal ? <EyeOffIcon className="size-6" /> : <EyeIcon className="size-6" />}
                </button>
              )}
              {iconEnd && <span className="flex shrink-0 [&_svg]:size-6">{iconEnd}</span>}
            </div>
            {trailing}
          </div>
        </div>

        {messages && messages.length > 0 && (
          <div className="flex flex-col gap-gap-4">
            {messages.map((m, i) => (
              <div
                key={i}
                id={`${id}-msg-${i}`}
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
