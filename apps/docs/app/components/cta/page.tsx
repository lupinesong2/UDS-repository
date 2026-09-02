import type { ReactNode } from "react";
import { CodeBlock } from "../../../components/code-block.tsx";
import { CtaPlayground } from "./cta-playground.tsx";

export const metadata = { title: "CTA — UDS" };

// Design tokens this component consumes. The container owns background, wrapper
// padding, and the home-indicator; button colors/size are owned by `Button`.
const TOKENS = [
  ["배경 · onFrameHigh=false", "color/background/base/low", "#fcfcfc"],
  ["배경 · onFrameHigh=true", "color/background/base/high", "#f2f2f2"],
  ["액션 wrapper 좌우 여백", "spacing/component/x/20", "20px"],
  ["액션 wrapper 상하 여백", "spacing/component/y/16", "16px"],
  ["홈 인디케이터 색", "color/container/base/black", "#1a1a1a"],
  ["홈 인디케이터 라운드", "guide-100", "100px (pill)"],
] as const;

// Prop origin: Figma = a Figma component property (in code expressed via
// children/other props); Code = code-only; Both = a real shared prop.
type Origin = "figma" | "code" | "both";

const PROPS: { prop: string; type: string; def: string; origin: Origin; desc: ReactNode }[] = [
  {
    prop: "onFrameHigh",
    type: "boolean",
    def: "false",
    origin: "both",
    desc: (
      <>
        배경을 하위 프레임에 맞춥니다 — <code>false</code>=<code>background/base/low</code>(#fcfcfc),{" "}
        <code>true</code>=<code>background/base/high</code>(#f2f2f2). Figma의 variant 축입니다.
      </>
    ),
  },
  {
    prop: "hasSystemUiBottom",
    type: "boolean",
    def: "true",
    origin: "both",
    desc: <>하단 시스템 UI(iOS 홈 인디케이터)를 렌더할지 여부. 기본 <code>true</code>.</>,
  },
  {
    prop: "systemUi",
    type: "React.ReactNode",
    def: "홈 인디케이터",
    origin: "both",
    desc: (
      <>
        기본 홈 인디케이터를 커스텀 시스템 UI 노드로 교체합니다(Figma의 시스템 UI 슬롯에 대응).
      </>
    ),
  },
  {
    prop: "children",
    type: "ReactNode (ButtonGroup)",
    def: "—",
    origin: "code",
    desc: <>액션 영역. 보통 <code>ButtonGroup</code>(+<code>Button</code>)을 넣습니다.</>,
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
    desc: <><code>id</code>, <code>data-*</code> 등 표준 div 속성.</>,
  },
];

const AI_GUIDE: { category: string; rule: ReactNode }[] = [
  {
    category: "구조",
    rule: (
      <>
        <code>Cta</code>는 화면 하단 액션 컨테이너입니다 — 액션은 <code>children</code>으로{" "}
        <code>ButtonGroup</code>(+<code>Button</code>)을 넣고, 컨테이너는 배경·wrapper
        패딩(<code>component/x/20</code>·<code>component/y/16</code>)·하단 시스템 UI만 담당합니다.
      </>
    ),
  },
  {
    category: "맥락",
    rule: (
      <>
        <code>onFrameHigh</code>로 배경을 프레임에 맞춥니다 — <code>false</code>=
        <code>background/base/low</code>, <code>true</code>=<code>background/base/high</code>. 상위
        프레임이 base/high면 <code>true</code>로 둡니다.
      </>
    ),
  },
  {
    category: "시스템 UI",
    rule: (
      <>
        <code>hasSystemUiBottom</code>은 기본 <code>true</code> — 하단 시스템 UI(iOS 홈 인디케이터)를
        렌더합니다. 커스텀 하단 UI가 필요하면 <code>systemUi</code> 슬롯으로 교체합니다.
      </>
    ),
  },
  {
    category: "색상·토큰",
    rule: (
      <>
        배경·여백·홈 인디케이터 색(<code>container/base/black</code>)은 토큰 유틸에 바인딩하고
        하드코딩하지 않습니다. 버튼 색상/크기는 자식 <code>Button</code>이 담당합니다.
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

export default function CtaPage() {
  return (
    <article className="max-w-3xl">
      <header>
        <p className="text-sm font-medium text-text-brand-primary-high">Components</p>
        <h1 className="mt-2 scroll-m-20 text-3xl font-bold tracking-tight">CTA</h1>
        <p className="mt-3 text-lg text-text-base-tertiary">
          화면 하단에 주요 행동을 고정 배치하는 액션 영역. Figma <code>[CTA]</code> 세트에
          대응합니다. 배경 축 <code>onFrameHigh</code>와 하단 시스템 UI만 소유하고, 액션은 자식{" "}
          <code>ButtonGroup</code>·<code>Button</code>이 담당합니다.
        </p>
      </header>

      {/* Hero preview + interactive playground. Controls mirror the Figma [CTA]
          properties (onFrameHigh · hasSystemUiBottom); the Code tab shows the
          real Cta + ButtonGroup composition. */}
      <div className="mt-6">
        <CtaPlayground />
      </div>
      <p className="mt-3 text-sm text-text-base-tertiary">
        컨트롤은 Figma 컴포넌트 속성(<code>onFrameHigh</code> · <code>hasSystemUiBottom</code>)과
        동일합니다 — 값을 바꾸면 Preview가 갱신되고, Code 탭에는 실제 소스 구조(<code>Cta</code> +{" "}
        <code>ButtonGroup</code>)가 표시됩니다.
      </p>

      <H2>Installation</H2>
      <H3>CLI</H3>
      <p className="mt-1 text-sm text-text-base-tertiary">
        벤더 중립 레지스트리(JSON)로 배포됩니다. <code>ButtonGroup</code>·<code>Button</code>도 함께
        설치됩니다.
      </p>
      <div className="mt-3">
        <CodeBlock lang="bash" code={"npx @uds/cli add cta"} />
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
        <CodeBlock lang="tsx" code={'import { Button, ButtonGroup, Cta } from "@uds/ui"'} />
      </div>
      <div className="mt-3">
        <CodeBlock
          lang="tsx"
          code={
            '<Cta>\n  <ButtonGroup direction="row">\n    <Button>확인</Button>\n  </ButtonGroup>\n</Cta>'
          }
        />
      </div>

      <H2>API Reference</H2>
      <p className="mt-1 text-sm text-text-base-tertiary">
        <code>Cta</code>의 모든 prop입니다. 각 prop이 Figma 전용인지, 코드 전용인지, 공통인지{" "}
        <em>Origin</em> 배지로 구분합니다.
      </p>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-text-base-tertiary">
        <span className="inline-flex items-center gap-2">
          <OriginBadge origin="figma" /> Figma 전용 — 코드에선 children/다른 props로 표현
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
        <code>onFrameHigh</code>·<code>hasSystemUiBottom</code>은 Figma의 표현 축이자 코드 prop입니다.
        액션(버튼)은 <code>Cta</code>가 아니라 자식 <code>ButtonGroup</code>/<code>Button</code>으로
        지정합니다 — 잘못된 조합(예 <code>{`<Button category="page" variant="outline" />`}</code>)은
        컴파일 에러입니다.
      </p>

      <H2>Design Tokens</H2>
      <p className="mt-1 text-sm text-text-base-tertiary">
        컨테이너가 소유한 토큰입니다. 모든 값은 토큰에 바인딩되어 있어 토큰이 바뀌면 자동 반영됩니다.
        (Figma <code>container/base/inverseBlack</code>은 테마의 <code>container/base/black</code>과
        동일한 <code>#1a1a1a</code>로 매핑됩니다.)
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
