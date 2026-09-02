import type { ReactNode } from "react";
import { Button, type ButtonProps } from "@uds/ui";
import { CodeBlock } from "../../../components/code-block.tsx";
import { ButtonPlayground } from "./button-playground.tsx";

// Build props for data-driven demos below. The component only accepts
// Figma-defined combinations; our static tables are known-valid, so cast the
// loosened row types back to ButtonProps for the mapped previews.
function demo(category: string, variant?: string, hierarchy?: string): ButtonProps {
  return { category, variant, hierarchy } as ButtonProps;
}

export const metadata = { title: "Button — UDS" };

// One representative CTA per category, sized as in Figma.
const CATEGORIES = [
  {
    category: "page",
    label: "Page · 55px",
    desc: "페이지 최상위 CTA. filled·ghost / primary·secondary.",
  },
  {
    category: "module",
    label: "Module · 44px",
    desc: "모듈·카드 내부 액션. filled·outline·ghost / primary·secondary·tertiary(filled).",
  },
  {
    category: "inline",
    label: "Inline · 33px",
    desc: "콘텐츠 흐름 속 텍스트형 액션. filled·outline·ghost / primary·secondary.",
  },
] as const;

// Full variant × hierarchy matrix shown per category (Figma-defined only).
const COMBOS = {
  page: [
    { variant: "filled", hierarchy: "primary", label: "Filled · Primary" },
    { variant: "filled", hierarchy: "secondary", label: "Filled · Secondary" },
    { variant: "ghost", hierarchy: "secondary", label: "Ghost · Secondary" },
  ],
  module: [
    { variant: "filled", hierarchy: "primary", label: "Filled · Primary" },
    { variant: "filled", hierarchy: "secondary", label: "Filled · Secondary" },
    { variant: "filled", hierarchy: "tertiary", label: "Filled · Tertiary" },
    { variant: "outline", hierarchy: "primary", label: "Outline · Primary" },
    { variant: "outline", hierarchy: "secondary", label: "Outline · Secondary" },
    { variant: "ghost", hierarchy: "primary", label: "Ghost · Primary" },
    { variant: "ghost", hierarchy: "secondary", label: "Ghost · Secondary" },
  ],
  inline: [
    { variant: "filled", hierarchy: "primary", label: "Filled · Primary" },
    { variant: "filled", hierarchy: "secondary", label: "Filled · Secondary" },
    { variant: "outline", hierarchy: "primary", label: "Outline · Primary" },
    { variant: "outline", hierarchy: "secondary", label: "Outline · Secondary" },
    { variant: "ghost", hierarchy: "primary", label: "Ghost · Primary" },
    { variant: "ghost", hierarchy: "secondary", label: "Ghost · Secondary" },
  ],
} as const;

// 24px sample icon (Figma icon slot size for page/module).
function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Design tokens this component consumes (Figma-1:1).
const TOKENS = [
  ["색상 · Filled Primary (page·module)", "color/container/brand/primaryHigh", "#e10975"],
  ["색상 · Filled Primary (inline) / Secondary (page·module)", "color/container/brand/secondary", "#1a1a1a"],
  ["색상 · Filled Tertiary·Secondary(inline) 배경", "color/container/base/higher-level1", "#e0e0e0"],
  ["색상 · Outline 배경", "color/container/base/low", "#fcfcfc"],
  ["색상 · Outline Primary 보더", "color/border/brand/secondary", "#1a1a1a"],
  ["색상 · Outline Secondary 보더", "color/border/base/higher", "#bdbdbd"],
  ["색상 · Ghost Primary 텍스트", "color/text/brand/primaryHigh", "#e10975"],
  ["색상 · 기본 텍스트", "color/text/base/primary", "#1a1a1a"],
  ["색상 · Filled 텍스트", "color/text/base/white", "#ffffff"],
  ["색상 · Disabled 배경/보더/텍스트", "color/status/…/disabled", "#ebebeb · #1a1a1a29"],
  ["색상 · Focus 링", "color/status/border/selected", "#1a1a1a"],
  ["색상 · Pressed 오버레이", "color/state/stateLayer/pressed-*", "#ffffff29 / #1a1a1a29"],
  ["여백 · 좌우 (page·module / inline)", "spacing/component/x-20 · x-12", "20 / 12px"],
  ["여백 · 상하 (page / module / inline)", "spacing/component/y-14 · y-10 · y-8", "14 / 10 / 8px"],
  ["여백 · 아이콘 간격", "spacing/gap/4", "4px"],
  ["모서리", "radius/small", "4px"],
  ["타이포 (page·module / inline)", "font/label/large · medium", "Pretendard 16·14 / 500"],
] as const;

