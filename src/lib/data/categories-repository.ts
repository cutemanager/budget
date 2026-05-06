import { DEFAULT_CATEGORIES } from "@/lib/data/default-data";
import { mapCategoryRow } from "@/lib/data/supabase-mappers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { generateId } from "@/lib/utils/id";
import type { Database } from "@/types/database";
import type { Category, CategoryType } from "@/types/category";

type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

async function ensureBaseCategories() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from("categories").select("id, type");

  if (error) {
    throw new Error(`카테고리 상태를 확인하지 못했습니다. ${error.message}`);
  }

  const rows = (data ?? []) as Pick<CategoryRow, "id" | "type">[];
  const hasExpenseCategory = rows.some((row) => row.type === "expense");
  const hasIncomeCategory = rows.some((row) => row.type === "income");

  const missingCategories = DEFAULT_CATEGORIES.filter((category) => {
    if (category.type === "expense") {
      return !hasExpenseCategory;
    }

    return !hasIncomeCategory;
  });

  if (missingCategories.length === 0) {
    return;
  }

  const { error: insertError } = await supabase.from("categories").upsert(missingCategories);

  if (insertError) {
    throw new Error(`기본 카테고리를 준비하지 못했습니다. ${insertError.message}`);
  }
}

export async function getCategories(type?: CategoryType) {
  await ensureBaseCategories();

  const supabase = createSupabaseServerClient();
  let query = supabase.from("categories").select("*").order("created_at", { ascending: true });

  if (type) {
    query = query.eq("type", type);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`카테고리를 불러오지 못했습니다. ${error.message}`);
  }

  return (data ?? []).map(mapCategoryRow);
}

export async function getCategoryMap() {
  const categories = await getCategories();
  return new Map(categories.map((category) => [category.id, category]));
}

export async function createCategory(input: Pick<Category, "name" | "type" | "color">) {
  const supabase = createSupabaseServerClient();
  const trimmedName = input.name.trim();

  const { data: duplicate, error: duplicateError } = await supabase
    .from("categories")
    .select("id")
    .eq("type", input.type)
    .ilike("name", trimmedName)
    .limit(1)
    .maybeSingle();

  if (duplicateError) {
    throw new Error(`카테고리 중복 여부를 확인하지 못했습니다. ${duplicateError.message}`);
  }

  if (duplicate) {
    throw new Error("같은 이름의 카테고리가 이미 있습니다.");
  }

  const nextCategory: Category = {
    id: generateId("cat"),
    name: trimmedName,
    type: input.type,
    color: input.color,
    createdAt: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from("categories")
    .insert({
      id: nextCategory.id,
      name: nextCategory.name,
      type: nextCategory.type,
      color: nextCategory.color,
      created_at: nextCategory.createdAt
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(`카테고리를 저장하지 못했습니다. ${error.message}`);
  }

  return mapCategoryRow(data);
}
