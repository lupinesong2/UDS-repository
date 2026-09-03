// url=https://www.figma.com/design/spWdVkr7RbwWOyDG6xbY4z?node-id=654-107836
// source=https://github.com/lupinesong2/UDS-repository/blob/main/packages/ui/src/components/checkbox.tsx
// component=Checkbox

import figma from "figma"

const size = figma.selectedInstance.getEnum("size", { medium: "medium", small: "small" })
const fontWeight = figma.selectedInstance.getEnum("fontWeight", { strong: "strong", base: "base" })
const checked = figma.selectedInstance.getBoolean("isChecked")
const disabled = figma.selectedInstance.getBoolean("isDisabled")
const label = figma.selectedInstance.getString("text")

export default {
  id: "Checkbox",
  imports: ["import { Checkbox } from '@uds/ui';"],
  example: figma.code`<Checkbox${figma.helpers.react.renderProp("size", size)}${figma.helpers.react.renderProp("fontWeight", fontWeight)}${figma.helpers.react.renderProp("defaultChecked", checked)}${figma.helpers.react.renderProp("disabled", disabled)}>${figma.helpers.react.renderChildren(label)}</Checkbox>`,
  metadata: { nestable: true },
}
