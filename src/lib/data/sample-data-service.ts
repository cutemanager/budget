import { saveBudget } from "@/lib/data/budgets-repository";
import { buildSampleBudgetData, DEFAULT_CATEGORIES } from "@/lib/data/default-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CategoryType } from "@/types/category";

function makeCategoryKey(type: CategoryType, name: string) {
  return `${type}:${name.trim().toLocaleLowerCase("ko-KR")}`;
}

export async function seedSampleData() {
  const supabase = createSupabaseServerClient();
  const sampleData = buildSampleBudgetData();
  const { data: existingCategories, error: categoryLookupError } = await supabase
    .from("categories")
    .select("id, name, type");

  if (categoryLookupError) {
    throw new Error(`기존 카테고리를 확인하지 못했습니다. ${categoryLookupError.message}`);
  }

  const existingCategoryMap = new Map(
    (existingCategories ?? []).map((category) => [makeCategoryKey(category.type, category.name), category.id])
  );

  const missingCategories = DEFAULT_CATEGORIES.filter((category) => {
    const key = makeCategoryKey(category.type, category.name);
    return !existingCategoryMap.has(key);
  });

  if (missingCategories.length > 0) {
    const { error: categoryInsertError } = await supabase.from("categories").insert(missingCategories);

    if (categoryInsertError) {
      throw new Error(`샘플 카테고리를 저장하지 못했습니다. ${categoryInsertError.message}`);
    }

    for (const category of missingCategories) {
      existingCategoryMap.set(makeCategoryKey(category.type, category.name), category.id);
    }
  }

  const resolveCategoryId = (categoryId: string) => {
    const defaultCategory = DEFAULT_CATEGORIES.find((category) => category.id === categoryId);

    if (!defaultCategory) {
      return categoryId;
    }

    return existingCategoryMap.get(makeCategoryKey(defaultCategory.type, defaultCategory.name)) ?? categoryId;
  };

  const transactions = sampleData.transactions.map((transaction) => ({
    ...transaction,
    category_id: resolveCategoryId(transaction.category_id)
  }));

  const { error: transactionError } = await supabase.from("transactions").upsert(transactions);

  if (transactionError) {
    throw new Error(`샘플 거래 내역을 저장하지 못했습니다. ${transactionError.message}`);
  }

  const { data: existingBudgets, error: budgetLookupError } = await supabase
    .from("budgets")
    .select("category_id")
    .eq("month", sampleData.month);

  if (budgetLookupError) {
    throw new Error(`기존 예산을 확인하지 못했습니다. ${budgetLookupError.message}`);
  }

  const existingBudgetKeys = new Set((existingBudgets ?? []).map((budget) => budget.category_id ?? "total"));

  for (const budget of sampleData.budgets) {
    const budgetKey = budget.category_id ? resolveCategoryId(budget.category_id) : "total";

    if (existingBudgetKeys.has(budgetKey)) {
      continue;
    }

    await saveBudget({
      month: budget.month,
      categoryId: budgetKey === "total" ? null : budgetKey,
      amount: budget.amount
    });
  }

  return {
    month: sampleData.month,
    categoryCount: DEFAULT_CATEGORIES.length,
    transactionCount: transactions.length,
    budgetCount: sampleData.budgets.length
  };
}
