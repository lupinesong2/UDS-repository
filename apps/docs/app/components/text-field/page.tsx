import type { ReactNode } from "react";
import { CodeBlock } from "../../../components/code-block.tsx";
import { TextFieldPlayground } from "./text-field-playground.tsx";

export const metadata = { title: "Text Field — UDS" };

const TOKENS = [
  ["필드 배경", "color/container/base/high-level1", "#f2f2f2"],
  ["입력 텍스트", "color/text/base/primary", "#1a1a1a"],
  ["플레이스홀더", "color/text/base/quaternary", "#747474"],
  ["캐럿(cursor)", "color/container/brand/primary", "#fa2993"],
  ["포커스 링", "color/state/focused", "#1a1a1a"],
  ["에러 링", "color/status/border/negative", "#e51a1a"],
  ["라벨", "color/text/base/primary", "#1a1a1a"],
  ["필수 별표", "color/text/brand/primary", "#fa2993"],
  ["지우기 아이콘", "color/icon/base/secondary", "#747474"],
  ["메시지 · 기본", "color/text/base/tertiary", "#696969"],
  ["메시지 · 비활성", "color/status/text/disabled", "#1a1a1a29"],
  ["메시지 · 에러", "color/status/text/negative", "#da0707"],
  ["라벨 타이포", "font/label/large-strong", "16 · 700"],
  ["입력 타이포", "font/body/large", "18 · 500"],
  ["메시지 타이포", "font/body/small", "14 · 500"],
  ["필드 패딩", "spacing/component/x/16 · y/14", "16px · 14px"],
  ["필드 모서리", "radius/small", "4px"],
] as const;

type Origin = "figma" | "code" | "both";

const PROPS: { prop: string; type: string; def: string; origin: Origin; desc: ReactNode }[] = [
  {
    prop: "variant",
    type: '"text" | "password" | "card" | "rrn" | "phone" | "email"',
    def: '"text"',
    origin: "figma",
    desc: (
      <>
        Figma 세트 병합 축. 네이티브 <code>type</code>/<code>inputMode</code>·기본 placeholder를
        정합니다. <code>password</code>=eye 토글, <code>card/rrn</code>=숫자, <code>phone</code>=
        <code>leading</code> select, <code>email</code>=<code>trailing</code> select.
      </>
    ),
  },
  {
    prop: "leading / trailing",
    type: "ReactNode",
    def: "—",
    origin: "both",
    desc: (
      <>
        필드 옆 sibling 박스 (Figma <code>[Dropdown Slot]</code>) — <code>phone</code>의 통신사
        select는 <code>leading</code>, <code>email</code>의 도메인 select는 <code>trailing</code>.
      </>
    ),
  },
  {
    prop: "label",
    type: "ReactNode",
    def: "—",
    origin: "both",
    desc: <>필드 상단 라벨 (Figma <code>[Field Text Set] Label</code>). 생략하면 라벨 행이 숨겨집니다.</>,
  },
  {
    prop: "required",
    type: "boolean",
    def: "false",
    origin: "both",
    desc: (
      <>
        Figma <code>hasRequired</code>. 마젠타 별표를 표시하고 네이티브 <code>required</code>도
        설정합니다.
      </>
    ),
  },
  {
    prop: "placeholder",
    type: "string",
    def: "—",
    origin: "both",
    desc: <>비어 있을 때 표시되는 안내 문구. 네이티브 속성입니다.</>,
  },
  {
    prop: "isTyping",
    type: "—",
    def: "—",
    origin: "figma",
    desc: (
      <>
        Figma의 포커스 상태. 코드에서는 프롭이 아니라 <code>:focus-within</code>으로 처리됩니다(검은
        1px 링 + 캐럿).
      </>
    ),
  },
  {
    prop: "error",
    type: "boolean",
    def: "false",
    origin: "both",
    desc: <>Figma <code>isError</code>. 빨간 링 + 빨간 supporting 메시지.</>,
  },
  {
    prop: "disabled",
    type: "boolean",
    def: "false",
    origin: "both",
    desc: <>Figma <code>isDisabled</code>. 네이티브 <code>disabled</code> 속성.</>,
  },
  {
    prop: "messages",
    type: "ReactNode[]",
    def: "—",
    origin: "both",
    desc: (
      <>
        하단 supporting 메시지 (Figma <code>[Field Text Set] Supporting</code>, 도움말 — 최대 3개).
        각 메시지 앞에 상태색 아이콘이 붙습니다.
      </>
    ),
  },
  {
    prop: "iconEnd",
    type: "ReactNode",
    def: "—",
    origin: "both",
    desc: <>필드 끝 24px 슬롯 (Figma end 슬롯, 예: mic 아이콘).</>,
  },
  {
    prop: "onClear",
    type: "() => void",
    def: "—",
    origin: "both",
    desc: (
      <>
        Figma 타이핑 상태의 close-circle. 지정하면 지우기 버튼이 렌더되고 클릭 시 호출됩니다.
      </>
    ),
  },
  {
    prop: "className",
    type: "string",
    def: "—",
    origin: "code",
    desc: <>루트 컨테이너에 추가할 유틸리티 클래스(cn 병합).</>,
  },
  {
    prop: "…InputHTMLAttributes",
    type: "React.InputHTMLAttributes<HTMLInputElement>",
    def: "—",
    origin: "code",
    desc: (
      <>
        <code>value</code>, <code>onChange</code>, <code>name</code>, <code>type</code>,{" "}
        <code>maxLength</code> 등 표준 input 속성. <code>ref</code>는 내부 <code>&lt;input&gt;</code>에
        전달됩니다.
      </>
    ),
  },
];

