/**
 * UDS registry manifest — the source of truth for what gets distributed.
 *
 * `build-registry.ts` reads each item's source files from `packages/ui/src`,
 * normalizes internal imports to the shadcn `@/` alias, and emits
 * `apps/docs/public/r/<name>.json` (+ `index.json`) following the shadcn
 * registry-item schema. Those files are consumed by:
 *   - the shadcn CLI:  `npx shadcn add <url>/r/button.json`
 *   - MCP registry servers that expose components to AI tools
 */

export type RegistryFile = {
  /** Path within `packages/ui/src`. */
  src: string;
  /** Install target in the consuming project. */
  target: string;
  type: "registry:ui" | "registry:lib";
};

export type RegistryItem = {
  name: string;
  type: "registry:ui";
  title: string;
  description: string;
  dependencies: string[];
  files: RegistryFile[];
  /** Freeform guidance surfaced to AI tools. */
  meta?: { ai?: string[] };
};

export const registry: RegistryItem[] = [
  {
    name: "button",
    type: "registry:ui",
    title: "Button",
    description:
      "동작을 트리거하는 클릭 가능한 요소. category(page 55px·module 44px·inline 33px) × variant(filled·outline·ghost) × hierarchy(primary·secondary·tertiary), iconStart/iconEnd, asChild 지원.",
    dependencies: [
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
    ],
    files: [
      {
        src: "components/button.tsx",
        target: "components/ui/button.tsx",
        type: "registry:ui",
      },
      { src: "lib/utils.ts", target: "lib/utils.ts", type: "registry:lib" },
    ],
    meta: {
      ai: [
        "category로 맥락을 고른다: 페이지 최상위 CTA는 page(55px), 모듈/카드 내부 액션은 module(44px), 콘텐츠 흐름 속 텍스트형 액션은 inline(33px). 기본값은 page.",
        "화면의 주요 액션에는 variant=filled hierarchy=primary(마젠타)를 1개만 사용한다.",
        "보조 액션에는 filled/secondary(블랙)·tertiary(그레이), 외곽선 outline, 텍스트형 ghost를 사용한다.",
        "Figma에 정의된 조합만 유효하다(타입으로 강제): page=filled(primary·secondary)·ghost(secondary), module=filled(primary·secondary·tertiary)·outline·ghost(primary·secondary), inline=filled·outline·ghost(primary·secondary). page엔 outline이, page·inline엔 tertiary가 없다.",
        "아이콘은 iconStart/iconEnd로 전달한다(page·module 24px, inline 16px).",
        "hover·pressed·focus·disabled 상태는 프롭이 아니라 CSS로 처리되므로 지정하지 않는다.",
        "링크 동작이 필요하면 asChild로 <a>/<Link>를 감싼다.",
        "색상은 Figma 토큰 유틸(bg-container-brand-primary-high, text-text-base-white 등)만 사용하고 하드코딩하지 않는다.",
      ],
    },
  },
  {
    name: "button-group",
    type: "registry:ui",
    title: "Button Group",
    description:
      "화면 하단·Bottom Sheet·Dialog·Card에서 주요 CTA를 함께 배치하는 버튼 그룹. Figma [Button Group] CTA·Bottom Sheet·Dialog·Card 네 세트에 1:1로 대응한다. direction(row=동일 너비 나란히 · column=풀너비 세로)만 소유하고, 버튼 크기·색상은 Button이 담당해(CTA/Bottom Sheet=page 55px, Dialog·Card=module 44px) filled·filled+filled·filled+outline·filled+ghost 패턴을 children으로 표현한다.",
    dependencies: [
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
    ],
    files: [
      {
        src: "components/button-group.tsx",
        target: "components/ui/button-group.tsx",
        type: "registry:ui",
      },
      {
        src: "components/button.tsx",
        target: "components/ui/button.tsx",
        type: "registry:ui",
      },
      { src: "lib/utils.ts", target: "lib/utils.ts", type: "registry:lib" },
    ],
    meta: {
      // Categorized with a [분류] prefix so tools (and the docs page) can group
      // the guidance: 구조 · 콘텐츠 · 맥락 · 색상·토큰.
      ai: [
        "[구조] ButtonGroup은 레이아웃 래퍼다 — 색상/hierarchy는 자식 Button이 결정하고, 그룹은 direction·간격(gap 8px)·자식 너비만 담당한다.",
        "[구조] direction=row는 자식을 동일 너비(flex-1)로 나란히, direction=column은 각 자식을 풀너비로 세로 배치한다. 기본값은 row.",
        "[콘텐츠] Figma contentType은 children으로 표현한다: filled=Button 1개, filled+filled/filled+outline=Button 2개(row), filled+ghost=filled Button + ghost Button(column).",
        "[콘텐츠] 존재하는 조합만 쓴다 — filled+outline은 Card 전용, filled+ghost는 column 전용이다. 미정의 조합(예: Dialog+filled+outline, filled+ghost+row)은 만들지 않는다.",
        "[맥락] Figma [Button Group] CTA·Bottom Sheet·Dialog·Card 네 세트에 1:1로 대응한다 — 레이아웃은 동일하고 맥락은 자식 Button의 category로 구분한다: CTA/Bottom Sheet=page(55px), Dialog·Card=module(44px).",
        "[색상·토큰] 맥락별 주요/보조 버튼: CTA/Bottom Sheet(page)=filled/primary(마젠타) + 어두운 filled/secondary. Dialog(module)=filled/primary(마젠타) + 회색 filled/tertiary(container/base/higher). Card(module)=중립 filled/secondary(어두움) + outline/primary(filled+outline) 또는 ghost/secondary.",
        "[색상·토큰] 그룹 자체에는 색상 토큰을 하드코딩하지 않는다(색상은 Button 토큰 유틸이 담당).",
      ],
    },
  },
  {
    name: "cta",
    type: "registry:ui",
    title: "CTA",
    description:
      "화면 하단에 주요 행동을 고정 배치하는 액션 영역. Figma [CTA] 세트에 대응한다. onFrameHigh(false=base/low·true=base/high)로 배경을 프레임에 맞추고, 액션은 children으로 ButtonGroup을 넣으며, hasSystemUiBottom(기본 true)이면 하단 시스템 UI(iOS 홈 인디케이터)를 렌더한다. systemUi 슬롯으로 시스템 UI를 교체할 수 있다.",
    dependencies: [
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
    ],
    files: [
      { src: "components/cta.tsx", target: "components/ui/cta.tsx", type: "registry:ui" },
      {
        src: "components/button-group.tsx",
        target: "components/ui/button-group.tsx",
        type: "registry:ui",
      },
      { src: "components/button.tsx", target: "components/ui/button.tsx", type: "registry:ui" },
      { src: "lib/utils.ts", target: "lib/utils.ts", type: "registry:lib" },
    ],
    meta: {
      ai: [
        "[구조] Cta는 화면 하단 액션 컨테이너다 — 액션은 children으로 ButtonGroup(+Button)을 넣고, 컨테이너는 배경·wrapper 패딩(component/x/20·component/y/16)·하단 시스템 UI만 담당한다.",
        "[맥락] onFrameHigh로 배경을 프레임에 맞춘다: false=background/base/low(#fcfcfc), true=background/base/high(#f2f2f2). 상위 프레임이 base/high면 true로 둔다.",
        "[시스템 UI] hasSystemUiBottom은 기본 true다 — 하단 시스템 UI(iOS 홈 인디케이터)를 렌더한다. 커스텀 하단 UI가 필요하면 systemUi 슬롯으로 교체한다.",
        "[색상·토큰] 배경·여백·홈 인디케이터 색(container/base/black)은 토큰 유틸에 바인딩하고 하드코딩하지 않는다. 버튼 색상/크기는 자식 Button이 담당한다.",
      ],
    },
  },
];
