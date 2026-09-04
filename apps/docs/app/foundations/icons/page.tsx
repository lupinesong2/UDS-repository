import type { ReactNode } from "react";
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseCircleIcon,
  CloseIcon,
  ErrorCircleIcon,
  InfoCircleIcon,
  MenuIcon,
  MicIcon,
  MoreVerticalIcon,
  SearchIcon,
  type IconProps,
} from "@uds/icons";
import { CodeBlock } from "../../../components/code-block.tsx";

export const metadata = { title: "Icons — UDS" };

const ICONS: { name: string; comp: (p: IconProps) => ReactNode }[] = [
  { name: "ChevronLeftIcon", comp: ChevronLeftIcon },
  { name: "ChevronRightIcon", comp: ChevronRightIcon },
  { name: "SearchIcon", comp: SearchIcon },
  { name: "CheckIcon", comp: CheckIcon },
  { name: "CloseIcon", comp: CloseIcon },
  { name: "CloseCircleIcon", comp: CloseCircleIcon },
  { name: "ErrorCircleIcon", comp: ErrorCircleIcon },
  { name: "InfoCircleIcon", comp: InfoCircleIcon },
  { name: "MicIcon", comp: MicIcon },
  { name: "MenuIcon", comp: MenuIcon },
  { name: "MoreVerticalIcon", comp: MoreVerticalIcon },
];

// 크기: 세 단계만 사용. 24px가 라이브러리 기본.
const SIZES: { px: string; util: string; use: ReactNode }[] = [
  { px: "16", util: "size-4", use: <>인라인·조밀한 곳 — supporting 메시지 아이콘, small 컨트롤 내부.</> },
  { px: "20", util: "size-5", use: <>small 컨트롤 — small 검색/필드.</> },
  { px: "24", util: "size-6", use: <><strong>기본</strong> — Header 뒤로/검색/액션, TextField 슬롯, 대부분의 아이콘.</> },
];

// 색상: currentColor라 text-* 토큰으로 지정. 아래 매핑만 사용.
const COLORS: { use: string; token: string; util: string; onDark?: boolean; inherit?: boolean }[] = [
  { use: "기본 아이콘", token: "icon/base/primary (#1a1a1a)", util: "text-icon-base-primary" },
  { use: "보조·힌트·placeholder", token: "icon/base/secondary (#747474)", util: "text-icon-base-secondary" },
  { use: "에러", token: "status/text/negative (#da0707)", util: "text-status-text-negative" },
  { use: "선택·성공", token: "status/icon/selected (#1a1a1a)", util: "text-status-icon-selected" },
  { use: "비활성", token: "status/icon/disabled-inverseBlack (#1a1a1a29)", util: "text-status-icon-disabled-inverse-black" },
  { use: "반전(어두운 배경)", token: "icon/base/inverseWhite (#fff)", util: "text-icon-base-inverse-white", onDark: true },
  { use: "문맥 상속", token: "currentColor", util: "부모 text 색을 그대로 상속", inherit: true },
];

function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-12 scroll-m-20 text-lg font-semibold tracking-tight first:mt-0">
      {children}
    </h2>
  );
}

export default function IconsPage() {
  return (
    <article className="max-w-3xl">
      <header>
        <p className="text-sm font-medium text-text-brand-primary-high">Foundations</p>
        <h1 className="mt-2 scroll-m-20 text-3xl font-semibold tracking-tight">Icons</h1>
        <p className="mt-3 text-base text-text-base-tertiary">
          Figma <code>[Test] Core Icon Library</code>에서 추출한 24×24 아이콘입니다. 색은{" "}
          <code>currentColor</code>라 <code>text-*</code> 토큰으로 물들고, 크기는 <code>size-*</code>로
          조절합니다. <code>@uds/icons</code>에서 개별 컴포넌트로 가져다 씁니다.
        </p>
      </header>

      <H2>Usage</H2>
      <div className="mt-4">
        <CodeBlock lang="tsx" code={'import { SearchIcon } from "@uds/icons"'} />
      </div>
      <div className="mt-3">
        <CodeBlock lang="tsx" code={'<SearchIcon className="size-6 text-icon-base-primary" />'} />
      </div>

      <H2>Library ({ICONS.length})</H2>
      <p className="mt-1 text-sm text-text-base-tertiary">
        스타터 셋입니다 — 필요한 아이콘은 Figma 라이브러리에서 추출해 <code>@uds/icons</code>에 추가할 수
        있습니다.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {ICONS.map(({ name, comp: Icon }) => (
          <div key={name} className="flex flex-col items-center gap-3 rounded-large border p-5 text-center">
            <Icon className="size-6 text-icon-base-primary" />
            <span className="font-mono text-[11px] text-text-base-tertiary">{name}</span>
          </div>
        ))}
      </div>

      <H2>크기</H2>
      <p className="mt-1 text-sm text-text-base-tertiary">
        세 단계만 사용합니다. 임의 크기(예 <code>size-[18px]</code>)는 쓰지 않습니다.
      </p>
      <div className="mt-4 overflow-hidden rounded-large border">
        <table className="w-full text-sm">
          <thead className="bg-container-base-high/40 text-left">
            <tr>
              <th className="p-3 font-medium">미리보기</th>
              <th className="p-3 font-medium">크기</th>
              <th className="p-3 font-medium">유틸</th>
              <th className="p-3 font-medium">용도</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {SIZES.map((s) => (
              <tr key={s.util} className="align-middle">
                <td className="p-3">
                  <span className="inline-flex items-center justify-center">
                    <SearchIcon className={`${s.util} text-icon-base-primary`} />
                  </span>
                </td>
                <td className="p-3 font-mono text-xs">{s.px}px</td>
                <td className="p-3 font-mono text-xs">{s.util}</td>
                <td className="p-3 text-xs text-text-base-tertiary">{s.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H2>색상</H2>
      <p className="mt-1 text-sm text-text-base-tertiary">
        색은 <code>currentColor</code>입니다 — <code>text-*</code> 토큰으로 지정하세요. 하드코딩 hex는
        쓰지 않습니다.
      </p>
      <div className="mt-4 overflow-hidden rounded-large border">
        <table className="w-full text-sm">
          <thead className="bg-container-base-high/40 text-left">
            <tr>
              <th className="p-3 font-medium">미리보기</th>
              <th className="p-3 font-medium">용도</th>
              <th className="p-3 font-medium">토큰</th>
              <th className="p-3 font-medium">유틸</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {COLORS.map((c) => (
              <tr key={c.use} className="align-middle">
                <td className="p-3">
                  {c.onDark ? (
                    <span className="grid size-9 place-items-center rounded-medium bg-container-base-black">
                      <InfoCircleIcon className={`size-6 ${c.util}`} />
                    </span>
                  ) : c.inherit ? (
                    // currentColor — 부모 text 색을 그대로 상속
                    <span className="text-text-brand-primary-high">
                      <InfoCircleIcon className="size-6" />
                    </span>
                  ) : (
                    <InfoCircleIcon className={`size-6 ${c.util}`} />
                  )}
                </td>
                <td className="whitespace-nowrap p-3 text-xs">{c.use}</td>
                <td className="p-3 font-mono text-xs text-text-base-tertiary">{c.token}</td>
                <td className="p-3 font-mono text-xs">{c.util}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
