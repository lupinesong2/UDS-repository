"use client";

import { Header, type HeaderProps } from "@uds/ui";
import { SearchIcon, MoreVerticalIcon } from "@uds/icons";
import { PropsPlayground, type PlaygroundCase } from "../../../components/props-playground.tsx";

function DemoLogo() {
  return <span className="text-base font-bold tracking-tight text-text-base-primary">LG U+</span>;
}

// Figma [Header]/[Header] Search/[Header] Logo combinations — grouped by category.
const cases: PlaygroundCase[] = [
  // title
  { label: "left · 뒤로+제목", state: { category: "title", align: "left", onFrameHigh: false, hasBack: true, hasActions: false, title: "타이틀" } },
  { label: "left · +액션", state: { category: "title", align: "left", onFrameHigh: false, hasBack: true, hasActions: true, title: "타이틀" } },
  { label: "center · +액션", state: { category: "title", align: "center", onFrameHigh: false, hasBack: true, hasActions: true, title: "타이틀" } },
  { label: "onFrameHigh", state: { category: "title", align: "left", onFrameHigh: true, hasBack: true, hasActions: true, title: "타이틀" } },
  // search — 필드 안: 검색(🔍), 입력 시 지우기(✕)+검색(🔍). 필드 밖 맨 우측: 액션 아이콘 1개.
  { label: "기본", state: { category: "search", align: "left", onFrameHigh: false, hasBack: true, hasActions: true, title: "" } },
  { label: "onFrameHigh", state: { category: "search", align: "left", onFrameHigh: true, hasBack: true, hasActions: true, title: "" } },
  // logo
  { label: "left · 로고+액션", state: { category: "logo", align: "left", onFrameHigh: false, hasBack: false, hasActions: true, title: "" } },
  { label: "center · 로고+액션", state: { category: "logo", align: "center", onFrameHigh: false, hasBack: true, hasActions: true, title: "" } },
  { label: "onFrameHigh", state: { category: "logo", align: "left", onFrameHigh: true, hasBack: false, hasActions: true, title: "" } },
];

export function HeaderPlayground() {
  return (
    <PropsPlayground
      componentName="Header"
      cases={cases}
      groupBy="category"
      render={(p) => {
        const category = p.category as "title" | "search" | "logo";
        const align = p.align as "left" | "center";
        const onFrameHigh = p.onFrameHigh as boolean;
        const onBack = p.hasBack ? () => {} : undefined;
        // search: 검색 아이콘은 필드 안에 이미 있으므로 바깥 액션은 단일 아이콘 하나만
        const actions = p.hasActions ? (
          category === "search" ? (
            <MoreVerticalIcon />
          ) : (
            <>
              <SearchIcon />
              <MoreVerticalIcon />
            </>
          )
        ) : undefined;

        const props: HeaderProps =
          category === "search"
            ? ({ category: "search", onFrameHigh, onBack, actions, placeholder: "검색어를 입력해주세요" } as HeaderProps)
            : category === "logo"
              ? ({ category: "logo", align, onFrameHigh, onBack, actions, logo: <DemoLogo /> } as HeaderProps)
              : ({ category: "title", align, onFrameHigh, onBack, actions, title: String(p.title) } as HeaderProps);

        return (
          <div className="w-[402px] max-w-full overflow-hidden rounded-medium border">
            <Header {...props} />
          </div>
        );
      }}
      code={(p) => {
        const category = p.category as string;
        const lines: string[] = [`category="${category}"`];
        if (category !== "search") lines.push(`align="${p.align}"`);
        if (p.onFrameHigh) lines.push("onFrameHigh");
        if (p.hasBack) lines.push("onBack={() => history.back()}");
        if (p.hasActions)
          lines.push(
            category === "search"
              ? "actions={<MoreVerticalIcon />}"
              : "actions={<><SearchIcon /><MoreVerticalIcon /></>}"
          );
        if (category === "title") lines.push(`title="${p.title}"`);
        if (category === "logo") lines.push("logo={<Logo />}");
        if (category === "search") lines.push('placeholder="검색어를 입력해주세요"');
        return `<Header\n  ${lines.join("\n  ")}\n/>`;
      }}
    />
  );
}
