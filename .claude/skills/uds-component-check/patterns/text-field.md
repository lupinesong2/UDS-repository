# TextField

APG 대응 패턴: 네이티브 `<input>` (APG는 네이티브 요소 사용을 권장하며 별도 패턴을 두지 않는다)

가장 관계가 많이 얽히는 컴포넌트다. **라벨 · 입력 · 도움말 · 에러**가 서로 연결되어야 하는데, Figma에는 이 연결이 그려지지 않는다. UDS에서 실제로 문제가 발견된 지점이기도 하다.

---

## 구조 명세

```
label   ──htmlFor──▶ input ◀──aria-describedby── messages
                       │
                    aria-invalid (error일 때)
```

세 개의 연결이 모두 있어야 한다. 하나라도 없으면 시각적으로만 필드고, 프로그램적으로는 이름 없는 텍스트 상자다.

## 필수 속성

| 상황 | 필수 |
|---|---|
| 라벨이 있음 | `<label htmlFor={id}>` + `<input id={id}>` |
| 라벨이 없음 | `aria-label` |
| 도움말/에러 메시지 있음 | `aria-describedby={messageIds}` |
| error 상태 | `aria-invalid={true}` |
| 필수 입력 | 네이티브 `required` (별표 표시만으로는 불충분) |
| 비밀번호 | `type="password"` (예외 없음) |

## id 생성

`React.useId()`를 쓴다. 하드코딩 금지 — 한 화면에 두 개를 놓으면 id가 충돌해 연결이 깨진다.

메시지가 여러 개면 각각 id를 부여하고 공백으로 구분해 나열한다.

```tsx
const id = React.useId();
const messageIds = messages?.map((_, i) => `${id}-msg-${i}`).join(" ");

<input
  id={id}
  aria-describedby={messageIds || undefined}
  aria-invalid={error || undefined}
  required={required}
/>
```

`aria-invalid={false}`를 명시적으로 넣지 않는다. `undefined`로 두어 속성 자체가 사라지게 한다.

## variant별 확인

| variant | type | inputMode | autoComplete |
|---|---|---|---|
| text | `text` | — | 상황에 맞게 |
| password | **`password`** | — | `current-password` / `new-password` |
| card | `text` | `numeric` | `cc-number` |
| rrn | `text` | `numeric` | `off` |
| phone | `tel` | `tel` | `tel` |
| email | `email` | `email` | `email` |

### password 주의

Figma의 점(●) 모양을 재현하려고 `type="text"` + `-webkit-text-security: disc`를 쓰는 구현이 있다. **허용하지 않는다.**

- 비밀번호 관리자가 필드를 인식하지 못한다
- 브라우저 자동완성이 동작하지 않는다
- `-webkit-text-security`를 지원하지 않는 엔진에서 비밀번호가 평문으로 보인다

점 모양을 양보하고 `type="password"`를 지킨다. 시각 차이는 디자인 쪽에서 수용할 문제다.

### rrn 주의

플레이스홀더가 뒷자리 마스킹(`•••••••`)을 암시하는데 실제 입력값이 평문으로 표시되면 불일치다. 뒷자리를 별도 필드로 분리해 `type="password"`를 주거나, 마스킹하지 않기로 명시적으로 결정하고 플레이스홀더를 바꾼다.

## 슬롯 컴포넌트 (leading / trailing)

phone의 통신사 select, email의 도메인 select처럼 형제로 붙는 요소도 각자 라벨이 필요하다. 시각적으로 라벨이 없으면 `aria-label`을 준다.

## 지우기 / 표시 토글 버튼

- `type="button"` 명시 (폼 안에서 submit 되는 것 방지)
- `aria-label` 필수 ("지우기", "비밀번호 표시")
- 표시 토글은 상태를 반영: `aria-pressed={reveal}`

## 메시지 아이콘

에러가 아닌 도움말에 에러 아이콘을 쓰지 않는다. 상태별로 아이콘을 분기하거나, 아이콘 없이 텍스트만 둔다.
메시지 아이콘은 장식이므로 `aria-hidden="true"`.

---

## 체크리스트

| # | 항목 | 검사법 |
|---|---|---|
| T1 | 라벨이 `htmlFor`로 input과 연결됨 | `htmlFor` 검색 |
| T2 | id가 `useId()`로 생성됨 | `useId` 검색 |
| T3 | 메시지가 `aria-describedby`로 연결됨 | `aria-describedby` 검색 |
| T4 | error 상태에 `aria-invalid` | `aria-invalid` 검색 |
| T5 | required가 네이티브 속성으로도 전달됨 | `required` 검색 |
| T6 | password variant가 `type="password"` | `type="password"` 검색 |
| T7 | `autoComplete`가 variant에 맞게 지정됨 | `autoComplete` 검색 |
| T8 | 지우기·토글 버튼에 `aria-label`과 `type="button"` | `aria-label` 검색 |
| T9 | leading/trailing 슬롯 요소에 라벨이 있음 | 해당 시 |
| T10 | 도움말에 에러 아이콘을 쓰지 않음 | 아이콘 분기 확인 |
