// url=https://www.figma.com/design/spWdVkr7RbwWOyDG6xbY4z?node-id=3203-9737
// source=https://github.com/lupinesong2/UDS-repository/blob/main/packages/ui/src/components/header.tsx
// component=Header

import figma from "figma"

// "[Header] Logo" (3203:9737) → <Header category="logo">.
// hasSlot-start = 뒤로(onBack), hasSlot-end = 우측 액션(actions), logo 슬롯은 소비자 제공.
const center = figma.selectedInstance.getEnum("align", { left: false, center: true })
const onFrameHigh = figma.selectedInstance.getBoolean("onFrameHigh")
const onBack = figma.selectedInstance.getBoolean("◐ hasSlot-start")
const actions = figma.selectedInstance.getBoolean("◑ hasSlot-end")

export default {
  id: "Header",
  imports: ["import { Header } from '@uds/ui';", "import { MoreVerticalIcon } from '@uds/icons';"],
  example: figma.code`<Header category="logo"${center ? ` align="center"` : ``}${onFrameHigh ? ` onFrameHigh` : ``}${onBack ? ` onBack={() => history.back()}` : ``} logo={<Logo />}${actions ? ` actions={<MoreVerticalIcon />}` : ``} />`,
  metadata: { nestable: true },
}
