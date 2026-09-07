"use client";

import { useState } from "react";

/**
 * "Copy Page" — copies this component's llms.txt (generated from the registry,
 * served at `/components/<slug>/llms.txt`) to the clipboard so it can be pasted
 * straight into an LLM. Single source of truth = the generated llms.txt, so the
 * page, the machine `meta.ai`, and this button always agree.
 */
export function CopyPageButton({
  slug,
  src,
  label = "Copy Page",
}: {
  slug?: string;
  src?: string;
  label?: string;
}) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");
  const url = src ?? `/components/${slug}/llms.txt`;

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          const res = await fetch(url);
          if (!res.ok) throw new Error(String(res.status));
          await navigator.clipboard.writeText(await res.text());
          setState("copied");
        } catch {
          setState("error");
        }
        setTimeout(() => setState("idle"), 1500);
      }}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-medium border border-border-base-high px-3 py-1.5 text-xs font-medium text-text-base-secondary transition-colors hover:bg-container-base-high hover:text-text-base-primary"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        {state === "copied" ? (
          <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <>
            <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M5 15V5a2 2 0 0 1 2-2h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </>
        )}
      </svg>
      {state === "copied" ? "Copied" : state === "error" ? "Failed" : label}
    </button>
  );
}
