import { mapSettingsRow } from "@/lib/data/supabase-mappers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Settings } from "@/types/settings";

const fallback: Settings = {
  currency: "KRW",
  defaultPaymentMethod: "card",
  lastUsedCategoryId: null
};

export async function getSettings() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from("app_settings").select("*").eq("id", "global").maybeSingle();

  if (error) {
    throw new Error(`설정 정보를 불러오지 못했습니다. ${error.message}`);
  }

  if (data) {
    return mapSettingsRow(data);
  }

  const { data: inserted, error: insertError } = await supabase
    .from("app_settings")
    .insert({
      id: "global",
      currency: fallback.currency,
      default_payment_method: fallback.defaultPaymentMethod,
      last_used_category_id: fallback.lastUsedCategoryId
    })
    .select("*")
    .single();

  if (insertError) {
    throw new Error(`기본 설정을 만들지 못했습니다. ${insertError.message}`);
  }

  return mapSettingsRow(inserted);
}

export async function updateSettings(patch: Partial<Settings>) {
  const current = await getSettings();
  const supabase = createSupabaseServerClient();
  const next = { ...current, ...patch };

  const { data, error } = await supabase
    .from("app_settings")
    .update({
      currency: next.currency,
      default_payment_method: next.defaultPaymentMethod,
      last_used_category_id: next.lastUsedCategoryId,
      updated_at: new Date().toISOString()
    })
    .eq("id", "global")
    .select("*")
    .single();

  if (error) {
    throw new Error(`설정 정보를 저장하지 못했습니다. ${error.message}`);
  }

  return mapSettingsRow(data);
}
