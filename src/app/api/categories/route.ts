import { NextResponse } from "next/server";

import { createCategory, getCategories } from "@/lib/data/categories-repository";
import { revalidateBudgetBookPages } from "@/lib/data/revalidate-budget-book-pages";
import { categorySchema } from "@/lib/utils/validators";

export const dynamic = "force-dynamic";

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  try {
    const parsed = categorySchema.parse(await request.json());
    const category = await createCategory(parsed);
    revalidateBudgetBookPages();
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "카테고리를 저장하지 못했습니다.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
