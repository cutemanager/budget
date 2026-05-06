"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { formatCurrency } from "@/lib/utils/currency";

export type BudgetItem = {
  categoryId: string;
  name: string;
  color: string;
  spentAmount: number;
  budgetAmount: number;
  usageRate: number;
  status: "none" | "safe" | "warning" | "over";
};

type BudgetManagerProps = {
  month: string;
  totalBudget: number;
  totalExpense: number;
  items: BudgetItem[];
};

function getBarClass(status: BudgetItem["status"]) {
  if (status === "over") {
    return "bg-rose";
  }

  if (status === "warning") {
    return "bg-accent";
  }

  return "bg-mint";
}

export function BudgetManager({ month, totalBudget, totalExpense, items }: BudgetManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [totalValue, setTotalValue] = useState(totalBudget > 0 ? String(totalBudget) : "");
  const [drafts, setDrafts] = useState<Record<string, string>>(
    () =>
      Object.fromEntries(
        items.map((item) => [item.categoryId, item.budgetAmount > 0 ? String(item.budgetAmount) : ""])
      )
  );

  const totalUsageRate = totalBudget > 0 ? Number(((totalExpense / totalBudget) * 100).toFixed(1)) : 0;
  const totalStatus: BudgetItem["status"] =
    totalBudget === 0 ? "none" : totalUsageRate >= 100 ? "over" : totalUsageRate >= 80 ? "warning" : "safe";

  useEffect(() => {
    setTotalValue(totalBudget > 0 ? String(totalBudget) : "");
    setDrafts(
      Object.fromEntries(items.map((item) => [item.categoryId, item.budgetAmount > 0 ? String(item.budgetAmount) : ""]))
    );
  }, [items, totalBudget]);

  async function handleSave() {
    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          month,
          entries: [
            {
              categoryId: null,
              amount: Number(totalValue || "0")
            },
            ...items.map((item) => ({
              categoryId: item.categoryId,
              amount: Number(drafts[item.categoryId] || "0")
            }))
          ]
        })
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "예산을 저장하지 못했습니다.");
        return;
      }

      setMessage("예산을 저장했습니다.");
      startTransition(() => {
        router.refresh();
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-5">
      <section className="rounded-4xl border border-white/70 bg-white/80 p-5 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-ink">월 전체 예산</h2>
            <p className="text-sm text-ink/65">월 총지출 기준으로 먼저 큰 흐름을 잡고, 그다음 카테고리별 예산을 나눕니다.</p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              className="rounded-2xl border border-black/10 bg-paper px-4 py-3 text-sm outline-none focus:border-accent"
              inputMode="numeric"
              onChange={(event) => setTotalValue(event.target.value)}
              placeholder="예: 1500000"
              type="number"
              value={totalValue}
            />
            <button
              className="rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-paper transition hover:bg-clay disabled:opacity-60"
              disabled={isPending || isSubmitting}
              onClick={handleSave}
              type="button"
            >
              전체 저장
            </button>
          </div>
        </div>

        <div className="mt-4 rounded-3xl bg-sand/60 p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-ink/60">이번 달 총지출</p>
              <p className="mt-1 text-xl font-black text-ink">{formatCurrency(totalExpense)}</p>
            </div>
            <div className="text-sm font-semibold text-ink">
              {totalBudget > 0 ? `${totalUsageRate}% 사용` : "예산 미설정"}
            </div>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-white">
            <div
              className={`h-full rounded-full transition-all ${getBarClass(totalStatus)}`}
              style={{ width: `${Math.min(totalUsageRate, 100)}%` }}
            />
          </div>
        </div>

        {message ? <p className="mt-4 text-sm font-semibold text-mint">{message}</p> : null}
        {error ? <p className="mt-4 text-sm font-semibold text-rose">{error}</p> : null}
      </section>

      <section className="rounded-4xl border border-white/70 bg-white/80 p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-ink">카테고리별 예산</h2>
          <span className="text-sm text-ink/50">{items.length}개 카테고리</span>
        </div>

        <div className="mt-4 space-y-4">
          {items.map((item) => (
            <article className="rounded-3xl bg-sand/60 p-4" key={item.categoryId}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <h3 className="font-bold text-ink">{item.name}</h3>
                  </div>
                  <p className="mt-2 text-sm text-ink/65">
                    사용 {formatCurrency(item.spentAmount)} / 예산 {item.budgetAmount > 0 ? formatCurrency(item.budgetAmount) : "미설정"}
                  </p>
                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-white">
                    <div
                      className={`h-full rounded-full transition-all ${getBarClass(item.status)}`}
                      style={{ width: `${Math.min(item.usageRate, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="w-full lg:w-64">
                  <input
                    className="w-full rounded-2xl border border-black/10 bg-paper px-4 py-3 text-sm outline-none focus:border-accent"
                    inputMode="numeric"
                    onChange={(event) =>
                      setDrafts((current) => ({
                        ...current,
                        [item.categoryId]: event.target.value
                      }))
                    }
                    placeholder="예: 200000"
                    type="number"
                    value={drafts[item.categoryId] ?? ""}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
