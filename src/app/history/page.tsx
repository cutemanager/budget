import { HistoryManager } from "@/components/history/history-manager";
import { MonthFilterForm } from "@/components/common/month-filter-form";
import { getCategories } from "@/lib/data/categories-repository";
import { resolveMonth } from "@/lib/data/dashboard-service";
import { listEnrichedTransactions } from "@/lib/data/transactions-repository";
import { formatMonthLabel } from "@/lib/utils/date";
import { getSearchParamValue } from "@/lib/utils/search";
import type { CategoryType } from "@/types/category";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default async function HistoryPage({ searchParams }: PageProps) {
  const month = await resolveMonth(getSearchParamValue(searchParams?.month));
  const q = getSearchParamValue(searchParams?.q)?.trim();
  const typeValue = getSearchParamValue(searchParams?.type);
  const type = typeValue === "expense" || typeValue === "income" ? (typeValue as CategoryType) : undefined;
  const categoryId = getSearchParamValue(searchParams?.categoryId);

  const [categories, transactions] = await Promise.all([
    getCategories(),
    listEnrichedTransactions({
      month,
      q,
      type,
      categoryId: categoryId || undefined
    })
  ]);

  return (
    <div className="space-y-5">
      <MonthFilterForm
        action="/history"
        description="월별 거래내역을 검색하고 수정하거나 삭제할 수 있습니다."
        month={month}
        title={`${formatMonthLabel(month)} 내역 조회`}
      />

      <HistoryManager
        categories={categories}
        filters={{
          month,
          q,
          type,
          categoryId: categoryId || undefined
        }}
        transactions={transactions}
      />
    </div>
  );
}
