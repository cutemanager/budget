export type Budget = {
  id: string;
  month: string;
  categoryId: string | null;
  amount: number;
  createdAt: string;
};

export type BudgetAlertStatus = "warning" | "over";

export type BudgetAlert = {
  id: string;
  categoryId: string | null;
  categoryName: string;
  budgetAmount: number;
  spentAmount: number;
  usageRate: number;
  overAmount: number;
  status: BudgetAlertStatus;
};
