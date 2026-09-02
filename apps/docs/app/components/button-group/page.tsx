import type { ReactNode } from "react";
import { CodeBlock } from "../../../components/code-block.tsx";
import { ButtonGroupPlayground } from "./button-group-playground.tsx";

export const metadata = { title: "Button Group — UDS" };

// Design tokens this component consumes. The group owns only the gap; button
// colors/spacing/radius/typography are owned by the composed `Button`.
const TOKENS = [
  ["버튼 사이 간격", "spacing/gap/8", "8px"],
  ["버튼 배경 · Primary", "color/container/brand/primaryHigh", "#e10975"],
  ["버튼 배경 · Secondary (page)", "color/container/brand/secondary", "#1a1a1a"],
  ["버튼 배경 · Tertiary (module/Dialog)", "color/container/base/higher", "#e0e0e0"],
  ["버튼 배경 · Outline (module/Card)", "color/frame/base/low", "#fcfcfc"],
  ["버튼 테두리 · Outline (module/Card)", "color/border/brand/secondary", "#1a1a1a"],
  ["버튼 텍스트 · Filled", "color/text/base/white", "#ffffff"],
  ["버튼 텍스트 · Ghost·Tertiary·Outline", "color/text/base/primary", "#1a1a1a"],
  ["버튼 좌우 여백", "spacing/component/x/20", "20px"],
  ["버튼 상하 여백 · page (55px)", "spacing/component/y/14", "14px"],
  ["버튼 상하 여백 · module (44px)", "spacing/component/y/10", "10px"],
  ["버튼 모서리", "radius/small", "4px"],
  ["버튼 타이포", "font/label/large", "Pretendard 16 / 500"],
] as const;

// AI 가이드 — machine-readable usage rules that also ship as `meta.ai` in the
// registry JSON. Grouped by category so both humans and AI tools can scan by
// concern (구조 / 콘텐츠 / 맥락 / 색상·토큰).
const AI_GUIDE: { category: string; rule: ReactNode }[] = [
  {
    category: "구조",
    rule: (
      <>
        <code>ButtonGroup</code>은 레이아웃 래퍼입니다 — 색상·계층은 자식 <code>Button</code>이
        결정하고, 그룹은 <code>direction</code>·간격(8px)·자식 너비만 담당합니다.
      </>
    ),
  },
  {
    category: "구조",
    rule: (
      <>
        <code>direction=row</code>는 자식을 동일 너비로 나란히, <code>column</code>은 각 자식을
        풀너비로 세로 배치합니다. 기본값은 <code>row</code>.
      </>
    ),
  },
  {
    category: "콘텐츠",
    rule: (
      <>
        Figma의 <code>contentType</code>은 children으로 표현합니다 — filled(Button 1개),
        filled+filled·filled+outline(row에 Button 2개), filled+ghost(column에 filled + ghost).
      </>
    ),
  },
  {
    category: "콘텐츠",
    rule: (
      <>
        존재하는 조합만 사용합니다 — <code>filled+outline</code>은 Card 전용이고,{" "}
        <code>filled+ghost</code>는 <code>column</code>에서만 씁니다.
      </>
    ),
  },
  {
    category: "맥락",
    rule: (
      <>
        Figma <code>[Button Group] CTA</code>·<code>Bottom Sheet</code>·<code>Dialog</code>·
        <code>Card</code> 네 세트를 같은 <code>ButtonGroup</code>으로 표현합니다 — 맥락은 자식{" "}
        <code>Button</code>의 <code>category</code>로 구분합니다: CTA/Bottom Sheet=
        <code>page</code>(55px), Dialog·Card=<code>module</code>(44px).
      </>
    ),
  },
  {
    category: "색상·토큰",
    rule: (
      <>
        맥락별 주요/보조 버튼: CTA/Bottom Sheet=마젠타 <code>filled/primary</code> + 어두운{" "}
        <code>filled/secondary</code>. Dialog=마젠타 <code>filled/primary</code> + 회색{" "}
        <code>filled/tertiary</code>. Card=중립 <code>filled/secondary</code> +{" "}
        <code>outline/primary</code>(<code>filled+outline</code>) 또는 <code>ghost/secondary</code>.
      </>
    ),
  },
  {
    category: "색상·토큰",
    rule: <>그룹 자체에는 색상 토큰을 하드코딩하지 않습니다(색상은 Button 토큰 유틸이 담당).</>,
  },
];

