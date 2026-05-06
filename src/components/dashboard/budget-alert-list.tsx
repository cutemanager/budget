import { formatCurrency } from "@/lib/utils/currency";
import type { BudgetAlert } from "@/types/budget";

type BudgetAlertListProps = {
  alerts: BudgetAlert[];
};

export function BudgetAlertList({ alerts }: BudgetAlertListProps) {
  return (
    <section className="rounded-4xl border border-white/70 bg-white/80 p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-ink">예산 경고</h3>
        <span className="text-sm text-ink/50">{alerts.length}건</span>
      </div>

      {alerts.length === 0 ? (
        <p className="mt-4 text-sm text-ink/60">이번 달은 아직 주의 또는 초과 항목이 없습니다.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {alerts.map((alert) => (
            <article
              className={`rounded-3xl border px-4 py-4 ${
                alert.status === "over"
                  ? "border-rose/20 bg-rose/10"
                  : "border-accent/20 bg-accent/10"
              }`}
              key={alert.id}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-bold text-ink">{alert.categoryName}</p>
                  <p className="text-sm text-ink/70">
                    예산 {formatCurrency(alert.budgetAmount)} 중 {formatCurrency(alert.spentAmount)} 사용
                  </p>
                </div>
                <div className="text-sm font-semibold text-ink">
                  {alert.status === "over"
                    ? `${formatCurrency(alert.overAmount)} 초과`
                    : `${alert.usageRate}% 사용`}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
