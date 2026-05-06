import { mapBudgetRow } from "@/lib/data/supabase-mappers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { generateId } from "@/lib/utils/id";
import type { Budget } from "@/types/budget";
import type { Database } from "@/types/database";

export async function listBudgets(month?: string) {
  const supabase = createSupabaseServerClient();
  let query = supabase.from("budgets").select("*").order("created_at", { ascending: true });

  if (month) {
    query = query.eq("month", month);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`예산 정보를 불러오지 못했습니다: ${error.message}`);
  }

  return (data ?? []).map(mapBudgetRow);
}

export async function saveBudget(input: Pick<Budget, "month" | "categoryId" | "amount">) {
  const supabase = createSupabaseServerClient();
  const existingResponse = input.categoryId
    ? await supabase
        .from("budgets")
        .select("*")
        .eq("month", input.month)
        .eq("category_id", input.categoryId)
        .maybeSingle()
    : await supabase
        .from("budgets")
        .select("*")
        .eq("month", input.month)
        .is("category_id", null)
        .maybeSingle();

  const existing = existingResponse.data as Database["public"]["Tables"]["budgets"]["Row"] | null;
  const lookupError = existingResponse.error;

  if (lookupError) {
    throw new Error(`기존 예산을 확인하지 못했습니다: ${lookupError.message}`);
  }

  if (input.amount <= 0) {
    if (existing) {
      const { error } = await supabase.from("budgets").delete().eq("id", existing.id);

      if (error) {
        throw new Error(`예산을 삭제하지 못했습니다: ${error.message}`);
      }
    }

    return null;
  }

  if (existing) {
    const { data, error } = await supabase
      .from("budgets")
      .update({
        amount: input.amount
      })
      .eq("id", existing.id)
      .select("*")
      .single();

    if (error) {
      throw new Error(`예산을 수정하지 못했습니다: ${error.message}`);
    }

    return mapBudgetRow(data);
  }

  const nextBudget: Budget = {
    id: generateId("budget"),
    month: input.month,
    categoryId: input.categoryId,
    amount: input.amount,
    createdAt: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from("budgets")
    .insert({
      id: nextBudget.id,
      month: nextBudget.month,
      category_id: nextBudget.categoryId,
      amount: nextBudget.amount,
      created_at: nextBudget.createdAt
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(`예산을 저장하지 못했습니다: ${error.message}`);
  }

  return mapBudgetRow(data);
}
