# Radio

APG 대응 패턴: Radio Group (`https://www.w3.org/WAI/ARIA/apg/patterns/radio/`)

**네이티브 `<input type="radio">`를 쓰는 것이 정답이다.** 같은 `name`을 공유하면 브라우저가 그룹·단일 선택·화살표 이동·롤(radio/radiogroup)을 전부 처리한다. APG의 radio 패턴은 네이티브를 못 쓸 때의 대체 명세다.

---

## 권장 구조

```tsx
<label>
  <input type="radio" name="plan" className="peer sr-only" {...props} />
  <span aria-hidden="true">{/* 시각적 원 */}</span>
  <span>{children}</span>
</label>
```

`<label>`로 감싸면 연결된다. 시각적 원은 장식이므로 `aria-hidden="true"` — 실제 상태는 숨긴 native input이 갖는다.

## 같은 name = 하나의 그룹

- 한 질문의 선택지는 **동일한 `name`**을 공유해야 브라우저가 하나의 radiogroup으로 묶고 한 번에 하나만 선택되게 한다. `name`을 빠뜨리면 각 라디오가 독립 토글이 돼버린다 — **가장 흔하고 치명적인 실수.**
- 화살표 키 이동·단일 선택·roving tabindex는 네이티브가 처리한다. 직접 구현하지 않는다.

## 그룹에 이름

```tsx
<fieldset><legend>요금제</legend> …라디오들… </fieldset>
```

`<fieldset>`을 쓰기 어려우면 `role="radiogroup"` + `aria-labelledby`.

## 상태는 네이티브가 갖는다

`checked`/`defaultChecked`/`disabled`는 네이티브 속성. `aria-checked`를 따로 붙이지 않는다(중복이며 어긋나면 해롭다). 스타일은 `peer-checked:`/`peer-disabled:`로 따라간다.

## 마크 렌더 주의

선택 마크가 SVG/도넛형이라도 시각만 다를 뿐 의미는 native가 가진다. 마크 span에 `aria-hidden`.

## 터치 영역

최소 44×44px 권장. 원이 16~20px여도 `<label>` 전체가 클릭 영역이므로 상하 패딩으로 확보한다.

---

## 체크리스트

| # | 항목 | 검사법 |
|---|---|---|
| R1 | 네이티브 `<input type="radio">` 사용 | `type="radio"` 검색 |
| R2 | 라벨이 `<label>` 감싸기 또는 `htmlFor` 연결 | `<label` 검색 |
| R3 | 같은 그룹이 동일 `name` 공유 | `name=` 확인 |
| R4 | 그룹에 이름(`fieldset`/`legend` 또는 `radiogroup`+label) | 해당 시 |
| R5 | 시각적 원에 `aria-hidden` | `aria-hidden` 검색 |
| R6 | `aria-checked` 중복 지정 없음 | 있으면 실패 |
| R7 | 화살표 이동을 직접 구현하지 않음(native) | JS 키 핸들러 없음 |
| R8 | `checked`/`disabled`가 네이티브 속성으로 전달됨 | props 전개 |
| R9 | 터치 영역 44px 이상 | 패딩 계산 |
