"use client";

import { Button, ButtonGroup, type ButtonProps } from "@uds/ui";
import { PropsPlayground, type PlaygroundCase } from "../../../components/props-playground.tsx";

// The playground mirrors the Figma component-set properties so every variation
// built in Figma can be reproduced here:
//   - context     → which Figma set ([Button Group] CTA / Bottom Sheet / Dialog / Card)
//   - contentType → the button composition (Figma `contentType` property)
//   - direction   → row / column (Figma `direction` property)
// The React component owns only `direction`; `context`/`contentType` are Figma
// concepts expressed in code by WHICH `Button`s you compose. This playground
// maps a (context, contentType) selection to that real composition — so the
// Preview renders it live and the Code tab shows the actual source structure.

type Ctx = "CTA" | "Bottom Sheet" | "Dialog" | "Card";
type Content = "filled" | "filled+filled" | "filled+outline" | "filled+ghost";
type Dir = "row" | "column";
type Role = "primary" | "paired" | "ghost";

// Which contentTypes each Figma set actually defines (only Card has outline).
const CONTENT_BY_CONTEXT: Record<Ctx, Content[]> = {
  CTA: ["filled", "filled+filled", "filled+ghost"],
  "Bottom Sheet": ["filled", "filled+filled", "filled+ghost"],
  Dialog: ["filled", "filled+filled", "filled+ghost"],
  Card: ["filled", "filled+outline", "filled+ghost"],
};

// Each contentType has exactly one orientation in Figma (the horizontal
// patterns are row; the ghost pattern is column).
const ORIENTATION: Record<Content, Dir> = {
  filled: "row",
  "filled+filled": "row",
  "filled+outline": "row",
  "filled+ghost": "column",
};

// The case list — every valid (context, contentType) combo, grouped by context.
// Impossible combos (e.g. Dialog · filled+outline) simply aren't in the list.
// direction is derived from the contentType (Figma gives each one orientation).
const cases: PlaygroundCase[] = (["CTA", "Bottom Sheet", "Dialog", "Card"] as Ctx[]).flatMap(
  (context) =>
    CONTENT_BY_CONTEXT[context].map((contentType) => ({
      label: contentType,
      state: { context, contentType, direction: ORIENTATION[contentType] },
    }))
);

// Per Figma set, the `Button` props for each role (main action / paired action /
// text action). This is the single source of truth for both Preview and Code.
function buttonPropsFor(context: Ctx, role: Role): ButtonProps {
  switch (context) {
    // page buttons (55px): magenta primary, dark secondary
    case "CTA":
    case "Bottom Sheet":
      if (role === "primary") return {};
      if (role === "paired") return { hierarchy: "secondary" };
      return { variant: "ghost" };
    // module buttons (44px): magenta primary, gray tertiary secondary
    case "Dialog":
      if (role === "primary") return { category: "module" };
      if (role === "paired") return { category: "module", hierarchy: "tertiary" };
      return { category: "module", variant: "ghost", hierarchy: "secondary" };
    // module buttons (44px): neutral dark primary, outline secondary
    case "Card":
      if (role === "primary") return { category: "module", hierarchy: "secondary" };
      if (role === "paired") return { category: "module", variant: "outline" };
      return { category: "module", variant: "ghost", hierarchy: "secondary" };
  }
}

// contentType → the ordered (role, label) children.
function compositionFor(contentType: Content): { role: Role; label: string }[] {
  switch (contentType) {
    case "filled":
      return [{ role: "primary", label: "확인" }];
    case "filled+filled":
    case "filled+outline":
      return [
        { role: "paired", label: "취소" },
        { role: "primary", label: "확인" },
      ];
    case "filled+ghost":
      return [
        { role: "primary", label: "확인" },
        { role: "ghost", label: "다음에 하기" },
      ];
  }
}

// Serialize a Button's props back to JSX attributes, in a stable order.
function attrs(bp: ButtonProps): string {
  const parts = (["category", "variant", "hierarchy"] as const)
    .map((k) => {
      const v = (bp as Record<string, unknown>)[k];
      return v == null ? null : `${k}="${v}"`;
    })
    .filter(Boolean) as string[];
  return parts.length ? " " + parts.join(" ") : "";
}

export function ButtonGroupPlayground() {
  return (
    <PropsPlayground
      componentName="ButtonGroup"
      cases={cases}
      groupBy="context"
      render={(props) => {
        const context = props.context as Ctx;
        const contentType = props.contentType as Content;
        const direction = props.direction as "row" | "column";
        const items = compositionFor(contentType);
        return (
          <div className="w-[362px] max-w-full">
            <ButtonGroup direction={direction}>
              {items.map((it, i) => (
                <Button key={i} {...buttonPropsFor(context, it.role)}>
                  {it.label}
                </Button>
              ))}
            </ButtonGroup>
          </div>
        );
      }}
      code={(props) => {
        const context = props.context as Ctx;
        const contentType = props.contentType as Content;
        const direction = props.direction as "row" | "column";
        const items = compositionFor(contentType);
        const lines = items.map(
          (it) => `  <Button${attrs(buttonPropsFor(context, it.role))}>${it.label}</Button>`
        );
        return [
          `{/* [Button Group] ${context} · ${contentType} */}`,
          `<ButtonGroup direction="${direction}">`,
          ...lines,
          `</ButtonGroup>`,
        ].join("\n");
      }}
    />
  );
}
