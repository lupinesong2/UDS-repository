import type { Metadata } from "next";
import "./globals.css";
import { SiteChrome } from "../components/site-chrome.tsx";

export const metadata: Metadata = {
  title: "UDS — Unified Design System",
  description: "Figma design assets, codified as a distributable component registry.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
