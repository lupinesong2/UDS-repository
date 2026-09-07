import { CodeBlock } from "../../components/code-block.tsx";
import { CopyPageButton } from "../../components/copy-page-button.tsx";
import { H2 } from "../../components/doc.tsx";

export const metadata = { title: "AI로 화면 만들기 — UDS" };

const STEPS = [
  ["1. AI 키트 복사", "아래 버튼으로 사용 규칙 + 컴포넌트 카탈로그 + 화면 조립 레시피를 한 번에 복사합니다."],
  ["2. AI에 붙여넣기", "ChatGPT·Claude·v0 등 아무 AI 채팅에 붙여넣습니다. 설치·개발환경이 없어도 됩니다."],
  ["3. 화면 요청", '"로그인 화면 만들어줘"처럼 요청하면 UDS 컴포넌트로 코드를 만들어 줍니다.'],
] as const;

export default function AiKitPage() {
  return (
    <article className="max-w-3xl">
      <header>
        <p className="pl-0.5 text-xs font-medium text-text-base-tertiary">Get Started</p>
        <h1 className="mt-2 scroll-m-20 text-3xl font-bold tracking-tight">AI로 화면 만들기</h1>
        <p className="mt-3 text-sm text-text-base-tertiary">
          디자이너가 설치·CLI 없이 AI에게 화면을 맡기고, 결과가 UDS 컴포넌트로 나오게 하는 가장 간단한
          방법입니다. 아래 키트를 복사해 AI에 붙여넣기만 하면 됩니다.
        </p>
      </header>

      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-large border bg-container-base-low p-6">
        <CopyPageButton src="/ai-kit.txt" label="AI 키트 복사" />
        <a
          href="/ai-kit.txt"
          className="text-sm text-text-base-tertiary underline underline-offset-4 hover:text-text-base-primary"
        >
          /ai-kit.txt 열기
        </a>
      </div>

      <H2>이렇게 쓰세요</H2>
      <ol className="mt-4 flex flex-col gap-3">
        {STEPS.map(([title, desc]) => (
          <li key={title} className="rounded-large border p-4">
            <div className="text-sm font-semibold">{title}</div>
            <p className="mt-1 text-sm text-text-base-tertiary">{desc}</p>
          </li>
        ))}
      </ol>

      <H2>개발 레포에서 (Cursor · Claude Code)</H2>
      <p className="mt-1 text-sm text-text-base-tertiary">
        실제 코드베이스에서 반복 작업한다면, 규칙 파일을 레포 루트에 저장하세요. 그러면 AI가 그 레포에서
        항상 UDS 컴포넌트를 우선 사용합니다.
      </p>
      <div className="mt-3">
        <CodeBlock
          lang="bash"
          code={"# 레포 루트에 규칙 저장 (CLAUDE.md 또는 .cursorrules)\ncurl -o CLAUDE.md http://localhost:3000/uds-rules.md"}
        />
      </div>
      <p className="mt-2 text-xs text-text-base-tertiary">
        컴포넌트 설치는 <code>npx @uds/cli add &lt;name&gt;</code>. 전체 문서는{" "}
        <a href="/llms-full.txt" className="underline underline-offset-4">
          /llms-full.txt
        </a>
        , 컴포넌트별은 각 페이지의 <em>Copy Page</em> 버튼으로도 가져올 수 있습니다.
      </p>

      <H2>MCP로 코드 기반 grounding (권장)</H2>
      <p className="mt-1 text-sm text-text-base-tertiary">
        텍스트 키트만 주면 AI가 조립을 <em>상상</em>합니다. MCP를 등록하면 AI가{" "}
        <strong>실제 컴포넌트·예시 화면 소스를 읽어</strong> 그대로 따라 만듭니다. Cursor·Claude Code의{" "}
        <code>mcpServers</code>에 등록하세요.
      </p>
      <div className="mt-3">
        <CodeBlock
          lang="json"
          code={
            '{\n  "mcpServers": {\n    "uds": { "command": "node", "args": ["<repo>/packages/mcp/src/server.ts"] }\n  }\n}'
          }
        />
      </div>
      <p className="mt-2 text-xs text-text-base-tertiary">
        AI가 쓰는 도구 순서: <code>get_screen_guide</code>(규칙·레시피) →{" "}
        <code>list_examples</code>/<code>get_example</code>(실제 화면 소스 흉내) →{" "}
        <code>get_component</code>(컴포넌트 소스) → <code>get_design_tokens</code>. 배포 후엔{" "}
        <code>{'"command": "npx", "args": ["-y", "@uds/mcp"]'}</code>.
      </p>

      <H2>무엇이 들어있나</H2>
      <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-text-base-tertiary">
        <li><strong>사용 규칙</strong> — “화면은 @uds/ui로만 조립, 토큰만 사용” 등 AI가 지킬 규칙.</li>
        <li><strong>컴포넌트 카탈로그</strong> — 9개 컴포넌트의 프롭·제약·사용 가이드.</li>
        <li><strong>화면 조립 레시피</strong> — 로그인·주소입력·선택·필터 등 흔한 화면 구성 패턴.</li>
      </ul>
    </article>
  );
}
