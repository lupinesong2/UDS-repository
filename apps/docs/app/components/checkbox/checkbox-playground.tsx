"use client";

import { Checkbox } from "@uds/ui";
import { PropsPlayground, type Control } from "../../../components/props-playground.tsx";

// Controls mirror the Figma [Checkbox] properties, in Figma order:
// size · fontWeight · isChecked · isDisabled (all independent — full matrix).
// isChecked/isDisabled map to the native checked/disabled attributes.
const controls: Control[] = [
  { name: "size", type: "select", options: ["medium", "small"], default: "medium" },
  { name: "fontWeight", type: "select", options: ["strong", "base"], default: "strong" },
  { name: "isChecked", type: "boolean", default: false },
  { name: "isDisabled", type: "boolean", default: false },
  { name: "children", type: "string", default: "레이블" },
];

export function CheckboxPlayground() {
  return (
    <PropsPlayground
      componentName="Checkbox"
      controls={controls}
      render={(p) => (
        <Checkbox
          size={p.size as "medium" | "small"}
          fontWeight={p.fontWeight as "strong" | "base"}
          checked={p.isChecked as boolean}
          disabled={p.isDisabled as boolean}
          readOnly
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
