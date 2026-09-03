// url=https://www.figma.com/design/spWdVkr7RbwWOyDG6xbY4z?node-id=14942-51398
// source=https://github.com/lupinesong2/UDS-repository/blob/main/packages/ui/src/components/cta.tsx
// component=Cta

import figma from "figma"

const onFrameHigh = figma.selectedInstance.getEnum("onFrameHigh", {
  true: true,
  false: false,
})
const hasSystemUiBottom = figma.selectedInstance.getBoolean(
  "◒ hasSystemUi-bottom",
)

export default {
  id: "Cta",
  imports: ["import { Cta } from '@uds/ui';"],
  example: figma.code`<Cta${figma.helpers.react.renderProp(
    "onFrameHigh",
    onFrameHigh,
  )}${figma.helpers.react.renderProp("hasSystemUiBottom", hasSystemUiBottom)}>
      {figma.children("*")}
    </Cta>`,
  metadata: { nestable: true },
}
