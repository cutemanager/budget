import { formatCurrency } from "@/lib/utils/currency";
import { formatDateLabel } from "@/lib/utils/date";
import type { EnrichedTransaction } from "@/types/transaction";

type RecentTransactionListProps = {
  transactions: EnrichedTransaction[];
};

export function RecentTransactionList({ transactions }: RecentTransactionListProps) {
  return (
    <section className="rounded-4xl border border-white/70 bg-white/80 p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-ink">최근 거래내역</h3>
        <span className="text-sm text-ink/50">{transactions.length}개</span>
      </div>

      {transactions.length === 0 ? (
        <p className="mt-4 text-sm text-ink/60">최근 거래내역이 없습니다.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {transactions.map((transaction) => (
            <div className="rounded-3xl bg-sand/60 px-4 py-3" key={transaction.id}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: transaction.categoryColor }}
                    />
                    <span className="font-semibold text-ink">{transaction.categoryName}</span>
                    <span className="text-xs text-ink/50">{formatDateLabel(transaction.transactionDate)}</span>
                  </div>
                  <p className="text-sm text-ink/65">{transaction.memo || "메모 없음"}</p>
                </div>
                <span
                  className={`text-base font-black ${
                    transaction.type === "income" ? "text-mint" : "text-ink"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
