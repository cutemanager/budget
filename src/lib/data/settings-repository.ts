import { dataFiles, readJsonFile, writeJsonFile } from "@/lib/data/file-db";
import type { Settings } from "@/types/settings";

const fallback: Settings = {
  currency: "KRW",
  defaultPaymentMethod: "card",
  lastUsedCategoryId: null
};

export async function getSettings() {
  return readJsonFile<Settings>(dataFiles.settings, fallback);
}

export async function updateSettings(patch: Partial<Settings>) {
  const current = await getSettings();
  const next = { ...current, ...patch };
  await writeJsonFile(dataFiles.settings, next);
  return next;
}
