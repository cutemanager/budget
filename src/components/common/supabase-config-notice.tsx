import { SUPABASE_ENV_ERROR_MESSAGE } from "@/lib/supabase/config";

type SupabaseConfigNoticeProps = {
  title: string;
};

export function SupabaseConfigNotice({ title }: SupabaseConfigNoticeProps) {
  return (
    <section className="rounded-4xl border border-rose/20 bg-white/80 p-6 shadow-soft">
      <div className="space-y-3">
        <h2 className="text-2xl font-black text-ink">{title}</h2>
        <p className="text-sm leading-6 text-ink/70">{SUPABASE_ENV_ERROR_MESSAGE}</p>
        <div className="rounded-3xl bg-sand/60 p-4 text-sm leading-6 text-ink/75">
          <p>1. 프로젝트 루트의 `.env.example`을 참고해 `.env.local`을 만듭니다.</p>
          <p>2. Supabase SQL Editor에서 `supabase/schema.sql`을 실행합니다.</p>
          <p>3. 샘플 데이터가 필요하면 `supabase/seed.sql`도 이어서 실행합니다.</p>
        </div>
      </div>
    </section>
  );
}
