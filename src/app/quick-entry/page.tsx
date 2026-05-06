import { CategoryCreator } from "@/components/quick-entry/category-creator";
import { QuickEntryForm } from "@/components/quick-entry/quick-entry-form";
import { getCategories } from "@/lib/data/categories-repository";
import { getSettings } from "@/lib/data/settings-repository";
import { getTodayValue } from "@/lib/utils/date";

export const dynamic = "force-dynamic";

export default async function QuickEntryPage() {
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
        <CategoryCreator />

        <section className="rounded-4xl border border-white/70 bg-white/80 p-5 shadow-soft">
          <h3 className="text-lg font-bold text-ink">입력 팁</h3>
          <div className="mt-4 space-y-3 text-sm leading-6 text-ink/70">
            <p>금액을 먼저 입력하고 카테고리만 고르면 메모 없이도 바로 저장할 수 있습니다.</p>
            <p>방금 쓴 결제수단과 최근 카테고리는 다음 입력에서 기본값으로 이어집니다.</p>
            <p>자주 쓰는 항목은 오른쪽 카테고리 추가 영역에서 바로 만들어 둘 수 있습니다.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
