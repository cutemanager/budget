import type { PaymentMethod } from "@/types/transaction";

export type Settings = {
  currency: "KRW";
  defaultPaymentMethod: PaymentMethod;
  lastUsedCategoryId: string | null;
};
