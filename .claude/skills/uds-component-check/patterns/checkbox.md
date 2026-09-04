# Checkbox

APG 대응 패턴: Checkbox (`https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/`)

**네이티브 `<input type="checkbox">`를 쓰는 것이 정답이다.** APG의 checkbox 패턴은 네이티브를 쓸 수 없는 경우를 위한 대체 명세이지, 우선 선택지가 아니다.

---

## 권장 구조

```tsx
<label>
  <input type="checkbox" className="peer sr-only" {...props} />
  <span aria-hidden="true">{/* 시각적 박스 */}</span>
  <span>{children}</span>
</label>
```

`<label>`로 감싸면 `htmlFor` 없이도 연결된다. 다만 라벨을 밖에 두는 구조라면 `htmlFor` + `useId`가 필요하다.

시각적 박스는 장식이므로 `aria-hidden="true"`. 실제 상태는 숨겨진 네이티브 input이 갖는다.

## 상태는 네이티브가 갖는다

`checked`, `disabled`는 style prop이 아니라 네이티브 속성이다. 스타일은 `peer-checked:`, `peer-disabled:`로 따라간다.

`aria-checked`를 별도로 붙이지 않는다 — 네이티브 input이 이미 갖고 있어 중복이고, 값이 어긋나면 오히려 해롭다.

## 부분 선택 (indeterminate)

전체 동의 / 개별 동의 구조에서 필요하다. HTML 속성으로 지정할 수 없고 DOM 프로퍼티로만 설정된다.

```tsx
React.useEffect(() => {
  if (innerRef.current) innerRef.current.indeterminate = !!indeterminate;
}, [indeterminate]);
```

체크·부분선택·해제 세 상태의 시각 표현이 모두 정의되어 있는지 확인한다.

## 그룹으로 묶일 때

약관 동의처럼 여러 체크박스가 하나의 질문에 속하면 그룹에도 이름이 필요하다.

```tsx
<fieldset>
  <legend>약관 동의</legend>
  ...
</fieldset>
```

`<fieldset>`을 쓰기 어려우면 `role="group"` + `aria-labelledby`.

## 터치 영역

최소 44×44px를 권장한다. 시각적 박스가 20px여도 `<label>` 전체가 클릭 영역이므로 패딩으로 확보한다.

size별 패딩이 역전되어 있지 않은지 확인한다 (small의 패딩이 medium보다 큰 것은 터치 영역 보정 의도일 수 있으나, 의도가 아니면 실수다).

## 에러 상태

체크박스에 에러가 있으면 (필수 동의 미체크 등) `aria-invalid` + `aria-describedby`로 메시지를 연결한다. TextField와 같은 규칙이다.

---

## 체크리스트

| # | 항목 | 검사법 |
|---|---|---|
| K1 | 네이티브 `<input type="checkbox">`를 사용 | `type="checkbox"` 검색 |
| K2 | 라벨이 `<label>` 감싸기 또는 `htmlFor`로 연결됨 | `<label` 검색 |
| K3 | 시각적 박스에 `aria-hidden` | `aria-hidden` 검색 |
| K4 | `checked`/`disabled`가 네이티브 속성으로 전달됨 | props 전개 확인 |
| K5 | `aria-checked` 중복 지정이 없음 | `aria-checked` 검색 (있으면 실패) |
| K6 | indeterminate가 필요하면 지원됨 | `indeterminate` 검색 |
| K7 | 그룹일 때 `fieldset`/`legend` 또는 `role="group"` | 해당 시 |
| K8 | 터치 영역이 44px 이상 확보됨 | 패딩 계산 |
| K9 | size별 패딩이 의도대로임 (역전 없음) | 패딩 값 비교 |
| K10 | 에러 시 `aria-invalid` + 메시지 연결 | 해당 시 |
