# Button

APG 대응 패턴: Button (`https://www.w3.org/WAI/ARIA/apg/patterns/button/`)

단순해 보이지만 **의미 혼동**이 가장 자주 일어나는 컴포넌트다. 버튼처럼 생겼다고 다 버튼이 아니다.

---

## 무엇을 쓸 것인가

| 하는 일 | 요소 |
|---|---|
| 동작 실행 (열기, 제출, 토글) | `<button>` |
| 다른 곳으로 이동 | `<a href>` |
| 폼 제출 | `<button type="submit">` |

**이동인데 `<button>`을 쓰면** 새 탭 열기, 링크 복사, 미리보기가 죽는다.
**동작인데 `<a>`를 쓰면** 스크린리더가 이동을 예고하는데 실제로는 이동하지 않는다.

`asChild` 패턴으로 렌더링 요소를 바꿀 수 있게 하는 것이 좋다.

## type 명시

`<button>`의 기본 type은 `submit`이다. 폼 안에 있으면 의도치 않게 폼이 제출된다.

동작 버튼에는 **반드시 `type="button"`을 명시한다.**

## 상태

| 상태 | 속성 |
|---|---|
| 비활성 | 네이티브 `disabled` |
| 로딩 | `disabled` + `aria-busy={true}` |
| 토글 (눌림 유지) | `aria-pressed` |
| 무언가를 여닫음 | `aria-expanded` + `aria-controls` |

### disabled 대안

`disabled`된 버튼은 포커스를 받지 못해 스크린리더 사용자가 존재를 모른다. 왜 비활성인지 알려야 하는 경우 `aria-disabled={true}` + 클릭 핸들러에서 차단 + 이유 메시지 연결을 고려한다.

폼 제출 버튼처럼 이유가 명확한 경우는 네이티브 `disabled`로 충분하다.

## 로딩 상태

- 스피너에 `aria-hidden="true"`
- 로딩 중 라벨 텍스트를 지우지 않는다 (지우면 버튼 이름이 사라진다)
- 텍스트를 숨기고 스피너만 보인다면 `aria-label`로 이름을 유지

## 아이콘 전용 버튼

`aria-label` 필수. 아이콘에는 `aria-hidden="true"`.

```tsx
<button type="button" aria-label="닫기">
  <CloseIcon aria-hidden="true" />
</button>
```

## 크기와 터치 영역

최소 44×44px. 시각적으로 작은 아이콘 버튼도 패딩이나 `::before` 확장으로 확보한다.

## 링크로 렌더링될 때

`<a>`로 렌더링되면 `disabled`가 동작하지 않는다. `aria-disabled` + `href` 제거 + 포인터 이벤트 차단이 필요하다.

---

## 체크리스트

| # | 항목 | 검사법 |
|---|---|---|
| B1 | 동작은 `<button>`, 이동은 `<a href>` | `<button`, `<a ` 검색 |
| B2 | `type="button"`이 명시됨 (submit이 아닌 경우) | `type=` 검색 |
| B3 | 아이콘 전용 버튼에 `aria-label` | `aria-label` 검색 |
| B4 | 아이콘에 `aria-hidden` | `aria-hidden` 검색 |
| B5 | 로딩 시 `aria-busy`, 라벨 유지 | `aria-busy` 검색 |
| B6 | 토글 버튼에 `aria-pressed` | 해당 시 |
| B7 | 여닫는 버튼에 `aria-expanded` + `aria-controls` | 해당 시 |
| B8 | 터치 영역 44px 이상 | 패딩·높이 확인 |
| B9 | `focus-visible` 스타일이 있음 | `focus-visible` 검색 |
| B10 | `<a>` 렌더링 시 disabled 처리가 별도로 있음 | 해당 시 |
