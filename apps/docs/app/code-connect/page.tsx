import type { ReactNode } from "react";
import { MAPPINGS, GENERATED_AT, type CcStatus } from "./mappings.generated.ts";

export const metadata = { title: "Code Connect — UDS" };

// The Figma library + GitHub repo these mappings live in.
const FILE_KEY = "spWdVkr7RbwWOyDG6xbY4z";
const REPO = "https://github.com/lupinesong2/UDS-repository/blob/main";

const figmaUrl = (nodeId: string) =>
  `https://www.figma.com/design/${FILE_KEY}?node-id=${nodeId.replace(":", "-")}`;
const sourceUrl = (path: string) => `${REPO}/${path}`;

function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
      {children}
    </h2>
  );
}

function StatusBadge({ status }: { status: CcStatus }) {
  const map = {
    connected: { label: "Connected", cls: "text-text-brand-primary-high" },
    pending: { label: "미연결", cls: "text-text-base-tertiary" },
  } as const;
  const { label, cls } = map[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-current px-2 py-0.5 text-[10px] font-medium ${cls}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

export default function CodeConnectPage() {
  const connected = MAPPINGS.filter((m) => m.status === "connected").length;
  const total = MAPPINGS.length;

  return (
    <article className="max-w-3xl">
      <header>
        <p className="text-sm font-medium text-text-brand-primary-high">Design ↔ Code</p>
        <h1 className="mt-2 scroll-m-20 text-3xl font-bold tracking-tight">Code Connect</h1>
        <p className="mt-3 text-lg text-text-base-tertiary">
          코드 컴포넌트와 Figma 컴포넌트 세트의 Code Connect 매핑 현황입니다. Figma Dev Mode에서 각
          컴포넌트를 선택하면 아래 소스 코드가 스니펫으로 표시됩니다. 라이브러리{" "}
          <code>{FILE_KEY}</code> 기준.
        </p>
        <p className="mt-3 text-sm text-text-base-tertiary">
          연결됨 <span className="font-semibold text-text-base-primary">{connected}</span> / {total}{" "}
          · 마지막 동기화 <code>{GENERATED_AT.slice(0, 10)}</code> · GitHub 연동{" "}
          <span className="font-medium text-text-brand-primary-high">연결됨</span> (Figma for GitHub →{" "}
          <code>lupinesong2/UDS-repository</code>)
        </p>
      </header>

      <H2>매핑 현황</H2>
      <p className="mt-1 text-sm text-text-base-tertiary">
        이 표는 Figma의 실제 Code Connect 상태에서 <strong>생성</strong>됩니다(수기 편집 아님) — 아래
        &ldquo;동기화 방법&rdquo; 참고.
      </p>
      <div className="mt-4 overflow-hidden rounded-large border">
        <table className="w-full text-sm">
          <thead className="bg-container-base-high/40 text-left">
            <tr>
              <th className="p-3 font-medium">코드 컴포넌트</th>
              <th className="p-3 font-medium">Figma 세트</th>
              <th className="p-3 font-medium">노드</th>
              <th className="p-3 font-medium">소스</th>
              <th className="p-3 font-medium">상태</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {MAPPINGS.map((m) => (
              <tr key={`${m.component}-${m.nodeId}`} className="align-top">
                <td className="p-3 font-mono text-xs">{m.component}</td>
                <td className="p-3 text-xs">
                  <a
                    href={figmaUrl(m.nodeId)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-text-base-secondary underline decoration-dotted underline-offset-2 hover:text-text-base-primary"
                  >
                    {m.figmaSet}
                  </a>
                </td>
                <td className="p-3 font-mono text-xs text-text-base-tertiary">{m.nodeId}</td>
                <td className="p-3 text-xs">
                  <a
                    href={sourceUrl(m.source)}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-text-base-tertiary underline decoration-dotted underline-offset-2 hover:text-text-base-primary"
                  >
                    {m.source.replace("packages/ui/src/components/", "…/")}
                  </a>
                </td>
                <td className="p-3">
                  <StatusBadge status={m.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H2>동기화 방법</H2>
      <p className="mt-1 text-sm text-text-base-tertiary">
        진실의 원천(source of truth)은 Figma에 저장된 Code Connect입니다. 이 페이지는 2단계 파이프라인의
        결과물입니다.
      </p>
      <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-sm text-text-base-tertiary">
        <li>
          <strong>fetch</strong> (MCP 세션): 각 세트 노드에 <code>get_code_connect_map</code>을 호출해{" "}
          <code>apps/docs/scripts/code-connect-map.json</code>을 갱신합니다.
        </li>
        <li>
          <strong>build</strong> (순수 Node · CI 가능):{" "}
          <code>node apps/docs/scripts/build-code-connect.ts</code>가 그 JSON과 리포의 기대
          매핑(MANIFEST)을 대조해 <code>mappings.generated.ts</code>를 생성합니다.
        </li>
      </ol>
      <p className="mt-3 text-sm text-text-base-tertiary">
        한 세트는 <strong>기대한 컴포넌트</strong>에 매핑돼 있을 때만 <code>connected</code>입니다. 예:{" "}
        <code>[Button Group] Bottom Sheet</code>는 내부 Button만 연결돼 있고 그룹 노드 자체는 아직
        <code>ButtonGroup</code>에 매핑되지 않아 <code>미연결</code>입니다.
      </p>
    </article>
  );
}
