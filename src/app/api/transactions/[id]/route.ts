import { NextResponse } from "next/server";

import { getCategoryMap } from "@/lib/data/categories-repository";
import { deleteTransaction, listTransactions, updateTransaction } from "@/lib/data/transactions-repository";
import { transactionUpdateSchema } from "@/lib/utils/validators";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: {
    id: string;
  };
};

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const parsed = transactionUpdateSchema.parse(await request.json());
    const transactions = await listTransactions();
    const current = transactions.find((transaction) => transaction.id === params.id);

    if (!current) {
      return NextResponse.json({ error: "거래내역을 찾을 수 없습니다." }, { status: 404 });
    }

    const categoryMap = await getCategoryMap();
    const nextType = parsed.type ?? current.type;
    const nextCategoryId = parsed.categoryId ?? current.categoryId;
    const category = categoryMap.get(nextCategoryId);

    if (!category) {
      return NextResponse.json({ error: "존재하지 않는 카테고리입니다." }, { status: 400 });
    }

    if (category.type !== nextType) {
      return NextResponse.json({ error: "수입/지출 타입과 카테고리가 맞지 않습니다." }, { status: 400 });
    }

    const transaction = await updateTransaction(params.id, parsed);
    return NextResponse.json(transaction);
  } catch (error) {
    const message = error instanceof Error ? error.message : "거래내역을 수정하지 못했습니다.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: RouteContext) {
  try {
    await deleteTransaction(params.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "거래내역을 삭제하지 못했습니다.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