// Prop origin: where a prop "lives". Figma = only a Figma component property
// (in code it's expressed via children/Button props); Code = only a code prop;
// Both = a real prop shared by Figma and code.
type Origin = "figma" | "code" | "both";

const PROPS: {
  prop: string;
  type: string;
  def: string;
  origin: Origin;
  desc: ReactNode;
}[] = [
  {
    prop: "context",
    type: '"CTA" | "Bottom Sheet" | "Dialog" | "Card"',
    def: "—",
    origin: "figma",
    desc: (
      <>
        어느 Figma 세트(맥락)인지. 코드에는 없는 prop이며, 자식 <code>Button</code>의{" "}
        <code>category·variant·hierarchy</code>로 표현됩니다.
      </>
    ),
  },
  {
    prop: "direction",
    type: '"row" | "column"',
    def: '"row"',
    origin: "both",
    desc: (
      <>
        레이아웃 방향. Figma·코드 공통 prop이며, 정의되지 않은 값(예{" "}
        <code>{`direction="diagonal"`}</code>)은 컴파일 에러입니다.
      </>
    ),
  },
  {
    prop: "contentType",
    type: '"filled" | "filled+filled" | "filled+outline" | "filled+ghost"',
    def: "—",
    origin: "figma",
    desc: (
      <>
        버튼 구성. 코드에서는 <code>children</code>(Button 조합)으로 표현됩니다.
      </>
    ),
  },
  {
    prop: "children",
    type: "ReactNode (Button …)",
    def: "—",
    origin: "code",
    desc: <>그룹을 구성할 Button 요소들. 색상·계층·크기는 각 Button이 결정합니다.</>,
  },
  {
    prop: "className",
    type: "string",
    def: "—",
    origin: "code",
    desc: <>추가 유틸리티 클래스(cn 병합).</>,
  },
  {
    prop: "…HTMLAttributes",
    type: "React.HTMLAttributes<HTMLDivElement>",
    def: "—",
    origin: "code",
    desc: (
      <>
        <code>role</code>(기본 <code>&quot;group&quot;</code>), <code>id</code>,{" "}
        <code>data-*</code> 등 표준 div 속성.
      </>
    ),
  },
];

// shadcn-style section heading.
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

// Origin chip — outline + text share currentColor, so one class controls both.
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

