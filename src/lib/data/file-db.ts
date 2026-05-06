import { promises as fs } from "fs";
import path from "path";

const dataDirectory = path.join(process.cwd(), "data");

export const dataFiles = {
  budgets: path.join(dataDirectory, "budgets.json"),
  categories: path.join(dataDirectory, "categories.json"),
  settings: path.join(dataDirectory, "settings.json"),
  transactions: path.join(dataDirectory, "transactions.json")
};

async function ensureFile<T>(filePath: string, fallback: T) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });

  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, JSON.stringify(fallback, null, 2), "utf8");
  }
}

export async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  await ensureFile(filePath, fallback);
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

export async function writeJsonFile<T>(filePath: string, value: T) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.tmp`;
  const json = JSON.stringify(value, null, 2);

  await fs.writeFile(tempPath, json, "utf8");
  await fs.copyFile(tempPath, filePath);
  await fs.unlink(tempPath);
}

export function generateId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
