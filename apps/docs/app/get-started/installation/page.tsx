import type { ReactNode } from "react";
import Link from "next/link";
import { CodeBlock } from "../../../components/code-block.tsx";

export const metadata = { title: "Installation — UDS" };

function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-12 scroll-m-20 text-lg font-semibold tracking-tight first:mt-0">{children}</h2>
  );
}

function H3({ children }: { children: ReactNode }) {
  return <h3 className="mt-8 text-base font-semibold tracking-tight">{children}</h3>;
}

export default function InstallationPage() {
  return (
    <article className="max-w-3xl">
      <header>
        <p className="pl-0.5 text-xs font-medium text-text-base-tertiary">Get Started</p>
        <h1 className="mt-2 scroll-m-20 text-3xl font-bold tracking-tight">Installation</h1>
        <p className="mt-3 text-sm text-text-base-tertiary">
          한 번만 설정하면 됩니다 — AI 툴에 MCP를 연결하고, 프로젝트에 토큰 테마를 깝니다. 설정을 마쳤으면{" "}
          <Link className="underline" href="/get-started/tutorial">
            튜토리얼
          </Link>
          에서 실제로 화면을 만들어 보세요.
        </p>
      </header>

      <H2>1. AI 툴에 MCP 연결</H2>
      <p className="mt-1 text-sm text-text-base-tertiary">
        Claude Code / Cursor 등에 UDS MCP 서버를 등록하면, AI가 컴포넌트 소스 · AI 가이드 · 토큰을 직접
        가져와 화면 코드를 생성합니다.
      </p>
      <div className="mt-3">
        <CodeBlock
          lang="json"
          code={'{\n  "mcpServers": {\n    "uds": { "command": "npx", "args": ["-y", "@uds/mcp"] }\n  }\n}'}
        />
      </div>

      <H2>2. 전역 셋업 (한 번)</H2>
      <p className="mt-1 text-sm text-text-base-tertiary">
        AI가 생성/복사한 컴포넌트가 렌더되려면, Tailwind v4 프로젝트의 전역 CSS에 토큰 테마와 Pretendard
        폰트가 있어야 합니다.
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
      <p className="mt-2 text-sm text-text-base-tertiary">
        <code>@uds/tokens/theme.css</code>는 Tailwind v4 <code>@theme</code> 블록으로 색·간격·타이포
        토큰 유틸(<code>bg-container-brand-primary</code>, <code>text-label-large</code> 등)을
        제공합니다. 별도 <code>tailwind.config</code>는 필요 없습니다.
      </p>

      <H2>3. 컴포넌트 소스 가져오기 (수동)</H2>
      <p className="mt-1 text-sm text-text-base-tertiary">
        AI 없이 직접 추가하려면 CLI로 레지스트리 소스를 복사합니다(import는 <code>@/</code>로 정규화, cva
        · clsx · tailwind-merge 등 의존성 포함).
      </p>
      <div className="mt-3">
        <CodeBlock lang="bash" code={`npx @uds/cli add button\nnpx @uds/cli list   # 사용 가능한 컴포넌트 목록`} />
      </div>

      <H2>다음</H2>
      <p className="mt-3 text-sm text-text-base-tertiary">
        <Link className="underline" href="/get-started/quickstart">
          Quickstart
        </Link>
        에서 세 가지 AI 워크플로우를 실제로 실행해 보세요.
      </p>
    </article>
  );
}
