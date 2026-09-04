"use client";

import { Button, type ButtonProps } from "@uds/ui";
import { ChevronLeftIcon, ChevronRightIcon } from "@uds/icons";
import { PropsPlayground, type PlaygroundCase } from "../../../components/props-playground.tsx";

// Figma-defined category × variant × hierarchy combinations — only these exist.
const COMBOS: Record<string, [string, string][]> = {
  page: [
    ["filled", "primary"],
    ["filled", "secondary"],
    ["ghost", "secondary"],
  ],
  module: [
    ["filled", "primary"],
    ["filled", "secondary"],
    ["filled", "tertiary"],
    ["outline", "primary"],
    ["outline", "secondary"],
    ["ghost", "primary"],
    ["ghost", "secondary"],
  ],
  inline: [
    ["filled", "primary"],
    ["filled", "secondary"],
    ["outline", "primary"],
    ["outline", "secondary"],
    ["ghost", "primary"],
    ["ghost", "secondary"],
  ],
};

const mk = (
  category: string,
  variant: string,
  hierarchy: string,
  extra: Record<string, unknown> = {}
) => ({
  category,
  variant,
  hierarchy,
  iconStart: false,
  iconEnd: false,
  disabled: false,
  children: "레이블",
  ...extra,
});

// The selectable case list — grouped by `category` (Page / Module / Inline) in the
// playground. Labels are the variant·hierarchy (+modifier) within each group.
const cases: PlaygroundCase[] = [
  ...Object.entries(COMBOS).flatMap(([category, combos]) =>
    combos.map(([variant, hierarchy]) => ({
      label: `${variant} · ${hierarchy}`,
      state: mk(category, variant, hierarchy),
    }))
  ),
  { label: "filled · primary · iconEnd", state: mk("page", "filled", "primary", { iconEnd: true, children: "다음" }) },
  { label: "outline · secondary · iconStart", state: mk("module", "outline", "secondary", { iconStart: true, children: "이전" }) },
  { label: "ghost · primary · iconEnd", state: mk("inline", "ghost", "primary", { iconEnd: true, children: "더보기" }) },
  { label: "filled · primary · disabled", state: mk("page", "filled", "primary", { disabled: true }) },
];

export function ButtonPlayground() {
  return (
    <PropsPlayground
      componentName="Button"
      cases={cases}
      groupBy="category"
      render={(p) => {
        // The picked case is always a Figma-defined combo, so the cast is safe.
        const buttonProps = {
          category: p.category,
          variant: p.variant,
          hierarchy: p.hierarchy,
          disabled: p.disabled as boolean,
        } as ButtonProps;
        // Button sizes the icon per category ([&_svg]:size-6 / size-4).
        return (
          <Button
            {...buttonProps}
            iconStart={p.iconStart ? <ChevronLeftIcon /> : undefined}
            iconEnd={p.iconEnd ? <ChevronRightIcon /> : undefined}
          >
            {String(p.children)}
          </Button>
        );
      }}
      code={(s) => {
        const attrs = [
          s.category !== "page" ? `category="${s.category}"` : null,
          s.variant !== "filled" ? `variant="${s.variant}"` : null,
          s.hierarchy !== "primary" ? `hierarchy="${s.hierarchy}"` : null,
          s.iconStart ? "iconStart={<ChevronLeftIcon />}" : null,
          s.iconEnd ? "iconEnd={<ChevronRightIcon />}" : null,
          s.disabled ? "disabled" : null,
        ].filter(Boolean) as string[];
        const children = String(s.children ?? "");
        if (attrs.length <= 1) {
          const open = attrs.length ? `<Button ${attrs[0]}>` : "<Button>";
          return `${open}${children}</Button>`;
        }
        return `<Button\n  ${attrs.join("\n  ")}\n>\n  ${children}\n</Button>`;
      }}
    />
  );
}
