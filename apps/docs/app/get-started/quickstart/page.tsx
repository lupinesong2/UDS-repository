import type { ReactNode } from "react";
import Link from "next/link";
import { CodeBlock } from "../../../components/code-block.tsx";

export const metadata = { title: "Quickstart — UDS" };

function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-12 scroll-m-20 text-lg font-semibold tracking-tight first:mt-0">{children}</h2>
  );
}

function Step({ index }: { index: string }) {
  return <span className="mr-2 text-sm font-semibold text-text-brand-primary-high">{index}</span>;
}

export default function QuickstartPage() {
  return (
    <article className="max-w-3xl">
      <header>
        <p className="text-sm font-medium text-text-brand-primary-high">Get Started</p>
        <h1 className="mt-2 scroll-m-20 text-3xl font-semibold tracking-tight">Quickstart</h1>
        <p className="mt-3 text-base text-text-base-tertiary">
          세 가지 AI 워크플로우를 실제로 실행해 봅니다. 공통 전제: UDS가 지식 베이스(토큰·컴포넌트·AI
          가이드·카탈로그)를 제공하고, AI가 그 규칙대로 조립합니다.
        </p>
      </header>

      <H2>
        <Step index="01" />AI로 Figma 화면 생성 (UDS-Gen)
      </H2>
      <p className="mt-1 text-sm text-text-base-tertiary">
        Figma MCP가 연결된 AI(예: Claude Code)에게 화면을 설명하면, UDS 규칙과 module·component 카탈로그를
        따라 <code>use_figma</code>로 Figma 화면을 직접 조립합니다. 앱 설치가 필요 없습니다.
      </p>
      <div className="mt-3">
        <CodeBlock
          lang="text"
          code={`"해외로밍 사용요금 조회 화면 만들어줘 — 항목 선택 + 다음 CTA"
→ AI가 Header · Module · Checkbox Group · CTA를 카탈로그에서 골라 Figma에 조립`}
        />
      </div>
      <p className="mt-2 text-sm text-text-base-tertiary">
        결과물의 형태는{" "}
        <Link className="underline" href="/examples/roaming">
          예시 화면
        </Link>
        에서 확인할 수 있습니다.
      </p>

      <H2>
        <Step index="02" />AI로 앱 코드 생성 (MCP)
      </H2>
      <p className="mt-1 text-sm text-text-base-tertiary">
        <Link className="underline" href="/get-started/installation">
          Installation
        </Link>
        에서 <code>@uds/mcp</code>를 등록했다면, AI에게 UDS 컴포넌트로 화면을 만들라고 요청합니다. AI는
        컴포넌트·토큰·AI 가이드를 가져와 아래 같은 코드를 생성합니다.
      </p>
      <div className="mt-3">
        <CodeBlock
          lang="tsx"
          code={`import { Button } from "@/components/ui/button";

export function Example() {
  return (
    <Button category="page" hierarchy="primary">
      확인
    </Button>
  );
}`}
        />
      </div>
      <p className="mt-2 text-sm text-text-base-tertiary">
        <code>category</code> · <code>variant</code> · <code>hierarchy</code>는 Figma가 정의한 조합만
        허용합니다. AI가 없는 조합(예: <code>category=&quot;page&quot; variant=&quot;outline&quot;</code>)을
        내면 타입 에러로 막히므로, 잘못된 UI가 애초에 컴파일되지 않습니다. 사람이 직접 쓸 때도 동일하게
        각 컴포넌트 문서의 플레이그라운드에서 유효 조합을 확인하세요.
      </p>

      <H2>
        <Step index="03" />AI로 시스템 확장 (스킬)
      </H2>
      <p className="mt-1 text-sm text-text-base-tertiary">
        시스템 자체를 키우는 워크플로우입니다. Figma 컴포넌트 세트 URL 하나를 스킬에 주면:
      </p>
      <ul className="mt-3 space-y-2 text-sm text-text-base-secondary">
        <li>
          <code>/uds-component</code> — Figma 세트 → 컴포넌트 · 타입 · registry · 문서 · 플레이그라운드
          생성
        </li>
        <li>
          <code>/uds-code-connect</code> — 코드 ↔ Figma Dev Mode 매핑(<code>*.figma.ts</code>) 작성·퍼블리시
        </li>
        <li>
          <code>/uds-component-check</code> — Figma가 표현 못 하는 관계(라벨↔입력, 에러 상태 등) 접근성
          감사
        </li>
      </ul>
      <p className="mt-3 text-sm text-text-base-tertiary">
        확장 워크플로우 상세는 리포 <code>README</code>와 <code>.claude/skills</code>를 참고하세요.
      </p>
    </article>
  );
}
