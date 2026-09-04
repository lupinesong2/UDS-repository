# ButtonGroup

APG 대응 패턴: 없음 (레이아웃 래퍼)

**조합 규칙이 핵심인 컴포넌트다.** 접근성 속성은 적지만, 빌더가 화면을 조립할 때 가장 많이 참조하게 될 명세가 여기 있다.

---

## 역할 경계

레이아웃만 소유한다. 방향과 간격, 자식 크기 배분까지다.

색상·크기·강조는 **자식 `Button`이 갖는다.** 그룹이 자식의 색을 결정하려 들면 안 된다. 이 경계가 지켜지면 Figma의 여러 세트가 코드에서는 하나로 합쳐진다.

## role="group"

버튼 여러 개가 하나의 결정에 속하므로 `role="group"`이 맞다.

다만 **이름 없는 group은 의미가 거의 없다.** 다이얼로그 안처럼 맥락이 명확하면 생략해도 되고, 독립적으로 놓일 때는 `aria-label`이나 `aria-labelledby`로 무엇에 대한 선택인지 알려준다.

한쪽만 하는 것이 애매하다면 **`aria-label`을 선택 가능한 prop으로 열어두는 것**이 실용적이다.

## 조합 제약 (빌더용 명세)

이 규칙들은 주석이 아니라 **검증 가능한 형태로 분리 보관한다.**

```
maxChildren: 2
allowedChildren: [Button]

contexts:
  cta:          { direction: row,    primary: filled/primary,   secondary: filled/secondary }
  bottomSheet:  { direction: row,    primary: filled/primary,   secondary: filled/secondary }
  dialog:       { direction: row,    primary: filled/primary,   secondary: filled/tertiary }
  card:         { direction: row,    primary: filled/secondary, secondary: outline/primary }

layouts:
  filled:         { count: 1, direction: row }
  filled+filled:  { count: 2, direction: row }
  filled+outline: { count: 2, direction: row }
  filled+ghost:   { count: 2, direction: column }
```

산문 주석으로만 두면 검증할 수 없고, 코드와 어긋나도 아무도 모른다. LLM이 읽을 수는 있으니 주석도 남기되, **주석은 사람용 / 구조화된 명세는 검증·빌더용**으로 둘 다 유지한다.

## 버튼 순서

주 동작과 보조 동작의 순서는 플랫폼 관례를 따르고, **시스템 전체에서 일관되어야 한다.** DOM 순서와 시각 순서가 다르면 (`flex-row-reverse` 등) 키보드 이동 순서가 화면과 어긋난다. 순서를 뒤집었다면 DOM 자체를 바꾼다.

## 파괴적 동작

삭제·해지처럼 되돌릴 수 없는 동작이 그룹에 포함되면, 기본 포커스가 그쪽에 가지 않도록 한다.

---

## 체크리스트

| # | 항목 | 검사법 |
|---|---|---|
| G1 | `role="group"`이 있음 | `role="group"` 검색 |
| G2 | 독립 사용 시 `aria-label` 지정이 가능함 | props 확인 |
| G3 | 레이아웃만 소유하고 자식 색상을 결정하지 않음 | variants 확인 |
| G4 | 조합 제약이 구조화된 명세로 분리되어 있음 | 주석 외 파일 확인 |
| G5 | 자식 개수 제한이 명시됨 | 명세 확인 |
| G6 | DOM 순서와 시각 순서가 일치함 | `reverse` 검색 |
| G7 | 파괴적 동작에 기본 포커스가 가지 않음 | 해당 시 |
