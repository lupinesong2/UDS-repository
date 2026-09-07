---
name: uds-component
description: Figma 컴포넌트 세트 URL 하나로 packages/ui의 UDS React 컴포넌트를 만들거나 병합하고, 레지스트리 항목과 케이스별 정적 예시·Copy Page가 있는 표준 문서 페이지까지 생성한다. figma.com 컴포넌트 URL을 붙여넣어 컴포넌트를 만들/추가/병합하려 할 때(링크만 있어도), 또는 "컴포넌트/버튼 합치자", "Figma 컴포넌트 추가", "registry 등록", "컴포넌트 문서 만들어", "add/merge component" 라고 할 때 트리거.
---

# UDS 컴포넌트 만들기 — Figma에서 코드·문서까지 한 번에

**입력은 Figma 컴포넌트 세트 URL 하나. 출력은 항상 아래 5가지.** 이 스킬은 그 사이를 재현 가능한 방식으로 잇는다.

---

## 이 스킬이 하는 일 (한눈에)

Figma에 그려진 컴포넌트를, 디자인이 정의한 조합만 정확히 허용하는 **완성도 높은 React 컴포넌트**로 옮기고, 그것을 **눌러보며 이해하는 문서 페이지**로 만들고, **팀이 설치·활용할 수 있게 등록·검증**까지 끝낸다.

세 가지 일을 하지만 **하나의 파이프라인**이다 — 뒷 단계가 앞 단계의 결과(정확한 프롭·토큰·축)를 그대로 참조하므로 분리하지 않는다.

| 단계 | 하는 일 | Phase | 이 단계의 산출물 |
|---|---|---|---|
| **Stage A · 코드화** | Figma 세트 → React 컴포넌트 | 1–3 | `packages/ui/…/<name>.tsx` (+토큰) |
| **Stage B · 문서화** | 코드 → 등록 + 문서(정적 예시) | 4–6 | 레지스트리 항목, 문서 페이지, Copy Page |
| **Stage C · 통합·검증** | 전체를 타입체크하고 (선택)Figma 연결 | 7–8 | 타입체크 통과, Code Connect |

**최종 산출물 5가지 (항상 이 5개):**

1. **하나의 `cva` 컴포넌트** — `button.tsx` 구조를 따름
2. **Figma가 정의한 조합만 컴파일되는** 손수 작성한 discriminated union props
3. 모든 색·간격·폰트를 **Figma 토큰 유틸에 바인딩** (하드코딩 금지)
4. **레지스트리 항목** + 재빌드된 `r/<name>.json`
5. **표준 문서 페이지** — 케이스별 정적 예시 + Copy Page(LLM 복사)

> Phase 순서대로 진행하고 **검증(Phase 7)을 건너뛰지 않는다.**

---

## 용어 미니사전 (디자이너를 위해)

이 스킬이 만드는 코드에 나오는 용어. 흐름을 이해하는 데만 참고하면 된다.

