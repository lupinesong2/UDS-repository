"use client";

import { useMemo, useState, type ReactNode } from "react";

/**
 * A select's options may be static, or a function of the current control state —
 * the latter powers *dependent* dropdowns (e.g. `contentType` options depend on
 * the chosen `context`/`direction`), so impossible combinations never appear.
 */
type SelectOptions = string[] | ((state: Record<string, unknown>) => string[]);

export type Control =
  | { name: string; type: "select"; options: SelectOptions; default: string }
  | { name: string; type: "boolean"; default: boolean }
  | { name: string; type: "string"; default: string };

function resolveOptions(options: SelectOptions, state: Record<string, unknown>): string[] {
  return typeof options === "function" ? options(state) : options;
}

/**
 * Cascade-correct the state so every select holds a value that is still valid
 * given upstream selections. Controls are processed in declared order, so a
 * dependent control sees already-corrected upstream values — changing `context`
 * fixes `direction`, which in turn fixes `contentType`.
 */
function normalize(controls: Control[], state: Record<string, unknown>): Record<string, unknown> {
  const next = { ...state };
  for (const c of controls) {
    if (c.type !== "select") continue;
    const opts = resolveOptions(c.options, next);
    if (opts.length > 0 && !opts.includes(String(next[c.name]))) {
      next[c.name] = opts[0];
    }
  }
  return next;
}

export type PlaygroundProps = {
  componentName: string;
  controls: Control[];
  /** Which control (a `string` type) supplies the element's children. */
  childrenProp?: string;
  render: (props: Record<string, unknown>) => ReactNode;
  /**
   * Optional override for the Code tab. When provided, the code shown reflects
   * whatever this returns instead of the generic `<Component ...props>` output —
   * use it for composition-based components (e.g. ButtonGroup + Button children)
   * so the code matches the real source structure.
   */
  code?: (state: Record<string, unknown>) => string;
};

function initialState(controls: Control[]): Record<string, unknown> {
  const raw = Object.fromEntries(controls.map((c) => [c.name, c.default]));
  return normalize(controls, raw);
}

function generateCode(
  componentName: string,
  controls: Control[],
  state: Record<string, unknown>,
  childrenProp?: string
): string {
  const attrs: string[] = [];
  for (const c of controls) {
    if (c.name === childrenProp) continue;
    const value = state[c.name];
    if (value === c.default) continue; // omit defaults for clean output
    if (c.type === "boolean") {
      if (value) attrs.push(c.name);
    } else {
      attrs.push(`${c.name}="${value}"`);
    }
  }
  const children = childrenProp ? String(state[childrenProp] ?? "") : "";
  if (attrs.length <= 1) {
    const open = attrs.length ? `<${componentName} ${attrs[0]}>` : `<${componentName}>`;
    return `${open}${children}</${componentName}>`;
  }
  // Multi-prop → break onto lines, shadcn-style.
  return `<${componentName}\n  ${attrs.join("\n  ")}\n>\n  ${children}\n</${componentName}>`;
}

export function PropsPlayground({
  componentName,
  controls,
  childrenProp,
  render,
  code: codeOverride,
}: PlaygroundProps) {
  const [state, setState] = useState(() => initialState(controls));
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const code = useMemo(
    () =>
      codeOverride
        ? codeOverride(state)
        : generateCode(componentName, controls, state, childrenProp),
    [componentName, controls, state, childrenProp, codeOverride]
  );

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="overflow-hidden rounded-large border">
      {/* Tab bar (Preview / Code) */}
      <div className="flex items-center justify-between border-b bg-container-base-high/30 pr-3">
        <div className="flex">
          {(["preview", "code"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={
                "relative px-4 py-2.5 text-sm font-medium capitalize transition-colors " +
                (tab === t
                  ? "text-text-base-primary after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:bg-text-base-primary"
                  : "text-text-base-tertiary hover:text-text-base-secondary")
              }
            >
              {t}
            </button>
          ))}
        </div>
        {tab === "code" && (
          <button
            onClick={copy}
            className="text-xs text-text-base-tertiary hover:text-text-base-primary"
          >
            {copied ? "복사됨 ✓" : "복사"}
          </button>
        )}
      </div>

      {tab === "preview" ? (
        <div className="grid lg:grid-cols-[1fr_240px]">
          {/* Live preview */}
          <div className="flex min-h-52 items-center justify-center p-10">{render(state)}</div>

          {/* Prop controls */}
          <div className="flex flex-col gap-4 border-t p-4 lg:border-l lg:border-t-0">
            <span className="text-xs font-medium uppercase tracking-wider text-text-base-tertiary">
              Props
            </span>
            {controls.map((c) => (
              <label key={c.name} className="flex flex-col gap-1.5 text-sm">
                <span className="font-mono text-xs">{c.name}</span>
                {c.type === "select" && (
                  <select
                    className="h-9 rounded-medium border bg-frame-base-low px-2 text-sm"
                    value={String(state[c.name])}
                    onChange={(e) =>
                      setState((s) => normalize(controls, { ...s, [c.name]: e.target.value }))
                    }
                  >
                    {resolveOptions(c.options, state).map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                )}
                {c.type === "boolean" && (
                  <input
                    type="checkbox"
                    className="size-4 self-start"
                    checked={Boolean(state[c.name])}
                    onChange={(e) =>
                      setState((s) => normalize(controls, { ...s, [c.name]: e.target.checked }))
                    }
                  />
                )}
                {c.type === "string" && (
                  <input
                    type="text"
                    className="h-9 rounded-medium border bg-frame-base-low px-2 text-sm"
                    value={String(state[c.name])}
                    onChange={(e) =>
                      setState((s) => normalize(controls, { ...s, [c.name]: e.target.value }))
                    }
                  />
                )}
              </label>
            ))}
          </div>
        </div>
      ) : (
        /* Live code — reflects the current prop selection */
        <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}
