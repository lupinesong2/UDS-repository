import type { ReactNode } from "react";
import { Checkbox } from "@uds/ui";
import { CodeBlock } from "../../../components/code-block.tsx";
import { DocHeader, Installation, H2, H3, Example, PropsTable } from "../../../components/doc.tsx";

export const metadata = { title: "Checkbox — UDS" };

// Prop reference — Prop · Type · Default · Description (shadcn-style 4-col).
const PROPS: [string, string, string, ReactNode][] = [
  ["size", "medium | small", "medium", "박스+라벨 스케일. medium=24px·label-large(16), small=20px·label-medium(14)."],
  ["fontWeight", "strong | base", "strong", "라벨 굵기. strong=bold(700), base=medium(500). size와 독립적인 축."],
  ["checked / defaultChecked", "boolean", "—", "선택 상태 — 네이티브 input 속성(제어/비제어)."],
  ["disabled", "boolean", "false", "네이티브 비활성 — 상호작용 차단 + 흐린 스타일."],
  ["children", "ReactNode", "—", "라벨 텍스트 슬롯."],
];

export default function CheckboxPage() {
  return (
    <article className="max-w-3xl">
      <DocHeader title="Checkbox" slug="checkbox">
        켜고 끌 수 있는 선택 컨트롤. role <code>checkbox</code>, 선택 여부는 <code>checked</code>로 노출됩니다.
      </DocHeader>

      {/* Hero preview — static */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-6 rounded-large border bg-container-base-low p-10">
        <Checkbox defaultChecked>레이블</Checkbox>
        <Checkbox size="small" defaultChecked>레이블</Checkbox>
        <Checkbox fontWeight="base" defaultChecked>레이블</Checkbox>
      </div>

      <Installation name="checkbox" />

      <H2>Usage</H2>
      <div className="mt-4">
        <CodeBlock lang="tsx" code={'import { Checkbox } from "@uds/ui"'} />
      </div>
      <div className="mt-3">
        <CodeBlock lang="tsx" code={"<Checkbox defaultChecked>약관에 동의합니다</Checkbox>"} />
      </div>

      <H2>Examples</H2>
      <H3>기본 (미선택)</H3>
      <Example preview={<Checkbox>레이블</Checkbox>} code={"<Checkbox>레이블</Checkbox>"} />
      <H3>선택 (checked)</H3>
      <Example
        preview={<Checkbox defaultChecked>레이블</Checkbox>}
        code={"<Checkbox defaultChecked>레이블</Checkbox>"}
      />
      <H3>Small</H3>
      <Example
        preview={
          <Checkbox size="small" defaultChecked>
            레이블
          </Checkbox>
        }
        code={'<Checkbox size="small" defaultChecked>\n  레이블\n</Checkbox>'}
      />
      <H3>Disabled</H3>
      <Example
        preview={
          <Checkbox disabled defaultChecked>
            레이블
          </Checkbox>
        }
        code={"<Checkbox disabled defaultChecked>\n  레이블\n</Checkbox>"}
      />

      <H2>Features</H2>
      <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-text-base-tertiary">
        <li>하나 이상 선택할 수 있는 항목이면 Radio가 아니라 <code>Checkbox</code>를 사용합니다 — 약관 동의, 다중 필터 등.</li>
        <li>
          <code>size</code>(medium · small) × <code>fontWeight</code>(strong · base)는 독립적인 축으로,
          박스·라벨 스케일과 굵기를 각각 조절합니다.
        </li>
        <li>모든 색·간격·타이포가 디자인 토큰에 바인딩되어, 토큰이 바뀌면 자동 반영됩니다.</li>
        <li>라벨 텍스트는 <code>children</code>으로 전달합니다.</li>
        <li>선택·비활성 상태는 프롭이 아니라 네이티브 <code>checked</code>·<code>defaultChecked</code>·<code>disabled</code>로 처리합니다.</li>
        <li><code>onChange</code>·<code>name</code>·<code>value</code> 등 표준 input 속성을 그대로 받습니다.</li>
      </ul>

      <H2>API Reference</H2>
      <PropsTable rows={PROPS} />
      <p className="mt-2 text-xs text-text-base-tertiary">
        선택·비활성 상태는 프롭이 아니라 네이티브 <code>checked</code>/<code>defaultChecked</code>/
        <code>disabled</code>로 지정합니다. <code>size</code>·<code>fontWeight</code>는 서로 독립적인
        optional 프롭이며, Figma에 정의된 값만 타입으로 허용됩니다 — 정의되지 않은 값(예:{" "}
        <code>{`<Checkbox size="large" />`}</code>)은 컴파일 에러입니다.
      </p>

      <H2>Accessibility</H2>
      <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-text-base-tertiary">
        <li><code>{"<label>"}</code>이 네이티브 <code>{'<input type="checkbox">'}</code>를 감싸, 라벨 클릭·폼 시맨틱을 기본 지원합니다.</li>
        <li>네이티브 input으로 렌더되어 키보드 포커스·스페이스 토글·스크린리더를 기본 지원합니다.</li>
        <li><code>focus-visible</code> 링으로 키보드 포커스만 표시합니다(마우스 클릭 시엔 뜨지 않음).</li>
        <li>비활성은 네이티브 <code>disabled</code>로 지정해 상호작용을 막고 보조기술에 상태를 전달합니다.</li>
      </ul>

    </article>
  );
}
