import { NextResponse } from "next/server";

import { seedSampleData } from "@/lib/data/sample-data-service";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const result = await seedSampleData();

    return NextResponse.json({
      message: `${result.month} 기준 샘플 데이터를 반영했습니다.`,
      ...result
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "샘플 데이터를 반영하지 못했습니다.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
