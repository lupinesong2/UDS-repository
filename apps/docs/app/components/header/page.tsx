import type { ReactNode } from "react";
import { CodeBlock } from "../../../components/code-block.tsx";
import { HeaderPlayground } from "./header-playground.tsx";

export const metadata = { title: "Header — UDS" };

const TOKENS = [
  ["배경 · frame low / high", "color/background/base/low · high", "#fcfcfc / #f2f2f2"],
  ["제목 타이포", "font/title/small-strong", "18 · 700"],
  ["제목 색", "color/text/base/primary", "#1a1a1a"],
  ["아이콘(뒤로·검색·액션)", "color/icon/base/primary", "#1a1a1a"],
  ["검색 필드 배경 · frame low", "color/container/base/high-level1", "#f2f2f2"],
  ["검색 필드 배경 · frame high", "color/container/base/low-level1", "#fcfcfc"],
  ["검색 입력 타이포", "font/body/medium", "16 · 500"],
  ["검색 placeholder", "color/text/base/quaternary", "#747474"],
  ["좌우 패딩", "spacing/component/x/20", "20px"],
  ["검색 필드 패딩", "spacing/component/x/12", "12px"],
  ["아이템 간격", "spacing/gap/12", "12px"],
  ["액션 간격", "spacing/gap/16", "16px"],
  ["검색 내부 간격", "spacing/gap/8", "8px"],
  ["검색 필드 모서리", "radius/small", "4px"],
  ["높이", "—", "56px"],
] as const;

type Origin = "figma" | "code" | "both";

const PROPS: { prop: string; type: string; def: string; origin: Origin; desc: ReactNode }[] = [
  {
    prop: "category",
    type: '"title" | "search" | "logo"',
    def: '"title"',
    origin: "figma",
    desc: (
      <>
        Figma 세트 병합 축 — <code>[Header]</code>(title) · <code>[Header] Search</code> ·{" "}
        <code>[Header] Logo</code>.
      </>
    ),
  },
  {
    prop: "align",
    type: '"left" | "center"',
    def: '"left"',
    origin: "both",
    desc: (
      <>
        제목/로고 정렬. <code>title</code>·<code>logo</code>에만 존재하며 <code>search</code>에는
        없습니다(<code>align?: never</code>).
      </>
    ),
  },
  {
    prop: "onFrameHigh",
    type: "boolean",
    def: "false",
    origin: "both",
    desc: <>배경을 프레임에 맞춥니다 — false=base/low(#fcfcfc), true=base/high(#f2f2f2).</>,
  },
  {
    prop: "onBack",
    type: "() => void",
    def: "—",
    origin: "both",
    desc: <>Figma <code>hasSlotStart</code>. 지정하면 뒤로가기 chevron이 렌더되고 클릭 시 호출됩니다.</>,
  },
  {
    prop: "actions",
    type: "ReactNode",
    def: "—",
    origin: "both",
    desc: <>Figma <code>hasSlotEnd</code>. 우측 액션 아이콘들(각 24px, 간격 16px).</>,
  },
  {
    prop: "title",
    type: "ReactNode",
    def: "—",
    origin: "both",
    desc: <><code>category="title"</code>의 제목 텍스트 (Figma <code>title</code>).</>,
  },
  {
    prop: "logo",
    type: "ReactNode",
    def: "—",
    origin: "both",
    desc: <><code>category="logo"</code>의 로고 노드 (Figma <code>[Header Slot]/ Logo</code>).</>,
  },
  {
    prop: "placeholder",
    type: "string",
    def: '"검색어를 입력해주세요"',
    origin: "both",
    desc: <><code>category="search"</code> 입력 안내 문구.</>,
  },
  {
    prop: "value / onChange / onSearch",
    type: "string · Handler · () => void",
    def: "—",
    origin: "code",
    desc: <>검색 입력 제어. Enter 또는 검색 아이콘 클릭 시 <code>onSearch</code> 호출.</>,
  },
  {
    prop: "className",
    type: "string",
    def: "—",
    origin: "code",
    desc: <>루트 <code>&lt;header&gt;</code>에 추가할 유틸리티 클래스(cn 병합).</>,
  },
  {
    prop: "…HTMLAttributes",
    type: "React.HTMLAttributes<HTMLElement>",
    def: "—",
    origin: "code",
    desc: <><code>id</code>, <code>style</code>, <code>onClick</code> 등 (단 <code>title</code>·<code>onChange</code> 제외 — 슬롯 프롭이 우선).</>,
  },
];

const AI_GUIDE: { category: string; rule: ReactNode }[] = [
  {
    category: "구조",
    rule: (
      <>
        <code>Header</code>는 화면 상단 내비게이션 컨테이너(높이 56px)입니다 — 색상은 배경만 소유하고,
        내용은 슬롯으로 받습니다: <code>onBack</code>(뒤로 chevron), <code>actions</code>(우측 아이콘),
        <code>title</code>/<code>logo</code>, 검색 입력.
      </>
    ),
  },
  {
    category: "맥락",
    rule: (
      <>
        <code>category</code>로 유형 선택 — title(뒤로+제목+액션) · search(뒤로+검색필드+액션) ·
        logo(로고+액션). <code>align</code>(left·center)은 title·logo에만 있고 search엔 없습니다(타입으로
        강제). center는 제목/로고를 절대 중앙 배치합니다.
      </>
    ),
  },
  {
    category: "콘텐츠",
    rule: (
      <>
        뒤로가기는 <code>onBack</code> 콜백으로 넘기면 chevron이 렌더됩니다. 우측 아이콘은{" "}
        <code>actions</code>, 검색은 <code>placeholder</code>·<code>value</code>·<code>onChange</code>·
        <code>onSearch</code>로 다룹니다.
      </>
    ),
  },
  {
    category: "색상·토큰",
    rule: (
      <>
        배경=<code>background/base/low·high</code>, 제목=<code>title/small</code>·
        <code>text/base/primary</code>, 아이콘=<code>icon/base/primary</code>, 검색 필드 배경=
        <code>container/base/high</code>(프레임 low)·<code>container/base/low-level1</code>(프레임 high),
        placeholder=<code>text/base/quaternary</code>. 모두 토큰 바인딩, 하드코딩 금지.
      </>
    ),
  },
];

function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
      {children}
    </h2>
  );
}

