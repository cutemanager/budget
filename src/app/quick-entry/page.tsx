import { SampleDataSeeder } from "@/components/common/sample-data-seeder";
import { SupabaseConfigNotice } from "@/components/common/supabase-config-notice";
import { CategoryCreator } from "@/components/quick-entry/category-creator";
import { QuickEntryForm } from "@/components/quick-entry/quick-entry-form";
import { getCategories } from "@/lib/data/categories-repository";
import { getSettings } from "@/lib/data/settings-repository";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getTodayValue } from "@/lib/utils/date";

export const dynamic = "force-dynamic";

export default async function QuickEntryPage() {
  if (!isSupabaseConfigured()) {
    return <SupabaseConfigNotice title="Supabase 연결이 필요합니다." />;
  }

  const [categories, settings] = await Promise.all([getCategories(), getSettings()]);

  return (
    <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
      <QuickEntryForm
        categories={categories}
        defaultPaymentMethod={settings.defaultPaymentMethod}
        lastUsedCategoryId={settings.lastUsedCategoryId}
        today={getTodayValue()}
      />

      <div className="space-y-5">
        <SampleDataSeeder />
        <CategoryCreator />

        <section className="rounded-4xl border border-white/70 bg-white/80 p-5 shadow-soft">
          <h3 className="text-lg font-bold text-ink">입력 팁</h3>
          <div className="mt-4 space-y-3 text-sm leading-6 text-ink/70">
            <p>금액을 먼저 적고 카테고리만 선택하면 메모 없이도 바로 저장할 수 있습니다.</p>
            <p>방금 쓴 결제 수단과 최근 카테고리는 다음 입력에서 기본값으로 이어집니다.</p>
            <p>테스트가 필요하면 위의 샘플 데이터 버튼으로 기본 데이터부터 한 번에 채울 수 있습니다.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
