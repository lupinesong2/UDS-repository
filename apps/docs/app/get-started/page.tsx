import type { ReactNode } from "react";
import Link from "next/link";
import { H2 } from "../../components/doc.tsx";

export const metadata = { title: "Introduction — UDS" };

function StartCard({ href, step, title, children }: { href: string; step: string; title: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="block rounded-large border p-5 transition-colors hover:bg-container-base-high"
    >
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-text-brand-primary-high">{step}</span>
        <span className="text-sm font-semibold text-text-base-primary">{title}</span>
      </div>
      <p className="mt-2 text-sm text-text-base-tertiary">{children}</p>
    </Link>
  );
}

export default function IntroductionPage() {
  return (
    <article className="max-w-3xl">
      <header>
        <p className="pl-0.5 text-xs font-medium text-text-base-tertiary">Get Started</p>
        <h1 className="mt-2 scroll-m-20 text-3xl font-bold tracking-tight">Introduction</h1>
        <p className="mt-3 text-sm text-text-base-tertiary">
          UDS(Unified Design System)는 Figma 디자인 자산을 코드로 만든 디자인 시스템입니다. 핵심은{" "}
          <strong>AI가 이 컴포넌트·토큰을 소비해 화면을 만들도록</strong> 설계된 점 — 사람이 하나씩
          조립하지 않습니다.
        </p>
      </header>

      <H2>핵심 원칙</H2>
      <ul className="mt-3 space-y-2 text-sm text-text-base-secondary">
        <li>
          <strong className="text-text-base-primary">Figma가 진실</strong> — 색·간격·타이포는
          하드코딩하지 않고 디자인 토큰에 바인딩합니다.
        </li>
        <li>
          <strong className="text-text-base-primary">정의된 조합만 컴파일</strong> — props는 Figma가
          정의한 조합만 허용하는 타입이라, 없는 조합은 타입 에러로 막힙니다.
        </li>
        <li>
          <strong className="text-text-base-primary">AI가 소비하는 지식</strong> — 컴포넌트마다 AI
          가이드·예시 소스가 붙어 있어 AI가 규칙대로 재현합니다.
        </li>
      </ul>

      <H2>시작하기</H2>
      <p className="mt-1 text-sm text-text-base-tertiary">
        설치는 한 번, 그다음은 AI에게 화면을 시키면 됩니다.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <StartCard href="/get-started/installation" step="설치" title="Installation">
          AI 툴에 MCP를 연결하고, 프로젝트에 토큰 테마를 한 번 설정합니다. (필요 시 CLI로 컴포넌트 소스도
          가져옵니다.)
        </StartCard>
        <StartCard href="/get-started/tutorial" step="실행" title="Claude로 화면 만들기">
          레포를 clone하고 Claude에게 요청하면 UDS 컴포넌트로 화면을 조립합니다. clone → 프롬프트 →
          렌더까지 스텝으로.
        </StartCard>
      </div>
    </article>
  );
}
