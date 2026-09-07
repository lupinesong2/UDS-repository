"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Top horizontal section tabs (mapped to real routes to avoid dead links).
const TOP = [
  { href: "/", label: "Overview", match: "^/$" },
  { href: "/foundations", label: "Foundations", match: "^/foundations" },
  { href: "/components/button", label: "Components", match: "^/components" },
  { href: "/examples/roaming", label: "Examples", match: "^/examples" },
  { href: "/code-connect", label: "Resources", match: "^/code-connect" },
];

// Category-grouped left sidebar (mirrors the Figma doc-site grouping).
const SIDE: { title: string; items: { href: string; label: string }[] }[] = [
  {
    title: "Get Started",
    items: [
      { href: "/get-started", label: "Introduction" },
      { href: "/get-started/installation", label: "Installation" },
      { href: "/get-started/quickstart", label: "Quickstart" },
      { href: "/get-started/tutorial", label: "튜토리얼 — Claude로 화면 만들기" },
      { href: "/ai-kit", label: "AI로 화면 만들기" },
    ],
  },
  {
    title: "Foundations",
    items: [
      { href: "/foundations", label: "Design Tokens" },
      { href: "/foundations/icons", label: "Icons" },
    ],
  },
  {
    title: "Action",
    items: [
      { href: "/components/button", label: "Button" },
      { href: "/components/button-group", label: "Button Group" },
      { href: "/components/cta", label: "CTA" },
    ],
  },
  {
    title: "Selection",
    items: [
      { href: "/components/checkbox", label: "Checkbox" },
      { href: "/components/radio", label: "Radio" },
      { href: "/components/chip", label: "Chip" },
      { href: "/components/chip-group", label: "Chip Group" },
    ],
  },
  {
    title: "Input",
    items: [{ href: "/components/text-field", label: "Text Field" }],
  },
  {
    title: "Navigation",
    items: [{ href: "/components/header", label: "Header" }],
  },
  {
    title: "Examples",
    items: [
      { href: "/examples/roaming", label: "해외로밍 사용요금조회" },
      { href: "/examples/address", label: "배송지 입력" },
    ],
  },
  {
    title: "Resources",
    items: [{ href: "/code-connect", label: "Code Connect" }],
  },
];

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m20 20-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ThemeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function slugify(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [toc, setToc] = useState<{ id: string; text: string }[]>([]);

  // Build the right-rail "On this page" from the page's <h2>s (auto-id them).
  useEffect(() => {
    const heads = Array.from(document.querySelectorAll("main h2")) as HTMLElement[];
    const items = heads
      .map((h) => {
        const text = (h.textContent ?? "").trim();
        if (!text) return null;
        if (!h.id) h.id = slugify(text);
        h.style.scrollMarginTop = "5rem";
        return { id: h.id, text };
      })
      .filter(Boolean) as { id: string; text: string }[];
    setToc(items);
  }, [pathname]);

  const topActive = (m: string) => new RegExp(m).test(pathname);
  const sideActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 items-center gap-6 border-b border-border-base-high bg-frame-base-low/85 px-6 backdrop-blur">
        <Link href="/" className="text-base font-bold tracking-tight">
          UDS
        </Link>
        <nav className="flex items-center gap-0.5">
          {TOP.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className={`rounded-medium px-3 py-1.5 text-sm transition-colors ${
                topActive(t.match)
                  ? "font-semibold text-text-base-primary"
                  : "text-text-base-tertiary hover:text-text-base-primary"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1 text-text-base-tertiary">
          <button
            type="button"
            aria-label="Search"
            className="grid size-8 place-items-center rounded-full hover:bg-container-base-high hover:text-text-base-primary"
          >
            <SearchIcon />
          </button>
          <button
            type="button"
            aria-label="Toggle theme"
            onClick={() => document.documentElement.classList.toggle("dark")}
            className="grid size-8 place-items-center rounded-full hover:bg-container-base-high hover:text-text-base-primary"
          >
            <ThemeIcon />
          </button>
        </div>
      </header>

      <div className="flex w-full">
        {/* Left — category-grouped component nav, flush to the viewport edge */}
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 overflow-y-auto border-r border-border-base-high px-4 py-8 lg:block">
          {SIDE.map((group) => (
            <div key={group.title} className="mb-6">
              <p className="mb-1.5 px-2 text-[11px] font-medium uppercase tracking-wider text-text-base-quaternary">
                {group.title}
              </p>
              <div className="flex flex-col">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-medium px-2 py-1.5 text-sm transition-colors ${
                      sideActive(item.href)
                        ? "bg-container-base-high-level1 font-medium text-text-base-primary"
                        : "text-text-base-tertiary hover:text-text-base-primary"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* Center — page content, centered in the remaining space */}
        <main className="min-w-0 flex-1 py-10">
          <div className="mx-auto max-w-3xl px-8">{children}</div>
        </main>

        {/* Right — on this page (symmetric width keeps content centered) */}
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 overflow-y-auto py-10 pr-6 xl:block">
          {toc.length > 0 && (
            <>
              <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-text-base-quaternary">
                On this page
              </p>
              <ul className="flex flex-col gap-2 border-l border-border-base-low">
                {toc.map((t) => (
                  <li key={t.id}>
                    <a
                      href={`#${t.id}`}
                      className="-ml-px block border-l border-transparent pl-3 text-sm text-text-base-tertiary transition-colors hover:border-status-border-selected hover:text-text-base-primary"
                    >
                      {t.text}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </aside>
      </div>
    </>
  );
}
