import type { ReactNode } from "react";
import Link from "next/link";

export const metadata = { title: "Introduction — UDS" };

function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-12 scroll-m-20 text-lg font-semibold tracking-tight first:mt-0">{children}</h2>
  );
}

function WorkflowCard({
  href,
  index,
  title,
  who,
  children,
}: {
  href: string;
  index: string;
  title: string;
  who: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className="block rounded-medium border p-4 transition-colors hover:bg-container-base-high">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-text-brand-primary-high">{index}</span>
        <span className="text-sm font-semibold text-text-base-primary">{title}</span>
      </div>
      <p className="mt-1.5 text-sm text-text-base-tertiary">{children}</p>
      <p className="mt-2 text-xs text-text-base-tertiary">{who}</p>
    </Link>
  );
}

export default function IntroductionPage() {
  return (
    <article className="max-w-3xl">
      <header>
        <p className="text-sm font-medium text-text-brand-primary-high">Get Started</p>
        <h1 className="mt-2 scroll-m-20 text-3xl font-semibold tracking-tight">Introduction</h1>
        <p className="mt-3 text-base text-text-base-tertiary">
          UDS(Unified Design System)는 Figma 디자인 자산을 코드로 코드화한 디자인 시스템입니다. 다만
          핵심은 사람이 하나씩 조립하는 게 아니라, <strong>AI가 UDS를 소비해 화면을 만들어내도록</strong>{" "}
          설계됐다는 점입니다 — Figma 화면이든, 앱 코드든. Figma의 컴포넌트 세트가 진실의 원천이고, 토큰·
          컴포넌트·AI 가이드가 AI에게 "무엇을 어떻게 조합해야 하는지"를 알려줍니다.
        </p>
      </header>

      <H2>원칙</H2>
      <ul className="mt-3 space-y-2 text-sm text-text-base-secondary">
        <li>
          <strong className="text-text-base-primary">Figma가 진실</strong> — 색·간격·타이포는
          하드코딩하지 않고 디자인 토큰 유틸에 바인딩합니다.
        </li>
        <li>
          <strong className="text-text-base-primary">정의된 조합만 컴파일</strong> — props는 Figma가
          정의한 조합만 허용하는 타입이라, AI가 없는 조합을 만들면 타입 에러로 막힙니다.
        </li>
        <li>
          <strong className="text-text-base-primary">AI가 소비하는 지식</strong> — 모든 컴포넌트에 AI
          가이드가, 토큰·카탈로그에 조합 규칙이 붙어 있어 AI가 규칙대로 재현합니다.
        </li>
      </ul>

      <H2>AI로 UDS 사용하기</H2>
      <p className="mt-1 text-sm text-text-base-tertiary">
        역할보다 "AI로 무엇을 만드는가"로 나뉩니다. 세 워크플로우 모두 UDS를 지식 베이스로 씁니다.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <WorkflowCard href="/examples/roaming" index="01" title="AI로 Figma 화면 생성" who="디자이너 · 기획">
          화면을 설명하면 AI가 UDS module·component 카탈로그를 골라 <code>use_figma</code>로 Figma에 직접
          조립합니다 (UDS-Gen).
        </WorkflowCard>
        <WorkflowCard href="/get-started/installation" index="02" title="AI로 앱 코드 생성" who="개발">
          AI 툴에 <code>@uds/mcp</code>를 등록하면, AI가 컴포넌트·토큰·AI 가이드를 가져와 화면 코드를
          만듭니다.
        </WorkflowCard>
        <WorkflowCard href="/get-started/quickstart" index="03" title="AI로 시스템 확장" who="유지보수">
          Figma 세트 URL을 스킬(<code>/uds-component</code> 등)에 주면 컴포넌트·타입·문서·Code Connect까지
          생성/연결합니다.
        </WorkflowCard>
      </div>

      <H2>다음 단계</H2>
      <p className="mt-3 text-sm text-text-base-tertiary">
        앱 코드 생성을 하려면{" "}
        <Link className="underline" href="/get-started/installation">
          Installation
        </Link>
        에서 MCP·셋업을 마친 뒤,{" "}
        <Link className="underline" href="/get-started/quickstart">
          Quickstart
        </Link>
        에서 세 워크플로우를 실제로 실행해 보세요.
      </p>
    </article>
  );
}
