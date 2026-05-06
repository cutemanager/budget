import { MonthFilterForm } from "@/components/common/month-filter-form";
import { BudgetManager, type BudgetItem } from "@/components/budgets/budget-manager";
import { listBudgets } from "@/lib/data/budgets-repository";
import { getCategories } from "@/lib/data/categories-repository";
import { getDashboardSummary, resolveMonth } from "@/lib/data/dashboard-service";
import { formatMonthLabel } from "@/lib/utils/date";
import { getSearchParamValue } from "@/lib/utils/search";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default async function BudgetsPage({ searchParams }: PageProps) {
  const month = await resolveMonth(getSearchParamValue(searchParams?.month));
  const [expenseCategories, budgets, summary] = await Promise.all([
    getCategories("expense"),
    listBudgets(month),
    getDashboardSummary(month)
  ]);

  const totalBudget = budgets.find((budget) => budget.categoryId === null)?.amount ?? 0;
  const spentByCategory = new Map(summary.categoryBreakdown.map((item) => [item.categoryId, item.amount]));
  const budgetByCategory = new Map(
    budgets.filter((budget) => budget.categoryId !== null).map((budget) => [budget.categoryId as string, budget.amount])
  );

  const items: BudgetItem[] = expenseCategories.map((category) => {
    const budgetAmount = budgetByCategory.get(category.id) ?? 0;
    const spentAmount = spentByCategory.get(category.id) ?? 0;
    const usageRate = budgetAmount > 0 ? Number(((spentAmount / budgetAmount) * 100).toFixed(1)) : 0;
    const status: BudgetItem["status"] =
      budgetAmount === 0 ? "none" : usageRate >= 100 ? "over" : usageRate >= 80 ? "warning" : "safe";

    return {
      categoryId: category.id,
      name: category.name,
      color: category.color,
      spentAmount,
      budgetAmount,
      usageRate,
      status
    };
  });

  return (
    <div className="space-y-5">
      <MonthFilterForm
        action="/budgets"
        description="월 전체 예산과 카테고리별 예산을 설정하고 사용률을 함께 관리합니다."
        month={month}
        title={`${formatMonthLabel(month)} 예산 관리`}
      />

      <BudgetManager items={items} month={month} totalBudget={totalBudget} totalExpense={summary.totalExpense} />
    </div>
  );
}
