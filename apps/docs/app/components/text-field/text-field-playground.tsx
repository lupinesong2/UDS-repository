"use client";

import { TextField } from "@uds/ui";
import { ChevronDownIcon } from "@uds/icons";
import { PropsPlayground, type PlaygroundCase } from "../../../components/props-playground.tsx";

type Variant = "text" | "password" | "card" | "rrn" | "phone" | "email";

// A field-styled native <select> for the phone(leading) / email(trailing) slots.
function DemoSelect({ label, options }: { label: string; options: string[] }) {
  return (
    <div className="relative flex h-[55px] shrink-0 items-center rounded-small bg-container-base-high">
      <select
        aria-label={label}
        className="h-full appearance-none bg-transparent pl-component-x-16 pr-10 text-body-large font-base text-text-base-primary outline-none"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-3 size-6 text-icon-base-secondary" />
    </div>
  );
}

const VARIANTS: Variant[] = ["text", "password", "card", "rrn", "phone", "email"];
const mk = (variant: Variant, extra: Record<string, unknown> = {}) => ({
  variant,
  label: "레이블",
  required: true,
  isError: false,
  isDisabled: false,
  hasMessage: true,
  ...extra,
});

// Grouped by variant (Text / Password / … ), each with 기본 · 에러 · 비활성.
const cases: PlaygroundCase[] = VARIANTS.flatMap((v) => [
  { label: "기본", state: mk(v) },
  { label: "에러", state: mk(v, { isError: true }) },
  { label: "비활성", state: mk(v, { isDisabled: true }) },
]);

export function TextFieldPlayground() {
  return (
    <PropsPlayground
      componentName="TextField"
      cases={cases}
      groupBy="variant"
      render={(p) => {
        const variant = p.variant as Variant;
        const leading =
          variant === "phone" ? <DemoSelect label="통신사" options={["U+알뜰폰", "SKT", "KT"]} /> : undefined;
        const trailing =
          variant === "email" ? (
            <DemoSelect label="이메일 도메인" options={["직접입력", "naver.com", "gmail.com"]} />
          ) : undefined;
        return (
          <div className="w-full max-w-[362px]">
            <TextField
              variant={variant}
              label={p.label ? String(p.label) : undefined}
              required={p.required as boolean}
              error={p.isError as boolean}
              disabled={p.isDisabled as boolean}
              messages={p.hasMessage ? ["도움말 메세지"] : undefined}
              leading={leading}
              trailing={trailing}
            />
          </div>
        );
      }}
      code={(p) => {
        const variant = p.variant as string;
        const lines: string[] = [`variant="${variant}"`];
        if (p.label) lines.push(`label="${p.label}"`);
        if (p.required) lines.push("required");
        if (p.isError) lines.push("error");
        if (p.isDisabled) lines.push("disabled");
        if (p.hasMessage) lines.push('messages={["도움말 메세지"]}');
        if (variant === "phone") lines.push("leading={<CarrierSelect />}");
        if (variant === "email") lines.push("trailing={<DomainSelect />}");
        return `<TextField\n  ${lines.join("\n  ")}\n/>`;
      }}
    />
  );
}
