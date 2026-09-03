import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "UDS — Unified Design System",
  description: "Figma design assets, codified as a distributable component registry.",
};

const NAV = [
  { href: "/components/button", label: "Button" },
  { href: "/components/button-group", label: "Button Group" },
  { href: "/components/cta", label: "CTA" },
  { href: "/code-connect", label: "Code Connect" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <div className="mx-auto flex min-h-screen max-w-6xl">
          <aside className="w-56 shrink-0 border-r p-6">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              UDS
            </Link>
            <p className="mt-1 text-xs text-text-base-tertiary">Unified Design System</p>
            <nav className="mt-8 flex flex-col gap-1">
              <span className="px-2 text-xs font-medium uppercase tracking-wider text-text-base-tertiary">
                Foundations
              </span>
              <Link
                href="/foundations"
                className="rounded-medium px-2 py-1.5 text-sm text-text-base-secondary hover:bg-container-base-high hover:text-text-base-primary"
              >
                Design Tokens
              </Link>
              <span className="mt-4 px-2 text-xs font-medium uppercase tracking-wider text-text-base-tertiary">
                Components
              </span>
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-medium px-2 py-1.5 text-sm text-text-base-secondary hover:bg-container-base-high hover:text-text-base-primary"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
          <main className="flex-1 p-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
