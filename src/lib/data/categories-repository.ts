import { dataFiles, generateId, readJsonFile, writeJsonFile } from "@/lib/data/file-db";
import type { Category, CategoryType } from "@/types/category";

const fallback: Category[] = [];

export async function getCategories(type?: CategoryType) {
  const categories = await readJsonFile<Category[]>(dataFiles.categories, fallback);

  return type ? categories.filter((category) => category.type === type) : categories;
}

export async function getCategoryMap() {
  const categories = await getCategories();
  return new Map(categories.map((category) => [category.id, category]));
}

export async function createCategory(input: Pick<Category, "name" | "type" | "color">) {
  const categories = await getCategories();
  const normalizedName = input.name.trim().toLowerCase();
  const duplicate = categories.find(
    (category) => category.type === input.type && category.name.trim().toLowerCase() === normalizedName
  );

  if (duplicate) {
    throw new Error("같은 이름의 카테고리가 이미 있습니다.");
  }

  const nextCategory: Category = {
    id: generateId("cat"),
    name: input.name.trim(),
    type: input.type,
    color: input.color,
    createdAt: new Date().toISOString()
  };

  const nextCategories = [...categories, nextCategory];
  await writeJsonFile(dataFiles.categories, nextCategories);

  return nextCategory;
}
