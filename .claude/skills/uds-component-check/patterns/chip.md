# Chip

APG 대응 패턴: Button (토글은 `aria-pressed`) — `https://www.w3.org/WAI/ARIA/apg/patterns/button/`

칩은 **작은 `<button>`**이다. 생김새(pill·outline)와 무관하게 역할은 버튼이며, `variant`마다 필요한 ARIA가 다르다.

---

## variant별 의미

| variant | 하는 일 | ARIA |
|---|---|---|
| filter | 켜고 끄는 토글 | `<button>` + `aria-pressed={selected}` |
| selection | 선택 토글(단일/다중) | `<button>` + `aria-pressed` (그룹 의미는 ChipGroup) |
| trigger | 눌러서 메뉴/시트를 엶 | `<button>` + `aria-haspopup` + `aria-expanded` |

- filter·selection은 **선택 상태를 `aria-pressed`로 노출**한다. 색만 바꾸면 스크린리더가 선택 여부를 모른다.
- trigger는 토글이 아니라 **여는 버튼**이므로 `aria-pressed`를 쓰지 않고, 열리는 대상에 `aria-expanded`/`aria-controls`를 건다.

## type 명시

`type="button"` 필수 — 폼 안에서 의도치 않은 submit 방지.

## 상태

비활성은 네이티브 `disabled`. hover/pressed는 CSS. 선택은 색과 **함께 `aria-pressed`**로 노출한다.

## 아이콘

trigger의 chevron 등 장식 아이콘은 `aria-hidden`. 아이콘만 있는 칩은 `aria-label`로 의미를 준다.

## 터치 영역

pill 높이가 33~40px여도 최소 44px를 권장(상하 패딩/타깃 보정).

---

## 체크리스트

| # | 항목 | 검사법 |
|---|---|---|
| C1 | `<button type="button">`로 렌더 | `type="button"` 검색 |
| C2 | filter·selection에 `aria-pressed` 노출 | 해당 variant |
| C3 | trigger는 `aria-pressed` 대신 `aria-haspopup`/`aria-expanded` | 해당 variant |
| C4 | 선택을 색만이 아니라 상태 속성으로 노출 | `aria-pressed` |
| C5 | 장식 아이콘 `aria-hidden`, 아이콘 단독 시 `aria-label` | 아이콘 확인 |
| C6 | 비활성은 네이티브 `disabled` | `disabled` |
| C7 | 터치 영역 44px 이상 | 패딩 계산 |
