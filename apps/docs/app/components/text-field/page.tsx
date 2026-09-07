import type { ReactNode } from "react";
import { TextField } from "@uds/ui";
import { CodeBlock } from "../../../components/code-block.tsx";
import { DocHeader, Installation, H2, H3, Example, PropsTable } from "../../../components/doc.tsx";

export const metadata = { title: "Text Field — UDS" };

// Prop reference — Prop · Type · Default · Description (shadcn-style 4-col).
const PROPS: [string, string, string, ReactNode][] = [
  ["variant", "text | password | card | rrn | phone | email", "text", "Figma 세트 축. 네이티브 type/inputMode·기본 placeholder를 정합니다 — password(마스킹+eye 토글)·card(카드번호)·rrn(주민번호)·phone(통신사 select)·email(도메인 select)."],
  ["label", "ReactNode", "—", "필드 위 라벨(Figma [Field Text Set] Label). htmlFor로 input과 연결됩니다. 생략하면 라벨 행이 사라지므로 aria-label을 함께 넘기세요."],
  ["required", "boolean", "false", "마젠타 필수 별표(Figma hasRequired) — 네이티브 required도 함께 설정합니다."],
  ["placeholder", "string", "—", "네이티브 placeholder. 생략하면 variant별 기본 placeholder가 쓰입니다."],
  ["error", "boolean", "false", "에러 상태(Figma isError): 빨간 링 + 빨간 supporting 메시지 + aria-invalid. disabled와 겹치면 error가 우선합니다."],
  ["disabled", "boolean", "false", "네이티브 비활성 — 상호작용 차단 + 흐린 스타일 + 보조기술 상태 전달."],
  ["messages", "ReactNode[]", "—", "필드 하단 도움말 메시지(Figma [Field Text Set] Supporting, 최대 3개). aria-describedby로 연결됩니다."],
  ["leading / trailing", "ReactNode", "—", "필드 앞/뒤 형제 박스 슬롯 — phone의 통신사 select(leading)·email의 도메인 select(trailing)."],
  ["iconEnd", "ReactNode", "—", "필드 안 끝쪽 24px 아이콘 슬롯(Figma end slot, 예: 마이크 아이콘)."],
  ["onClear", "() => void", "—", "값이 있을 때 자동 노출되는 지우기 버튼 클릭 시 호출됩니다."],
  ["className", "string", "—", "래퍼 요소에 병합되는 클래스."],
];

