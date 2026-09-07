import { CodeBlock } from "../../../components/code-block.tsx";
import { H2, H3 } from "../../../components/doc.tsx";

export const metadata = { title: "튜토리얼 — Claude로 화면 만들기 — UDS" };

export default function TutorialPage() {
  return (
    <article className="max-w-3xl">
      <header>
        <p className="pl-0.5 text-xs font-medium text-text-base-tertiary">Get Started</p>
        <h1 className="mt-2 scroll-m-20 text-3xl font-bold tracking-tight">
          튜토리얼 — Claude로 화면 만들기
        </h1>
        <p className="mt-3 text-sm text-text-base-tertiary">
          UDS 컴포넌트로 실제 화면을 AI에게 만들게 하는 가장 짧은 길입니다. 핵심은 Claude가{" "}
          <strong>레포의 실제 코드(컴포넌트·예시)를 읽게</strong> 하는 것 — 그래야 자의적으로
          그리지 않습니다.
        </p>
      </header>

      <H2>0. 준비</H2>
      <p className="mt-1 text-sm text-text-base-tertiary">
        레포를 받고 의존성을 설치합니다. (Claude가 읽을 실제 코드가 여기에 있습니다.)
      </p>
      <div className="mt-3">
        <CodeBlock
          lang="bash"
          code={
            "git clone https://github.com/lupinesong2/UDS-repository\ncd UDS-repository\npnpm install"
          }
        />
      </div>

      <H2>1. Claude Code로 열고 요청 (가장 간단)</H2>
      <p className="mt-1 text-sm text-text-base-tertiary">
        MCP 설정 없이도 됩니다. 이 레포를 Claude Code로 연 뒤 그대로 요청하세요 — Claude가{" "}
        <code>packages/ui/src</code>와 <code>apps/docs/app/examples</code>의 실제 코드를 읽어
        조립합니다.
      </p>
      <div className="mt-3">
        <CodeBlock
          lang="text"
          code={
            "이 레포의 packages/ui/src 컴포넌트로 로그인 화면을 만들어줘.\napps/docs/app/examples/address 예시의 조립 방식을 그대로 따라 하고,\n@uds/ui 컴포넌트(Header·TextField·Checkbox·Cta·Button)만 쓰고 새로 만들지 마."
          }
        />
      </div>

      <H2>2. (선택) MCP 등록해서 정밀하게</H2>
      <p className="mt-1 text-sm text-text-base-tertiary">
        반복 작업이라면 MCP를 등록하세요. Claude가 도구로 규칙·예시·컴포넌트 소스를 직접 조회합니다.
      </p>
      <H3>등록</H3>
      <div className="mt-3">
        <CodeBlock
          lang="bash"
          code={'# 레포 안에서\nclaude mcp add uds -- node "$(pwd)/packages/mcp/src/server.ts"'}
        />
      </div>
      <p className="mt-2 text-xs text-text-base-tertiary">
        또는 프로젝트 <code>.mcp.json</code>에:{" "}
        <code>{'{ "mcpServers": { "uds": { "command": "node", "args": ["<clone경로>/packages/mcp/src/server.ts"] } } }'}</code>
      </p>
      <H3>요청</H3>
      <div className="mt-3">
        <CodeBlock
          lang="text"
          code={
            "UDS 디자인시스템으로 로그인 화면을 만들어줘.\n- 먼저 uds MCP의 get_screen_guide로 규칙·레시피를 읽고\n- list_examples / get_example로 비슷한 예시 화면 소스를 참고해서\n- @uds/ui 컴포넌트로만 조립하고 디자인 토큰만 써."
          }
        />
      </div>

      <H2>3. 화면을 실제로 실행 (스타일까지)</H2>
      <p className="mt-1 text-sm text-text-base-tertiary">
        컴포넌트가 <strong>디자인 토큰</strong>을 쓰므로, 붙여넣을 앱에 토큰 테마가 import돼 있어야 색이
        나옵니다. Claude에게 세팅까지 시키세요.
      </p>
      <div className="mt-3">
        <CodeBlock
          lang="text"
          code={
            "방금 만든 화면이 실행되게 세팅해줘.\nTailwind v4에 @uds/tokens/theme.css를 import하고,\n필요한 컴포넌트를 uds CLI로 설치해줘 (npx @uds/cli add <name>)."
          }
        />
      </div>
      <p className="mt-2 text-xs text-text-base-tertiary">
        설치 상세는 <a href="/get-started/installation" className="underline underline-offset-4">Installation</a>,
        규칙·레시피 원문은 <a href="/ai-kit" className="underline underline-offset-4">AI로 화면 만들기</a>{" "}
        참고.
      </p>

      <H2>팁</H2>
      <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-text-base-tertiary">
        <li>“새로 만들지 말고 @uds/ui 컴포넌트만 써”를 항상 명시하면 자의적 생성이 줄어듭니다.</li>
        <li>비슷한 화면이 있으면 예시 이름(<code>address</code>·<code>roaming</code>)을 콕 집어 주세요.</li>
        <li>레포에서 반복 작업하면 루트에 규칙 파일(<code>CLAUDE.md</code>)을 두는 게 가장 확실합니다 — <a href="/uds-rules.md" className="underline underline-offset-4">/uds-rules.md</a>.</li>
      </ul>
    </article>
  );
}
