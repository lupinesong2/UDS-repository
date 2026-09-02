"use client";

import { useState } from "react";

export function CodeBlock({ code, lang = "tsx" }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="relative rounded-large border bg-container-base-high/40">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <span className="text-xs font-medium text-text-base-tertiary">{lang}</span>
        <button
          onClick={copy}
          className="text-xs text-text-base-tertiary hover:text-text-base-primary"
        >
          {copied ? "복사됨 ✓" : "복사"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}
