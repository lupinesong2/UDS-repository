import type { ReactNode } from "react";
import { Button } from "@uds/ui";
import { CodeBlock } from "../../../components/code-block.tsx";
import { DocHeader, Installation, H2, H3, Example, PropsTable } from "../../../components/doc.tsx";

export const metadata = { title: "Button — UDS" };

// Prop reference — Prop · Type · Default · Description.
const PROPS: [string, string, string, ReactNode][] = [
  ["category", "page | module | inline", "page", "맥락/위계를 정하는 축. 페이지 최상위 CTA=page, 모듈·카드 내부=module, 콘텐츠 흐름 속 텍스트형=inline."],
  ["variant", "filled | outline | ghost", "filled", "채움 방식. category별로 허용되는 값이 다르다(타입으로 강제)."],
  ["hierarchy", "primary | secondary | tertiary", "primary", "강조 수준. tertiary는 module의 filled에만 존재한다."],
  ["iconStart", "ReactNode", "—", "라벨 앞 아이콘 슬롯(page·module 24px, inline 16px)."],
  ["iconEnd", "ReactNode", "—", "라벨 뒤 아이콘 슬롯."],
  ["disabled", "boolean", "false", "네이티브 비활성 — 상호작용 차단 + 흐린 스타일."],
  ["asChild", "boolean", "false", "자식 요소로 렌더(Radix Slot). <a>/<Link>를 버튼처럼 쓸 때."],
];

export default function ButtonPage() {
  return (
    <article className="max-w-3xl">
      <DocHeader title="Button" slug="button">
        누르면 동작을 실행하는 버튼. role <code>button</code>의 네이티브 <code>{"<button>"}</code> 기반으로 키보드·스크린리더를 지원합니다.
      </DocHeader>

      {/* Hero preview — static */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 rounded-large border bg-container-base-low p-10">
        <Button>레이블</Button>
        <Button variant="filled" hierarchy="secondary">레이블</Button>
        <Button variant="ghost" hierarchy="secondary">레이블</Button>
      </div>

      <Installation name="button" />

      <H2>Usage</H2>
      <div className="mt-4">
        <CodeBlock lang="tsx" code={'import { Button } from "@uds/ui"'} />
      </div>
      <div className="mt-3">
        <CodeBlock
          lang="tsx"
          code={'<Button category="page" variant="filled" hierarchy="primary">\n  레이블\n</Button>'}
        />
      </div>

      <H2>Examples</H2>
      <H3>Page · Filled · Primary</H3>
      <Example preview={<Button>레이블</Button>} code={"<Button>레이블</Button>"} />
      <H3>Module · Outline · Secondary</H3>
      <Example
        preview={
          <Button category="module" variant="outline" hierarchy="secondary">
            레이블
          </Button>
        }
        code={'<Button category="module" variant="outline" hierarchy="secondary">\n  레이블\n</Button>'}
      />
      <H3>Inline · Ghost · Primary</H3>
      <Example
        preview={
          <Button category="inline" variant="ghost" hierarchy="primary">
            레이블
          </Button>
        }
        code={'<Button category="inline" variant="ghost" hierarchy="primary">\n  레이블\n</Button>'}
      />

      <H2>Features</H2>
      <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-text-base-tertiary">
        <li>맥락을 고르는 <code>category</code>(page · module · inline)로 위계를 구성합니다.</li>
        <li>
          <code>variant</code> × <code>hierarchy</code>는 Figma에 정의된 조합만 타입으로 허용합니다
          (discriminated union — 잘못된 조합은 컴파일 에러).
        </li>
        <li>모든 색·간격·타이포가 디자인 토큰에 바인딩되어, 토큰이 바뀌면 자동 반영됩니다.</li>
        <li><code>iconStart</code>·<code>iconEnd</code> 슬롯으로 아이콘을 넣습니다.</li>
        <li><code>asChild</code>로 <code>{"<a>"}</code>·<code>{"<Link>"}</code> 등 다른 요소를 버튼처럼 렌더합니다.</li>
        <li>hover·pressed·focus·disabled는 프롭이 아니라 CSS·네이티브로 자동 처리됩니다.</li>
      </ul>

      <H2>API Reference</H2>
      <PropsTable rows={PROPS} />
      <p className="mt-2 text-xs text-text-base-tertiary">
        Figma에 정의된 조합만 타입으로 허용됩니다 — 정의되지 않은 조합(예:{" "}
        <code>{`<Button variant="outline" />`}</code> 은 category=page에서)은 컴파일 에러입니다.
      </p>

      <H2>Accessibility</H2>
      <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-text-base-tertiary">
        <li>네이티브 <code>{"<button>"}</code>으로 렌더되어 키보드 포커스·엔터/스페이스 활성화·스크린리더를 기본 지원합니다.</li>
        <li><code>focus-visible</code> 링으로 키보드 포커스만 표시합니다(마우스 클릭 시엔 뜨지 않음).</li>
        <li>비활성은 네이티브 <code>disabled</code>로 지정해 상호작용을 막고 보조기술에 상태를 전달합니다.</li>
        <li>아이콘만 있는 버튼에는 <code>aria-label</code>로 의미를 제공합니다.</li>
      </ul>
    </article>
  );
}
