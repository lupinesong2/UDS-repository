import type { ReactNode } from "react";
import { Chip } from "@uds/ui";
import { CodeBlock } from "../../../components/code-block.tsx";
import { DocHeader, Installation, H2, H3, Example, PropsTable } from "../../../components/doc.tsx";

export const metadata = { title: "Chip — UDS" };

// Prop reference — Prop · Type · Default · Description (shadcn-style 4-col).
const PROPS: [string, string, string, ReactNode][] = [
  ["variant", "filter | trigger | selection", "filter", "칩의 유형. filter=목록·카드 빠른 필터(pill 토글), trigger=상세 옵션 메뉴를 여는 진입점(chevron 자동), selection=외곽선 선택 칩."],
  ["size", "medium | small", "medium", "상하 여백 크기. filter·trigger에만 존재하며 selection은 단일 크기."],
  ["selected", "boolean", "false", "토글 상태. filter·selection에만 존재하며 trigger에는 없다(aria-pressed로 노출)."],
  ["disabled", "boolean", "false", "네이티브 비활성 — 상호작용 차단 + 흐린 스타일."],
  ["children", "ReactNode", "—", "칩 라벨."],
];

export default function ChipPage() {
  return (
    <article className="max-w-3xl">
      <DocHeader title="Chip" slug="chip">
        선택·필터·트리거에 쓰는 칩. role <code>button</code>이며 토글은 <code>aria-pressed</code>로 상태를 알립니다.
      </DocHeader>

      {/* Hero preview — static */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 rounded-large border bg-container-base-low p-10">
        <Chip selected>전체</Chip>
        <Chip variant="trigger">정렬</Chip>
        <Chip variant="selection" selected>혜택</Chip>
      </div>

      <Installation name="chip" />

      <H2>Usage</H2>
      <div className="mt-4">
        <CodeBlock lang="tsx" code={'import { Chip } from "@uds/ui"'} />
      </div>
      <div className="mt-3">
        <CodeBlock
          lang="tsx"
          code={'<Chip selected>전체</Chip>\n<Chip variant="trigger">정렬</Chip>'}
        />
      </div>

      <H2>Examples</H2>
      <H3>Filter · 선택</H3>
      <Example preview={<Chip selected>전체</Chip>} code={"<Chip selected>전체</Chip>"} />
      <H3>Filter · 미선택</H3>
      <Example preview={<Chip>전체</Chip>} code={"<Chip>전체</Chip>"} />
      <H3>Trigger</H3>
      <Example
        preview={<Chip variant="trigger">정렬</Chip>}
        code={'<Chip variant="trigger">정렬</Chip>'}
      />
      <H3>Selection · 선택</H3>
      <Example
        preview={
          <Chip variant="selection" selected>
            혜택
          </Chip>
        }
        code={'<Chip variant="selection" selected>\n  혜택\n</Chip>'}
      />

      <H2>Features</H2>
      <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-text-base-tertiary">
        <li>
          <code>variant</code>로 유형을 고릅니다 — <code>filter</code>(빠른 필터, pill 토글),{" "}
          <code>trigger</code>(상세 옵션 메뉴 진입점, chevron 자동), <code>selection</code>(외곽선
          선택 칩).
        </li>
        <li>
          <code>variant</code> × <code>size</code> × <code>selected</code>는 Figma에 정의된 조합만
          타입으로 허용합니다 (discriminated union — 잘못된 조합은 컴파일 에러).
        </li>
        <li>모든 색·간격·타이포가 디자인 토큰에 바인딩되어, 토큰이 바뀌면 자동 반영됩니다.</li>
        <li><code>selected</code>는 <code>filter</code>·<code>selection</code>의 토글 상태입니다.</li>
        <li>라벨은 <code>children</code>으로 전달하고, 여러 칩은 <code>ChipGroup</code>으로 배치합니다.</li>
        <li>hover·pressed·focus·disabled는 프롭이 아니라 CSS·네이티브로 자동 처리됩니다.</li>
      </ul>

      <H2>API Reference</H2>
      <PropsTable rows={PROPS} />
      <p className="mt-2 text-xs text-text-base-tertiary">
        Figma에 정의된 조합만 타입으로 허용됩니다 — <code>variant="selection"</code>은{" "}
        <code>size</code>가 없고, <code>variant="trigger"</code>는 <code>selected</code>가 없습니다.
        정의되지 않은 조합(예: <code>{`<Chip variant="trigger" selected />`}</code>)은 컴파일
        에러입니다.
      </p>

      <H2>Accessibility</H2>
      <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-text-base-tertiary">
        <li>네이티브 <code>{"<button>"}</code>으로 렌더되어 키보드 포커스·엔터/스페이스 활성화·스크린리더를 기본 지원합니다.</li>
        <li><code>filter</code>·<code>selection</code>의 토글 상태는 <code>aria-pressed</code>로 노출됩니다(<code>trigger</code>는 메뉴를 여는 버튼이므로 없음).</li>
        <li><code>focus-visible</code> 링으로 키보드 포커스만 표시합니다(마우스 클릭 시엔 뜨지 않음).</li>
        <li>비활성은 네이티브 <code>disabled</code>로 지정해 상호작용을 막고 보조기술에 상태를 전달합니다.</li>
      </ul>

    </article>
  );
}
