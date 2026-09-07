import type { ReactNode } from "react";
import { Radio } from "@uds/ui";
import { CodeBlock } from "../../../components/code-block.tsx";
import { DocHeader, Installation, H2, H3, Example, PropsTable } from "../../../components/doc.tsx";

export const metadata = { title: "Radio — UDS" };

// Prop reference — Prop · Type · Default · Description (shadcn-style 4-col).
const PROPS: [string, string, string, ReactNode][] = [
  ["size", "medium | small", "medium", "원과 라벨의 크기 축. medium=20px 원·label-large(16), small=16px 원·label-medium(14)."],
  ["fontWeight", "strong | base", "strong", "라벨 굵기. strong=700, base=500. size와 독립적인 축."],
  ["name", "string", "—", "그룹 식별자. 같은 name을 공유하는 Radio끼리 하나의 선택 그룹으로 묶입니다."],
  ["checked / defaultChecked", "boolean", "—", "선택 상태. 네이티브 속성으로 제어(controlled)/비제어(uncontrolled) 모두 지원."],
  ["disabled", "boolean", "false", "네이티브 비활성 — 상호작용 차단 + 흐린 스타일."],
  ["children", "ReactNode", "—", "라벨 텍스트 슬롯."],
];

export default function RadioPage() {
  return (
    <article className="max-w-3xl">
      <DocHeader title="Radio" slug="radio">
        여러 옵션 중 하나만 고르는 선택 컨트롤. role <code>radio</code>, 같은 <code>name</code>이 하나의 radiogroup을 이룹니다.
      </DocHeader>

      {/* Hero preview — static */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-6 rounded-large border bg-container-base-low p-10">
        <Radio name="demo" defaultChecked>
          기본 요금제
        </Radio>
        <Radio name="demo">프로 요금제</Radio>
      </div>

      <Installation name="radio" />

      <H2>Usage</H2>
      <div className="mt-4">
        <CodeBlock lang="tsx" code={'import { Radio } from "@uds/ui"'} />
      </div>
      <div className="mt-3">
        <CodeBlock
          lang="tsx"
          code={
            '<Radio name="plan" value="basic" defaultChecked>\n  기본 요금제\n</Radio>\n<Radio name="plan" value="pro">\n  프로 요금제\n</Radio>'
          }
        />
      </div>

      <H2>Examples</H2>
      <H3>기본 (미선택)</H3>
      <Example
        preview={<Radio name="ex-default">레이블</Radio>}
        code={'<Radio name="ex-default">레이블</Radio>'}
      />
      <H3>선택 (checked)</H3>
      <Example
        preview={
          <Radio name="ex-checked" defaultChecked>
            레이블
          </Radio>
        }
        code={'<Radio name="ex-checked" defaultChecked>\n  레이블\n</Radio>'}
      />
      <H3>Small</H3>
      <Example
        preview={
          <Radio name="ex-small" size="small">
            레이블
          </Radio>
        }
        code={'<Radio name="ex-small" size="small">\n  레이블\n</Radio>'}
      />
      <H3>그룹 (name 공유)</H3>
      <Example
        preview={
          <div className="flex flex-wrap items-center gap-6">
            <Radio name="ex-group" defaultChecked>
              기본 요금제
            </Radio>
            <Radio name="ex-group">프로 요금제</Radio>
          </div>
        }
        code={'<Radio name="plan" defaultChecked>\n  기본 요금제\n</Radio>\n<Radio name="plan">\n  프로 요금제\n</Radio>'}
      />

      <H2>Features</H2>
      <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-text-base-tertiary">
        <li>단일 선택이 필요한 폼·옵션 선택에 사용합니다 — 하나만 켜지는 항목이면 <code>Radio</code>입니다.</li>
        <li>같은 <code>name</code>을 공유하는 <code>Radio</code>끼리 하나의 선택 그룹으로 묶여 한 번에 하나만 선택됩니다.</li>
        <li>
          <code>size</code>(medium · small) × <code>fontWeight</code>(strong · base)는 서로 독립적인 축이라
          모든 조합이 유효합니다.
        </li>
        <li>모든 색·간격·타이포가 디자인 토큰에 바인딩되어, 토큰이 바뀌면 자동 반영됩니다.</li>
        <li>라벨 텍스트는 <code>children</code>으로 전달합니다.</li>
        <li>선택·비활성은 프롭이 아니라 네이티브 <code>checked</code>·<code>defaultChecked</code>·<code>disabled</code>로 처리됩니다.</li>
      </ul>

      <H2>API Reference</H2>
      <PropsTable rows={PROPS} />
      <p className="mt-2 text-xs text-text-base-tertiary">
        같은 <code>name</code>을 공유하는 Radio는 하나의 그룹으로 묶여 한 번에 하나만 선택됩니다.
        선택·비활성 상태는 프롭이 아니라 네이티브 <code>checked</code>/<code>defaultChecked</code>/
        <code>disabled</code>로 지정합니다. <code>size</code>·<code>fontWeight</code>는 서로 독립적인 축이며,
        Figma에 정의된 값만 타입으로 허용됩니다 — 정의되지 않은 값(예:{" "}
        <code>{`<Radio size="large" />`}</code>)은 컴파일 에러입니다.
      </p>

      <H2>Accessibility</H2>
      <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-text-base-tertiary">
        <li>
          네이티브 <code>{'<input type="radio">'}</code>로 렌더되어 키보드 포커스·방향키 그룹 이동·스크린리더를
          기본 지원합니다.
        </li>
        <li>
          <code>{"<label>"}</code>로 감싸 라벨을 클릭해도 선택되며, 라벨과 컨트롤이 접근성 트리에서 연결됩니다.
        </li>
        <li><code>focus-visible</code> 링으로 키보드 포커스만 표시합니다(마우스 클릭 시엔 뜨지 않음).</li>
        <li>비활성은 네이티브 <code>disabled</code>로 지정해 상호작용을 막고 보조기술에 상태를 전달합니다.</li>
      </ul>

    </article>
  );
}
