import { NextResponse } from "next/server";

import { getDashboardSummary, resolveMonth } from "@/lib/data/dashboard-service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const month = await resolveMonth(searchParams.get("month"));
  const summary = await getDashboardSummary(month);
  return NextResponse.json(summary);
}
