import type { ReactNode } from "react";

import { NavLink } from "@/components/common/nav-link";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="overflow-hidden rounded-4xl border border-white/60 bg-white/70 p-6 shadow-soft backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="inline-flex rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-clay">
                Budget Book
              </p>
              <div className="space-y-2">
                <h1 className="text-3xl font-black tracking-tight text-ink sm:text-4xl">개인 가계부 웹사이트</h1>
                <p className="max-w-xl text-sm leading-6 text-ink/70 sm:text-base">
                  빠르게 기록하고, 이번 달 흐름을 보고, 예산을 넘기기 전에 잡아주는 개인용 가계부입니다.
                </p>
              </div>
            </div>
            <nav className="flex flex-wrap gap-2">
              <NavLink href="/">대시보드</NavLink>
              <NavLink href="/quick-entry">빠른 입력</NavLink>
              <NavLink href="/history">내역 조회</NavLink>
              <NavLink href="/budgets">예산 관리</NavLink>
            </nav>
          </div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}
