import { getCategoryMap } from "@/lib/data/categories-repository";
import { dataFiles, generateId, readJsonFile, writeJsonFile } from "@/lib/data/file-db";
import { getSettings, updateSettings } from "@/lib/data/settings-repository";
import { getCurrentMonth, isMonthString } from "@/lib/utils/date";
import type { CategoryType } from "@/types/category";
import type { EnrichedTransaction, Transaction } from "@/types/transaction";

const fallback: Transaction[] = [];

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
  const transactions = await readJsonFile<Transaction[]>(dataFiles.transactions, fallback);

  return transactions
    .filter((transaction) => {
      if (filters.month && transaction.transactionDate.slice(0, 7) !== filters.month) {
        return false;
      }

      if (filters.categoryId && transaction.categoryId !== filters.categoryId) {
        return false;
      }

      if (filters.type && transaction.type !== filters.type) {
        return false;
      }

      if (filters.q) {
        const query = filters.q.trim().toLowerCase();
        const memo = transaction.memo.toLowerCase();
        return memo.includes(query);
      }

      return true;
    })
    .sort(sortTransactions);
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
  const transactions = await listTransactions();
  const nextTransaction: Transaction = {
    ...input,
    id: generateId("txn"),
    createdAt: new Date().toISOString(),
    memo: input.memo.trim()
  };

  const nextTransactions = [...transactions, nextTransaction].sort(sortTransactions);
  await writeJsonFile(dataFiles.transactions, nextTransactions);

  const settings = await getSettings();
  await updateSettings({
    defaultPaymentMethod: input.paymentMethod,
    lastUsedCategoryId: input.categoryId ?? settings.lastUsedCategoryId
  });

  return nextTransaction;
}

export async function updateTransaction(id: string, patch: Partial<Omit<Transaction, "id" | "createdAt">>) {
  const transactions = await listTransactions();
  const index = transactions.findIndex((transaction) => transaction.id === id);

  if (index === -1) {
    throw new Error("거래내역을 찾을 수 없습니다.");
  }

  const current = transactions[index];
  const nextTransaction: Transaction = {
    ...current,
    ...patch,
    memo: patch.memo?.trim() ?? current.memo
  };

  const nextTransactions = [...transactions];
  nextTransactions[index] = nextTransaction;
  nextTransactions.sort(sortTransactions);
  await writeJsonFile(dataFiles.transactions, nextTransactions);

  return nextTransaction;
}

export async function deleteTransaction(id: string) {
  const transactions = await listTransactions();
  const nextTransactions = transactions.filter((transaction) => transaction.id !== id);

  if (nextTransactions.length === transactions.length) {
    throw new Error("거래내역을 찾을 수 없습니다.");
  }

  await writeJsonFile(dataFiles.transactions, nextTransactions);
}

export async function getDefaultMonth() {
  const transactions = await listTransactions();
  const latest = transactions[0];

  if (latest && isMonthString(latest.transactionDate.slice(0, 7))) {
    return latest.transactionDate.slice(0, 7);
  }

  return getCurrentMonth();
}