// shadcn-style section heading.
function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
      {children}
    </h2>
  );
}

function H3({ children }: { children: ReactNode }) {
  return <h3 className="mt-8 text-lg font-semibold tracking-tight">{children}</h3>;
}

// shadcn-style preview surface.
function Preview({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4 flex min-h-40 flex-wrap items-center justify-center gap-4 rounded-large border p-10">
      {children}
    </div>
  );
}

export default function ButtonPage() {
  return (
    <article className="max-w-3xl">
      <header>
        <p className="text-sm font-medium text-text-brand-primary-high">Components</p>
        <h1 className="mt-2 scroll-m-20 text-4xl font-bold tracking-tight">Button</h1>
        <p className="mt-3 text-lg text-text-base-tertiary">
          동작을 트리거하는 클릭 가능한 요소. Figma <code>[Button]</code> 세트와 1:1로 대응하며,
          맥락을 고르는 <code>category</code>(page · module · inline) 축과 <code>variant</code> ×{" "}
          <code>hierarchy</code>로 구성됩니다.
        </p>
      </header>

      {/* Hero preview + interactive playground */}
      <div className="mt-6">
        <ButtonPlayground />
      </div>

      <H2>Installation</H2>
      <H3>CLI</H3>
      <p className="mt-1 text-sm text-text-base-tertiary">
        벤더 중립 레지스트리(JSON)로 배포됩니다. shadcn CLI에 의존하지 않습니다.
      </p>
      <div className="mt-3">
        <CodeBlock lang="bash" code={"npx @uds/cli add button"} />
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
        <CodeBlock lang="tsx" code={'import { Button } from "@uds/ui"'} />
      </div>
      <div className="mt-3">
        <CodeBlock
          lang="tsx"
          code={'<Button category="page" variant="filled" hierarchy="primary">\n  레이블\n</Button>'}
        />
      </div>

      <H2>Examples</H2>

      <H3>Category</H3>
      <p className="mt-1 text-sm text-text-base-tertiary">
        하나의 <code>Button</code>이 세 맥락을 담습니다. <code>category</code>로 크기·타이포·지원 축이 결정됩니다.
      </p>
      <div className="mt-4 grid gap-3">
        {CATEGORIES.map((c) => (
          <div key={c.category} className="flex items-center gap-4 rounded-large border p-6">
            <span className="w-28 shrink-0 text-sm font-medium">{c.label}</span>
            <Button {...demo(c.category)}>레이블</Button>
            <span className="text-xs text-text-base-tertiary">{c.desc}</span>
          </div>
        ))}
      </div>

      {CATEGORIES.map((cat) => (
        <div key={cat.category}>
          <H3>{cat.label}</H3>
          <Preview>
            {COMBOS[cat.category].map((c) => (
              <div key={c.label} className="flex flex-col items-center gap-2">
                <Button {...demo(cat.category, c.variant, c.hierarchy)}>레이블</Button>
                <span className="text-xs text-text-base-tertiary">{c.label}</span>
              </div>
            ))}
          </Preview>
        </div>
      ))}

      <H3>Icon</H3>
      <p className="mt-1 text-sm text-text-base-tertiary">
        <code>iconStart</code> / <code>iconEnd</code>로 아이콘을 배치합니다 (page·module 24px, inline 16px).
      </p>
      <Preview>
        <Button iconStart={<ArrowIcon />}>이전</Button>
        <Button iconEnd={<ArrowIcon />}>다음</Button>
        <Button category="inline" variant="ghost" hierarchy="primary" iconEnd={<ArrowIcon />}>
          더보기
        </Button>
      </Preview>
      <div className="mt-3">
        <CodeBlock code={'<Button iconEnd={<ArrowIcon />}>다음</Button>'} />
      </div>

      <H3>States</H3>
      <p className="mt-1 text-sm text-text-base-tertiary">
        상태는 프롭이 아니라 상호작용으로 표현됩니다 — hover·pressed·
        <kbd className="rounded-small bg-container-base-high px-1 text-xs">Tab</kbd>(focus)으로 직접 확인하세요.
      </p>
      <Preview>
        <div className="flex flex-col items-center gap-2">
          <Button>레이블</Button>
          <span className="text-xs text-text-base-tertiary">default</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Button disabled>레이블</Button>
          <span className="text-xs text-text-base-tertiary">disabled</span>
        </div>
      </Preview>

      <H2>API Reference</H2>
      <div className="mt-4 overflow-hidden rounded-large border">
        <table className="w-full text-sm">
          <thead className="bg-container-base-high/40 text-left">
            <tr>
              <th className="p-3 font-medium">Prop</th>
              <th className="p-3 font-medium">Type</th>
              <th className="p-3 font-medium">Default</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {[
              ["category", "page | module | inline", "page"],
              ["variant", "filled | outline | ghost", "filled"],
              ["hierarchy", "primary | secondary | tertiary", "primary"],
              ["iconStart", "ReactNode", "—"],
              ["iconEnd", "ReactNode", "—"],
              ["disabled", "boolean", "false"],
              ["asChild", "boolean", "false"],
            ].map(([prop, type, def]) => (
              <tr key={prop}>
                <td className="p-3 font-mono text-xs">{prop}</td>
                <td className="p-3 font-mono text-xs text-text-base-tertiary">{type}</td>
                <td className="p-3 font-mono text-xs">{def}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-text-base-tertiary">
        Figma에 정의된 조합만 타입으로 허용됩니다 — page는 <code>outline</code>·<code>tertiary</code>가 없고,
        inline은 <code>tertiary</code>가 없으며, <code>tertiary</code>는 module의 <code>filled</code>에만 존재합니다.
        정의되지 않은 조합(예: <code>{`<Button variant="outline" />`}</code>)은 컴파일 에러입니다.
      </p>

      <H2>Design Tokens</H2>
      <p className="mt-1 text-sm text-text-base-tertiary">
        이 컴포넌트가 사용하는 Figma 토큰입니다. 모든 값은 토큰에 바인딩되어 있어 토큰이 바뀌면 자동 반영됩니다.
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
        AI 툴이 이 컴포넌트를 올바르게 사용하도록 돕는 규칙입니다. (레지스트리 메타데이터로도 배포됨)
      </p>
      <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-text-base-tertiary">
        <li>
          <code>category</code>로 맥락을 고릅니다 — 페이지 최상위 CTA는 <code>page</code>, 모듈·카드 내부 액션은{" "}
          <code>module</code>, 콘텐츠 흐름 속 텍스트형 액션은 <code>inline</code>. 기본값은 <code>page</code>.
        </li>
        <li>화면의 주요 액션에는 <code>variant=filled hierarchy=primary</code>(마젠타)를 1개만 사용합니다.</li>
        <li>보조 액션에는 <code>filled/secondary·tertiary</code>, 외곽선 <code>outline</code>, 텍스트형 <code>ghost</code>를 사용합니다.</li>
        <li>Figma에 정의된 조합만 유효합니다 — page엔 outline이, page·inline엔 tertiary가 없습니다.</li>
        <li>아이콘은 <code>iconStart</code>/<code>iconEnd</code>로 전달합니다(page·module 24px, inline 16px).</li>
        <li>상태(hover·pressed·focus·disabled)는 프롭이 아니라 CSS로 처리되므로 별도 지정하지 않습니다.</li>
        <li>색상은 Figma 토큰 유틸(<code>bg-container-brand-primary-high</code> 등)만 사용하고 하드코딩하지 않습니다.</li>
      </ul>
    </article>
  );
}
