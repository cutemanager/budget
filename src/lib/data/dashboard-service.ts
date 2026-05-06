import { listBudgets } from "@/lib/data/budgets-repository";
import { getCategories, getCategoryMap } from "@/lib/data/categories-repository";
import { getDefaultMonth, listEnrichedTransactions, listTransactions } from "@/lib/data/transactions-repository";
import type { BudgetAlert } from "@/types/budget";
import type { Category } from "@/types/category";
import type { DashboardSummary } from "@/types/dashboard";

function roundPercentage(value: number) {
  return Number(value.toFixed(1));
}

export async function resolveMonth(month?: string | null) {
  return month && /^\d{4}-\d{2}$/.test(month) ? month : getDefaultMonth();
}

export async function getDashboardSummary(month: string): Promise<DashboardSummary> {
  const [categories, categoryMap, transactions, budgets, recentTransactions] = await Promise.all([
    getCategories(),
    getCategoryMap(),
    listTransactions({ month }),
    listBudgets(month),
    listEnrichedTransactions({ month })
  ]);

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalExpense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const expenseCategoryTotals = new Map<string, number>();
  const dailyExpenseTotals = new Map<string, number>();

  for (const transaction of transactions) {
    if (transaction.type !== "expense") {
      continue;
    }

    expenseCategoryTotals.set(
      transaction.categoryId,
      (expenseCategoryTotals.get(transaction.categoryId) ?? 0) + transaction.amount
    );

    dailyExpenseTotals.set(
      transaction.transactionDate,
      (dailyExpenseTotals.get(transaction.transactionDate) ?? 0) + transaction.amount
    );
  }

  const expenseCategories = categories.filter((category) => category.type === "expense");
  const categoryBreakdown = expenseCategories
    .map((category) => {
      const amount = expenseCategoryTotals.get(category.id) ?? 0;

      return {
        categoryId: category.id,
        categoryName: category.name,
        color: category.color,
        amount,
        percentage: totalExpense > 0 ? roundPercentage((amount / totalExpense) * 100) : 0
      };
    })
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const dailyExpenses = Array.from(dailyExpenseTotals.entries())
    .map(([date, amount]) => ({
      date,
      amount
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const budgetAlerts = createBudgetAlerts({
    budgets,
    categoryMap,
    expenseCategoryTotals,
    totalExpense
  });

  return {
    month,
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    categoryBreakdown,
    dailyExpenses,
    budgetAlerts,
    recentTransactions: recentTransactions.slice(0, 8)
  };
}

function createBudgetAlerts({
  budgets,
  categoryMap,
  expenseCategoryTotals,
  totalExpense
}: {
  budgets: Awaited<ReturnType<typeof listBudgets>>;
  categoryMap: Map<string, Category>;
  expenseCategoryTotals: Map<string, number>;
  totalExpense: number;
}) {
  return budgets
    .map<BudgetAlert | null>((budget) => {
      const spentAmount = budget.categoryId ? expenseCategoryTotals.get(budget.categoryId) ?? 0 : totalExpense;
      const usageRate = budget.amount > 0 ? roundPercentage((spentAmount / budget.amount) * 100) : 0;

      if (usageRate < 80) {
        return null;
      }

      const overAmount = Math.max(0, spentAmount - budget.amount);

      return {
        id: budget.id,
        categoryId: budget.categoryId,
        categoryName: budget.categoryId ? categoryMap.get(budget.categoryId)?.name ?? "미분류" : "월 전체 예산",
        budgetAmount: budget.amount,
        spentAmount,
        usageRate,
        overAmount,
        status: usageRate >= 100 ? "over" : "warning"
      };
    })
    .filter((alert): alert is BudgetAlert => Boolean(alert))
    .sort((a, b) => b.usageRate - a.usageRate);
}

export async function getBudgetUsageMap(month: string) {
  const [summary, budgets] = await Promise.all([getDashboardSummary(month), listBudgets(month)]);
  const budgetMap = new Map(budgets.map((budget) => [budget.categoryId ?? "total", budget.amount]));
  const spentMap = new Map(summary.categoryBreakdown.map((item) => [item.categoryId, item.amount]));

  return {
    totalBudget: budgetMap.get("total") ?? 0,
    totalExpense: summary.totalExpense,
    categoryBudgets: budgetMap,
    categorySpent: spentMap
  };
}
