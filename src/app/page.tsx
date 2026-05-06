import Link from "next/link";

import { MonthFilterForm } from "@/components/common/month-filter-form";
import { SampleDataSeeder } from "@/components/common/sample-data-seeder";
import { SupabaseConfigNotice } from "@/components/common/supabase-config-notice";
import { BudgetAlertList } from "@/components/dashboard/budget-alert-list";
import { DailyExpenseChart } from "@/components/dashboard/daily-expense-chart";
import { ExpensePieChart } from "@/components/dashboard/expense-pie-chart";
import { RecentTransactionList } from "@/components/dashboard/recent-transaction-list";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { getDashboardSummary, resolveMonth } from "@/lib/data/dashboard-service";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { formatCurrency } from "@/lib/utils/currency";
import { formatMonthLabel } from "@/lib/utils/date";
import { getSearchParamValue } from "@/lib/utils/search";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default async function DashboardPage({ searchParams }: PageProps) {
  if (!isSupabaseConfigured()) {
    return <SupabaseConfigNotice title="Supabase 연결이 필요합니다." />;
  }

  const month = await resolveMonth(getSearchParamValue(searchParams?.month));
  const summary = await getDashboardSummary(month);

  return (
    <div className="space-y-5">
      <MonthFilterForm
        action="/"
        description="월별 수입, 지출, 예산 경고를 대시보드에서 빠르게 확인할 수 있습니다."
        month={month}
        title={formatMonthLabel(month)}
      />

      <SummaryCards balance={summary.balance} totalExpense={summary.totalExpense} totalIncome={summary.totalIncome} />

      {summary.recentTransactions.length === 0 ? (
        <SampleDataSeeder
          description="대시보드가 비어 있다면 기본 카테고리와 이번 달 샘플 거래, 예산 데이터를 한 번에 넣어 바로 테스트할 수 있습니다."
          title="처음 테스트하신다면"
        />
      ) : null}

      <section className="grid gap-5 lg:grid-cols-[1.3fr_0.9fr]">
        <ExpensePieChart data={summary.categoryBreakdown} />
        <DailyExpenseChart data={summary.dailyExpenses} />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <BudgetAlertList alerts={summary.budgetAlerts} />
        <RecentTransactionList transactions={summary.recentTransactions} />
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-4xl border border-white/70 bg-white/80 p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-ink">카테고리 통계</h2>
            <span className="text-sm text-ink/50">{summary.categoryBreakdown.length}개</span>
          </div>

          {summary.categoryBreakdown.length === 0 ? (
            <p className="mt-4 text-sm text-ink/60">아직 지출 카테고리 통계가 없습니다.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {summary.categoryBreakdown.map((item) => (
                <div className="rounded-3xl bg-sand/60 px-4 py-3" key={item.categoryId}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="font-semibold text-ink">{item.categoryName}</span>
                    </div>
                    <span className="text-sm font-medium text-ink/65">{item.percentage}%</span>
                  </div>
                  <p className="mt-2 text-sm text-ink/70">{formatCurrency(item.amount)}</p>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="rounded-4xl border border-white/70 bg-white/80 p-5 shadow-soft">
          <div className="space-y-2">
            <h2 className="text-xl font-black text-ink">빠른 이동</h2>
            <p className="text-sm text-ink/65">지금 바로 기록을 추가하거나 예산을 조정할 수 있습니다.</p>
          </div>

          <div className="mt-4 grid gap-3">
            <Link
              className="rounded-3xl bg-ink px-4 py-4 text-sm font-semibold text-paper transition hover:bg-clay"
              href="/quick-entry"
              prefetch={false}
            >
              거래 내역 빠르게 입력하기
            </Link>
            <Link
              className="rounded-3xl border border-black/10 bg-white px-4 py-4 text-sm font-semibold text-ink transition hover:border-accent"
              href={`/history?month=${month}`}
              prefetch={false}
            >
              {formatMonthLabel(month)} 내역 조회하기
            </Link>
            <Link
              className="rounded-3xl border border-black/10 bg-white px-4 py-4 text-sm font-semibold text-ink transition hover:border-accent"
              href={`/budgets?month=${month}`}
              prefetch={false}
            >
              예산 관리하기
            </Link>
          </div>
        </article>
      </section>
    </div>
  );
}
