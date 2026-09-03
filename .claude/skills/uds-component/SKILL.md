---
name: uds-component
description: Figma 컴포넌트 세트에서 packages/ui의 UDS 컴포넌트를 만들거나 병합하고 레지스트리 항목과 shadcn 형식 문서 페이지(Preview/Code 플레이그라운드)까지 생성한다. figma.com 컴포넌트 URL을 붙여넣어 컴포넌트를 만들/추가/병합하려 할 때(링크만 있어도), 또는 "컴포넌트/버튼 합치자", "Figma 컴포넌트 추가", "registry 등록", "컴포넌트 문서 만들어", "add/merge component" 라고 할 때 트리거.
---

# UDS 컴포넌트 작성 (Figma → packages/ui → registry → docs)

Figma 컴포넌트 세트를 **재현 가능한 방식으로** 코드 컴포넌트로 만든다. 결과물은 항상 다음 5가지다:

1. **하나의 `cva` 컴포넌트** (`button.tsx` 구조를 따름)
2. **Figma가 정의한 조합만 컴파일되는** 손수 작성한 discriminated union props
3. 모든 색·간격·폰트를 **Figma 토큰 유틸에 바인딩** (하드코딩 금지)
4. **레지스트리 항목** + 재빌드된 `r/<name>.json`
5. **shadcn 형식 문서 페이지** + Preview/Code 플레이그라운드

Phase 순서대로 진행하고 **검증(Phase 7)을 건너뛰지 않는다.**

---

## 호출 & 입력

**필수 입력은 Figma 컴포넌트 세트 URL 하나뿐이다.** `figma.com/design/<fileKey>/...?node-id=<id>` 링크만 붙여넣어도(선택적으로 "만들어줘"/"추가"/"합치자") 이 스킬이 트리거된다. `/uds-component` 입력은 선택.

링크만으로 자율 진행한다:

1. URL에서 node id 추출(`?node-id=1-2` → `1:2` 또는 `1-2`) 후 Phase 1로 세트를 읽는다.
2. **컴포넌트 이름을 Figma 세트 이름에서 유도** — `[Button] Inline` → `button`, `[Chip] …` → `chip`. 여러 세트가 접두사를 공유하면(Page/Module/Inline) `category` 축을 가진 **하나의 컴포넌트로 병합**한다(`button.tsx` 참고). 이름·category 매핑이 정말 모호할 때만 사용자에게 묻고, 아니면 명백한 매핑을 골라 명시한다.
3. **신규 vs 병합 결정**: 같은 이름 컴포넌트가 `packages/ui/src/components/`에 있으면 확장/병합, 없으면 신규 생성.
4. Phase 1–7을 끝까지 실행한 뒤, 생성/수정/삭제된 모든 파일과 타입체크 결과를 보고한다.

각 Phase마다 확인받지 말 것 — **진짜 결정**일 때만 멈춘다(이름 모호, `theme.css`에 없는 토큰, 기존 조합과 모순되는 Figma 조합).

---

## 0. 레포 맵 (source of truth)

| 대상 | 경로 |
|---|---|
| 컴포넌트 소스 | `packages/ui/src/components/<name>.tsx` |
| 배럴 익스포트 | `packages/ui/src/index.ts` |
| `cn` 유틸 | `packages/ui/src/lib/utils.ts` |
| 토큰 유틸(생성물) | `packages/tokens/dist/theme.css` |
| 토큰 소스 | `packages/tokens/src/tokens.ts` → `node packages/tokens/scripts/build-css.ts` 로 재생성 |
| 레지스트리 매니페스트 | `registry/registry.ts` |
| 레지스트리 빌드 | `apps/docs/scripts/build-registry.ts` → `apps/docs/public/r/<name>.json` + `index.json` 생성 |
| 문서 페이지 | `apps/docs/app/components/<name>/page.tsx` |
| 문서 플레이그라운드 | `apps/docs/app/components/<name>/<name>-playground.tsx` |
| 공용 플레이그라운드 | `apps/docs/components/props-playground.tsx` (Preview/Code 탭 카드) |
| 사이드바 내비 | `apps/docs/app/layout.tsx` (`NAV` 배열) |

