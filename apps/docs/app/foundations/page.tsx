import type { ReactNode } from "react";
import { color, radius, spacing, fontSize } from "@uds/tokens";

export const metadata = { title: "Foundations — UDS" };

const COLOR_GROUPS: { key: string; label: string }[] = [
  { key: "text", label: "Text" },
  { key: "background", label: "Background" },
  { key: "container", label: "Container" },
  { key: "border", label: "Border" },
  { key: "frame", label: "Frame" },
  { key: "icon", label: "Icon" },
  { key: "status", label: "Status" },
  { key: "state", label: "State Layer" },
];

function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-12 scroll-m-20 text-lg font-semibold tracking-tight first:mt-0">{children}</h2>
  );
}

function TokenTable({ rows }: { rows: { preview: ReactNode; name: string; value: string }[] }) {
  return (
    <div className="mt-4 overflow-hidden rounded-large border">
      <table className="w-full text-sm">
        <thead className="bg-container-base-high/40 text-left">
          <tr>
            <th className="w-24 p-3 font-medium">미리보기</th>
            <th className="p-3 font-medium">토큰</th>
            <th className="p-3 font-medium">값</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((r) => (
            <tr key={r.name} className="align-middle">
              <td className="p-3">{r.preview}</td>
              <td className="p-3 font-mono text-xs text-text-base-primary">{r.name}</td>
              <td className="p-3 font-mono text-xs text-text-base-tertiary">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function FoundationsPage() {
  const colorEntries = Object.entries(color) as [string, string][];

  return (
    <article className="max-w-3xl">
      <header>
        <p className="text-sm font-medium text-text-brand-primary-high">Foundations</p>
        <h1 className="mt-2 scroll-m-20 text-3xl font-semibold tracking-tight">Design Tokens</h1>
        <p className="mt-3 text-base text-text-base-tertiary">
          모든 컴포넌트의 토대가 되는 디자인 토큰입니다. Figma "Core Foundation v1.0.0"에서 추출해 코드
          토큰(<code>@uds/tokens</code>)으로 자산화했으며, 이름은 Figma 토큰 경로와 1:1로 일치합니다.
        </p>
      </header>

      <H2>Color</H2>
      <p className="mt-1 text-sm text-text-base-tertiary">
        시맨틱 컬러 토큰. CSS 변수 <code>--color-*</code>, 유틸리티 <code>bg-*</code> / <code>text-*</code>.
      </p>
      {COLOR_GROUPS.map((group) => {
        const items = colorEntries.filter(([name]) => name.split("-")[0] === group.key);
        if (items.length === 0) return null;
        return (
          <div key={group.key} className="mt-6">
            <h3 className="text-sm font-semibold text-text-base-secondary">{group.label}</h3>
            <TokenTable
              rows={items.map(([name, value]) => ({
                name: `color/${name}`,
                value,
                preview: (
                  <span
                    className="inline-block size-8 rounded-medium border"
                    style={{ background: `var(--color-${name})` }}
                  />
                ),
              }))}
            />
          </div>
        );
      })}

      <H2>Typography</H2>
      <p className="mt-1 text-sm text-text-base-tertiary">
        Pretendard 기반. 사이즈 토큰 <code>--font-size-*</code> → 유틸리티 <code>text-*</code>.
      </p>
      <TokenTable
        rows={(Object.keys(fontSize) as (keyof typeof fontSize)[]).map((name) => ({
          name: `font-size/${name}`,
          value: `${fontSize[name]}px`,
          preview: (
            <span
              className="block truncate text-text-base-primary"
              style={{ fontSize: `var(--font-size-${name})`, lineHeight: 1.1 }}
            >
              Ag 가
            </span>
          ),
        }))}
      />

      <H2>Spacing</H2>
      <p className="mt-1 text-sm text-text-base-tertiary">
        여백 토큰 <code>--spacing-*</code> → 유틸리티 <code>p-*</code> / <code>gap-*</code> 등.
      </p>
      <TokenTable
        rows={Object.entries(spacing).map(([name, value]) => ({
          name: `spacing/${name}`,
          value: `${value}px`,
          preview: (
            <div
              className="h-3 rounded-small bg-container-brand-primary-high"
              style={{ width: `var(--spacing-${name})` }}
            />
          ),
        }))}
      />

      <H2>Radius</H2>
      <p className="mt-1 text-sm text-text-base-tertiary">
        모서리 토큰 <code>--radius-*</code> → 유틸리티 <code>rounded-*</code>.
      </p>
      <TokenTable
        rows={Object.entries(radius).map(([name, value]) => ({
          name: `radius/${name}`,
          value: `${value}px`,
          preview: (
            <div
              className="size-10 border bg-container-base-high"
              style={{ borderRadius: `var(--radius-${name})` }}
            />
          ),
        }))}
      />
    </article>
  );
}
