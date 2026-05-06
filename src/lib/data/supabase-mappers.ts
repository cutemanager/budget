import type { Budget } from "@/types/budget";
import type { Category } from "@/types/category";
import type { Database } from "@/types/database";
import type { Settings } from "@/types/settings";
import type { Transaction } from "@/types/transaction";

type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
type TransactionRow = Database["public"]["Tables"]["transactions"]["Row"];
type BudgetRow = Database["public"]["Tables"]["budgets"]["Row"];
type SettingsRow = Database["public"]["Tables"]["app_settings"]["Row"];

export function mapCategoryRow(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    color: row.color,
    createdAt: row.created_at
  };
}

export function mapTransactionRow(row: TransactionRow): Transaction {
  return {
    id: row.id,
    type: row.type,
    amount: row.amount,
    categoryId: row.category_id,
    paymentMethod: row.payment_method,
    memo: row.memo,
    transactionDate: row.transaction_date,
    createdAt: row.created_at
  };
}

export function mapBudgetRow(row: BudgetRow): Budget {
  return {
    id: row.id,
    month: row.month,
    categoryId: row.category_id,
    amount: row.amount,
    createdAt: row.created_at
  };
}

export function mapSettingsRow(row: SettingsRow): Settings {
  return {
    currency: row.currency,
    defaultPaymentMethod: row.default_payment_method,
    lastUsedCategoryId: row.last_used_category_id
  };
}
