// url=https://www.figma.com/design/spWdVkr7RbwWOyDG6xbY4z?node-id=2498-50378
// source=https://github.com/lupinesong2/UDS-repository/blob/main/packages/ui/src/components/header.tsx
// component=Header

import figma from "figma"

// "[Header] Search" (2498:50378) → <Header category="search">.
// 검색 필드 안의 검색/지우기 아이콘은 컴포넌트 내장(Figma 프롭 아님). hasIcon-start = 뒤로(onBack),
// hasIcon-end = 필드 밖 맨 우측 액션(actions). align은 search에 없음.
const onFrameHigh = figma.selectedInstance.getBoolean("onFrameHigh")
const onBack = figma.selectedInstance.getBoolean("◑ hasIcon-start")
const actions = figma.selectedInstance.getBoolean("◑ hasIcon-end")

export default {
  id: "Header",
  imports: ["import { Header } from '@uds/ui';", "import { MoreVerticalIcon } from '@uds/icons';"],
  example: figma.code`<Header category="search"${onFrameHigh ? ` onFrameHigh` : ``}${onBack ? ` onBack={() => history.back()}` : ``} placeholder="검색어를 입력해주세요"${actions ? ` actions={<MoreVerticalIcon />}` : ``} />`,
  metadata: { nestable: true },
}
