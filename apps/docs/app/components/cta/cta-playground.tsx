"use client";

import { Button, ButtonGroup, Cta } from "@uds/ui";
import { PropsPlayground, type PlaygroundCase } from "../../../components/props-playground.tsx";

// Figma [CTA] combinations — the onFrameHigh axis × the bottom system-UI toggle.
const cases: PlaygroundCase[] = [
  { label: "기본", state: { onFrameHigh: false, hasSystemUiBottom: true } },
  { label: "onFrameHigh", state: { onFrameHigh: true, hasSystemUiBottom: true } },
  { label: "시스템 UI 없음", state: { onFrameHigh: false, hasSystemUiBottom: false } },
];

export function CtaPlayground() {
  return (
    <PropsPlayground
      componentName="Cta"
      cases={cases}
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