`/.claude/rules/figma-mcp-integration.md`(캔버스 쓰기 규칙)도 준수하되, **이 스킬은 레포 안의 코드**를 다루지 Figma 캔버스에 쓰지 않는다.

---

## 1. Figma 스펙 추출

`get_design_context` 호출 전에 `figma:figma-implement-design`을 먼저 로드한다(필수). 코어 컴포넌트 라이브러리 파일은 **`spWdVkr7RbwWOyDG6xbY4z`** ("[Test] Core Component v.1.0.0"). node URL/id가 주어지면 이 순서로 호출한다:

1. `mcp__figma__get_screenshot` — 시각적 진실(행 = variant×hierarchy, 열 = state).
2. `mcp__figma__get_metadata` — 컴포넌트 세트 축. 심볼 이름이 축을 인코딩함(예: `variant=outline, hierarchy=secondary, state=focused, isDisabled=true`). 각 심볼의 height와 **실제로 존재하는 `variant × hierarchy` 조합**을 기록 — 이게 **허용 타입 union을 정의**한다.
3. `mcp__figma__get_variable_defs` — 바인딩된 토큰(색·간격·radius·폰트).
4. `mcp__figma__get_design_context` — variant별 정확한 토큰 바인딩 확인. 특히 각 `filled` 조합의 *기본 상태 배경*(category마다 다름 — 예: inline `filled/primary` = `container/brand/secondary`, module `filled/primary` = `container/brand/primaryHigh`).

조합별로 기록: bg, text color, border(outline), pressed 오버레이(`state/stateLayer/pressed-*`), disabled(container/border/text).

## 2. 모든 토큰 유틸 존재 확인

색·간격을 절대 하드코딩하지 않는다. 쓰기 전에 각 Tailwind 유틸이 생성된 테마에서 해석되는지 확인:

```bash
CSS=packages/tokens/dist/theme.css
grep -oE "component-(x|y)-[0-9]+" "$CSS" | sort -u      # spacing/component/*
grep -oE "text-label-(large|medium|small)" "$CSS" | sort -u
grep -E -- "--color-<token>:" "$CSS"                    # e.g. --color-container-brand-secondary:
```

토큰 → 유틸 매핑: `color/container/brand/secondary` → `bg-container-brand-secondary`, `color/text/base/white` → `text-text-base-white`, `color/border/base/higher` → `border-border-base-higher`, `spacing/component/x/12` → `px-component-x-12`, `font/label/medium` → `text-label-medium`, `radius/small` → `rounded-small`, `spacing/gap/4` → `gap-gap-4`, `color/state/stateLayer/pressed-inverseBlack` → `before:bg-state-state-layer-pressed-inverse-black`.

