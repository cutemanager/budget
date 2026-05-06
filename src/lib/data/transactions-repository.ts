import { getCategoryMap } from "@/lib/data/categories-repository";
import { mapTransactionRow } from "@/lib/data/supabase-mappers";
import { getSettings, updateSettings } from "@/lib/data/settings-repository";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentMonth, getMonthDateRange, isMonthString } from "@/lib/utils/date";
import { generateId } from "@/lib/utils/id";
import type { CategoryType } from "@/types/category";
import type { EnrichedTransaction, Transaction } from "@/types/transaction";

type TransactionFilters = {
  month?: string;
  categoryId?: string;
  type?: CategoryType;
  q?: string;
};

function sortTransactions(a: Transaction, b: Transaction) {
  const dateCompare = b.transactionDate.localeCompare(a.transactionDate);

  if (dateCompare !== 0) {
    return dateCompare;
  }

  return b.createdAt.localeCompare(a.createdAt);
}

export async function listTransactions(filters: TransactionFilters = {}) {
  const supabase = createSupabaseServerClient();
  let query = supabase
    .from("transactions")
    .select("*")
    .order("transaction_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (filters.month) {
    const { start, endExclusive } = getMonthDateRange(filters.month);
    query = query.gte("transaction_date", start).lt("transaction_date", endExclusive);
  }

  if (filters.categoryId) {
    query = query.eq("category_id", filters.categoryId);
  }

  if (filters.type) {
    query = query.eq("type", filters.type);
  }

  if (filters.q?.trim()) {
    query = query.ilike("memo", `%${filters.q.trim()}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`거래내역을 불러오지 못했습니다: ${error.message}`);
  }

  return (data ?? []).map(mapTransactionRow).sort(sortTransactions);
}

export async function listEnrichedTransactions(filters: TransactionFilters = {}) {
  const [transactions, categoryMap] = await Promise.all([listTransactions(filters), getCategoryMap()]);

  return transactions.map<EnrichedTransaction>((transaction) => {
    const category = categoryMap.get(transaction.categoryId);

    return {
      ...transaction,
      categoryColor: category?.color ?? "#6b7280",
      categoryName: category?.name ?? "미분류"
    };
  });
}

export async function createTransaction(input: Omit<Transaction, "id" | "createdAt">) {
  const supabase = createSupabaseServerClient();
  const nextTransaction: Transaction = {
    ...input,
    id: generateId("txn"),
    createdAt: new Date().toISOString(),
    memo: input.memo.trim()
  };

  const { data, error } = await supabase
    .from("transactions")
    .insert({
      id: nextTransaction.id,
      type: nextTransaction.type,
      amount: nextTransaction.amount,
      category_id: nextTransaction.categoryId,
      payment_method: nextTransaction.paymentMethod,
      memo: nextTransaction.memo,
      transaction_date: nextTransaction.transactionDate,
      created_at: nextTransaction.createdAt
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(`거래내역을 저장하지 못했습니다: ${error.message}`);
  }

  const settings = await getSettings();
  await updateSettings({
    defaultPaymentMethod: input.paymentMethod,
    lastUsedCategoryId: input.categoryId ?? settings.lastUsedCategoryId
  });

  return mapTransactionRow(data);
}

export async function updateTransaction(id: string, patch: Partial<Omit<Transaction, "id" | "createdAt">>) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("transactions")
    .update({
      type: patch.type,
      amount: patch.amount,
      category_id: patch.categoryId,
      payment_method: patch.paymentMethod,
      memo: patch.memo?.trim(),
      transaction_date: patch.transactionDate
    })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(`거래내역을 수정하지 못했습니다: ${error.message}`);
  }

  if (!data) {
    throw new Error("거래내역을 찾을 수 없습니다.");
  }

  return mapTransactionRow(data);
}

export async function deleteTransaction(id: string) {
  const supabase = createSupabaseServerClient();
  const { error, count } = await supabase.from("transactions").delete({ count: "exact" }).eq("id", id);

  if (error) {
    throw new Error(`거래내역을 삭제하지 못했습니다: ${error.message}`);
  }

  if (!count) {
    throw new Error("거래내역을 찾을 수 없습니다.");
  }
}

export async function getDefaultMonth() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("transaction_date, created_at")
    .order("transaction_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`기본 월 정보를 계산하지 못했습니다: ${error.message}`);
  }

  if (data && isMonthString(data.transaction_date.slice(0, 7))) {
    return data.transaction_date.slice(0, 7);
  }

  return getCurrentMonth();
}
