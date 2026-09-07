import type { ReactNode } from "react";
import Link from "next/link";
import { CodeBlock } from "../../../components/code-block.tsx";
import { H2, H3 } from "../../../components/doc.tsx";

export const metadata = { title: "설치 (Installation) — UDS" };

function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="mt-3 rounded-large border bg-container-base-high/40 p-4 text-sm text-text-base-secondary">
      {children}
    </div>
  );
}

export default function InstallationPage() {
  return (
    <article className="max-w-3xl">
      <header>
        <p className="pl-0.5 text-xs font-medium text-text-base-tertiary">Get Started</p>
        <h1 className="mt-2 scroll-m-20 text-3xl font-bold tracking-tight">설치 (Installation)</h1>
        <p className="mt-3 text-sm text-text-base-tertiary">
          개발을 몰라도 그대로 따라 할 수 있게 썼습니다. 목표는 <strong>UDS를 AI(Claude)에 연결</strong>해서,
          AI가 우리 디자인시스템 컴포넌트로 화면을 만들게 준비하는 것 — 약 5분.
        </p>
        <Callout>
          <strong>준비물</strong> — (1) 컴퓨터의 <em>터미널</em>(맥: Terminal 앱), (2){" "}
          <a
            href="https://docs.claude.com/claude-code"
            className="underline underline-offset-4"
            target="_blank"
            rel="noreferrer"
          >
            Claude Code
          </a>
          . 아래 명령은 복사 버튼으로 그대로 붙여넣으면 됩니다.
        </Callout>
      </header>

      <H2>1. UDS 코드 내려받기</H2>
      <p className="mt-1 text-sm text-text-base-tertiary">
        AI가 읽을 컴포넌트·예시 코드를 컴퓨터로 가져옵니다. 터미널에 아래를 붙여넣으세요.
      </p>
      <div className="mt-3">
        <CodeBlock
          lang="bash"
          code={"git clone https://github.com/lupinesong2/UDS-repository\ncd UDS-repository\npnpm install"}
        />
      </div>
      <p className="mt-2 text-xs text-text-base-tertiary">
        <code>clone</code>=코드 복사, <code>cd</code>=그 폴더로 이동, <code>pnpm install</code>=필요한
        부품 설치. (마지막 명령은 몇 십 초 걸릴 수 있어요.)
      </p>

      <H2>2. UDS를 Claude에 연결 (MCP)</H2>
      <p className="mt-1 text-sm text-text-base-tertiary">
        <strong>내려받은 폴더 안에서</strong> 아래 한 줄을 실행하면, Claude가 UDS 컴포넌트를 읽을 수 있게
        연결됩니다.
      </p>
      <div className="mt-3">
        <CodeBlock lang="bash" code={'claude mcp add uds -- node "$(pwd)/packages/mcp/src/server.ts"'} />
      </div>
      <Callout>
        <strong>Cursor · Claude Desktop</strong>을 쓴다면, 설정의 MCP(JSON)에 아래를 넣으세요 (
        <code>&lt;내려받은경로&gt;</code>는 실제 폴더 경로로):
        <div className="mt-2">
          <CodeBlock
            lang="json"
            code={
              '{\n  "mcpServers": {\n    "uds": {\n      "command": "node",\n      "args": ["<내려받은경로>/packages/mcp/src/server.ts"]\n    }\n  }\n}'
            }
          />
        </div>
      </Callout>

      <H2>3. 연결 확인</H2>
      <p className="mt-1 text-sm text-text-base-tertiary">
        Claude에게 이렇게 물어보세요. 컴포넌트 목록이 나오면 연결 성공입니다.
      </p>
      <div className="mt-3">
        <CodeBlock lang="text" code={"uds에 어떤 컴포넌트가 있는지 목록으로 보여줘"} />
      </div>

      <H2>다음</H2>
      <p className="mt-3 text-sm text-text-base-tertiary">
        준비 끝났습니다.{" "}
        <Link className="underline" href="/get-started/build">
          화면 만들기
        </Link>
        에서 AI에게 명령해 화면을 뽑아 보세요.
      </p>

      <H2>고급 — 내 앱에 직접 붙일 때 (개발자용)</H2>
      <p className="mt-1 text-sm text-text-base-tertiary">
        디자이너는 여기까지 안 봐도 됩니다. 만든 화면을 실제 코드 프로젝트에 넣어 <em>실행</em>할 때만 필요합니다.
      </p>
      <H3>토큰 테마 연결 (한 번)</H3>
      <p className="mt-1 text-sm text-text-base-tertiary">
        컴포넌트가 렌더되려면 Tailwind v4 프로젝트의 전역 CSS에 토큰 테마와 폰트가 있어야 합니다.
      </p>
      <div className="mt-3">
        <CodeBlock
          lang="css"
          code={`/* app/globals.css */
@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css");
@import "tailwindcss";
@import "@uds/tokens/theme.css";`}
        />
      </div>
      <H3>컴포넌트 소스 가져오기</H3>
      <p className="mt-1 text-sm text-text-base-tertiary">
        CLI로 레지스트리 소스를 프로젝트에 복사합니다(import는 <code>@/</code>로 정규화).
      </p>
      <div className="mt-3">
        <CodeBlock lang="bash" code={"npx @uds/cli add button\nnpx @uds/cli list   # 사용 가능한 컴포넌트 목록"} />
      </div>
    </article>
  );
}
