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

const TYPE_SAMPLES = Object.keys(fontSize) as (keyof typeof fontSize)[];

function Swatch({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="h-16 w-full rounded-medium border"
        style={{ background: `var(--color-${name})` }}
      />
      <div className="font-mono text-[11px] leading-tight text-text-base-primary">{name}</div>
      <div className="font-mono text-[11px] leading-tight text-text-base-tertiary">{value}</div>
    </div>
  );
}

export default function FoundationsPage() {
  const colorEntries = Object.entries(color) as [string, string][];

  return (
    <article className="max-w-4xl">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Foundations</h1>
        <p className="mt-2 text-text-base-tertiary">
          모든 컴포넌트의 토대가 되는 디자인 토큰입니다. Figma "Core Foundation v1.0.0"에서 추출해
          코드 토큰(<code>@uds/tokens</code>)으로 자산화했으며, 이름은 Figma 토큰 경로와 1:1로 일치합니다.
        </p>
      </header>

      {/* Colors */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold">Color</h2>
        <p className="mt-1 text-sm text-text-base-tertiary">
          시맨틱 컬러 토큰. CSS 변수 <code>--color-*</code> 및 유틸리티 <code>bg-*</code> / <code>text-*</code>로 사용합니다.
        </p>
        {COLOR_GROUPS.map((group) => {
          const items = colorEntries.filter(
            ([name]) => name.split("-")[0] === group.key
          );
          if (items.length === 0) return null;
          return (
            <div key={group.key} className="mt-6">
              <h3 className="text-sm font-semibold text-text-base-secondary">{group.label}</h3>
              <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {items.map(([name, value]) => (
                  <Swatch key={name} name={name} value={value} />
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* Typography */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">Typography</h2>
        <p className="mt-1 text-sm text-text-base-tertiary">
          Pretendard 기반. 사이즈 토큰 <code>--font-size-*</code> → 유틸리티 <code>text-*</code>.
        </p>
        <div className="mt-4 divide-y rounded-large border">
          {TYPE_SAMPLES.map((name) => (
            <div key={name} className="flex items-baseline gap-4 p-4">
              <span className="w-32 shrink-0 font-mono text-xs text-text-base-tertiary">{name}</span>
              <span className="w-14 shrink-0 font-mono text-xs text-text-base-tertiary">
                {fontSize[name]}
              </span>
              <span
                className="truncate text-text-base-primary"
                style={{ fontSize: `var(--font-size-${name})` }}
              >
                다람쥐 헌 쳇바퀴 Ag 123
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Spacing */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">Spacing</h2>
        <p className="mt-1 text-sm text-text-base-tertiary">
          여백 토큰 <code>--spacing-*</code> → 유틸리티 <code>p-*</code> / <code>gap-*</code> 등.
        </p>
        <div className="mt-4 flex flex-col gap-2 rounded-large border p-4">
          {Object.entries(spacing).map(([name, value]) => (
            <div key={name} className="flex items-center gap-4">
              <span className="w-40 shrink-0 font-mono text-xs text-text-base-tertiary">{name}</span>
              <span className="w-12 shrink-0 font-mono text-xs text-text-base-primary">{value}</span>
              <div
                className="h-3 rounded-small bg-container-brand-primary-high"
                style={{ width: `var(--spacing-${name})` }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Radius */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">Radius</h2>
        <p className="mt-1 text-sm text-text-base-tertiary">
          모서리 토큰 <code>--radius-*</code> → 유틸리티 <code>rounded-*</code>.
        </p>
        <div className="mt-4 flex flex-wrap gap-6">
          {Object.entries(radius).map(([name, value]) => (
            <div key={name} className="flex flex-col items-center gap-2">
              <div
                className="size-20 border bg-container-base-high"
                style={{ borderRadius: `var(--radius-${name})` }}
              />
              <div className="font-mono text-xs text-text-base-primary">{name}</div>
              <div className="font-mono text-xs text-text-base-tertiary">{value}</div>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
