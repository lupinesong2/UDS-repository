import Link from "next/link";
import { Button } from "@uds/ui";

export default function HomePage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-semibold tracking-tight">UDS — Unified Design System</h1>
      <p className="mt-3 text-text-base-tertiary">
        Figma 디자인 자산을 코드로 자산화한 컴포넌트 레지스트리입니다. 디자인 토큰 기반으로
        구조화되어 있으며, shadcn 호환 레지스트리를 통해 AI 툴과 코드베이스로 배포됩니다.
      </p>

      <div className="mt-8 flex gap-3">
        <Button asChild>
          <Link href="/components/button">컴포넌트 보기</Link>
        </Button>
        <Button variant="filled" hierarchy="secondary" asChild>
          <a href="/r/index.json">레지스트리 (JSON)</a>
        </Button>
      </div>

      <div className="mt-12 grid gap-4 text-sm">
        <div className="rounded-large border p-4">
          <div className="font-medium">1. 코드 자산화</div>
          <p className="mt-1 text-text-base-tertiary">
            Figma 컴포넌트를 토큰·프롭 기반 React 컴포넌트로 변환합니다.
          </p>
        </div>
        <div className="rounded-large border p-4">
          <div className="font-medium">2. 문서 & 플레이그라운드</div>
          <p className="mt-1 text-text-base-tertiary">
            프리뷰, 프롭스 컨트롤, 코드, AI 가이드를 한곳에서 제공합니다.
          </p>
        </div>
        <div className="rounded-large border p-4">
          <div className="font-medium">3. MCP / CLI 배포</div>
          <p className="mt-1 text-text-base-tertiary">
            AI 툴은 MCP로, 개발자는 자체 CLI로 — shadcn 의존 없이.
            <code className="ml-1 rounded-small bg-container-base-high px-1.5 py-0.5">npx @uds/cli add button</code>
          </p>
        </div>
      </div>
    </div>
  );
}
