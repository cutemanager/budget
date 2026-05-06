import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AppShell } from "@/components/common/app-shell";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Budget Book",
  description: "JSON 저장 기반 개인 가계부 웹사이트"
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