| 용어 | 쉬운 설명 |
|---|---|
| **cva** | "이 속성이면 이 스타일" 규칙표. Figma의 variant 조합 → CSS 클래스 매핑을 담는 함수. |
| **discriminated union (props)** | "Figma에 있는 조합만 허용"하는 타입 장치. 없는 조합을 코드로 쓰면 **컴파일 에러**가 난다. |
| **토큰 유틸** | 색·간격·폰트를 하드코딩(#000 같은) 대신 디자인 토큰 이름(`bg-container-brand-secondary`)으로 쓰는 것. |
| **registry(레지스트리)** | 이 컴포넌트를 다른 프로젝트가 `npx @uds/cli add` 로 설치할 수 있게 하는 배포 목록. |
| **Example (정적 예시)** | 케이스마다 실제 컴포넌트 프리뷰 카드 + 그와 일치하는 코드 블록을 나란히 보여주는 것. |
| **Copy Page** | 페이지를 LLM용 마크다운으로 클립보드에 복사하는 헤더 버튼(llms.txt의 페이지 버전). |

---

## 트리거 & 입력

**필수 입력은 Figma 컴포넌트 세트 URL 하나뿐이다.** `figma.com/design/<fileKey>/...?node-id=<id>` 링크만 붙여넣어도(선택적으로 "만들어줘"/"추가"/"합치자") 이 스킬이 트리거된다. `/uds-component` 입력은 선택.

**링크만으로 자율 진행한다:**

1. URL에서 node id 추출(`?node-id=1-2` → `1:2` 또는 `1-2`) 후 Stage A로 세트를 읽는다.
2. **컴포넌트 이름을 Figma 세트 이름에서 유도** — `[Button] Inline` → `button`, `[Chip] …` → `chip`. 여러 세트가 접두사를 공유하면(Page/Module/Inline) `category` 축을 가진 **하나의 컴포넌트로 병합**한다(`button.tsx` 참고).
3. **신규 vs 병합 결정** — 같은 이름 컴포넌트가 `packages/ui/src/components/`에 있으면 확장/병합, 없으면 신규 생성.
4. Phase 1–7을 끝까지 실행한 뒤, 생성/수정/삭제된 모든 파일과 타입체크 결과를 보고한다.

각 Phase마다 확인받지 말 것 — **아래 "멈춰야 할 때"에 해당할 때만** 멈춘다.

---

## ⛔ 멈춰서 사용자에게 물어봐야 할 때 (그 외에는 자율 진행)

| 상황 | 왜 멈추나 |
|---|---|
| **이름·category 매핑이 정말 모호** | 잘못 병합하면 되돌리기 어렵다. 명백한 매핑이면 고르고 명시만 하고 진행. |
| **`theme.css`에 없는 토큰** | 정확값 매핑이 있으면 진행하되, 완전 동일 값이 없고 정확도가 중요하면 사용자 판단 필요. |
| **기존 조합과 모순되는 Figma 조합** | 기존 컴포넌트의 타입/스타일과 충돌하면 임의로 덮지 않는다. |

---

## 레포 맵 (source of truth)

| 대상 | 경로 |
|---|---|
| 컴포넌트 소스 | `packages/ui/src/components/<name>.tsx` |
| 배럴 익스포트 | `packages/ui/src/index.ts` |
| `cn` 유틸 | `packages/ui/src/lib/utils.ts` |
| 토큰 유틸(생성물) | `packages/tokens/dist/theme.css` |
| 토큰 소스 | `packages/tokens/src/tokens.ts` → `node packages/tokens/scripts/build-css.ts` 로 재생성 |
| 레지스트리 매니페스트 | `registry/registry.ts` |
| 레지스트리 빌드 | `apps/docs/scripts/build-registry.ts` → `apps/docs/public/r/<name>.json` + `index.json` 생성 |
| llms.txt 빌드 | `apps/docs/scripts/build-llms.ts` → `public/llms.txt` + `llms-full.txt` + `components/<name>/llms.txt` (레지스트리에서 생성) |
| 문서 페이지 | `apps/docs/app/components/<name>/page.tsx` |
| 공용 문서 primitives | `apps/docs/components/doc.tsx` (`DocHeader`·`Installation`·`H2`·`H3`·`Example`·`PropsTable`) |
| Copy Page 버튼(공용) | `apps/docs/components/copy-page-button.tsx` |
| 사이드바/상단 내비·TOC | `apps/docs/components/site-chrome.tsx` (`SIDE`·`TOP` 배열) |

`/.claude/rules/figma-mcp-integration.md`(캔버스 쓰기 규칙)도 준수하되, **이 스킬은 레포 안의 코드**를 다루지 Figma 캔버스에 쓰지 않는다.

---

# Stage A · 코드화 (Phase 1–3)

> **목적** — Figma 세트를, 디자인이 정의한 조합만 정확히 허용하는 React 컴포넌트로 옮긴다.

### ✅ 이 단계 완료 기준 (Definition of Done)
- [ ] category별 허용 `variant × hierarchy` 조합을 Figma 메타데이터에서 기록했다.
- [ ] 쓰는 모든 색·간격·폰트 유틸이 `theme.css`에서 해석됨을 확인했다 (**하드코딩 hex 0개**).
- [ ] 컴포넌트가 `button.tsx` 구조를 따르고, **프롭은 손수 작성한 discriminated union** — Figma에 없는 조합은 컴파일 안 됨.
- [ ] `index.ts` 갱신; 병합으로 사라진 파일·익스포트 삭제.

### 🎯 품질 바
색은 오직 `compoundVariants`에, 기하/타이포는 크기 축에. 미정의 조합에 **런타임 fallback을 두지 않는다** — 타입으로 막는 게 정답.

---

## Phase 1 · Figma 스펙 추출

`get_design_context` 호출 전에 `figma:figma-implement-design`을 먼저 로드한다(필수). 코어 컴포넌트 라이브러리 파일은 **`spWdVkr7RbwWOyDG6xbY4z`** ("[Test] Core Component v.1.0.0"). node URL/id가 주어지면 이 순서로 호출한다:

1. `mcp__figma__get_screenshot` — 시각적 진실(행 = variant×hierarchy, 열 = state).
2. `mcp__figma__get_metadata` — 컴포넌트 세트 축. 심볼 이름이 축을 인코딩함(예: `variant=outline, hierarchy=secondary, state=focused, isDisabled=true`). 각 심볼의 height와 **실제로 존재하는 `variant × hierarchy` 조합**을 기록 — 이게 **허용 타입 union을 정의**한다.
3. `mcp__figma__get_variable_defs` — 바인딩된 토큰(색·간격·radius·폰트).
4. `mcp__figma__get_design_context` — variant별 정확한 토큰 바인딩 확인. 특히 각 `filled` 조합의 *기본 상태 배경*(category마다 다름 — 예: inline `filled/primary` = `container/brand/secondary`, module `filled/primary` = `container/brand/primaryHigh`).

조합별로 기록: bg, text color, border(outline), pressed 오버레이(`state/stateLayer/pressed-*`), disabled(container/border/text).

**⚠️ 마크가 벡터/SVG 글리프일 때 — 스크린샷으로 모양을 추측하지 말 것 (라디오에서 겪은 실수):** 라디오 점·체크마크·토글 노브처럼 아이콘형 마크는 `get_screenshot`이 **저해상도라 형태를 구분 못 한다**. 반드시 `get_design_context`가 준 `http://localhost:3845/assets/<hash>.svg` 에셋을 **직접 `curl`해서 path 지오메트리(반지름·stroke 두께·구멍 크기)를 읽고** 정확히 재현한다. 실제 사례: 라디오 **선택 상태**는 "바깥 링 + gap + 안쪽 점"(과녁형)이 아니라 **border 두께로 만든 도넛 + 투명 중앙 구멍**이었다 — SVG는 `r=10`(바깥)~`r=4`(구멍) 채운 annulus였고, 그래서 CSS로는 `border-[6px]`(medium)/`border-[5px]`(small) 원으로 재현했다. 비슷한 컴포넌트(Checkbox)의 렌더 패턴을 복사하기 **전에** SVG로 이 컴포넌트의 실제 형태를 먼저 확인한다.

## Phase 2 · 모든 토큰 유틸 존재 확인

색·간격을 절대 하드코딩하지 않는다. 쓰기 전에 각 Tailwind 유틸이 생성된 테마에서 해석되는지 확인:

```bash
CSS=packages/tokens/dist/theme.css
grep -oE "component-(x|y)-[0-9]+" "$CSS" | sort -u      # spacing/component/*
grep -oE "text-label-(large|medium|small)" "$CSS" | sort -u
grep -E -- "--color-<token>:" "$CSS"                    # e.g. --color-container-brand-secondary:
```

**토큰 → 유틸 매핑:** `color/container/brand/secondary` → `bg-container-brand-secondary`, `color/text/base/white` → `text-text-base-white`, `color/border/base/higher` → `border-border-base-higher`, `spacing/component/x/12` → `px-component-x-12`, `font/label/medium` → `text-label-medium`, `radius/small` → `rounded-small`, `spacing/gap/4` → `gap-gap-4`, `color/state/stateLayer/pressed-inverseBlack` → `before:bg-state-state-layer-pressed-inverse-black`.

**토큰이 `theme.css`에 없을 때 (결정 지점):** Figma엔 있는데 생성물엔 없는 토큰이면 두 갈래다 —
- **정확한 값의 다른 토큰으로 매핑**(예: `container/base/high-level1` #f2f2f2 → 동일 값의 `bg-container-base-high`, 포커스 `state/focused` → 레포 관례 `ring-status-border-selected`). 문서 토큰표에 매핑 사실을 명시.
- **완전 동일 값이 없거나 사용자가 정확도를 원하면** `packages/tokens/src/tokens.ts`에 토큰을 추가하고 `node packages/tokens/scripts/build-css.ts`로 재생성. (이 세션에서 placeholder용 `text-base-quaternary` #747474를 이렇게 추가함.)

**tailwind-merge 주의:** 커스텀 스페이싱 스케일(`gap-gap-*` 등)은 twMerge가 **중복 제거하지 못한다** — `className`으로 usage마다 덮어써도 안 이길 수 있다. 값을 바꾸려면 **컴포넌트 소스에서** 바꾼다.

## Phase 3 · 컴포넌트 작성 (`packages/ui/src/components/<name>.tsx`)

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

---

# Stage B · 문서화 (Phase 4–6)

> **목적** — 만든 컴포넌트를 팀이 설치·활용할 수 있게 등록하고, 눌러보며 이해하는 문서로 만든다.

### ✅ 이 단계 완료 기준
- [ ] 레지스트리 항목 추가/병합; `meta.ai` 줄에 `[분류]` 접두사; `build-registry.ts` + `build-llms.ts` 재실행; 낡은 JSON 삭제.
- [ ] 문서 페이지를 **`button/page.tsx` 복제**로 시작; 섹션 순서(Header+Copy Page → Hero정적 → Install → Usage → Examples → Features → API 4열 → Accessibility)·타이포 Button과 동일.
- [ ] Examples는 **케이스별 정적 `Example`(프리뷰+코드)**; 인터랙티브 플레이그라운드 없음; preview↔code 일치.
- [ ] API Reference = `Prop·Type·Default·Description` **4열** 표; **별도 "AI 가이드" 섹션 없음**(Copy Page + `meta.ai`가 LLM 채널).
- [ ] `site-chrome.tsx`의 `SIDE`에 항목 추가; 병합으로 사라진 페이지/디렉터리 삭제.

### 🎯 품질 바
문서는 **스스로 검증**한다 — 각 `Example`의 `preview`(실제 컴포넌트)와 `code` 문자열이 1:1로 일치하고, 리터럴 프롭 예시는 타입 검사를 통과해야 한다.

---

## Phase 4 · 레지스트리 (`registry/registry.ts`) + 재빌드

`RegistryItem` 하나 추가/병합: `name`, `title`, `description`, `dependencies`(`@radix-ui/react-slot`, `class-variance-authority`, `clsx`, `tailwind-merge`), `files`(컴포넌트 + `lib/utils.ts`), `meta.ai` 가이드. `meta.ai` 줄은 **Figma 정의 조합만 유효(타입으로 강제)**임을 명시하고 category별로 나열한다. 그다음 재빌드:

```bash
node apps/docs/scripts/build-registry.ts   # emits public/r/<name>.json + index.json
node apps/docs/scripts/build-llms.ts        # emits public/llms.txt + llms-full.txt + components/<name>/llms.txt
```

병합으로 사라진 컴포넌트의 `apps/docs/public/r/<removed>.json`은 삭제.

> `meta.ai`의 `[분류]` 접두사는 그대로 유지한다(AI 파싱용). 이 `meta.ai`가 곧 llms.txt·Copy Page의 본문이 되므로(빌드 스크립트가 생성) 여기서 정확히 쓰면 LLM 문서가 공짜로 완성된다.

## Phase 5 · 문서 페이지 (표준 형식)

`apps/docs/app/components/<name>/page.tsx`.

**⭐ 기준 템플릿은 오직 하나 — `app/components/button/page.tsx`.** 새 컴포넌트는 **이 페이지를 그대로 복제**해 시작한다. 문서 포맷은 **shadcn 스타일(정적 케이스 예시 + Copy Page)** 을 따른다 — 인터랙티브 플레이그라운드는 **더 이상 쓰지 않는다**. 어느 형제가 더 비슷해 보여도 항상 Button 페이지를 따른다.

**섹션 순서 (Button 기준):**

1. **Header** — kicker `Components`(`text-sm font-medium text-text-brand-primary-high`) + `h1`(`mt-2 scroll-m-20 text-3xl font-semibold tracking-tight`) + 한 문단 설명(`mt-3 text-base text-text-base-tertiary`). 헤더는 `flex items-start justify-between`으로 **오른쪽 상단에 `<CopyPageButton slug="<name>" />`**(생성된 llms.txt를 fetch — 아래 Phase 6).
2. **Hero preview (정적)** — 헤더 아래 테두리 카드 하나에 대표 인스턴스 몇 개를 정적 배치(`flex flex-wrap items-center justify-center gap-3 rounded-large border bg-container-base-low p-10`). 컨트롤·탭 없음.
3. **Installation** — 한 줄 설명 문단 + `npx @uds/cli add <name>`(bash `CodeBlock`). **`### CLI`/`### Manual · MCP` 하위 섹션은 두지 않는다** — Installation은 CLI 한 줄만.
4. **Usage** — `import` 줄 + 최소 `<X …>` 스니펫.
5. **Examples** — Figma 케이스별로 `H3`(케이스명) + `<Example preview={…} code="…" />`. 대표 조합만 간결하게(전 조합 나열 금지).
6. **Features** — 불릿 리스트(핵심 특징 5~6개).
7. **API Reference** — **4열 표**(`Prop` | `Type` | `Default` | `Description`). 인라인 배열 `.map()`. 표 아래 `text-xs text-text-base-tertiary` 주석으로 (a) 미정의 조합 컴파일 에러 예, (b) 상태(checked/disabled 등)는 프롭이 아니라 네이티브·CSS로 처리.
8. **Accessibility** — 불릿 리스트(시맨틱 요소, `focus-visible`, 네이티브 `disabled`/aria, 아이콘 단독 시 `aria-label` 등).

> **Design Tokens 섹션·AI 가이드 섹션은 페이지에 두지 않는다.** 토큰 매핑은 컴포넌트 소스·레지스트리에만 있고, 문서 페이지는 예시·프롭·접근성에 집중한다. LLM 채널은 **Copy Page(생성된 llms.txt)** + 레지스트리 **`meta.ai`** — 둘 다 레지스트리에서 나온 같은 출처다. 셸(`site-chrome.tsx`)이 우측 "On this page" TOC를 H2에서 자동 생성한다.

### 타이포그래피 (Button 실측값 — 헤딩 키우지 말 것)

- `h1` → `mt-2 scroll-m-20 text-3xl font-semibold tracking-tight`
- `H2` 헬퍼 → `mt-12 scroll-m-20 text-lg font-semibold tracking-tight first:mt-0`
- `H3` 헬퍼 → `mt-8 text-base font-semibold tracking-tight`
- lead → `text-base text-text-base-tertiary`; 본문 → `text-sm`; 표 주석 → `text-xs`

공용 primitives를 `components/doc.tsx`에서 import한다(페이지에서 재선언 금지): `DocHeader`(헤더+Copy Page), `Installation`(CLI 설치), `H2`·`H3`, `Example`(프리뷰+코드), `PropsTable`(4열). 페이지에는 `PROPS` 배열(`[string,string,string,ReactNode][]`)과 컴포넌트별 hero·Examples·Features·Accessibility만 남는다. 엄격 union 프롭이 필요하면 행 객체를 `as XProps` 캐스트.

**사이드바 등록:** `apps/docs/components/site-chrome.tsx`의 `SIDE` 배열에서 알맞은 카테고리(Action·Selection·Input·Navigation 등)에 항목을 추가한다. 사라진 항목·`app/components/<removed>/` 디렉터리 삭제.

## Phase 6 · Example 헬퍼 & Copy Page 버튼

인터랙티브 플레이그라운드는 쓰지 않는다. 대신 **케이스별 정적 예시** + **Copy Page**.

**Example (공용 `doc.tsx`):** `<Example preview={…} code="…" />` — 프리뷰 카드 + 그와 정확히 일치하는 소스. 페이지에서 재선언하지 않고 import해서 쓴다.

- `preview`는 **실제 컴포넌트 인스턴스**(엄격 union이면 `as XProps` 캐스트), `code`는 그와 **1:1로 일치하는** 소스 문자열.
- Figma 케이스명을 `H3`로 얹고 **대표 조합만** 보여준다(전 조합 나열 금지 — 그건 API 표가 담당).

**Copy Page = llms.txt (단일 출처):** 페이지에 손으로 `LLM_DOC`을 쓰지 않는다. 대신 `apps/docs/scripts/build-llms.ts`가 **레지스트리(`title`·`description`·`meta.ai`)에서** llms.txt 3종을 생성한다:

| 파일 | 용도 |
|---|---|
| `public/llms.txt` | 인덱스(컴포넌트 목록 + 링크) |
| `public/llms-full.txt` | 전체 문서 이어붙임 |
| `public/components/<name>/llms.txt` | 컴포넌트 1개 (Copy Page가 fetch) |

공용 버튼은 `<CopyPageButton slug="<name>" />` 하나만 넘긴다 — 클릭 시 `/components/<name>/llms.txt`를 fetch해 클립보드로 복사한다. 즉 **문서 페이지·Copy Page·llms.txt·`meta.ai`가 전부 같은 출처**라 드리프트가 없다.

- 컴포넌트를 추가/수정하면 **`node apps/docs/scripts/build-llms.ts`를 재실행**(레지스트리 빌드와 함께). `pnpm build`에도 체이닝돼 있다.
- llms.txt 품질은 곧 `meta.ai` 품질이다 — `meta.ai`를 잘 쓰면 llms.txt·Copy Page가 공짜로 채워진다.

---

# Stage C · 통합·검증 (Phase 7–8)

> **목적** — 만든 코드·문서가 실제로 컴파일되는지 증명하고, (선택) Figma Dev Mode에서 코드가 보이게 연결한다.

### ✅ 이 단계 완료 기준
- [ ] `packages/ui` + `apps/docs` 타입체크 통과.
- [ ] 네거티브 타입 테스트 통과(잘못된 조합이 실제로 에러남을 증명) 후 임시 파일 삭제.
- [ ] (선택) Code Connect 연결 시 `uds-code-connect` 스킬 사용.

### 🎯 품질 바
"컴파일된다"가 아니라 **"잘못된 조합은 컴파일 안 된다"까지 증명**한다. 이게 이 스킬의 핵심 약속이다.

---

## Phase 7 · 검증 (필수)

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

## Phase 8 · (선택) Code Connect

새 컴포넌트의 Figma 세트를 코드에 연결해 Dev Mode가 스니펫 + GitHub 소스를 보이게 하려면 **`uds-code-connect`** 스킬을 쓴다 — v2 템플릿 워크플로(`*.figma.ts`), 토큰 위생, 퍼블리시, 문서 상태 페이지를 모두 다룬다. 요약: 세트 node마다 `*.figma.ts` 템플릿 하나(`@uds/ui`에서 import, glyph 접두사 포함 정확한 Figma 프롭명 매핑, 조합은 `figma.children("*")`), 그다음 `pnpm figma:check` → `pnpm figma:publish -- --force`.

---

## 최종 체크리스트 (제출 전 전체 점검)

**Stage A · 코드화**
- [ ] Figma 메타데이터 읽음; category별 허용 `variant × hierarchy` 기록.
- [ ] 모든 색·간격·폰트 유틸을 `theme.css`에서 확인(없으면 정확값 매핑 또는 토큰 재생성).
- [ ] 컴포넌트: 기하는 size 축, 색은 compoundVariants, 모든 토큰 바인딩(하드코딩 hex 없음).
- [ ] 프롭은 손수 작성한 discriminated union — 잘못된 조합 컴파일 안 됨; 런타임 fallback 없음.
- [ ] `index.ts` 갱신; 병합으로 사라진 파일/익스포트 삭제.

**Stage B · 문서화**
- [ ] 레지스트리 항목 추가/병합; `meta.ai` 줄에 `[분류]` 접두사; `build-registry.ts` + `build-llms.ts` 재실행; 낡은 JSON 삭제.
- [ ] 문서 페이지를 `button/page.tsx` 복제로 시작; 섹션 순서·타이포 Button 동일; Header 우상단 **`<CopyPageButton slug="<name>" />`**.
- [ ] Examples = 케이스별 정적 `Example`(프리뷰+코드), 인터랙티브 플레이그라운드 없음; preview↔code 일치.
- [ ] API Reference = `Prop·Type·Default·Description` **4열** 표 + 표 아래 주석; **Features·Accessibility** 섹션 존재.
- [ ] `build-llms.ts` 재실행 → `/components/<name>/llms.txt` 생성 확인; `<CopyPageButton slug>`가 그걸 fetch; 별도 "AI 가이드" 섹션 없음.
- [ ] doc-only 병합 시: 무의미한 프롭 미추가; docstring + 레지스트리 + 문서가 새 세트를 커버.
- [ ] `site-chrome.tsx`의 `SIDE`에 항목 추가; 삭제된 페이지/디렉터리 제거.

**Stage C · 통합·검증**
- [ ] `packages/ui` + `apps/docs` 타입체크 통과; 네거티브 타입 테스트 통과; 임시 파일 삭제.