function H3({ children }: { children: ReactNode }) {
  return <h3 className="mt-8 scroll-m-20 text-xl font-semibold tracking-tight">{children}</h3>;
}

function OriginBadge({ origin }: { origin: Origin }) {
  const map = {
    figma: { label: "Figma", cls: "text-text-brand-primary-high" },
    code: { label: "Code", cls: "text-text-base-tertiary" },
    both: { label: "Both", cls: "text-text-base-primary" },
  } as const;
  const { label, cls } = map[origin];
  return (
    <span
      className={`inline-flex items-center rounded-full border border-current px-2 py-0.5 text-[10px] font-medium ${cls}`}
    >
      {label}
    </span>
  );
}

export default function HeaderPage() {
  return (
    <article className="max-w-3xl">
      <header>
        <p className="text-sm font-medium text-text-brand-primary-high">Components</p>
        <h1 className="mt-2 scroll-m-20 text-3xl font-bold tracking-tight">Header</h1>
        <p className="mt-3 text-lg text-text-base-tertiary">
          화면 상단 내비게이션 바. Figma <code>[Header]</code> · <code>[Header] Search</code> ·{" "}
          <code>[Header] Logo</code> 세 세트를 <code>category</code> 축으로 병합했습니다.{" "}
          <code>category</code>(title·search·logo) × <code>align</code>(left·center, search 제외) ×{" "}
          <code>onFrameHigh</code> 배경 축을 가지며, 뒤로가기·우측 액션·검색 입력을 슬롯으로 받습니다.
        </p>
      </header>

      <div className="mt-6">
        <HeaderPlayground />
      </div>
      <p className="mt-3 text-sm text-text-base-tertiary">
        컨트롤은 Figma 세트 속성(<code>category</code> · <code>align</code> · <code>onFrameHigh</code> ·
        슬롯)과 동일합니다. <code>align</code>은 <code>search</code>에선 비활성(정의 없음)입니다.
      </p>

      <H2>Installation</H2>
      <H3>CLI</H3>
      <div className="mt-3">
        <CodeBlock lang="bash" code={"npx @uds/cli add header"} />
      </div>
      <H3>Manual · MCP (AI 툴)</H3>
      <div className="mt-3">
        <CodeBlock
          lang="json"
          code={'{\n  "mcpServers": {\n    "uds": { "command": "npx", "args": ["-y", "@uds/mcp"] }\n  }\n}'}
        />
      </div>

      <H2>Usage</H2>
      <div className="mt-4">
        <CodeBlock lang="tsx" code={'import { Header } from "@uds/ui"'} />
      </div>
      <div className="mt-3">
        <CodeBlock
          lang="tsx"
          code={'<Header\n  category="title"\n  onBack={() => history.back()}\n  title="배송지 입력"\n/>'}
        />
      </div>

      <H2>API Reference</H2>
      <p className="mt-1 text-sm text-text-base-tertiary">
        <code>Header</code>의 모든 prop입니다. <code>align</code>은 <code>search</code>에서 컴파일
        에러입니다(<code>{`<Header category="search" align="left" />`}</code>).
      </p>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-text-base-tertiary">
        <span className="inline-flex items-center gap-2">
          <OriginBadge origin="figma" /> Figma 전용
        </span>
        <span className="inline-flex items-center gap-2">
          <OriginBadge origin="code" /> 코드 전용
        </span>
        <span className="inline-flex items-center gap-2">
          <OriginBadge origin="both" /> 공통 (Figma·코드)
        </span>
      </div>
      <div className="mt-4 overflow-hidden rounded-large border">
        <table className="w-full text-sm">
          <thead className="bg-container-base-high/40 text-left">
            <tr>
              <th className="p-3 font-medium">Prop</th>
              <th className="p-3 font-medium">Type</th>
              <th className="p-3 font-medium">Default</th>
              <th className="p-3 font-medium">Origin</th>
              <th className="p-3 font-medium">설명</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {PROPS.map((p) => (
              <tr key={p.prop} className="align-top">
                <td className="p-3 font-mono text-xs">{p.prop}</td>
                <td className="p-3 font-mono text-xs text-text-base-tertiary">{p.type}</td>
                <td className="p-3 font-mono text-xs">{p.def}</td>
                <td className="p-3">
                  <OriginBadge origin={p.origin} />
                </td>
                <td className="p-3 text-xs text-text-base-tertiary">{p.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H2>Design Tokens</H2>
      <div className="mt-4 overflow-hidden rounded-large border">
        <table className="w-full text-sm">
          <thead className="bg-container-base-high/40 text-left">
            <tr>
              <th className="p-3 font-medium">용도</th>
              <th className="p-3 font-medium">토큰</th>
              <th className="p-3 font-medium">값</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {TOKENS.map(([use, token, value]) => (
              <tr key={use}>
                <td className="p-3 text-xs">{use}</td>
                <td className="p-3 font-mono text-xs text-text-base-tertiary">{token}</td>
                <td className="p-3 font-mono text-xs">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-text-base-tertiary">
        <code>container/base/high-level1</code>은 동일 값의 <code>container/base/high</code>(#f2f2f2)
        유틸로 바인딩됩니다.
      </p>

      <H2>AI 가이드</H2>
      <p className="mt-1 text-sm text-text-base-tertiary">
        AI 툴이 이 컴포넌트를 올바르게 쓰도록 돕는 규칙입니다. 레지스트리 <code>meta.ai</code>에 같은{" "}
        <code>[분류]</code> 접두사로 배포됩니다.
      </p>
      <div className="mt-4 overflow-hidden rounded-large border">
        <table className="w-full text-sm">
          <thead className="bg-container-base-high/40 text-left">
            <tr>
              <th className="w-28 p-3 font-medium">분류</th>
              <th className="p-3 font-medium">가이드</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {AI_GUIDE.map((g, i) => (
              <tr key={i} className="align-top">
                <td className="whitespace-nowrap p-3 text-xs font-medium">{g.category}</td>
                <td className="p-3 text-xs text-text-base-tertiary">{g.rule}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
