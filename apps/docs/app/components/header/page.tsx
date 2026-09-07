import type { ReactNode } from "react";
import { Header } from "@uds/ui";
import { MenuIcon, MoreVerticalIcon } from "@uds/icons";
import { CodeBlock } from "../../../components/code-block.tsx";
import { DocHeader, Installation, H2, H3, Example, PropsTable } from "../../../components/doc.tsx";

export const metadata = { title: "Header — UDS" };

// Prop reference — Prop · Type · Default · Description (shadcn-style 4-col).
const PROPS: [string, string, string, ReactNode][] = [
  ["category", '"title" | "search" | "logo"', '"title"', <>유형 선택 — title(뒤로+제목+액션) · search(뒤로+검색필드+액션) · logo(로고+액션). Figma <code>[Header]</code> · <code>[Header] Search</code> · <code>[Header] Logo</code> 세 세트를 병합한 축.</>],
  ["align", '"left" | "center"', '"left"', <>제목/로고 정렬. <code>title</code>·<code>logo</code>에만 존재하며 <code>search</code>에는 없습니다(<code>align?: never</code> — 타입으로 강제).</>],
  ["onFrameHigh", "boolean", "false", <>배경을 프레임에 맞춥니다 — false=base/low(#fcfcfc), true=base/high(#f2f2f2).</>],
  ["onBack", "() => void", "—", <>지정하면 뒤로가기 chevron이 렌더되고 클릭 시 호출됩니다(start 슬롯).</>],
  ["actions", "ReactNode", "—", <>우측 액션 아이콘 슬롯(각 24px, 간격 16px, end 슬롯).</>],
  ["title", "ReactNode", "—", <><code>category="title"</code>의 제목 텍스트.</>],
  ["logo", "ReactNode", "—", <><code>category="logo"</code>의 로고 노드.</>],
  ["placeholder", "string", '"검색어를 입력해주세요"', <><code>category="search"</code> 입력 안내 문구.</>],
  ["value / onChange / onSearch", "string · Handler · () => void", "—", <>검색 입력 제어. Enter 또는 검색 아이콘 클릭 시 <code>onSearch</code> 호출.</>],
  ["className", "string", "—", <>루트 <code>{"<header>"}</code>에 추가할 유틸리티 클래스(cn 병합).</>],
  ["…HTMLAttributes", "HTMLAttributes<HTMLElement>", "—", <><code>id</code>·<code>style</code> 등 (<code>title</code>·<code>onChange</code> 제외 — 슬롯 프롭 우선).</>],
];

export default function HeaderPage() {
  return (
    <article className="max-w-3xl">
      <DocHeader title="Header" slug="header">
        화면 상단 내비게이션 바. role <code>banner</code> 영역으로 제목·검색·로고를 배치합니다.
      </DocHeader>

      {/* Hero preview — static. Header is full-width, so it's constrained in a phone-width card. */}
      <div className="mt-6 flex justify-center rounded-large border bg-container-base-low p-10">
        <div className="w-full max-w-[402px] overflow-hidden rounded-large border">
          <Header category="title" onBack={() => {}} title="배송지 입력" actions={<MoreVerticalIcon />} />
        </div>
      </div>

      <Installation name="header" />

      <H2>Usage</H2>
      <div className="mt-4">
        <CodeBlock lang="tsx" code={'import { Header } from "@uds/ui"'} />
      </div>
      <div className="mt-3">
        <CodeBlock
          lang="tsx"
          code={'<Header\n  category="title"\n  onBack={() => history.back()}\n  title="배송지 입력"\n/>'}
        />
      </div>

      <H2>Examples</H2>
      <H3>Title · Back · Action</H3>
      <Example
        preview={
          <div className="w-full max-w-[402px] overflow-hidden rounded-large border">
            <Header category="title" onBack={() => {}} title="배송지 입력" actions={<MoreVerticalIcon />} />
          </div>
        }
        code={'<Header\n  category="title"\n  onBack={() => history.back()}\n  title="배송지 입력"\n  actions={<MoreVerticalIcon />}\n/>'}
      />
      <H3>Title · Center Align</H3>
      <Example
        preview={
          <div className="w-full max-w-[402px] overflow-hidden rounded-large border">
            <Header category="title" align="center" onBack={() => {}} title="주문 상세" actions={<MoreVerticalIcon />} />
          </div>
        }
        code={'<Header\n  category="title"\n  align="center"\n  onBack={() => history.back()}\n  title="주문 상세"\n  actions={<MoreVerticalIcon />}\n/>'}
      />
      <H3>Search</H3>
      <Example
        preview={
          <div className="w-full max-w-[402px] overflow-hidden rounded-large border">
            <Header category="search" onBack={() => {}} placeholder="상품을 검색해보세요" />
          </div>
        }
        code={'<Header\n  category="search"\n  onBack={() => history.back()}\n  placeholder="상품을 검색해보세요"\n/>'}
      />
      <H3>Logo · Actions</H3>
      <Example
        preview={
          <div className="w-full max-w-[402px] overflow-hidden rounded-large border">
            <Header
              category="logo"
              onFrameHigh
              logo={<span className="text-title-small font-strong text-text-brand-primary-high">UDS</span>}
              actions={<MenuIcon />}
            />
          </div>
        }
        code={'<Header\n  category="logo"\n  onFrameHigh\n  logo={<Logo />}\n  actions={<MenuIcon />}\n/>'}
      />

      <H2>Features</H2>
      <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-text-base-tertiary">
        <li>유형을 고르는 <code>category</code>(title · search · logo)로 상단 바 구조를 구성합니다.</li>
        <li>
          <code>align</code>은 <code>title</code>·<code>logo</code>에만 존재하고 <code>search</code>에는
          없습니다 (discriminated union — <code>{`<Header category="search" align="left" />`}</code>은
          컴파일 에러).
        </li>
        <li>모든 색·간격·타이포가 디자인 토큰에 바인딩되어, 토큰이 바뀌면 자동 반영됩니다.</li>
        <li><code>onBack</code> 콜백을 넘기면 뒤로가기 chevron이 렌더됩니다.</li>
        <li><code>actions</code> 슬롯으로 우측 액션 아이콘을 넣습니다(각 24px).</li>
        <li><code>category="search"</code>는 <code>value</code> 미지정 시 내부 상태로 동작해 지우기(✕) 버튼이 기본 동작합니다.</li>
      </ul>

      <H2>API Reference</H2>
      <PropsTable rows={PROPS} />
      <p className="mt-2 text-xs text-text-base-tertiary">
        Figma에 정의된 조합만 타입으로 허용됩니다 — <code>align</code>은 <code>search</code>에서
        정의되지 않으므로(<code>{`<Header category="search" align="left" />`}</code>) 컴파일 에러입니다.
      </p>

      <H2>Accessibility</H2>
      <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-text-base-tertiary">
        <li>루트는 시맨틱 <code>{"<header>"}</code> 요소로 렌더되어 랜드마크 역할을 제공합니다.</li>
        <li>뒤로가기·지우기·검색은 네이티브 <code>{"<button>"}</code>이며 각각 <code>aria-label</code>(뒤로 · 지우기 · 검색)을 가집니다.</li>
        <li>검색 아이콘 버튼은 <code>focus-visible</code> 링으로 키보드 포커스를 표시합니다.</li>
        <li>검색 입력은 <code>type="search"</code>로 렌더되어 Enter 키로 <code>onSearch</code>를 호출합니다.</li>
        <li><code>actions</code>에 아이콘만 넣을 때는 각 버튼에 <code>aria-label</code>로 의미를 제공합니다.</li>
      </ul>

    </article>
  );
}
