"use client";

import { useState } from "react";
import { Button, ButtonGroup, Checkbox, Cta, TextField, cn } from "@uds/ui";

// 그룹핑(구조) 색 — 오버레이의 주인공
const GROUP_0 = "#6366f1"; // 최상위 섹션 (OS Bar · Header · Module · CTA)
const GROUP_1 = "#a855f7"; // 하위 그룹 ([Module Contents] · [Checkbox Group])
// 컴포넌트 소유 색 — 보조
const UDS = "#10b981"; // 우리가 만든 @uds/ui 컴포넌트
const CUSTOM = "#f59e0b"; // 아직 컴포넌트 없는 커스텀 마크업

type Mode = "group" | "component" | "off";

/**
 * Region — 오버레이. `mode`에 따라 서로 다른 정보를 강조한다.
 *  - "group"    : 오토레이아웃 그룹 구조(섹션/모듈/하위그룹)를 깊이별 색으로 → 주 목적
 *  - "component": 우리 컴포넌트(emerald) vs 커스텀(amber) → 보조
 *  - "off"      : 순수 화면
 * 각 Region은 자신의 group/comp 역할을 선언하고, 현재 mode에 해당하면 테두리+배지를 그린다.
 */
function Region({
  mode,
  group,
  comp,
  className,
  children,
}: {
  mode: Mode;
  group?: { name: string; depth: 0 | 1 };
  comp?: { name: string; kind: "uds" | "custom" };
  className?: string;
  children: React.ReactNode;
}) {
  let color: string | undefined;
  let dashed = false;
  let label = "";
  let align: "left" | "right" = "left";

  if (mode === "group" && group) {
    color = group.depth === 0 ? GROUP_0 : GROUP_1;
    dashed = group.depth === 1;
    label = group.name;
    align = group.depth === 0 ? "right" : "left"; // 중첩 배지 겹침 방지
  } else if (mode === "component" && comp) {
    color = comp.kind === "uds" ? UDS : CUSTOM;
    dashed = comp.kind === "custom";
    label = `${comp.kind === "uds" ? "UDS" : "custom"} · ${comp.name}`;
  }

  return (
    <div
      className={cn("relative", className)}
      style={color ? { outline: `2px ${dashed ? "dashed" : "solid"} ${color}`, outlineOffset: 1 } : undefined}
    >
      {color && (
        <span
          className={cn(
            "pointer-events-none absolute top-0 z-20 -translate-y-1/2 rounded px-1 py-px text-[9px] font-semibold leading-none text-white",
            align === "right" ? "right-0" : "left-0"
          )}
          style={{ backgroundColor: color }}
        >
          {label}
        </span>
      )}
      {children}
    </div>
  );
}

function StatusIcons() {
  return (
    <div className="flex items-center gap-1.5 text-text-base-primary">
      <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor" aria-hidden>
        <rect x="0" y="7" width="3" height="4" rx="1" />
        <rect x="4.5" y="5" width="3" height="6" rx="1" />
        <rect x="9" y="2.5" width="3" height="8.5" rx="1" />
        <rect x="13.5" y="0" width="3" height="11" rx="1" />
      </svg>
      <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor" aria-hidden>
        <path d="M8 2.2c2.5 0 4.8 1 6.5 2.6l-1.4 1.5A7 7 0 0 0 8 4.2 7 7 0 0 0 2.9 6.3L1.5 4.8A9.4 9.4 0 0 1 8 2.2Zm0 3.4c1.5 0 2.9.6 3.9 1.6l-1.4 1.5A3.4 3.4 0 0 0 8 9a3.4 3.4 0 0 0-2.5-.3L4.1 7.2A5.5 5.5 0 0 1 8 5.6Zm0 3.3 1.4 1.5L8 11 6.6 9.4 8 8.9Z" />
      </svg>
      <svg width="26" height="12" viewBox="0 0 26 12" fill="none" aria-hidden>
        <rect x="0.5" y="0.5" width="22" height="11" rx="3" stroke="currentColor" opacity="0.4" />
        <rect x="2" y="2" width="17" height="8" rx="1.5" fill="currentColor" />
        <rect x="24" y="4" width="1.5" height="4" rx="0.75" fill="currentColor" opacity="0.4" />
      </svg>
    </div>
  );
}

