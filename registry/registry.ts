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
  /** Path within the source package (`packages/<pkg>/src`). */
  src: string;
  /** Install target in the consuming project. */
  target: string;
  type: "registry:ui" | "registry:lib";
  /** Which workspace package `src` is resolved from. Defaults to `ui`. */
  pkg?: "ui" | "icons";
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
  {
    name: "checkbox",
    type: "registry:ui",
    title: "Checkbox",
    description:
      "하나 이상 선택할 수 있는 선택 컨트롤. Figma [Checkbox] 세트에 대응한다. size(medium 24px·small 20px) × fontWeight(strong·base)의 스타일 축과, 네이티브 checked/disabled로 표현되는 상태를 가진다. 라벨을 감싸는 접근성 있는 네이티브 input + 토큰 스타일 박스로 구현된다.",
    dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
    files: [
      { src: "components/checkbox.tsx", target: "components/ui/checkbox.tsx", type: "registry:ui" },
      { src: "lib/utils.ts", target: "lib/utils.ts", type: "registry:lib" },
      { src: "index.tsx", target: "components/ui/icons.tsx", type: "registry:lib", pkg: "icons" },
    ],
    meta: {
      ai: [
        "[구조] Checkbox는 <label>이 네이티브 <input type=checkbox>(스크린리더용, peer) + 토큰 박스 + 라벨을 감싼다. 라벨 텍스트는 children으로 전달한다.",
        "[크기·타이포] size로 박스와 라벨을 함께 키운다: medium=박스 24px·label-large(16), small=박스 20px·label-medium(14). fontWeight=strong(bold 700)/base(medium 500)는 라벨 굵기다. 두 축은 독립적이며 4×2×2×2 전 조합이 유효하다.",
        "[상태] isChecked/isDisabled는 프롭이 아니라 네이티브 checked/defaultChecked/disabled로 지정한다 — 박스는 peer-checked/peer-disabled로 반응한다.",
        "[색상·토큰] 미선택 테두리=icon/base/secondary, 선택 채움=status/icon/selected, 비활성=status/icon/disabled-inverseBlack, 체크마크=icon/base/inverseWhite, 라벨=text/base/primary(비활성 status/text/disabled). 모두 토큰 바인딩, 하드코딩 금지.",
      ],
    },
  },
  {
    name: "text-field",
    type: "registry:ui",
    title: "Text Field",
    description:
      "이름·주소·검색어 등 자유로운 문자열을 입력하는 기본 텍스트 입력 필드. Figma [Text Field] Text 세트에 대응한다. label/required(별표) · placeholder · error(빨간 링+빨간 메시지) · disabled(네이티브) 상태와, 하단 supporting messages(도움말 최대 3개), 끝 슬롯(iconEnd), 지우기 버튼(onClear)을 지원한다. 포커스(isTyping)는 :focus-within로 처리된다.",
    dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
    files: [
      { src: "components/text-field.tsx", target: "components/ui/text-field.tsx", type: "registry:ui" },
      { src: "lib/utils.ts", target: "lib/utils.ts", type: "registry:lib" },
      { src: "index.tsx", target: "components/ui/icons.tsx", type: "registry:lib", pkg: "icons" },
    ],
    meta: {
      ai: [
        "[구조] TextField는 label(상단) + 입력 박스 + supporting messages(하단)로 구성된다. 라벨은 label 프롭, 도움말은 messages 배열(최대 3개)로 전달한다. 값/onChange 등은 네이티브 input 속성이다.",
        "[상태] isTyping(포커스)은 프롭이 아니라 :focus-within로 처리된다(검은 1px 링). isDisabled는 네이티브 disabled, isError는 error 프롭으로 지정한다. error와 disabled는 독립적이며 둘 다 true면 error(빨강)가 우선한다.",
        "[콘텐츠] required는 마젠타 별표를 표시하고 네이티브 required도 설정한다. placeholder는 네이티브 속성이다. 끝 슬롯 아이콘(예: mic)은 iconEnd, 입력값 지우기 버튼은 onClear로 전달한다(onClear가 있으면 close-circle 버튼이 렌더된다).",
        "[색상·토큰] 필드 배경=container/base/high, 입력 텍스트=text/base/primary, placeholder=text/base/quaternary, 캐럿=container/brand/primary, 포커스 링=status/border/selected, 에러 링=status/border/negative, 메시지=text/base/tertiary(기본)·status/text/disabled(비활성)·status/text/negative(에러). 모두 토큰 바인딩, 하드코딩 금지.",
      ],
    },
  },
  {
    name: "header",
    type: "registry:ui",
    title: "Header",
    description:
      "화면 상단 내비게이션 바. Figma [Header]·[Header] Search·[Header] Logo 세 세트를 category 축으로 병합한다. category(title·search·logo) × align(left·center, search 제외) × onFrameHigh(배경 base/low·base/high)를 가지며, onBack(뒤로 chevron)·actions(우측 아이콘)·title/logo/검색 입력을 슬롯으로 받는다. 레이아웃 컨테이너라 색상은 배경만 소유하고, align은 title·logo에만 존재(search엔 없음, 타입으로 강제).",
    dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
    files: [
      { src: "components/header.tsx", target: "components/ui/header.tsx", type: "registry:ui" },
      { src: "lib/utils.ts", target: "lib/utils.ts", type: "registry:lib" },
      { src: "index.tsx", target: "components/ui/icons.tsx", type: "registry:lib", pkg: "icons" },
    ],
    meta: {
      ai: [
        "[구조] Header는 화면 상단 내비게이션 컨테이너(높이 56px)다 — 색상은 배경만 소유하고, 실제 내용은 슬롯으로 받는다: onBack(뒤로 chevron), actions(우측 24px 아이콘들), title/logo, 그리고 검색 입력.",
        "[맥락] category로 유형을 고른다: title(뒤로+제목+액션), search(뒤로+검색필드+액션), logo(로고+액션). 기본값은 title.",
        "[맥락] align(left·center)은 title·logo에만 있다 — search에는 align이 없다(타입으로 강제, align?: never). left=제목/로고가 앞에서 채우고, center=제목/로고를 절대 중앙 배치하고 뒤로/액션을 양끝에 둔다.",
        "[콘텐츠] 뒤로가기는 onBack 콜백으로 넘기면 chevron이 렌더된다. 우측 액션 아이콘은 actions로, 검색은 placeholder·value·onChange·onSearch로 다룬다(Enter 또는 검색 아이콘 클릭 시 onSearch).",
        "[색상·토큰] 배경=onFrameHigh로 background/base/low(#fcfcfc)·high(#f2f2f2). 제목=title/small·text/base/primary, 아이콘=icon/base/primary, 검색 필드 배경=container/base/high(프레임 low일 때)·container/base/low-level1(프레임 high일 때, 헤더와 반대로 대비), placeholder=text/base/quaternary. 모두 토큰 바인딩, 하드코딩 금지.",
      ],
    },
  },
];