const AI_GUIDE: { category: string; rule: ReactNode }[] = [
  {
    category: "구조",
    rule: (
      <>
        <code>TextField</code>는 label(상단) + 입력 박스 + supporting 메시지(하단)로 구성됩니다.
        라벨은 <code>label</code>, 도움말은 <code>messages</code> 배열(최대 3개)로 전달하고, 값/
        <code>onChange</code>는 네이티브 input 속성으로 다룹니다.
      </>
    ),
  },
  {
    category: "상태",
    rule: (
      <>
        <code>isTyping</code>(포커스)은 프롭이 아니라 <code>:focus-within</code>으로 처리됩니다(검은 1px
        링). <code>isDisabled</code>는 네이티브 <code>disabled</code>, <code>isError</code>는{" "}
        <code>error</code> 프롭으로 지정합니다 — 둘 다 true면 <code>error</code>(빨강)가 우선합니다.
      </>
    ),
  },
  {
    category: "콘텐츠",
    rule: (
      <>
        <code>required</code>는 마젠타 별표 + 네이티브 <code>required</code>를 함께 설정합니다.{" "}
        <code>placeholder</code>는 네이티브 속성이고, 끝 슬롯 아이콘은 <code>iconEnd</code>, 값
        지우기는 <code>onClear</code>로 전달합니다.
      </>
    ),
  },
  {
    category: "색상·토큰",
    rule: (
      <>
        배경=<code>container/base/high</code>, 입력=<code>text/base/primary</code>, placeholder=
        <code>text/base/quaternary</code>, 캐럿=<code>container/brand/primary</code>, 포커스 링=
        <code>status/border/selected</code>, 에러 링=<code>status/border/negative</code>,
        메시지=<code>text/base/tertiary</code>·<code>status/text/disabled</code>·
        <code>status/text/negative</code>. 모두 토큰 바인딩, 하드코딩 금지.
      </>
    ),
  },
];

function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-12 scroll-m-20 text-lg font-semibold tracking-tight first:mt-0">
      {children}
    </h2>
  );
}

function H3({ children }: { children: ReactNode }) {
  return <h3 className="mt-8 scroll-m-20 text-base font-semibold tracking-tight">{children}</h3>;
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

export default function TextFieldPage() {
  return (
    <article className="max-w-3xl">
      <header>
        <p className="text-sm font-medium text-text-brand-primary-high">Components</p>
        <h1 className="mt-2 scroll-m-20 text-3xl font-semibold tracking-tight">Text Field</h1>
        <p className="mt-3 text-base text-text-base-tertiary">
          텍스트 입력 필드. Figma <code>[Text Field]</code> Text·Password·Card·RRN·Phone·Email 여섯
          세트를 <code>variant</code> 축으로 병합했습니다. <code>variant</code>가 네이티브{" "}
          <code>type</code>/<code>inputMode</code>·기본 placeholder를 정하고(password=eye 토글,
          phone/email=<code>leading</code>/<code>trailing</code> select), <code>label</code>/
          <code>required</code> · <code>error</code> · <code>disabled</code> 상태와 도움말(
          <code>messages</code>)을 가집니다. 포커스(<code>isTyping</code>)는 <code>:focus-within</code>.
        </p>
      </header>

      <div className="mt-6">
        <TextFieldPlayground />
      </div>
      <p className="mt-3 text-sm text-text-base-tertiary">
        컨트롤은 Figma 컴포넌트 속성(<code>isTyping</code> · <code>isDisabled</code> ·{" "}
        <code>isError</code>)과 구성 콘텐츠(label·placeholder·messages)를 반영합니다 — 값을 바꾸면
        Preview가 갱신되고 Code 탭에 실제 소스가 표시됩니다.
      </p>

      <H2>Installation</H2>
      <H3>CLI</H3>
      <div className="mt-3">
        <CodeBlock lang="bash" code={"npx @uds/cli add text-field"} />
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
        <CodeBlock lang="tsx" code={'import { TextField } from "@uds/ui"'} />
      </div>
      <div className="mt-3">
        <CodeBlock
          lang="tsx"
          code={
            '<TextField\n  label="이메일"\n  required\n  placeholder="you@example.com"\n  messages={["도움말 메세지"]}\n/>'
          }
        />
      </div>

      <H2>API Reference</H2>
      <p className="mt-1 text-sm text-text-base-tertiary">
        <code>TextField</code>의 모든 prop입니다. Figma 전용/코드 전용/공통을 <em>Origin</em> 배지로
        구분합니다. 상호작용 상태(<code>isTyping</code>)는 프롭이 아니라 CSS로 처리됩니다.
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
        <code>container/base/high-level1</code>·<code>state/focused</code>는 동일 값의 유틸(
        <code>container/base/high</code>·<code>status/border/selected</code>)로 바인딩됩니다.
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
