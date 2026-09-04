"use client";

import { useState } from "react";
import { Button, ButtonGroup, Checkbox, Cta, Header, TextField, cn } from "@uds/ui";

// 그룹핑(구조) 색 — 오버레이의 주인공
const GROUP_0 = "#6366f1"; // 최상위 섹션 (OS Bar · Header · Module · CTA)
const GROUP_1 = "#a855f7"; // 하위 그룹 ([Module Contents] · 주소 그룹)
// 컴포넌트 소유 색 — 보조
const UDS = "#10b981"; // 우리가 만든 @uds/ui 컴포넌트
const CUSTOM = "#f59e0b"; // 아직 컴포넌트 없는 커스텀 마크업

type Mode = "group" | "component" | "off";

/** Region — 오버레이. mode에 따라 그룹 구조 / 컴포넌트 소유를 강조한다. off면 순수 화면. */
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
    align = group.depth === 0 ? "right" : "left";
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

export function AddressScreen() {
  // 오버레이 컨트롤 제거 — Region은 순수 패스스루(mode="off").
  const mode = "off" as const;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [zip, setZip] = useState("");
  const [base, setBase] = useState("");
  const [detail, setDetail] = useState("");
  const [asDefault, setAsDefault] = useState(true);
  const [done, setDone] = useState(false);

  const searched = zip !== "";
  const canSave = name !== "" && phone !== "" && searched && detail !== "";

  function search() {
    // 주소검색 시뮬레이션 — 실제로는 우편번호 검색 모듈을 띄운다.
    setZip("06236");
    setBase("서울 강남구 테헤란로 152");
  }

  return (
    // 산출물 0.7배 축소 + 영역 가운데. 바깥 박스가 축소된 실제 크기를 차지한다.
    <div style={{ width: 402 * 0.7, height: 874 * 0.7 }}>
      <div className="origin-top-left scale-[0.7]">
        {/* 402px 모바일 프레임 (내용은 874px 안에 맞춰짐, flex-1 spacer가 CTA를 바닥에 고정) */}
        <div className="flex h-[874px] w-[402px] flex-col rounded-[40px] border bg-frame-base-low shadow-2xl">
        {/* OS 상단 바 */}
        <Region mode={mode} group={{ name: "OS Bar", depth: 0 }} comp={{ name: "OS Bar Top", kind: "custom" }}>
          <div className="flex items-center justify-between rounded-t-[40px] bg-background-base-low pb-component-y-8 pt-[10px]">
            <span className="pl-7 text-[15px] font-strong tracking-tight text-text-base-primary">9:41</span>
            <div className="pr-5">
              <StatusIcons />
            </div>
          </div>
        </Region>

        {/* Header — 우리 컴포넌트 */}
        <Region mode={mode} group={{ name: "Header", depth: 0 }} comp={{ name: "Header", kind: "uds" }}>
          <Header category="title" onBack={() => {}} title="배송지 입력" />
        </Region>

        {done ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-gap-16 px-6 text-center">
            <div className="grid size-16 place-items-center rounded-full bg-container-brand-primary text-text-base-white">
              <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-strong text-text-base-primary">배송지가 저장되었어요</h2>
              <p className="mt-1 text-body-small text-text-base-tertiary">
                {name} · {zip} {base} {detail}
              </p>
            </div>
            <button onClick={() => setDone(false)} className="text-body-small text-text-brand-primary-high underline">
              다시 입력하기
            </button>
          </div>
        ) : (
          <>
            {/* 모듈 영역 — Header/CTA는 고정, 이 영역만 세로 스크롤. gap-40(로밍 규칙)로 콘텐츠가
                874px를 넘어도 CTA는 바닥에 고정된다(실제 모바일 폼 동작). min-h-0 이 있어야 flex-1이
                줄어들며 overflow 스크롤이 켜진다. */}
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {/* Module 1 — [Module](바깥 패딩) > [Module Contents](항목 gap). 첫 모듈 pt=layout/y/40 */}
            <Region mode={mode} group={{ name: "Module", depth: 0 }} className="flex w-full flex-col px-layout-x-20 pt-layout-y-40">
              <Region mode={mode} group={{ name: "Module Contents", depth: 1 }} className="flex w-full flex-col gap-gap-16">
                <Region mode={mode} comp={{ name: "Module Header", kind: "custom" }}>
                  <h2 className="text-display-medium font-strong leading-[1.3] tracking-[-0.56px] text-text-base-primary">
                    어디로
                    <br />
                    배송해 드릴까요?
                  </h2>
                </Region>
              </Region>
            </Region>

            {/* Module 2 — 입력 폼. 이후 모듈: pt=layout/y/64, contents 최상위 블록 gap=gap/40 (로밍 규칙).
                pb-layout-y-40: 스크롤 바닥에서 마지막 필드가 CTA에 붙지 않도록 여백 */}
            <Region mode={mode} group={{ name: "Module", depth: 0 }} className="flex w-full flex-col px-layout-x-20 pt-layout-y-64 pb-layout-y-40">
              <Region mode={mode} group={{ name: "Module Contents", depth: 1 }} className="flex w-full flex-col gap-gap-40">
                <Region mode={mode} comp={{ name: "TextField", kind: "uds" }}>
                  <TextField
                    label="받는 사람"
                    required
                    placeholder="이름"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Region>

                <Region mode={mode} comp={{ name: "TextField", kind: "uds" }}>
                  <TextField
                    label="연락처"
                    required
                    type="tel"
                    inputMode="tel"
                    placeholder="010-0000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </Region>

                {/* 주소 그룹 — 라벨 + 우편번호 row(검색 버튼) + 기본/상세 주소. 래퍼는 커스텀, 필드·버튼은 우리 것 */}
                <Region mode={mode} group={{ name: "주소 그룹", depth: 1 }} comp={{ name: "Address Group", kind: "custom" }}>
                  <div className="flex flex-col gap-gap-8">
                    <div className="flex items-center gap-gap-2 text-label-large font-strong leading-none">
                      <span className="text-text-base-primary">주소</span>
                      <span className="text-text-brand-primary">*</span>
                    </div>
                    <div className="flex items-stretch gap-gap-8">
                      <Region mode={mode} comp={{ name: "TextField", kind: "uds" }} className="flex-1">
                        <TextField placeholder="우편번호" value={zip} readOnly />
                      </Region>
                      <Region mode={mode} comp={{ name: "Button", kind: "uds" }}>
                        <Button
                          category="module"
                          variant="outline"
                          hierarchy="secondary"
                          className="h-[55px] shrink-0"
                          onClick={search}
                        >
                          주소검색
                        </Button>
                      </Region>
                    </div>
                    <Region mode={mode} comp={{ name: "TextField", kind: "uds" }}>
                      <TextField placeholder="기본주소" value={base} readOnly />
                    </Region>
                    <Region mode={mode} comp={{ name: "TextField", kind: "uds" }}>
                      <TextField
                        placeholder="상세주소 입력"
                        value={detail}
                        onChange={(e) => setDetail(e.target.value)}
                      />
                    </Region>
                    {/* 기본 배송지 체크박스 — 주소 인풋과 한 블록(gap-8)으로 묶음 */}
                    <Region mode={mode} comp={{ name: "Checkbox", kind: "uds" }} className="self-start">
                      <Checkbox
                        size="small"
                        fontWeight="base"
                        checked={asDefault}
                        onChange={(e) => setAsDefault(e.target.checked)}
                      >
                        기본 배송지로 설정
                      </Checkbox>
                    </Region>
                  </div>
                </Region>
              </Region>
            </Region>

            </div>

            {/* CTA — 스크롤 영역 밖 → 항상 바닥 고정 (Cta + ButtonGroup + Button) */}
            <Region mode={mode} group={{ name: "CTA", depth: 0 }} comp={{ name: "Cta · ButtonGroup · Button", kind: "uds" }}>
              <Cta hasSystemUiBottom className="rounded-b-[40px]">
                <ButtonGroup direction="column">
                  <Button disabled={!canSave} onClick={() => setDone(true)}>
                    저장
                  </Button>
                </ButtonGroup>
              </Cta>
            </Region>
          </>
        )}
        </div>
      </div>
    </div>
  );
}
