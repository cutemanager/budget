import type { BudgetAlert } from "@/types/budget";
import type { EnrichedTransaction } from "@/types/transaction";

export type CategoryBreakdown = {
  categoryId: string;
  categoryName: string;
  color: string;
  amount: number;
  percentage: number;
};

export type DailyExpensePoint = {
  date: string;
  amount: number;
};

export type DashboardSummary = {
  month: string;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  categoryBreakdown: CategoryBreakdown[];
  dailyExpenses: DailyExpensePoint[];
  budgetAlerts: BudgetAlert[];
  recentTransactions: EnrichedTransaction[];
};
