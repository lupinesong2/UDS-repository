"use client";

import { TextField } from "@uds/ui";
import { PropsPlayground, type Control } from "../../../components/props-playground.tsx";

// Controls mirror the Figma [Text Field] Text properties, in Figma order:
// isTyping · isDisabled · isError — plus the composed content (label/required/
// placeholder/messages). isTyping (focus) is real :focus-within in code, but the
// playground exposes it as a toggle so the focused ring is reproducible here;
// isDisabled/isError map to the native `disabled` / `error` prop.
const controls: Control[] = [
  { name: "label", type: "string", default: "레이블" },
  { name: "required", type: "boolean", default: true },
  { name: "placeholder", type: "string", default: "플레이스홀더" },
  { name: "isError", type: "boolean", default: false },
  { name: "isDisabled", type: "boolean", default: false },
  { name: "hasMessage", type: "boolean", default: true },
];

export function TextFieldPlayground() {
  return (
    <PropsPlayground
      componentName="TextField"
      controls={controls}
      render={(p) => (
        <div className="w-full max-w-[362px]">
          <TextField
            label={String(p.label)}
            required={p.required as boolean}
            placeholder={String(p.placeholder)}
            error={p.isError as boolean}
            disabled={p.isDisabled as boolean}
            messages={p.hasMessage ? ["도움말 메세지"] : undefined}
            readOnly
          />
        </div>
      )}
      code={(p) => {
        const attrs = [
          `label="${p.label}"`,
          p.required ? "required" : null,
          `placeholder="${p.placeholder}"`,
          p.isError ? "error" : null,
          p.isDisabled ? "disabled" : null,
          p.hasMessage ? 'messages={["도움말 메세지"]}' : null,
        ].filter(Boolean) as string[];
        return `<TextField\n  ${attrs.join("\n  ")}\n/>`;
      }}
    />
  );
}
