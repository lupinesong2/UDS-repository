import type { ReactNode } from "react";
import { CodeBlock } from "../../../components/code-block.tsx";
import { CheckboxPlayground } from "./checkbox-playground.tsx";

export const metadata = { title: "Checkbox — UDS" };

const TOKENS = [
  ["미선택 테두리", "color/icon/base/secondary", "#747474"],
  ["선택 채움/테두리", "color/status/icon/selected", "#1a1a1a"],
  ["비활성 박스", "color/status/icon/disabled-inverseBlack", "#1a1a1a29"],
  ["체크마크", "color/icon/base/inverseWhite", "#ffffff"],
  ["라벨 색", "color/text/base/primary", "#1a1a1a"],
  ["라벨 · 비활성", "color/status/text/disabled", "#1a1a1a29"],
  ["라벨 타이포 · medium", "font/label/large", "16"],
  ["라벨 타이포 · small", "font/label/medium", "14"],
  ["라벨 굵기 · strong / base", "fontWeight-strong / base", "700 / 500"],
  ["박스↔라벨 간격", "spacing/gap/6", "6px"],
  ["상하 여백 · medium / small", "spacing/component/y/8 · y/10", "8px / 10px"],
  ["박스 모서리", "radius/small", "4px"],
] as const;

type Origin = "figma" | "code" | "both";

const PROPS: { prop: string; type: string; def: string; origin: Origin; desc: ReactNode }[] = [
  {
    prop: "size",
    type: '"medium" | "small"',
    def: '"medium"',
    origin: "both",
    desc: <>박스+라벨 크기. medium=24px·label-large, small=20px·label-medium.</>,
  },
  {
    prop: "fontWeight",
    type: '"strong" | "base"',
    def: '"strong"',
    origin: "both",
    desc: <>라벨 굵기. strong=bold(700), base=medium(500).</>,
  },
  {
    prop: "checked / defaultChecked",
    type: "boolean",
    def: "—",
    origin: "both",
    desc: (
      <>
        Figma <code>isChecked</code>. 네이티브 속성 — 제어형은 <code>checked</code>+
        <code>onChange</code>, 비제어형은 <code>defaultChecked</code>.
      </>
    ),
  },
  {
    prop: "disabled",
    type: "boolean",
    def: "false",
    origin: "both",
    desc: <>Figma <code>isDisabled</code>. 네이티브 <code>disabled</code> 속성.</>,
  },
  {
    prop: "children",
    type: "ReactNode",
    def: "—",
    origin: "both",
    desc: <>라벨 텍스트 (Figma <code>text</code>).</>,
  },
  {
    prop: "className",
    type: "string",
    def: "—",
    origin: "code",
    desc: <>추가 유틸리티 클래스(cn 병합).</>,
  },
  {
    prop: "…InputHTMLAttributes",
    type: "React.InputHTMLAttributes<HTMLInputElement>",
    def: "—",
    origin: "code",
    desc: (
      <>
        <code>onChange</code>, <code>name</code>, <code>value</code>, <code>required</code> 등
        표준 input 속성 (단 <code>size</code>는 제외 — 스타일 축이 우선).
      </>
    ),
  },
];

const AI_GUIDE: { category: string; rule: ReactNode }[] = [
  {
    category: "구조",
    rule: (
      <>
        <code>Checkbox</code>는 <code>&lt;label&gt;</code>이 네이티브{" "}
        <code>&lt;input type=&quot;checkbox&quot;&gt;</code>(스크린리더용, peer) + 토큰 박스 +
        라벨을 감쌉니다. 라벨은 <code>children</code>으로 전달합니다.
      </>
    ),
  },
  {
    category: "크기·타이포",
    rule: (
      <>
        <code>size</code>가 박스와 라벨을 함께 키웁니다 — medium=24px·label-large(16),
        small=20px·label-medium(14). <code>fontWeight</code>=strong(700)/base(500)는 라벨 굵기.
        두 축은 독립적이며 전 조합이 유효합니다.
      </>
    ),
  },
  {
    category: "상태",
    rule: (
      <>
        <code>isChecked</code>/<code>isDisabled</code>는 프롭이 아니라 네이티브{" "}
        <code>checked</code>/<code>defaultChecked</code>/<code>disabled</code>로 지정합니다 — 박스는{" "}
        <code>peer-checked</code>/<code>peer-disabled</code>로 반응합니다.
      </>
    ),
  },
  {
    category: "색상·토큰",
    rule: (
      <>
        미선택 테두리=<code>icon/base/secondary</code>, 선택 채움=<code>status/icon/selected</code>,
        비활성=<code>status/icon/disabled-inverseBlack</code>, 체크마크=
        <code>icon/base/inverseWhite</code>, 라벨=<code>text/base/primary</code>(비활성{" "}
        <code>status/text/disabled</code>). 모두 토큰 바인딩, 하드코딩 금지.
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

export default function CheckboxPage() {
  return (
    <article className="max-w-3xl">
      <header>
        <p className="text-sm font-medium text-text-brand-primary-high">Components</p>
        <h1 className="mt-2 scroll-m-20 text-3xl font-bold tracking-tight">Checkbox</h1>
        <p className="mt-3 text-lg text-text-base-tertiary">
          하나 이상 선택할 수 있는 선택 컨트롤. Figma <code>[Checkbox]</code> 세트에 대응하며,{" "}
          <code>size</code>(medium·small) × <code>fontWeight</code>(strong·base) 스타일 축과 네이티브{" "}
          <code>checked</code>/<code>disabled</code> 상태를 가집니다. 라벨을 감싸는 접근성 있는
          네이티브 input으로 구현됩니다.
        </p>
      </header>

      <div className="mt-6">
        <CheckboxPlayground />
      </div>
      <p className="mt-3 text-sm text-text-base-tertiary">
        컨트롤은 Figma 컴포넌트 속성(<code>size</code> · <code>fontWeight</code> ·{" "}
        <code>isChecked</code> · <code>isDisabled</code>)과 동일합니다 — 값을 바꾸면 Preview가
        갱신되고, Code 탭에 실제 소스가 표시됩니다.
      </p>

      <H2>Installation</H2>
      <H3>CLI</H3>
      <div className="mt-3">
        <CodeBlock lang="bash" code={"npx @uds/cli add checkbox"} />
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
        <CodeBlock lang="tsx" code={'import { Checkbox } from "@uds/ui"'} />
      </div>
      <div className="mt-3">
        <CodeBlock
          lang="tsx"
          code={'<Checkbox defaultChecked>약관에 동의합니다</Checkbox>'}
        />
      </div>

      <H2>API Reference</H2>
      <p className="mt-1 text-sm text-text-base-tertiary">
        <code>Checkbox</code>의 모든 prop입니다. Figma 전용/코드 전용/공통을 <em>Origin</em> 배지로
        구분합니다. 정의되지 않은 값(예 <code>{`size="large"`}</code>)은 컴파일 에러입니다.
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
