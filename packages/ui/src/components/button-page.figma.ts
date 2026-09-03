// url=https://www.figma.com/design/spWdVkr7RbwWOyDG6xbY4z?node-id=654-107975
// source=https://github.com/lupinesong2/UDS-repository/blob/main/packages/ui/src/components/button.tsx
// component=Button

import figma from "figma"

const label = figma.selectedInstance.getString("text")
const variant = figma.selectedInstance.getEnum("variant", {
  filled: "filled",
  ghost: "ghost",
})
const hierarchy = figma.selectedInstance.getEnum("hierarchy", {
  primary: "primary",
  secondary: "secondary",
})
const disabled = figma.selectedInstance.getBoolean("isDisabled")
const iconStart = figma.selectedInstance.getBoolean("◐ hasIcon-start", {
  true: figma.selectedInstance
    .getInstanceSwap("↔ icon-start")
    ?.executeTemplate().example,
  false: undefined,
})
const iconEnd = figma.selectedInstance.getBoolean("◑ hasIcon-end", {
  true: figma.selectedInstance.getInstanceSwap("↔ icon-end")?.executeTemplate()
    .example,
  false: undefined,
})

export default {
  id: "Button",
  imports: ["import { Button } from '@uds/ui';"],
  example: figma.code`<Button category="page"${figma.helpers.react.renderProp(
    "variant",
    variant,
  )}${figma.helpers.react.renderProp(
    "hierarchy",
    hierarchy,
  )}${figma.helpers.react.renderProp(
    "disabled",
    disabled,
  )}${figma.helpers.react.renderProp(
    "iconStart",
    iconStart,
  )}${figma.helpers.react.renderProp("iconEnd", iconEnd)}>
      ${figma.helpers.react.renderChildren(label)}
    </Button>`,
  metadata: { nestable: true },
}
