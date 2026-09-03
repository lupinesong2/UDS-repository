import type { ReactNode } from "react";
import { AddressScreen } from "./address-screen.tsx";

export const metadata = { title: "배송지 입력 — UDS 예시" };

const BREAKDOWN: { area: string; use: "uds" | "custom"; detail: ReactNode }[] = [
  { area: "OS Bar Top", use: "custom", detail: <>상단 상태바. 컴포넌트 없음 → 커스텀.</> },
  { area: "Header", use: "custom", detail: <>뒤로가기 + 제목. 컴포넌트 없음 → 커스텀.</> },
  { area: "Module Header", use: "custom", detail: <>안내 제목(display/medium). 컴포넌트 없음 → 커스텀.</> },
  { area: "TextField ×5", use: "uds", detail: <>받는 사람 · 연락처 · 우편번호 · 기본주소 · 상세주소 — 우리 <code>TextField</code>.</> },
  { area: "Button (주소검색)", use: "uds", detail: <>우리 <code>Button</code>(module · outline · secondary).</> },
  { area: "주소 그룹", use: "custom", detail: <>라벨 + 우편번호 row + 기본/상세 주소 레이아웃 래퍼는 커스텀. 내부 필드·버튼은 우리 것.</> },
  { area: "Checkbox", use: "uds", detail: <>기본 배송지로 설정 — 우리 <code>Checkbox</code>.</> },
  { area: "CTA", use: "uds", detail: <><code>Cta</code> + <code>ButtonGroup</code> + <code>Button</code>(저장).</> },
];

function UseBadge({ use }: { use: "uds" | "custom" }) {
  return use === "uds" ? (
    <span className="inline-flex items-center rounded-full border border-current px-2 py-0.5 text-[10px] font-medium" style={{ color: "#10b981" }}>
      UDS
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full border border-current px-2 py-0.5 text-[10px] font-medium" style={{ color: "#f59e0b" }}>
      custom
    </span>
  );
}

export default function AddressExamplePage() {
  const udsCount = BREAKDOWN.filter((b) => b.use === "uds").length;
  return (
    <article className="max-w-3xl">
      <header>
        <p className="text-sm font-medium text-text-brand-primary-high">Examples</p>
        <h1 className="mt-2 scroll-m-20 text-3xl font-bold tracking-tight">배송지 입력</h1>
        <p className="mt-3 text-lg text-text-base-tertiary">
          지금까지 만든 <code>@uds/ui</code> 컴포넌트로 조립한 402px 배송지 입력 폼입니다 —{" "}
          <code>TextField</code>(받는 사람·연락처·우편번호·기본/상세 주소) · <code>Button</code>
          (주소검색) · <code>Checkbox</code>(기본 배송지) · <code>Cta</code>. 주소검색을 누르면
          우편번호·기본주소가 채워지고, 필수값이 다 차면 저장 버튼이 활성화됩니다. 어느 영역이 우리
          컴포넌트인지는 아래 <strong className="text-text-base-primary">구성 분해</strong> 표에서
          확인할 수 있어요.
        </p>
      </header>

      <div className="mt-8 flex justify-center rounded-large border bg-container-base-high/30 p-8">
        <AddressScreen />
      </div>

      <h2 className="mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">
        구성 분해{" "}
        <span className="text-base font-normal text-text-base-tertiary">
          ({udsCount}/{BREAKDOWN.length} 영역이 우리 컴포넌트)
        </span>
      </h2>
      <div className="mt-4 overflow-hidden rounded-large border">
        <table className="w-full text-sm">
          <thead className="bg-container-base-high/40 text-left">
            <tr>
              <th className="p-3 font-medium">영역</th>
              <th className="p-3 font-medium">구분</th>
              <th className="p-3 font-medium">설명</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {BREAKDOWN.map((b) => (
              <tr key={b.area} className="align-top">
                <td className="whitespace-nowrap p-3 font-mono text-xs">{b.area}</td>
                <td className="p-3">
                  <UseBadge use={b.use} />
                </td>
                <td className="p-3 text-xs text-text-base-tertiary">{b.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
