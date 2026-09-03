// url=https://www.figma.com/design/spWdVkr7RbwWOyDG6xbY4z?node-id=654-108885
// source=https://github.com/lupinesong2/UDS-repository/blob/main/packages/ui/src/components/button-group.tsx
// component=ButtonGroup

import figma from "figma"

const direction = figma.selectedInstance.getEnum("direction", {
  row: "row",
  column: "column",
})

export default {
  id: "ButtonGroup",
  imports: ["import { ButtonGroup } from '@uds/ui';"],
  example: figma.code`<ButtonGroup${figma.helpers.react.renderProp(
    "direction",
    direction,
  )}>{figma.children("*")}</ButtonGroup>`,
  metadata: { nestable: true },
}
