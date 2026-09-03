import type { ReactNode } from "react";
import { RoamingScreen } from "./roaming-screen.tsx";

export const metadata = { title: "해외로밍 사용요금조회 — UDS 예시" };

const BREAKDOWN: { area: string; use: "uds" | "custom"; detail: ReactNode }[] = [
  { area: "OS Bar Top", use: "custom", detail: <>상단 상태바(시간·신호·배터리). <code>@uds/ui</code>에 컴포넌트 없음 → 커스텀 마크업.</> },
  { area: "Header", use: "custom", detail: <>뒤로가기 + 화면 제목. <code>Header</code> 컴포넌트 미보유 → 커스텀.</> },
  { area: "Indicator Progress", use: "custom", detail: <>“1 / 2” 단계 표시. 컴포넌트 미보유 → 커스텀.</> },
  { area: "Module Header", use: "custom", detail: <>큰 제목(display/medium). 컴포넌트 미보유 → 커스텀.</> },
  { area: "TextField", use: "uds", detail: <><code>&lt;TextField label=&quot;고객번호&quot; required /&gt;</code> — 우리 컴포넌트.</> },
  { area: "Checkbox Group", use: "custom", detail: <>라벨 + 2×2 레이아웃 래퍼는 커스텀(<code>CheckboxGroup</code> 미보유). 내부 항목은 우리 <code>Checkbox</code>.</> },
  { area: "Checkbox ×4", use: "uds", detail: <><code>&lt;Checkbox&gt;</code> 음성 통화·SMS·데이터·임시 로밍 — 우리 컴포넌트.</> },
  { area: "CTA", use: "uds", detail: <><code>&lt;Cta&gt;</code> + <code>&lt;ButtonGroup&gt;</code> + <code>&lt;Button&gt;</code>(다음으로) — 모두 우리 컴포넌트.</> },
];

function UseBadge({ use }: { use: "uds" | "custom" }) {
  return use === "uds" ? (
    <span className="inline-flex items-center rounded-full border border-current px-2 py-0.5 text-[10px] font-medium text-text-base-primary" style={{ color: "#10b981" }}>
      UDS
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full border border-current px-2 py-0.5 text-[10px] font-medium" style={{ color: "#f59e0b" }}>
      custom
    </span>
  );
}

export default function RoamingExamplePage() {
  const udsCount = BREAKDOWN.filter((b) => b.use === "uds").length;
  return (
    <article className="max-w-3xl">
      <header>
        <p className="text-sm font-medium text-text-brand-primary-high">Examples</p>
        <h1 className="mt-2 scroll-m-20 text-3xl font-bold tracking-tight">해외로밍 사용요금조회</h1>
        <p className="mt-3 text-lg text-text-base-tertiary">
          Figma 화면(<code>node 20601:58919</code>)을 그대로 구현한 402px 모바일 화면입니다. 지금까지
          만든 <code>@uds/ui</code> 컴포넌트(<code>TextField</code> · <code>Checkbox</code> ·{" "}
          <code>Cta</code> · <code>ButtonGroup</code> · <code>Button</code>)로 조립하고, 아직
          컴포넌트가 없는 부분은 커스텀 마크업으로 채웠습니다. 화면 위{" "}
          <strong className="text-text-base-primary">오버레이</strong>는 두 모드로 볼 수 있어요 —
          기본값 <strong className="text-text-base-primary">모듈 그룹핑</strong>은 오토레이아웃 섹션·
          모듈·하위 그룹의 중첩 구조를 깊이별 색(인디고 실선/바이올렛 점선)으로 보여주고,{" "}
          <strong className="text-text-base-primary">컴포넌트</strong> 모드는 우리 컴포넌트(초록)와
          커스텀(주황)을 구분합니다.
        </p>
      </header>

      <div className="mt-8 flex justify-center rounded-large border bg-container-base-high/30 p-8">
        <RoamingScreen />
      </div>

      <h2 className="mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">
        구성 분해 <span className="text-base font-normal text-text-base-tertiary">({udsCount}/{BREAKDOWN.length} 영역이 우리 컴포넌트)</span>
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
      <p className="mt-3 text-sm text-text-base-tertiary">
        커스텀으로 남은 영역(<code>Header</code>·<code>Indicator Progress</code>·
        <code>Module Header</code>·<code>Checkbox Group</code>·<code>OS Bar</code>)은 다음에{" "}
        <code>/uds-component</code>로 컴포넌트화할 후보입니다.
      </p>
    </article>
  );
}
