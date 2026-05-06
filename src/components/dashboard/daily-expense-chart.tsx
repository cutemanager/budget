"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { formatCurrency } from "@/lib/utils/currency";
import type { DailyExpensePoint } from "@/types/dashboard";

type DailyExpenseChartProps = {
  data: DailyExpensePoint[];
};

export function DailyExpenseChart({ data }: DailyExpenseChartProps) {
  if (data.length === 0) {
    return (
      <section className="rounded-4xl border border-white/70 bg-white/80 p-5 shadow-soft">
        <h3 className="text-lg font-bold text-ink">일별 지출 추이</h3>
        <p className="mt-3 text-sm text-ink/60">표시할 지출 내역이 아직 없습니다.</p>
      </section>
    );
  }

  const chartData = data.map((item) => ({
    ...item,
    label: item.date.slice(8, 10)
  }));

  return (
    <section className="rounded-4xl border border-white/70 bg-white/80 p-5 shadow-soft">
      <h3 className="text-lg font-bold text-ink">일별 지출 추이</h3>
      <div className="mt-5 h-80">
        <ResponsiveContainer height="100%" width="100%">
          <BarChart data={chartData}>
            <CartesianGrid stroke="rgba(31, 26, 23, 0.08)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" stroke="#8f5f43" />
            <YAxis hide />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => `${label}일`}
              contentStyle={{
                borderRadius: "16px",
                border: "1px solid rgba(31,26,23,0.08)"
              }}
            />
            <Bar dataKey="amount" fill="#d97706" radius={[12, 12, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
