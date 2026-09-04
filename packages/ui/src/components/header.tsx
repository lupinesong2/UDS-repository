import * as React from "react";
import { cva } from "class-variance-authority";
import { ChevronLeftIcon, CloseCircleIcon, SearchIcon } from "@uds/icons";
import { cn } from "../lib/utils.ts";

/**
 * Header — the UDS "[Header]" navigation bars, merging three Figma sets under a
 * `category` axis (mirrors the Button merge pattern):
 *   - `category="title"`  → "[Header]"        · back + title + right actions   (align left·center)
 *   - `category="search"` → "[Header] Search" · back + search field + action   (no align)
 *   - `category="logo"`   → "[Header] Logo"    · logo + right actions           (align left·center)
 *
 * `align` is only defined for title/logo — the search branch forbids it (`align?: never`),
 * so `<Header category="search" align=… />` is a compile error.
 *
 * This is a *layout container* (like Cta), not an interactive control — a minimal
 * `cva` owns just the `onFrameHigh` background (base/low #fcfcfc vs base/high #f2f2f2);
 * the rest is structure. Interaction lives in slots: `onBack` (back chevron),
 * `actions` (right-side icons), and the search `value`/`onChange`/`onSearch`.
 * Every color binds to a Figma token.
 */
const headerVariants = cva("flex h-[56px] w-full items-center px-component-x-20", {
  variants: {
    onFrameHigh: {
      false: "bg-background-base-low",
      true: "bg-background-base-high",
    },
  },
  defaultVariants: { onFrameHigh: false },
});

function BackButton({ onClick }: { onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label="뒤로" className="flex shrink-0 items-center text-icon-base-primary">
      <ChevronLeftIcon className="size-6" />
    </button>
  );
}

const titleText =
  "truncate text-title-small font-strong leading-[1.3] tracking-[-0.36px] text-text-base-primary";
const actionSlot = "flex shrink-0 items-center gap-gap-16 text-icon-base-primary [&_svg]:size-6";
// search field end-slot buttons (지우기 / 검색) — 20px icons per Figma "size=small", with focus ring
const searchIconBtn =
  "flex shrink-0 rounded-small focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-status-border-selected";

type HeaderVariantProps =
  | { category?: "title"; align?: "left" | "center" }
  | { category: "logo"; align?: "left" | "center" }
  | { category: "search"; align?: never };

type HeaderOwnProps = {
  /** Match the background to the underlying frame — `true` = base/high, `false` = base/low. Defaults to `false`. */
  onFrameHigh?: boolean;
  /** Back chevron (start slot). Rendered only when provided. */
  onBack?: () => void;
  /** Right-side action icons (end slot). 24px each. */
  actions?: React.ReactNode;
  /** `category="title"`: the title text. */
  title?: React.ReactNode;
  /** `category="logo"`: the logo node. */
  logo?: React.ReactNode;
  /** `category="search"`: input placeholder / value / handlers. */
  placeholder?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onSearch?: () => void;
};

export type HeaderProps = Omit<React.HTMLAttributes<HTMLElement>, "title" | "onChange"> &
  HeaderOwnProps &
  HeaderVariantProps;

const Header = React.forwardRef<HTMLElement, HeaderProps>(
  (
    {
      className,
      category = "title",
      align = "left",
      onFrameHigh = false,
      onBack,
      actions,
      title,
      logo,
      placeholder = "검색어를 입력해주세요",
      value,
      onChange,
      onSearch,
      ...rest
    },
    ref
  ) => {
    const back = onBack ? <BackButton onClick={onBack} /> : null;
    const right = actions ? <div className={actionSlot}>{actions}</div> : null;

    // search value — controlled by `value` if provided, else internal, so the clear (✕) button
    // works out of the box. Clearing uses the native setter + input event (like TextField).
    const [searchInner, setSearchInner] = React.useState("");
    const searchControlled = value !== undefined;
    const searchValue = searchControlled ? String(value ?? "") : searchInner;
    const searchRef = React.useRef<HTMLInputElement>(null);
    const handleSearchChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      if (!searchControlled) setSearchInner(e.target.value);
      onChange?.(e);
    };
    const clearSearch = () => {
      const node = searchRef.current;
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
      if (node && setter) {
        setter.call(node, "");
        node.dispatchEvent(new Event("input", { bubbles: true }));
        node.focus();
      } else if (!searchControlled) {
        setSearchInner("");
      }
    };

    return (
      <header ref={ref} className={cn(headerVariants({ onFrameHigh }), className)} {...rest}>
        <div className="relative flex w-full items-center gap-gap-12">
          {category === "title" &&
            (align === "center" ? (
              <>
                {back}
                <div className="flex-1" />
                {right}
                <div className="pointer-events-none absolute inset-x-[76px] flex justify-center">
                  <p className={cn(titleText, "text-center")}>{title}</p>
                </div>
              </>
            ) : (
              <>
                {back}
                <div className="min-w-0 flex-1">
                  <p className={titleText}>{title}</p>
                </div>
                {right}
              </>
            ))}

          {category === "logo" &&
            (align === "center" ? (
              <>
                {back}
                <div className="flex-1" />
                {right}
                <div className="pointer-events-none absolute left-1/2 -translate-x-1/2">{logo}</div>
              </>
            ) : (
              <>
                <div className="flex min-w-0 flex-1 items-center">{logo}</div>
                {right}
              </>
            ))}

          {category === "search" && (
            <>
              {back}
              <div
                className={cn(
                  "flex h-[44px] min-w-0 flex-1 items-center gap-gap-16 rounded-small px-component-x-12",
                  onFrameHigh ? "bg-container-base-low-level1" : "bg-container-base-high"
                )}
              >
                <input
                  ref={searchRef}
                  type="search"
                  placeholder={placeholder}
                  value={searchValue}
                  onChange={handleSearchChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onSearch?.();
                  }}
                  className="min-w-0 flex-1 bg-transparent text-body-medium font-base leading-normal text-text-base-primary caret-container-brand-primary outline-none placeholder:text-text-base-quaternary [&::-webkit-search-cancel-button]:appearance-none"
                />
                {/* end slot — Figma [Search] typing: 텍스트가 있으면 지우기(✕)+검색(🔍) 2개, 없으면 검색만 */}
                <div className="flex shrink-0 items-center gap-gap-8">
                  {searchValue.length > 0 && (
                    <button type="button" onClick={clearSearch} aria-label="지우기" className={cn(searchIconBtn, "text-icon-base-secondary")}>
                      <CloseCircleIcon className="size-5" />
                    </button>
                  )}
                  <button type="button" onClick={onSearch} aria-label="검색" className={cn(searchIconBtn, "text-icon-base-primary")}>
                    <SearchIcon className="size-5" />
                  </button>
                </div>
              </div>
              {actions ? (
                <div className="flex shrink-0 items-center text-icon-base-primary [&_svg]:size-6">{actions}</div>
              ) : null}
            </>
          )}
        </div>
      </header>
    );
  }
);
Header.displayName = "Header";

export { Header, headerVariants };
