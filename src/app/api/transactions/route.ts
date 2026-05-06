import { NextResponse } from "next/server";

import { getCategoryMap } from "@/lib/data/categories-repository";
import { createTransaction, listEnrichedTransactions } from "@/lib/data/transactions-repository";
import { transactionSchema } from "@/lib/utils/validators";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month") ?? undefined;
  const categoryId = searchParams.get("categoryId") ?? undefined;
  const q = searchParams.get("q") ?? undefined;
  const typeParam = searchParams.get("type");
  const type = typeParam === "income" || typeParam === "expense" ? typeParam : undefined;

  const transactions = await listEnrichedTransactions({
    month,
    categoryId,
    q,
    type
  });

  return NextResponse.json(transactions);
}

export async function POST(request: Request) {
  try {
    const parsed = transactionSchema.parse(await request.json());
    const categoryMap = await getCategoryMap();
    const category = categoryMap.get(parsed.categoryId);

    if (!category) {
      return NextResponse.json({ error: "존재하지 않는 카테고리입니다." }, { status: 400 });
    }

    if (category.type !== parsed.type) {
      return NextResponse.json({ error: "수입/지출 타입과 카테고리가 맞지 않습니다." }, { status: 400 });
    }

    const transaction = await createTransaction(parsed);
    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "거래내역을 저장하지 못했습니다.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