export default function ButtonGroupPage() {
  return (
    <article className="max-w-3xl">
      <header>
        <p className="text-sm font-medium text-text-brand-primary-high">Components</p>
        <h1 className="mt-2 scroll-m-20 text-3xl font-bold tracking-tight">Button Group</h1>
        <p className="mt-3 text-lg text-text-base-tertiary">
          화면 하단·Bottom Sheet·Dialog·Card에서 주요 행동을 함께 배치하는 CTA 버튼 그룹. Figma{" "}
          <code>[Button Group] CTA</code>·<code>Bottom Sheet</code>·<code>Dialog</code>·
          <code>Card</code> 네 세트와 1:1로 대응합니다. 레이아웃 축 <code>direction</code>(row ·
          column)만 소유하고, 크기·색상은 자식 <code>Button</code>이 담당합니다 — CTA/Bottom
          Sheet는 <code>category=page</code>(55px), Dialog·Card는 <code>category=module</code>(44px)
          버튼을 씁니다.
        </p>
      </header>

      {/* Hero preview + interactive playground. Controls mirror the Figma
          component-set properties (context · contentType · direction); the Code
          tab emits the real ButtonGroup + Button composition. */}
      <div className="mt-6">
        <ButtonGroupPlayground />
      </div>
      <p className="mt-3 text-sm text-text-base-tertiary">
        컨트롤은 Figma 컴포넌트 속성(<code>context</code> · <code>contentType</code> ·{" "}
        <code>direction</code>)과 동일합니다 — 값을 바꾸면 Figma에서 만든 배리에이션이 그대로
        Preview에 렌더링되고, Code 탭에는 실제 소스 구조(<code>ButtonGroup</code> +{" "}
        <code>Button</code> 조합)가 표시됩니다.
      </p>

      <H2>Installation</H2>
      <H3>CLI</H3>
      <p className="mt-1 text-sm text-text-base-tertiary">
        벤더 중립 레지스트리(JSON)로 배포됩니다. <code>Button</code>도 함께 설치됩니다.
      </p>
      <div className="mt-3">
        <CodeBlock lang="bash" code={"npx @uds/cli add button-group"} />
      </div>
      <H3>Manual · MCP (AI 툴)</H3>
      <p className="mt-1 text-sm text-text-base-tertiary">
        Claude Code / Cursor 등에 UDS MCP 서버를 등록하면 컴포넌트 소스·AI 가이드·토큰을 직접 가져옵니다.
      </p>
      <div className="mt-3">
        <CodeBlock
          lang="json"
          code={'{\n  "mcpServers": {\n    "uds": { "command": "npx", "args": ["-y", "@uds/mcp"] }\n  }\n}'}
        />
      </div>

      <H2>Usage</H2>
      <div className="mt-4">
        <CodeBlock lang="tsx" code={'import { Button, ButtonGroup } from "@uds/ui"'} />
      </div>
      <div className="mt-3">
        <CodeBlock
          lang="tsx"
          code={
            '<ButtonGroup direction="row">\n  <Button hierarchy="secondary">취소</Button>\n  <Button>확인</Button>\n</ButtonGroup>'
          }
        />
      </div>

      <H2>API Reference</H2>
      <p className="mt-1 text-sm text-text-base-tertiary">
        <code>ButtonGroup</code>의 모든 prop입니다. 각 prop이 Figma 전용인지, 코드 전용인지,
        공통인지 <em>Origin</em> 배지로 구분합니다.
      </p>
      {/* Origin legend */}
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-text-base-tertiary">
        <span className="inline-flex items-center gap-2">
          <OriginBadge origin="figma" /> Figma 전용 — 코드에선 children/Button props로 표현
        </span>
        <span className="inline-flex items-center gap-2">
          <OriginBadge origin="code" /> 코드 전용 — Figma에는 없는 개발용 prop
        </span>
        <span className="inline-flex items-center gap-2">
          <OriginBadge origin="both" /> 공통 — Figma·코드 양쪽 prop
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
      <p className="mt-2 text-xs text-text-base-tertiary">
        <code>context</code>·<code>contentType</code>은 Figma의 표현 축이라 코드에는 별도 prop이
        없습니다 — 대신 자식 <code>Button</code>의 <code>category</code>/<code>variant</code>/
        <code>hierarchy</code> 조합으로 구현합니다. 그룹이 직접 소유하는 prop은{" "}
        <code>direction</code> 하나입니다.
      </p>

      <H2>Design Tokens</H2>
      <p className="mt-1 text-sm text-text-base-tertiary">
        그룹은 <code>spacing/gap/8</code>만 직접 소유하고, 나머지는 자식 <code>Button</code>이 소유한 토큰입니다.
        모든 값은 토큰에 바인딩되어 있어 토큰이 바뀌면 자동 반영됩니다.
      </p>
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

      <H2>AI 가이드</H2>
      <p className="mt-1 text-sm text-text-base-tertiary">
        AI 툴이 이 컴포넌트를 올바르게 사용하도록 돕는 규칙입니다. 분류별로 정리했으며, 레지스트리
        메타데이터(<code>meta.ai</code>)에도 같은 <code>[분류]</code> 접두사로 배포됩니다.
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
