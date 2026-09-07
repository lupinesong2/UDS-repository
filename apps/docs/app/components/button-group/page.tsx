import type { ReactNode } from "react";
import { ButtonGroup, Button } from "@uds/ui";
import { CodeBlock } from "../../../components/code-block.tsx";
import { DocHeader, Installation, H2, H3, Example, PropsTable } from "../../../components/doc.tsx";

export const metadata = { title: "Button Group — UDS" };

// Prop reference — Prop · Type · Default · Description (shadcn-style 4-col).
const PROPS: [string, string, string, ReactNode][] = [
  [
    "direction",
    "row | column",
    "row",
    <>
      레이아웃 방향. <code>row</code>는 버튼을 동일 너비로 나란히, <code>column</code>은 각 버튼을
      풀너비로 세로 배치합니다. 정의되지 않은 값은 컴파일 에러입니다.
    </>,
  ],
  [
    "children",
    "ReactNode (Button …)",
    "—",
    <>그룹을 구성할 Button 요소들. 색상·계층·크기는 각 Button이 결정합니다.</>,
  ],
  ["className", "string", "—", <>추가 유틸리티 클래스(cn 병합).</>],
  [
    "…HTMLAttributes",
    "React.HTMLAttributes<HTMLDivElement>",
    "—",
    <>
      <code>role</code>(기본 <code>&quot;group&quot;</code>), <code>id</code>, <code>data-*</code> 등
      표준 div 속성.
    </>,
  ],
];

export default function ButtonGroupPage() {
  return (
    <article className="max-w-3xl">
      <DocHeader title="Button Group" slug="button-group">
        여러 버튼을 나란히 묶는 그룹 컨테이너. 레이아웃만 담당하고 각 항목은 role <code>button</code>입니다.
      </DocHeader>

      {/* Hero preview — static */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 rounded-large border bg-container-base-low p-10">
        <ButtonGroup direction="row" className="w-80">
          <Button hierarchy="secondary">취소</Button>
          <Button>확인</Button>
        </ButtonGroup>
      </div>

      <Installation name="button-group" note="Button도 함께 설치됩니다." />

      <H2>Usage</H2>
      <div className="mt-4">
        <CodeBlock lang="tsx" code={'import { ButtonGroup, Button } from "@uds/ui"'} />
      </div>
      <div className="mt-3">
        <CodeBlock
          lang="tsx"
          code={
            '<ButtonGroup direction="row">\n  <Button hierarchy="secondary">취소</Button>\n  <Button>확인</Button>\n</ButtonGroup>'
          }
        />
      </div>

      <H2>Examples</H2>
      <H3>Row · Filled + Filled</H3>
      <Example
        preview={
          <ButtonGroup direction="row" className="w-80">
            <Button hierarchy="secondary">취소</Button>
            <Button>확인</Button>
          </ButtonGroup>
        }
        code={
          '<ButtonGroup direction="row">\n  <Button hierarchy="secondary">취소</Button>\n  <Button>확인</Button>\n</ButtonGroup>'
        }
      />
      <H3>Column · Filled + Ghost</H3>
      <Example
        preview={
          <ButtonGroup direction="column" className="w-80">
            <Button>확인</Button>
            <Button variant="ghost" hierarchy="secondary">
              다음에 하기
            </Button>
          </ButtonGroup>
        }
        code={
          '<ButtonGroup direction="column">\n  <Button>확인</Button>\n  <Button variant="ghost" hierarchy="secondary">\n    다음에 하기\n  </Button>\n</ButtonGroup>'
        }
      />
      <H3>Card · Filled + Outline</H3>
      <Example
        preview={
          <ButtonGroup direction="row" className="w-80">
            <Button category="module" variant="outline" hierarchy="primary">
              더보기
            </Button>
            <Button category="module" hierarchy="secondary">
              담기
            </Button>
          </ButtonGroup>
        }
        code={
          '<ButtonGroup direction="row">\n  <Button category="module" variant="outline" hierarchy="primary">\n    더보기\n  </Button>\n  <Button category="module" hierarchy="secondary">담기</Button>\n</ButtonGroup>'
        }
      />

      <H2>Features</H2>
      <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-text-base-tertiary">
        <li>
          <code>ButtonGroup</code>은 레이아웃 래퍼입니다 — 색상·계층은 자식 <code>Button</code>이
          결정하고, 그룹은 <code>direction</code>·간격(8px)·자식 너비만 담당합니다.
        </li>
        <li>
          <code>direction=row</code>는 자식을 동일 너비로 나란히, <code>column</code>은 각 자식을
          풀너비로 세로 배치합니다. 기본값은 <code>row</code>.
        </li>
        <li>
          Figma <code>[Button Group] CTA</code>·<code>Bottom Sheet</code>·<code>Dialog</code>·
          <code>Card</code> 네 세트를 같은 <code>ButtonGroup</code>으로 표현합니다 — 맥락은 자식{" "}
          <code>Button</code>의 <code>category</code>로 구분합니다.
        </li>
        <li>
          모든 색·간격·타이포가 디자인 토큰에 바인딩되어, 토큰이 바뀌면 자동 반영됩니다(그룹은{" "}
          <code>spacing/gap/8</code>만 직접 소유).
        </li>
        <li>
          Figma의 <code>contentType</code>은 children으로 표현합니다 — filled·filled+filled·
          filled+outline·filled+ghost 조합을 그대로 Button으로 조립합니다.
        </li>
        <li>
          <code>role=&quot;group&quot;</code>이 기본 지정되며, <code>className</code>·표준 div 속성을
          그대로 전달할 수 있습니다.
        </li>
      </ul>

      <H2>API Reference</H2>
      <PropsTable rows={PROPS} />
      <p className="mt-2 text-xs text-text-base-tertiary">
        그룹이 직접 소유하는 prop은 <code>direction</code> 하나입니다 — Figma의 표현 축인{" "}
        <code>context</code>·<code>contentType</code>은 코드에 별도 prop 없이 자식 <code>Button</code>의{" "}
        <code>category</code>/<code>variant</code>/<code>hierarchy</code> 조합으로 구현합니다.
      </p>

      <H2>Accessibility</H2>
      <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-text-base-tertiary">
        <li>
          그룹 컨테이너에 <code>role=&quot;group&quot;</code>이 기본 지정되어 보조기술이 버튼 묶음으로
          인식합니다.
        </li>
        <li>
          자식 <code>Button</code>은 네이티브 <code>{"<button>"}</code>이라 키보드 포커스·엔터/스페이스
          활성화·스크린리더를 기본 지원합니다.
        </li>
        <li>
          여러 버튼의 관계가 이름만으로 불분명하면 <code>aria-label</code>·<code>aria-labelledby</code>로
          그룹의 의미를 제공합니다.
        </li>
        <li>주요 행동과 보조 행동은 색·계층(primary/secondary)으로 시각적으로 구분합니다.</li>
      </ul>

    </article>
  );
}