function ChevronLeft() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

const OPTIONS = [
  { key: "voice", label: "음성 통화" },
  { key: "sms", label: "SMS" },
  { key: "data", label: "데이터" },
  { key: "temp", label: "임시 로밍" },
] as const;

function LegendDot({ color, dashed, text }: { color: string; dashed?: boolean; text: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs text-text-base-tertiary">
      <span className="inline-block h-3 w-4 rounded-sm" style={{ outline: `2px ${dashed ? "dashed" : "solid"} ${color}` }} />
      {text}
    </span>
  );
}

export function RoamingScreen() {
  const [mode, setMode] = useState<Mode>("group");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const anyChecked = Object.values(checked).some(Boolean);

  return (
    <div className="flex flex-col items-start gap-6 lg:flex-row">
      {/* 402px 모바일 프레임 — 컨트롤과 분리되어 조작해도 움직이지 않음.
          overflow는 visible: 오버레이 배지/아웃라인이 가장자리에서 잘리지 않도록.
          둥근 디바이스 모양은 최상단/최하단 자식 모서리를 맞춰 유지한다. */}
      <div className="flex h-[874px] w-[402px] shrink-0 flex-col rounded-[40px] border bg-frame-base-low shadow-2xl">
        {/* OS 상단 바 */}
        <Region mode={mode} group={{ name: "OS Bar", depth: 0 }} comp={{ name: "OS Bar Top", kind: "custom" }}>
          <div className="flex items-center justify-between rounded-t-[40px] bg-background-base-low pb-component-y-8 pt-[10px]">
            <span className="pl-7 text-[15px] font-strong tracking-tight text-text-base-primary">9:41</span>
            <div className="pr-5">
              <StatusIcons />
            </div>
          </div>
        </Region>

        {/* Header */}
        <Region mode={mode} group={{ name: "Header", depth: 0 }} comp={{ name: "Header", kind: "custom" }}>
          <div className="flex items-center gap-gap-12 bg-background-base-low px-component-x-20 py-component-y-6">
            <button className="py-component-y-10 text-icon-base-primary" aria-label="뒤로">
              <ChevronLeft />
            </button>
            <h1 className="text-title-small font-strong leading-[1.3] tracking-[-0.36px] text-text-base-primary">
              해외로밍 사용요금조회
            </h1>
          </div>
        </Region>

        {/* Module 1 — [Module](바깥 패딩) > [Module Contents](항목 gap). 첫 모듈 pt=layout/y/40 */}
        <Region
          mode={mode}
          group={{ name: "Module", depth: 0 }}
          className="flex w-full flex-col px-layout-x-20 pt-layout-y-40"
        >
          <Region mode={mode} group={{ name: "Module Contents", depth: 1 }} className="flex w-full flex-col gap-gap-16">
            <Region mode={mode} comp={{ name: "Indicator Progress", kind: "custom" }} className="self-start">
              <div className="flex items-center gap-gap-2 text-title-small font-strong leading-none">
                <span className="text-text-brand-primary-high">1</span>
                <span className="text-text-base-tertiary">/</span>
                <span className="text-text-base-tertiary">2</span>
              </div>
            </Region>
            <Region mode={mode} comp={{ name: "Module Header", kind: "custom" }}>
              <h2 className="text-display-medium font-strong leading-[1.3] tracking-[-0.56px] text-text-base-primary">
                조회하고 싶은 항목을
                <br />
                선택해주세요
              </h2>
            </Region>
          </Region>
        </Region>

        {/* Module 2 — 이후 모듈 pt=layout/y/64, contents gap=gap/40 */}
        <Region
          mode={mode}
          group={{ name: "Module", depth: 0 }}
          className="flex w-full flex-col px-layout-x-20 pt-layout-y-64"
        >
          <Region mode={mode} group={{ name: "Module Contents", depth: 1 }} className="flex w-full flex-col gap-gap-40">
            <Region mode={mode} comp={{ name: "TextField", kind: "uds" }}>
              <TextField label="고객번호" required defaultValue="010-1234-5678" />
            </Region>

            {/* Checkbox Group — 래퍼(라벨+2x2)는 하위 그룹/커스텀, 개별 Checkbox는 우리 것 */}
            <Region
              mode={mode}
              group={{ name: "Checkbox Group", depth: 1 }}
              comp={{ name: "Checkbox Group", kind: "custom" }}
            >
              <div className="flex flex-col gap-gap-12">
                <div className="flex items-center gap-gap-2 text-label-large font-strong leading-none">
                  <span className="text-text-base-primary">조회 항목 선택</span>
                  <span className="text-text-brand-primary">*</span>
                </div>
                <div className="grid grid-cols-2 gap-x-gap-12 gap-y-gap-6">
                  {OPTIONS.map((o) => (
                    <Region mode={mode} comp={{ name: "Checkbox", kind: "uds" }} key={o.key}>
                      <Checkbox
                        checked={!!checked[o.key]}
                        onChange={(e) => setChecked((c) => ({ ...c, [o.key]: e.target.checked }))}
                      >
                        {o.label}
                      </Checkbox>
                    </Region>
                  ))}
                </div>
              </div>
            </Region>
          </Region>
        </Region>

        {/* 남는 공간 → CTA를 바닥으로 */}
        <div className="flex-1" />

        {/* CTA — 최상위 그룹이자 우리 컴포넌트(Cta + ButtonGroup + Button) */}
        <Region
          mode={mode}
          group={{ name: "CTA", depth: 0 }}
          comp={{ name: "Cta · ButtonGroup · Button", kind: "uds" }}
        >
          <Cta hasSystemUiBottom className="rounded-b-[40px]">
            <ButtonGroup direction="column">
              <Button disabled={!anyChecked}>다음으로</Button>
            </ButtonGroup>
          </Cta>
        </Region>
      </div>

      {/* 컨트롤 패널 — 화면과 분리. 여기를 조작해도 프레임은 고정. */}
      <aside className="w-full rounded-large border bg-frame-base-low p-4 lg:sticky lg:top-6 lg:w-64">
        <span className="text-xs font-medium uppercase tracking-wider text-text-base-tertiary">
          오버레이
        </span>
        <div className="mt-3 flex w-full rounded-medium border p-0.5">
          {(["group", "component", "off"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "flex-1 rounded px-2 py-1.5 text-sm transition-colors",
                mode === m
                  ? "bg-container-base-high font-medium text-text-base-primary"
                  : "text-text-base-tertiary hover:text-text-base-primary"
              )}
            >
              {m === "group" ? "그룹핑" : m === "component" ? "컴포넌트" : "끄기"}
            </button>
          ))}
        </div>
        {/* min-height로 모드 전환 시 패널 높이도 흔들리지 않게 고정 */}
        <div className="mt-4 flex min-h-[72px] flex-col gap-2">
          {mode === "group" && (
            <>
              <LegendDot color={GROUP_0} text="섹션 · 모듈 (최상위 그룹)" />
              <LegendDot color={GROUP_1} dashed text="하위 그룹 (Contents · Checkbox Group)" />
            </>
          )}
          {mode === "component" && (
            <>
              <LegendDot color={UDS} text="우리 컴포넌트 (@uds/ui)" />
              <LegendDot color={CUSTOM} dashed text="커스텀 (아직 컴포넌트 없음)" />
            </>
          )}
          {mode === "off" && (
            <span className="text-xs text-text-base-tertiary">
              오버레이가 꺼져 순수 화면만 표시됩니다.
            </span>
          )}
        </div>
      </aside>
    </div>
  );
}
