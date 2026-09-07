import type { ReactNode } from "react";
import { Cta, ButtonGroup, Button } from "@uds/ui";
import { CodeBlock } from "../../../components/code-block.tsx";
import { DocHeader, Installation, H2, H3, Example, PropsTable } from "../../../components/doc.tsx";

export const metadata = { title: "CTA — UDS" };

// Prop reference — Prop · Type · Default · Description (shadcn-style 4-col).
const PROPS: [string, string, string, ReactNode][] = [
  ["onFrameHigh", "boolean", "false", "배경을 하위 프레임에 맞춥니다 — false=background/base/low(#fcfcfc), true=background/base/high(#f2f2f2). Figma의 variant 축입니다."],
  ["hasSystemUiBottom", "boolean", "true", "하단 시스템 UI(iOS 홈 인디케이터)를 렌더할지 여부."],
  ["systemUi", "ReactNode", "홈 인디케이터", "기본 홈 인디케이터를 커스텀 시스템 UI 노드로 교체합니다(Figma의 시스템 UI 슬롯에 대응)."],
  ["children", "ReactNode (ButtonGroup)", "—", "액션 영역. 보통 ButtonGroup(+Button)을 넣습니다."],
  ["className", "string", "—", "추가 유틸리티 클래스(cn 병합)."],
  ["…HTMLAttributes", "React.HTMLAttributes<HTMLDivElement>", "—", "id, data-* 등 표준 div 속성."],
];

export default function CtaPage() {
  return (
    <article className="max-w-3xl">
      <DocHeader title="CTA" slug="cta">
        화면 하단에 주요 액션을 고정하는 컨테이너. 안에 버튼 그룹을 담습니다.
      </DocHeader>

      {/* Hero preview — static */}
      <div className="mt-6 flex items-center justify-center rounded-large border bg-container-base-low p-10">
        <Cta className="w-full max-w-sm rounded-large border">
          <ButtonGroup direction="row">
            <Button>확인</Button>
          </ButtonGroup>
        </Cta>
      </div>

      <Installation name="cta" note="ButtonGroup·Button도 함께 설치됩니다." />

      <H2>Usage</H2>
      <div className="mt-4">
        <CodeBlock lang="tsx" code={'import { Cta, ButtonGroup, Button } from "@uds/ui"'} />
      </div>
      <div className="mt-3">
        <CodeBlock
          lang="tsx"
          code={
            '<Cta>\n  <ButtonGroup direction="row">\n    <Button>확인</Button>\n  </ButtonGroup>\n</Cta>'
          }
        />
      </div>

      <H2>Examples</H2>
      <H3>기본 CTA</H3>
      <Example
        preview={
          <Cta className="w-full max-w-sm rounded-large border">
            <ButtonGroup direction="row">
              <Button>확인</Button>
            </ButtonGroup>
          </Cta>
        }
        code={
          '<Cta>\n  <ButtonGroup direction="row">\n    <Button>확인</Button>\n  </ButtonGroup>\n</Cta>'
        }
      />
      <H3>onFrameHigh · 배경 base/high</H3>
      <Example
        preview={
          <Cta onFrameHigh className="w-full max-w-sm rounded-large border">
            <ButtonGroup direction="row">
              <Button variant="filled" hierarchy="secondary">
                취소
              </Button>
              <Button>확인</Button>
            </ButtonGroup>
          </Cta>
        }
        code={
          '<Cta onFrameHigh>\n  <ButtonGroup direction="row">\n    <Button variant="filled" hierarchy="secondary">취소</Button>\n    <Button>확인</Button>\n  </ButtonGroup>\n</Cta>'
        }
      />

      <H2>Features</H2>
      <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-text-base-tertiary">
        <li>화면 하단 액션 컨테이너 — 액션은 <code>children</code>으로 <code>ButtonGroup</code>(+<code>Button</code>)을 넣습니다.</li>
        <li>컨테이너는 배경·wrapper 패딩(<code>component/x/20</code>·<code>component/y/16</code>)·하단 시스템 UI만 담당합니다.</li>
        <li><code>onFrameHigh</code>로 배경을 하위 프레임에 맞춥니다(<code>false</code>=base/low, <code>true</code>=base/high).</li>
        <li><code>hasSystemUiBottom</code>은 기본 <code>true</code>로 iOS 홈 인디케이터를 렌더하며, <code>systemUi</code> 슬롯으로 교체합니다.</li>
        <li>모든 색·간격·홈 인디케이터 색이 디자인 토큰에 바인딩되어, 토큰이 바뀌면 자동 반영됩니다.</li>
        <li>버튼 색상/크기는 자식 <code>Button</code>이 담당합니다.</li>
      </ul>

      <H2>API Reference</H2>
      <PropsTable rows={PROPS} />
      <p className="mt-2 text-xs text-text-base-tertiary">
        <code>onFrameHigh</code>·<code>hasSystemUiBottom</code>은 Figma의 표현 축이자 코드 prop입니다.
        액션(버튼)은 <code>Cta</code>가 아니라 자식 <code>ButtonGroup</code>/<code>Button</code>으로
        지정합니다.
      </p>

      <H2>Accessibility</H2>
      <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-text-base-tertiary">
        <li>레이아웃 컨테이너로, 상호작용 의미는 자식 <code>Button</code>이 네이티브 <code>{"<button>"}</code>으로 제공합니다.</li>
        <li>화면 하단에 고정되는 주요 행동이므로, 페이지의 기본 액션은 하나의 <code>ButtonGroup</code>으로 명확히 묶습니다.</li>
        <li>하단 시스템 UI(홈 인디케이터)는 시각 요소일 뿐, 보조기술에 노출되는 콘텐츠가 아닙니다.</li>
        <li>키보드 포커스·엔터/스페이스 활성화·포커스 링은 자식 <code>Button</code>이 기본 지원합니다.</li>
      </ul>

    </article>
  );
}
