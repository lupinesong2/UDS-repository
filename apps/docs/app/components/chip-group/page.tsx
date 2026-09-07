import type { ReactNode } from "react";
import { Chip, ChipGroup } from "@uds/ui";
import { CodeBlock } from "../../../components/code-block.tsx";
import { DocHeader, Installation, H2, H3, Example, PropsTable } from "../../../components/doc.tsx";

export const metadata = { title: "Chip Group — UDS" };

// Prop reference — Prop · Type · Default · Description (shadcn-style 4-col).
const PROPS: [string, string, string, ReactNode][] = [
  ["wrap", "boolean", "false", "칩 줄바꿈 여부. false(기본)는 한 줄 가로 스크롤, true는 여러 줄 flex-wrap."],
  ["label", "ReactNode", "—", "상단 라벨 행. 주면 라벨이 뜨고 생략하면 헤더 행 자체가 숨습니다."],
  ["required", "boolean", "false", "라벨 옆 마젠타 별표(*) 표시 — 주로 selection 칩 그룹에서 사용."],
  ["children", "ReactNode (Chip[])", "—", "배치할 Chip 자식들. 색·크기는 각 Chip이 소유합니다."],
];

export default function ChipGroupPage() {
  return (
    <article className="max-w-3xl">
      <DocHeader title="Chip Group" slug="chip-group">
        여러 칩을 배치하는 그룹 컨테이너. 레이아웃만 담당하고 상태는 각 칩이 가집니다.
      </DocHeader>

      {/* Hero preview — static */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 rounded-large border bg-container-base-low p-10">
        <ChipGroup>
          <Chip variant="filter" selected>
            전체
          </Chip>
          <Chip variant="filter">혜택</Chip>
          <Chip variant="filter">쇼핑</Chip>
          <Chip variant="filter">여행</Chip>
        </ChipGroup>
      </div>

      <Installation name="chip-group" note="Chip도 함께 설치됩니다." />

      <H2>Usage</H2>
      <div className="mt-4">
        <CodeBlock lang="tsx" code={'import { Chip, ChipGroup } from "@uds/ui"'} />
      </div>
      <div className="mt-3">
        <CodeBlock
          lang="tsx"
          code={
            '<ChipGroup label="관심 카테고리" required wrap>\n  <Chip variant="selection" selected>혜택</Chip>\n  <Chip variant="selection">쇼핑</Chip>\n  <Chip variant="selection">여행</Chip>\n</ChipGroup>'
          }
        />
      </div>

      <H2>Examples</H2>
      <H3>Filter · 한 줄 (스크롤)</H3>
      <Example
        preview={
          <ChipGroup>
            <Chip variant="filter" selected>
              전체
            </Chip>
            <Chip variant="filter">혜택</Chip>
            <Chip variant="filter">쇼핑</Chip>
          </ChipGroup>
        }
        code={
          '<ChipGroup>\n  <Chip variant="filter" selected>전체</Chip>\n  <Chip variant="filter">혜택</Chip>\n  <Chip variant="filter">쇼핑</Chip>\n</ChipGroup>'
        }
      />
      <H3>Filter · wrap (여러 줄)</H3>
      <Example
        preview={
          <ChipGroup wrap>
            <Chip variant="filter" selected>
              전체
            </Chip>
            <Chip variant="filter">혜택</Chip>
            <Chip variant="filter">쇼핑</Chip>
            <Chip variant="filter">여행</Chip>
          </ChipGroup>
        }
        code={
          '<ChipGroup wrap>\n  <Chip variant="filter" selected>전체</Chip>\n  <Chip variant="filter">혜택</Chip>\n  <Chip variant="filter">쇼핑</Chip>\n  <Chip variant="filter">여행</Chip>\n</ChipGroup>'
        }
      />
      <H3>Selection · 라벨 + 필수</H3>
      <Example
        preview={
          <ChipGroup label="관심 카테고리" required wrap>
            <Chip variant="selection" selected>
              혜택
            </Chip>
            <Chip variant="selection">쇼핑</Chip>
            <Chip variant="selection">여행</Chip>
          </ChipGroup>
        }
        code={
          '<ChipGroup label="관심 카테고리" required wrap>\n  <Chip variant="selection" selected>혜택</Chip>\n  <Chip variant="selection">쇼핑</Chip>\n  <Chip variant="selection">여행</Chip>\n</ChipGroup>'
        }
      />

      <H2>Features</H2>
      <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-text-base-tertiary">
        <li>
          <code>ChipGroup</code>은 <code>Chip</code> 자식들을 배치하는 레이아웃 전용 래퍼입니다 — 색·크기는
          각 <code>Chip</code>이 소유합니다.
        </li>
        <li>
          <code>ButtonGroup</code> ↔ <code>Button</code>과 동일한 관계로, 그룹은 배치만, 개별 칩은 생김새를
          담당합니다.
        </li>
        <li>
          <code>wrap=true</code>면 여러 줄로 줄바꿈(flex-wrap), <code>false</code>(기본)면 한 줄 가로
          스크롤입니다.
        </li>
        <li>
          <code>label</code>을 주면 상단 라벨 행이 뜨고, <code>required</code>면 마젠타 별표(*)가 붙습니다.
        </li>
        <li>
          넣는 칩 수(Figma <code>chipCount</code>)는 프롭이 아니라 실제 <code>Chip</code> 자식 수입니다.
        </li>
      </ul>

      <H2>API Reference</H2>
      <PropsTable rows={PROPS} />
      <p className="mt-2 text-xs text-text-base-tertiary">
        <code>chipCount</code>는 프롭이 아니라 넣는 <code>Chip</code> 자식 수입니다.{" "}
        <code>wrap=false</code>(기본)는 한 줄 가로 스크롤, <code>wrap=true</code>는 여러 줄
        줄바꿈입니다. 표준 <code>div</code> 속성(<code>className</code> 등)을 그대로 받습니다.
      </p>

      <H2>Accessibility</H2>
      <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-text-base-tertiary">
        <li>
          각 <code>Chip</code>은 네이티브 <code>{"<button>"}</code>으로 렌더되어 키보드 포커스·엔터/스페이스
          활성화·스크린리더를 기본 지원합니다.
        </li>
        <li>
          토글형 칩(filter · selection)은 <code>aria-pressed</code>로 선택 상태를 보조기술에 전달합니다.
        </li>
        <li>
          <code>label</code>·<code>required</code> 별표는 시각 라벨 역할을 하며, 폼 맥락에서는 각 칩을 관련
          입력과 연결합니다.
        </li>
        <li>
          한 줄 스크롤(<code>wrap=false</code>)에서도 모든 칩이 키보드 탭 순서로 접근 가능합니다.
        </li>
      </ul>

    </article>
  );
}
