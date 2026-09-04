// url=https://www.figma.com/design/spWdVkr7RbwWOyDG6xbY4z?node-id=645-16876
// source=https://github.com/lupinesong2/UDS-repository/blob/main/packages/ui/src/components/header.tsx
// component=Header

import figma from "figma"

// "[Header]" (645:16876) → <Header category="title">.
// hasSlot-start = 뒤로 버튼(onBack), hasSlot-end = 우측 액션(actions), title = 제목 텍스트.
const center = figma.selectedInstance.getEnum("align", { left: false, center: true })
const onFrameHigh = figma.selectedInstance.getBoolean("onFrameHigh")
const onBack = figma.selectedInstance.getBoolean("◐ hasSlot-start")
const actions = figma.selectedInstance.getBoolean("◑ hasSlot-end")
const title = figma.selectedInstance.getString("title")

export default {
  id: "Header",
  imports: ["import { Header } from '@uds/ui';", "import { MoreVerticalIcon } from '@uds/icons';"],
  example: figma.code`<Header category="title"${center ? ` align="center"` : ``}${onFrameHigh ? ` onFrameHigh` : ``}${onBack ? ` onBack={() => history.back()}` : ``}${figma.helpers.react.renderProp("title", title)}${actions ? ` actions={<MoreVerticalIcon />}` : ``} />`,
  metadata: { nestable: true },
}
