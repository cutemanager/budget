import { formatCurrency } from "@/lib/utils/currency";

type SummaryCardsProps = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
};

const items = [
  {
    key: "income",
    label: "이번 달 총수입",
    accent: "bg-mint/15 text-mint"
  },
  {
    key: "expense",
    label: "이번 달 총지출",
    accent: "bg-rose/15 text-rose"
  },
  {
    key: "balance",
    label: "이번 달 잔액",
    accent: "bg-accent/15 text-accent"
  }
] as const;

export function SummaryCards({ totalIncome, totalExpense, balance }: SummaryCardsProps) {
  const values = {
    income: totalIncome,
    expense: totalExpense,
    balance
  };

  return (
    <section className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <article
          className="rounded-4xl border border-white/70 bg-white/80 p-5 shadow-soft backdrop-blur"
          key={item.key}
        >
          <div className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${item.accent}`}>{item.label}</div>
          <div className="mt-4 text-2xl font-black tracking-tight text-ink">{formatCurrency(values[item.key])}</div>
        </article>
      ))}
    </section>
  );
}
