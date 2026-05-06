"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { formatCurrency } from "@/lib/utils/currency";
import type { CategoryBreakdown } from "@/types/dashboard";

type ExpensePieChartProps = {
  data: CategoryBreakdown[];
};

export function ExpensePieChart({ data }: ExpensePieChartProps) {
  if (data.length === 0) {
    return (
      <section className="rounded-4xl border border-white/70 bg-white/80 p-5 shadow-soft">
        <h3 className="text-lg font-bold text-ink">카테고리별 지출 비율</h3>
        <p className="mt-3 text-sm text-ink/60">선택한 월의 지출 데이터가 아직 없습니다.</p>
      </section>
    );
  }

  return (
    <section className="rounded-4xl border border-white/70 bg-white/80 p-5 shadow-soft">
      <h3 className="text-lg font-bold text-ink">카테고리별 지출 비율</h3>
      <div className="mt-5 h-80">
        <ResponsiveContainer height="100%" width="100%">
          <PieChart>
            <Pie
              cx="50%"
              cy="50%"
              data={data}
              dataKey="amount"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={3}
            >
              {data.map((entry) => (
                <Cell fill={entry.color} key={entry.categoryId} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                borderRadius: "16px",
                border: "1px solid rgba(31,26,23,0.08)"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid gap-2">
        {data.map((item) => (
          <div className="flex items-center justify-between rounded-2xl bg-sand/60 px-3 py-2 text-sm" key={item.categoryId}>
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="font-medium text-ink">{item.categoryName}</span>
            </div>
            <span className="text-ink/70">
              {formatCurrency(item.amount)} / {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
