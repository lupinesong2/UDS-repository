"use client";

import { Button, ButtonGroup, Cta } from "@uds/ui";
import { PropsPlayground, type Control } from "../../../components/props-playground.tsx";

// Controls mirror the Figma [CTA] component properties: the `onFrameHigh`
// variant axis and the `hasSystemUiBottom` boolean. The action itself is a
// composed ButtonGroup — the Code tab shows that real structure.
const controls: Control[] = [
  { name: "onFrameHigh", type: "boolean", default: false },
  { name: "hasSystemUiBottom", type: "boolean", default: true },
];

export function CtaPlayground() {
  return (
    <PropsPlayground
      componentName="Cta"
      controls={controls}
      render={(props) => (
        <div className="w-[402px] max-w-full">
          <Cta
            onFrameHigh={props.onFrameHigh as boolean}
            hasSystemUiBottom={props.hasSystemUiBottom as boolean}
          >
            <ButtonGroup direction="row">
              <Button>확인</Button>
            </ButtonGroup>
          </Cta>
        </div>
      )}
      code={(props) => {
        const attrs = [
          props.onFrameHigh ? "onFrameHigh" : null,
          props.hasSystemUiBottom ? null : "hasSystemUiBottom={false}",
        ].filter(Boolean) as string[];
        const open = attrs.length ? `<Cta ${attrs.join(" ")}>` : "<Cta>";
        return [
          open,
          "  <ButtonGroup direction=\"row\">",
          "    <Button>확인</Button>",
          "  </ButtonGroup>",
          "</Cta>",
        ].join("\n");
      }}
    />
  );
}
