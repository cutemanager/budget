import { NextResponse } from "next/server";

import { listBudgets, saveBudget } from "@/lib/data/budgets-repository";
import { revalidateBudgetBookPages } from "@/lib/data/revalidate-budget-book-pages";
import { budgetBatchSchema } from "@/lib/utils/validators";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month") ?? undefined;
  const budgets = await listBudgets(month);
  return NextResponse.json(budgets);
}

export async function POST(request: Request) {
  try {
    const parsed = budgetBatchSchema.parse(await request.json());

    for (const entry of parsed.entries) {
      await saveBudget({
        month: parsed.month,
        categoryId: entry.categoryId,
        amount: entry.amount
      });
    }

    revalidateBudgetBookPages();
    const budgets = await listBudgets(parsed.month);
    return NextResponse.json(budgets);
  } catch (error) {
    const message = error instanceof Error ? error.message : "예산을 저장하지 못했습니다.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