export default function TextFieldPage() {
  return (
    <article className="max-w-3xl">
      <DocHeader title="Text Field" slug="text-field">
        텍스트를 입력받는 입력 필드. <code>label</code>이 접근 이름을 주고, 오류·비활성은 상태로 전달됩니다.
      </DocHeader>

      {/* Hero preview — static */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 rounded-large border bg-container-base-low p-10">
        <TextField
          label="이메일"
          required
          placeholder="you@example.com"
          messages={["도움말 메세지"]}
        />
      </div>

      <Installation name="text-field" />

      <H2>Usage</H2>
      <div className="mt-4">
        <CodeBlock lang="tsx" code={'import { TextField } from "@uds/ui"'} />
      </div>
      <div className="mt-3">
        <CodeBlock
          lang="tsx"
          code={
            '<TextField\n  label="이메일"\n  required\n  placeholder="you@example.com"\n  messages={["도움말 메세지"]}\n/>'
          }
        />
      </div>

      <H2>Examples</H2>
      <H3>기본 (Text)</H3>
      <Example
        preview={<TextField label="이름" placeholder="이름을 입력하세요" />}
        code={'<TextField label="이름" placeholder="이름을 입력하세요" />'}
      />
      <H3>Password</H3>
      <Example
        preview={<TextField variant="password" label="비밀번호" required />}
        code={'<TextField variant="password" label="비밀번호" required />'}
      />
      <H3>Error</H3>
      <Example
        preview={
          <TextField
            label="이메일"
            error
            defaultValue="wrong"
            messages={["올바른 이메일 형식이 아닙니다."]}
          />
        }
        code={'<TextField\n  label="이메일"\n  error\n  defaultValue="wrong"\n  messages={["올바른 이메일 형식이 아닙니다."]}\n/>'}
      />
      <H3>Phone (통신사 select)</H3>
      <Example
        preview={
          <TextField
            variant="phone"
            label="휴대폰 번호"
            leading={
              <select
                aria-label="통신사"
                className="min-h-[55px] rounded-small bg-container-base-high px-component-x-16 text-body-large"
              >
                <option>SKT</option>
                <option>KT</option>
                <option>LG U+</option>
              </select>
            }
          />
        }
        code={'<TextField\n  variant="phone"\n  label="휴대폰 번호"\n  leading={\n    <select aria-label="통신사">\n      <option>SKT</option>\n      <option>KT</option>\n      <option>LG U+</option>\n    </select>\n  }\n/>'}
      />

      <H2>Features</H2>
      <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-text-base-tertiary">
        <li>
          label(상단) + 입력 박스 + supporting 메시지(하단)로 구성됩니다. 라벨은 <code>label</code>,
          도움말은 <code>messages</code> 배열(최대 3개), 값/<code>onChange</code>는 네이티브 input
          속성으로 다룹니다.
        </li>
        <li>
          <code>variant</code>로 유형을 고릅니다 — text(기본)·password(마스킹+eye 토글)·card(0000-0000
          숫자)·rrn(주민번호)·phone·email. 네이티브 <code>type</code>/<code>inputMode</code>·기본
          placeholder를 함께 정합니다.
        </li>
        <li>
          <code>phone</code>은 통신사 select를 <code>leading</code>, <code>email</code>은 도메인
          select를 <code>trailing</code> 슬롯으로 넣습니다.
        </li>
        <li>모든 색·간격·타이포가 디자인 토큰에 바인딩되어, 토큰이 바뀌면 자동 반영됩니다.</li>
        <li>값이 있으면 지우기 버튼이 자동 노출되고, <code>onClear</code>로 처리합니다.</li>
        <li>
          isTyping(포커스)은 프롭이 아니라 <code>:focus-within</code>으로, error·disabled는{" "}
          <code>error</code>·네이티브 <code>disabled</code>로 처리됩니다.
        </li>
      </ul>

      <H2>API Reference</H2>
      <PropsTable rows={PROPS} />
      <p className="mt-2 text-xs text-text-base-tertiary">
        <code>variant</code>가 네이티브 <code>type</code>/<code>inputMode</code>·기본 placeholder를
        정합니다. 포커스(<code>isTyping</code>)는 프롭이 아니라 <code>:focus-within</code>으로
        처리되며, 상태는 <code>error</code>·<code>disabled</code>로 지정합니다. <code>value</code>·
        <code>onChange</code>·<code>name</code>·<code>maxLength</code> 등 표준 input 속성과{" "}
        <code>ref</code>는 내부 <code>&lt;input&gt;</code>에 전달됩니다.
      </p>

      <H2>Accessibility</H2>
      <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-text-base-tertiary">
        <li>
          <code>label</code>은 <code>htmlFor</code>로 내부 <code>{"<input>"}</code>과 연결되고,{" "}
          <code>messages</code>는 <code>aria-describedby</code>로 연결됩니다. 라벨을 생략하면{" "}
          <code>aria-label</code>을 함께 넘겨야 합니다.
        </li>
        <li>
          <code>required</code>는 마젠타 별표와 네이티브 <code>required</code>를 함께 설정합니다.
        </li>
        <li>
          포커스는 <code>:focus-within</code> 링으로 표시되고, 에러 상태는 <code>aria-invalid</code>로
          보조기술에 전달됩니다.
        </li>
        <li>
          비활성은 네이티브 <code>disabled</code>로 지정해 상호작용을 막고 보조기술에 상태를
          전달합니다.
        </li>
      </ul>

    </article>
  );
}
