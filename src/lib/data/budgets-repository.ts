import { dataFiles, generateId, readJsonFile, writeJsonFile } from "@/lib/data/file-db";
import type { Budget } from "@/types/budget";

const fallback: Budget[] = [];

export async function listBudgets(month?: string) {
  const budgets = await readJsonFile<Budget[]>(dataFiles.budgets, fallback);

  return month ? budgets.filter((budget) => budget.month === month) : budgets;
}

export async function saveBudget(input: Pick<Budget, "month" | "categoryId" | "amount">) {
  const budgets = await listBudgets();
  const index = budgets.findIndex(
    (budget) => budget.month === input.month && budget.categoryId === input.categoryId
  );

  if (input.amount <= 0) {
    if (index >= 0) {
      const nextBudgets = budgets.filter((_, budgetIndex) => budgetIndex !== index);
      await writeJsonFile(dataFiles.budgets, nextBudgets);
    }

    return null;
  }

  if (index >= 0) {
    const nextBudgets = [...budgets];
    nextBudgets[index] = {
      ...nextBudgets[index],
      amount: input.amount
    };
    await writeJsonFile(dataFiles.budgets, nextBudgets);
    return nextBudgets[index];
  }

  const nextBudget: Budget = {
    id: generateId("budget"),
    month: input.month,
    categoryId: input.categoryId,
    amount: input.amount,
    createdAt: new Date().toISOString()
  };

  const nextBudgets = [...budgets, nextBudget];
  await writeJsonFile(dataFiles.budgets, nextBudgets);

  return nextBudget;
}
