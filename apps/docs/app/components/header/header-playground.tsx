"use client";

import { Header, type HeaderProps } from "@uds/ui";
import { PropsPlayground, type Control } from "../../../components/props-playground.tsx";

function DemoIcon() {
  return <span className="inline-block size-6 rounded-full border-2 border-icon-base-primary/40" />;
}
function DemoLogo() {
  return <span className="text-base font-bold tracking-tight text-text-base-primary">LG U+</span>;
}

// Controls mirror the Figma [Header]/[Header] Search/[Header] Logo set properties,
// in Figma order: category(merge axis) · align · onFrameHigh · slots.
// align is a dependent dropdown — empty for search (search has no align).
const controls: Control[] = [
  { name: "category", type: "select", options: ["title", "search", "logo"], default: "title" },
  {
    name: "align",
    type: "select",
    options: (s) => (s.category === "search" ? [] : ["left", "center"]),
    default: "left",
  },
  { name: "onFrameHigh", type: "boolean", default: false },
  { name: "hasBack", type: "boolean", default: true },
  { name: "hasActions", type: "boolean", default: true },
  { name: "title", type: "string", default: "타이틀" },
];

export function HeaderPlayground() {
  return (
    <PropsPlayground
      componentName="Header"
      controls={controls}
      render={(p) => {
        const category = p.category as "title" | "search" | "logo";
        const align = p.align as "left" | "center";
        const onFrameHigh = p.onFrameHigh as boolean;
        const onBack = p.hasBack ? () => {} : undefined;
        const actions = p.hasActions ? (
          <>
            <DemoIcon />
            <DemoIcon />
          </>
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
        if (p.hasActions) lines.push("actions={<><MenuIcon /><MoreIcon /></>}");
        if (category === "title") lines.push(`title="${p.title}"`);
        if (category === "logo") lines.push("logo={<Logo />}");
        if (category === "search") lines.push('placeholder="검색어를 입력해주세요"');
        return `<Header\n  ${lines.join("\n  ")}\n/>`;
      }}
    />
  );
}
