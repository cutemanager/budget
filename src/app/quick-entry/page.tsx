import { SampleDataSeeder } from "@/components/common/sample-data-seeder";
import { SupabaseConfigNotice } from "@/components/common/supabase-config-notice";
import { RecentTransactionList } from "@/components/dashboard/recent-transaction-list";
import { CategoryCreator } from "@/components/quick-entry/category-creator";
import { QuickEntryForm } from "@/components/quick-entry/quick-entry-form";
import { getCategories } from "@/lib/data/categories-repository";
import { getSettings } from "@/lib/data/settings-repository";
import { listEnrichedTransactions } from "@/lib/data/transactions-repository";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getTodayValue } from "@/lib/utils/date";

export const dynamic = "force-dynamic";

export default async function QuickEntryPage() {
  if (!isSupabaseConfigured()) {
    return <SupabaseConfigNotice title="Supabase 연결이 필요합니다." />;
  }

  const today = getTodayValue();
  const month = today.slice(0, 7);

  const [categories, settings, recentTransactions] = await Promise.all([
    getCategories(),
    getSettings(),
    listEnrichedTransactions({ month })
  ]);

  return (
    <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-5">
        <QuickEntryForm
          categories={categories}
          defaultPaymentMethod={settings.defaultPaymentMethod}
          lastUsedCategoryId={settings.lastUsedCategoryId}
          today={today}
        />

        <RecentTransactionList transactions={recentTransactions.slice(0, 6)} />
      </div>

      <div className="space-y-5">
        <SampleDataSeeder />
        <CategoryCreator />

        <section className="rounded-4xl border border-white/70 bg-white/80 p-5 shadow-soft">
          <h3 className="text-lg font-bold text-ink">입력 팁</h3>
          <div className="mt-4 space-y-3 text-sm leading-6 text-ink/70">
            <p>금액을 먼저 적고 카테고리만 선택하면 메모 없이도 바로 저장할 수 있습니다.</p>
            <p>저장 후 아래 최근 거래 목록이 새로고침되므로, 입력이 반영됐는지 같은 화면에서 바로 확인할 수 있습니다.</p>
            <p>카테고리가 비어 있거나 테스트가 필요하면 샘플 데이터 버튼으로 기본 데이터를 먼저 채워 주세요.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
