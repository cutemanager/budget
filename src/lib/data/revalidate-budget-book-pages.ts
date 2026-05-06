import { revalidatePath } from "next/cache";

export function revalidateBudgetBookPages() {
  revalidatePath("/");
  revalidatePath("/history");
  revalidatePath("/quick-entry");
  revalidatePath("/budgets");
}
