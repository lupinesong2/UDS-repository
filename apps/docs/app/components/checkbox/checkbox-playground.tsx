"use client";

import { Checkbox } from "@uds/ui";
import { PropsPlayground, type PlaygroundCase } from "../../../components/props-playground.tsx";

// Figma [Checkbox] combinations — grouped by size (Medium / Small).
const mk = (size: string, fontWeight: string, isChecked: boolean, isDisabled = false) => ({
  size,
  fontWeight,
  isChecked,
  isDisabled,
  children: "레이블",
});

const cases: PlaygroundCase[] = (["medium", "small"] as const).flatMap((size) => [
  { label: "strong · unchecked", state: mk(size, "strong", false) },
  { label: "strong · checked", state: mk(size, "strong", true) },
  { label: "base · unchecked", state: mk(size, "base", false) },
  { label: "base · checked", state: mk(size, "base", true) },
  { label: "checked · disabled", state: mk(size, "strong", true, true) },
]);

export function CheckboxPlayground() {
  return (
    <PropsPlayground
      componentName="Checkbox"
      cases={cases}
      groupBy="size"
      render={(p) => (
        <Checkbox
          size={p.size as "medium" | "small"}
          fontWeight={p.fontWeight as "strong" | "base"}
          defaultChecked={p.isChecked as boolean}
          disabled={p.isDisabled as boolean}
        >
          {String(p.children)}
        </Checkbox>
      )}
      code={(p) => {
        const attrs = [
          p.size !== "medium" ? `size="${p.size}"` : null,
          p.fontWeight !== "strong" ? `fontWeight="${p.fontWeight}"` : null,
          p.isChecked ? "defaultChecked" : null,
          p.isDisabled ? "disabled" : null,
        ].filter(Boolean) as string[];
        const open = attrs.length ? `<Checkbox ${attrs.join(" ")}>` : "<Checkbox>";
        return `${open}${String(p.children)}</Checkbox>`;
      }}
    />
  );
}