**토큰이 `theme.css`에 없을 때 (결정 지점):** Figma엔 있는데 생성물엔 없는 토큰이면 두 갈래다 —
- **정확한 값의 다른 토큰으로 매핑**(예: `container/base/high-level1` #f2f2f2 → 동일 값의 `bg-container-base-high`, 포커스 `state/focused` → 레포 관례 `ring-status-border-selected`). 문서 토큰표에 매핑 사실을 명시.
- **완전 동일 값이 없거나 사용자가 정확도를 원하면** `packages/tokens/src/tokens.ts`에 토큰을 추가하고 `node packages/tokens/scripts/build-css.ts`로 재생성. (이 세션에서 placeholder용 `text-base-quaternary` #747474를 이렇게 추가함.)

**tailwind-merge 주의:** 커스텀 스페이싱 스케일(`gap-gap-*` 등)은 twMerge가 **중복 제거하지 못한다** — `className`으로 usage마다 덮어써도 안 이길 수 있다. 값을 바꾸려면 **컴포넌트 소스에서** 바꾼다.

## 3. 컴포넌트 작성 (`packages/ui/src/components/<name>.tsx`)

**구조 — `button.tsx`를 따름:**

- `cva([...base], { variants, compoundVariants, defaultVariants })`.
- Base: `relative isolate inline-flex select-none items-center justify-center`, `gap-gap-4 rounded-small font-sans font-base leading-none transition-colors`, `focus-visible:` 링, `disabled:pointer-events-none [&_svg]:shrink-0`, 그리고 `before:` state-layer 오버레이(`hover:before:opacity-100 active:before:opacity-100`).
- **기하/타이포는 category류 축에** 둔다(padding + text size + `[&_svg]:size-*`). **색은 오직 `compoundVariants`에**, 실제로 달라지는 축을 키로. 어떤 축과 무관하게 스타일이 하나면(예: page `ghost`는 secondary만) 그 축을 compound 항목에서 생략해 cva 기본값이 매칭되게 한다.
- `defaultVariants`는 가장 흔한 조합(page/filled/primary).

**Props = Figma 정의 조합만 허용하는 discriminated union (핵심 규칙):**

`VariantProps<typeof cva>`를 노출하지 말 것(모든 축을 독립적으로 허용함). 대신 손수 union을 작성해 잘못된 조합이 **컴파일 에러**가 되게 한다:

```ts
type XVariantProps =
  | { category?: "page"; variant?: "filled"; hierarchy?: "primary" | "secondary" }
  | { category?: "page"; variant: "ghost"; hierarchy?: "secondary" }
  | { category: "module"; variant?: "filled"; hierarchy?: "primary" | "secondary" | "tertiary" }
  | { category: "module"; variant: "outline" | "ghost"; hierarchy?: "primary" | "secondary" }
  | { category: "inline"; variant?: "filled" | "outline" | "ghost"; hierarchy?: "primary" | "secondary" };

export type XProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean; iconStart?: React.ReactNode; iconEnd?: React.ReactNode;
} & XVariantProps;
```

- **기본 category는 optional**(`category?: "page"`)이라 `<X>` 단독으로 동작.
- 한 분기에서 variant를 필수로 하면(`variant: "ghost"`) 그 분기의 hierarchy가 좁혀진다.
- 미정의 조합에 **런타임 fallback 없음** — Figma에 없으면 타입에도 compoundVariants에도 없다(매칭 안 되는 조합은 스타일 없이 렌더 = 타입 에러였어야 함, 그게 정상).
- 컴포넌트 body: `forwardRef`, `asChild`면 `Slot`, `{iconStart}{children}{iconEnd}` 렌더.
- `{ X, xVariants }` 익스포트 + `export type XProps`.

`packages/ui/src/index.ts` 갱신. 병합 시 흡수된 파일 삭제 + 익스포트 제거.

**상태는 프롭이 아니라 CSS/네이티브:** Figma의 `state`(hover/pressed/focus)나 `isTyping`(포커스) 같은 상호작용 축은 코드에서 프롭이 아니라 CSS(`hover:`/`active:`/`focus-within:`)로, `isDisabled`는 네이티브 `disabled`로 표현한다.

**레이아웃 전용/조합 컴포넌트 (doc-only 병합):** 색·크기를 자식에 전부 위임하는 순수 *레이아웃* 래퍼(예: `ButtonGroup`은 `Button`들을 배치; `[Button Group] CTA/Bottom Sheet/Dialog/Card` 세트는 넣는 자식 `Button`만 다름). 새 Figma 세트가 그런 기존 컴포넌트에 1:1 대응하고 **자식 구성만** 다르면(새 레이아웃 축 없음, 모든 자식 스타일이 기존 컴포넌트로 표현 가능 — 각 토큰이 기존 variant 유틸로 해석되는지 확인) **doc-only 병합**: 컴포넌트 docstring, `registry`의 `description`/`meta.ai`, 문서 페이지만 갱신하고 **무의미한 프롭/축을 추가하지 않는다.** 래퍼 자신이 소유하는 스타일을 바꿀 때만 실제 축 추가. 이 매핑을 보고에 명시.

**새 레이아웃 컨테이너 (버튼류 아님):** 컨테이너 컴포넌트(예: `Cta` — `onFrameHigh` 배경 축 + 선택적 시스템 UI 슬롯 + `children`인 화면 하단 액션 영역)는 상호작용 요소가 아니므로 버튼 base(포커스 링, state-layer `before:`, `inline-flex`)를 생략. 자신이 소유한 축(예: 배경)만을 위한 **최소 `cva`**를 쓰고, boolean/슬롯은 평범한 프롭으로, 실제 액션은 `children`으로 조합(안에 `ButtonGroup`을 넣음). OS 스펙 기하(예: iOS 홈 인디케이터 5px/134px)는 리터럴로 둬도 되지만 **색은 반드시 토큰에 바인딩**한다.

## 4. 레지스트리 (`registry/registry.ts`) + 재빌드

`RegistryItem` 하나 추가/병합: `name`, `title`, `description`, `dependencies`(`@radix-ui/react-slot`, `class-variance-authority`, `clsx`, `tailwind-merge`), `files`(컴포넌트 + `lib/utils.ts`), `meta.ai` 가이드. `meta.ai` 줄은 **Figma 정의 조합만 유효(타입으로 강제)**임을 명시하고 category별로 나열한다. 그다음 재빌드:

```bash
node apps/docs/scripts/build-registry.ts   # emits public/r/<name>.json + index.json
```

병합으로 사라진 컴포넌트의 `apps/docs/public/r/<removed>.json`은 삭제.

## 5. 문서 페이지 — shadcn 형식

`apps/docs/app/components/<name>/page.tsx`. 섹션 순서:

1. **Header** — kicker `Components`, `h1`(`text-3xl font-bold tracking-tight`), Figma 세트를 언급하는 한 문단 `text-lg` 흐린 설명.
2. **Hero 플레이그라운드** — 헤더 바로 아래 `<XPlayground />`(preview + props + code 통합 카드). 컨트롤이 Figma 세트 속성을 반영한다는 짧은 캡션 권장.
3. **Installation** — `### CLI`(`npx @uds/cli add <name>`) + `### Manual · MCP`(`mcpServers` JSON).
4. **Usage** — `import` 줄 + 최소 `<X …>` 스니펫, `CodeBlock`으로.
5. **Examples** *(선택)* — hero 플레이그라운드가 이미 모든 Figma variation을 재현하면 생략(대부분 기본). 정적 매트릭스가 플레이그라운드로 못 보여주는 걸 더할 때만 포함하고, category별(`variant × hierarchy`) `Preview` 하나씩 + `### Icon`/`### States`.
6. **API Reference** — **모든** 프롭 표, 각각 **Origin** 배지 + 범례. 미정의 조합이 컴파일 에러란 주석(구체 예시 하나 명시).
7. **Design Tokens** — 용도 → Figma 토큰 → 값 표.
8. **AI 가이드** — **표**(`분류` | `가이드`), `AI_GUIDE: { category, rule }[]` 배열 기반 규칙 한 줄씩(`meta.ai`의 `[분류]` 접두사와 일치). 컴포넌트에 맞는 분류 선택(예: 구조 · 콘텐츠 · 맥락 · 색상·토큰).

### 타이포그래피 (shadcn 문서 스케일)

shadcn 문서 스케일에 맞추고 헤딩을 키우지 않는다:

- `h1` 페이지 제목 → `text-3xl font-bold tracking-tight`
- `H2` 섹션 → `mt-12 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0`
- `H3` 하위 → `mt-8 text-xl font-semibold tracking-tight`
- lead 설명 → `text-lg text-text-base-tertiary`; 본문/헬퍼 → `text-sm text-text-base-tertiary`

### Prop Origin (Figma / Code / Both)

API Reference의 모든 프롭을 "어디에 사는가"로 분류:

- **Figma** — Figma 세트 속성일 뿐, 코드에선 children/다른 프롭으로 표현(예: `contentType`, `context`/set).
- **Code** — Figma 대응 없는 코드 전용(`children`, `className`, `…HTMLAttributes`).
- **Both** — Figma·코드 공용 실제 프롭(예: `direction`).

border+text가 `currentColor`를 공유하는 outline 칩으로 렌더:

```tsx
function OriginBadge({ origin }: { origin: "figma" | "code" | "both" }) {
  const map = {
    figma: { label: "Figma", cls: "text-text-brand-primary-high" },
    code: { label: "Code", cls: "text-text-base-tertiary" },
    both: { label: "Both", cls: "text-text-base-primary" },
  } as const;
  const { label, cls } = map[origin];
  return (
    <span className={`inline-flex items-center rounded-full border border-current px-2 py-0.5 text-[10px] font-medium ${cls}`}>
      {label}
    </span>
  );
}
```

프롭은 **Figma 속성 순서**로 나열(Figma variant 이름 순서, 예: `direction` 다음 `contentType`) 후 Code 전용.

재사용할 로컬 헬퍼: `H2`, `H3`, `OriginBadge`, `GuideGroup`, 그리고 `Preview`(Examples 포함 시만). 프롭이 엄격한 union이라 **데이터 기반** `.map()` 안의 `<X>`는 캐스트 헬퍼가 필요:

```ts
function demo(category: string, variant?: string, hierarchy?: string): XProps {
  return { category, variant, hierarchy } as XProps;   // static tables are known-valid
}
```

리터럴 프롭 사용(`<X category="inline" variant="ghost" hierarchy="primary" />`)은 완전 타입 검사되게 캐스트 없이 둔다(문서가 스스로 검증).

`apps/docs/app/layout.tsx`의 `NAV`에 컴포넌트 추가. 병합으로 사라진 내비 항목과 `app/components/<removed>/` 디렉터리 삭제.

## 6. 플레이그라운드 (`<name>-playground.tsx`)

`"use client"`. 컨트롤 패널은 **Figma 세트 속성을 반영**해야 함 — Figma 속성마다 `select` 하나(여러 세트를 병합한 컴포넌트면 `context`/set select 추가), **Figma 속성 순서**로 — 사용자가 Figma가 정의한 모든 variation을(그리고 *그것만*) 재현할 수 있게.

**Controls (`controls: Control[]`)**

- 컨트롤 순서를 Figma에 맞춤(예: `context` → `direction` → `contentType`).
- **의존 드롭다운:** select의 `options`가 현재 state의 함수일 수 있음 — `options: (s) => string[]` — 상위 선택이 정의한 것만 하위 메뉴에 뜨게. 불가능한 조합은 절대 선택 불가(예: `Dialog · filled+outline`, `filled+ghost · row`). `PropsPlayground`가 변경 후 state를 순서대로(선언 순) cascade 정규화하므로 구동 축을 먼저 둔다.

```tsx
const controls: Control[] = [
  { name: "context", type: "select", options: ["CTA", "Bottom Sheet", "Dialog", "Card"], default: "CTA" },
  { name: "direction", type: "select", options: ["row", "column"], default: "row" },
  { name: "contentType", type: "select",
    options: (s) => CONTENT_BY_CONTEXT[s.context as Ctx].filter((ct) => ORIENTATION[ct] === s.direction),
    default: "filled+filled" },
];
```

**Preview** — `render`가 실제 컴포넌트를 만든다. 조합 컴포넌트는 (Figma) 선택을 실제 자식 구성으로 매핑; 단일 컴포넌트는 느슨한 bag을 엄격한 프롭으로 캐스트해 spread:

```tsx
render={(props) => {
  const p = { category: props.category, variant: props.variant,
    hierarchy: props.hierarchy, disabled: props.disabled as boolean } as XProps;
  return <X {...p}>{String(props.children)}</X>;
}}
```

**Code** — Code 탭은 일반 prop bag이 아니라 **실제 소스 구조**를 반영해야 함. 개발자가 실제로 쓸 것을 그대로 내보내는 `code: (state) => string` override 전달(조합 컴포넌트는 `<Wrapper>` + children 트리). `render`와 `code`를 같은 매핑에서 구동해 어긋나지 않게.

공용 `PropsPlayground`는 **Preview / Code** 탭바가 있는 테두리 카드 하나를 렌더: Preview = 라이브 컴포넌트(좌) + 프롭 컨트롤(우); Code = `code(state)` 출력(override 없으면 일반 생성기) + 복사 버튼. 페이지마다 fork하지 말고 **가산적으로만** 확장. 안정 API는 `componentName`, `controls`(정적 **또는** `(state) => string[]` options), `childrenProp`, `render`, 선택적 `code` override.

## 7. 검증 (필수)

`pnpm typecheck`가 정석이나 **corepack pnpm은 Node ≥ 25에서 크래시**(`ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING`). 대안 — 워크스페이스 TS 컴파일러를 직접 실행(버전 무관하게 `find`로 해석):

```bash
TSC="$(find . -path '*/typescript/bin/tsc' | head -1)"
node "$TSC" --noEmit -p packages/ui/tsconfig.json && echo ui-ok
rm -rf apps/docs/.next/types   # 삭제된 페이지를 참조하는 오래된 생성 validator 제거
node "$TSC" --noEmit -p apps/docs/tsconfig.json && echo docs-ok
```

**네거티브 타입 테스트** — `packages/ui/src/`에 임시 파일을 넣고 타입체크해 의도한 잘못된 줄만 에러 나는지 확인 후 삭제:

- **Discriminated union 컴포넌트**(Button류): union이 비-Figma 조합을 거부함을 증명.
  ```tsx
  // packages/ui/src/__typetest__.tsx
  import { X } from "./index.ts";
  const ok = <X category="module" variant="outline" hierarchy="secondary" />;
  const bad = <X category="page" variant="outline" />;      // MUST error
  ```
- **독립 boolean 축 컴포넌트**(TextField류, sparse union 없음): 디자인 전용 축이 코드 프롭이 아님을 증명(예: `<X isTyping />` 는 에러여야 함) + 프롭 타입 강제(`messages="x"` 에러).

의도적으로 잘못된 줄마다 `TS2322 … is not assignable`, 정상 줄엔 에러 없음. 임시 파일 삭제.

## 8. (선택) Code Connect

새 컴포넌트의 Figma 세트를 코드에 연결해 Dev Mode가 스니펫 + GitHub 소스를 보이게 하려면 **`uds-code-connect`** 스킬을 쓴다 — v2 템플릿 워크플로(`*.figma.ts`), 토큰 위생, 퍼블리시, 문서 상태 페이지를 모두 다룬다. 요약: 세트 node마다 `*.figma.ts` 템플릿 하나(`@uds/ui`에서 import, glyph 접두사 포함 정확한 Figma 프롭명 매핑, 조합은 `figma.children("*")`), 그다음 `pnpm figma:check` → `pnpm figma:publish -- --force`.

---

## 체크리스트

- [ ] Figma 메타데이터 읽음; category별 허용 `variant × hierarchy` 기록.
- [ ] 모든 색·간격·폰트 유틸을 `packages/tokens/dist/theme.css`에서 확인(없으면 정확값 매핑 또는 토큰 재생성).
- [ ] 컴포넌트: 기하는 size 축, 색은 compoundVariants, 모든 토큰 바인딩(하드코딩 hex 없음).
- [ ] 프롭은 손수 작성한 discriminated union — 잘못된 조합 컴파일 안 됨; 런타임 fallback 없음.
- [ ] `index.ts` 갱신; 병합으로 사라진 파일/익스포트 삭제.
- [ ] 레지스트리 항목 추가/병합; `meta.ai` 줄에 `[분류]` 접두사; `build-registry.ts` 재실행; 낡은 JSON 삭제.
- [ ] 문서 페이지가 섹션 순서대로(Examples 선택); shadcn 타이포(h1 `text-3xl`, H3 `text-xl`); hero 플레이그라운드; `demo()` 캐스트는 `.map()`에서만.
- [ ] 플레이그라운드 컨트롤이 Figma 프롭을 Figma 순서로 반영; 의존 드롭다운이 불가능 조합 숨김; Code 탭이 실제 소스 구조 반영하는 `code` override 사용.
- [ ] API Reference에 모든 프롭 + Figma/Code/Both Origin 배지 + 범례.
- [ ] AI 가이드가 `분류 | 가이드` 표로 렌더(`meta.ai` 분류와 일치).
- [ ] doc-only 병합 시: 무의미한 프롭 미추가; docstring + 레지스트리 + 문서가 새 세트를 커버.
- [ ] `NAV` 갱신; 삭제된 페이지/디렉터리 제거.
- [ ] `packages/ui` + `apps/docs` 타입체크 통과; 네거티브 타입 테스트 통과; 임시 파일 삭제.
