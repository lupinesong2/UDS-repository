// url=https://www.figma.com/design/spWdVkr7RbwWOyDG6xbY4z?node-id=2230-36622
// source=https://github.com/lupinesong2/UDS-repository/blob/main/packages/ui/src/components/text-field.tsx
// component=TextField

import figma from "figma"

// "[Text Field] Email" (2230:36622) → <TextField variant="email"> (도메인 select는 trailing 슬롯).
// isTyping is design-only (focus) — CSS `:focus-within` in code, so NOT mapped.
const hasLabel = figma.selectedInstance.getBoolean("hasLabel")
const hasSupporting = figma.selectedInstance.getBoolean("hasSupporting")
const disabled = figma.selectedInstance.getBoolean("isDisabled")
const error = figma.selectedInstance.getBoolean("isError")

export default {
  id: "TextField",
  imports: ["import { TextField } from '@uds/ui';"],
  example: figma.code`<TextField variant="email" trailing={<DomainSelect />}${figma.helpers.react.renderProp("label", hasLabel ? "레이블" : undefined)} required${figma.helpers.react.renderProp("disabled", disabled)}${figma.helpers.react.renderProp("error", error)}${figma.helpers.react.renderProp("messages", hasSupporting ? ["도움말 메세지"] : undefined)} />`,
  metadata: { nestable: true },
}
