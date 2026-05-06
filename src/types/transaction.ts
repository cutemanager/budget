import type { CategoryType } from "@/types/category";

export type PaymentMethod = "card" | "cash" | "bank" | "other";

export type Transaction = {
  id: string;
  type: CategoryType;
  amount: number;
  categoryId: string;
  paymentMethod: PaymentMethod;
  memo: string;
  transactionDate: string;
  createdAt: string;
};

export type EnrichedTransaction = Transaction & {
  categoryName: string;
  categoryColor: string;
};
