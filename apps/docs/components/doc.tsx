import type { ReactNode } from "react";
import { CodeBlock } from "./code-block.tsx";
import { CopyPageButton } from "./copy-page-button.tsx";

/**
 * Shared documentation primitives for component pages. Every `components/<name>/page.tsx`
 * composes these instead of re-declaring the same helpers/markup, so the doc format
 * (shadcn-style: header + Copy Page → Examples → Features → API 4-col → Accessibility)
 * stays consistent in one place.
 */

export function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-16 scroll-m-20 text-lg font-semibold tracking-tight first:mt-0">{children}</h2>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return <h3 className="mt-8 text-base font-semibold tracking-tight">{children}</h3>;
}

/** Page header — kicker + title + one-paragraph description + Copy Page (llms.txt) button. */
export function DocHeader({
  title,
  slug,
  children,
}: {
  title: string;
  slug: string;
  children: ReactNode;
}) {
  return (
    <header>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="pl-0.5 text-xs font-medium text-text-base-tertiary">Components</p>
          <h1 className="mt-2 scroll-m-20 text-3xl font-bold tracking-tight">{title}</h1>
        </div>
        <div className="mt-1">
          <CopyPageButton slug={slug} />
        </div>
      </div>
      <p className="mt-3 text-sm text-text-base-tertiary">{children}</p>
    </header>
  );
}

/** Per-case example — live preview card + its exact source. */
export function Example({ preview, code }: { preview: ReactNode; code: string }) {
  return (
    <div className="mt-4">
      <div className="flex min-h-24 items-center justify-center rounded-large border bg-container-base-low p-8">
        {preview}
      </div>
      <div className="mt-2">
        <CodeBlock lang="tsx" code={code} />
      </div>
    </div>
  );
}

/** CLI install section (vendor-neutral registry — no Manual/MCP block). `note`
 * appends an extra sentence (e.g. sibling components that get installed too). */
export function Installation({ name, note }: { name: string; note?: ReactNode }) {
  return (
    <>
      <H2>Installation</H2>
      <p className="mt-1 text-sm text-text-base-tertiary">
        별도 CLI에 의존하지 않는 벤더 중립 레지스트리(JSON)로 배포됩니다.
        {note ? <> {note}</> : null}
      </p>
      <div className="mt-3">
        <CodeBlock lang="bash" code={`npx @uds/cli add ${name}`} />
      </div>
    </>
  );
}

/** API reference — Prop · Type · Default · Description (4-col). */
export function PropsTable({ rows }: { rows: [string, string, string, ReactNode][] }) {
  return (
    <div className="mt-4 overflow-hidden rounded-large border">
      <table className="w-full text-sm">
        <thead className="bg-container-base-high/40 text-left">
          <tr>
            <th className="p-3 font-medium">Prop</th>
            <th className="p-3 font-medium">Type</th>
            <th className="p-3 font-medium">Default</th>
            <th className="p-3 font-medium">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map(([prop, type, def, desc]) => (
            <tr key={prop} className="align-top">
              <td className="p-3 font-mono text-xs">{prop}</td>
              <td className="p-3 font-mono text-xs text-text-base-tertiary">{type}</td>
              <td className="p-3 font-mono text-xs">{def}</td>
              <td className="p-3 text-xs text-text-base-tertiary">{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
