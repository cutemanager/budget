import { z } from "zod";

const monthRegex = /^\d{4}-\d{2}$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const categorySchema = z.object({
  name: z.string().trim().min(1, "카테고리명을 입력해 주세요.").max(20, "카테고리명은 20자 이하로 입력해 주세요."),
  type: z.enum(["income", "expense"]),
  color: z
    .string()
    .trim()
    .regex(/^#[a-fA-F0-9]{6}$/, "색상은 HEX 형식이어야 합니다.")
});

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.coerce.number().int().positive("금액은 0보다 커야 합니다.").max(1_000_000_000),
  categoryId: z.string().trim().min(1, "카테고리를 선택해 주세요."),
  paymentMethod: z.enum(["card", "cash", "bank", "other"]),
  memo: z.string().trim().max(80, "메모는 80자 이하로 입력해 주세요.").default(""),
  transactionDate: z.string().regex(dateRegex, "날짜 형식이 올바르지 않습니다.")
});

export const transactionUpdateSchema = transactionSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: "수정할 값이 없습니다."
});

export const budgetEntrySchema = z.object({
  categoryId: z.string().trim().min(1).nullable(),
  amount: z.coerce.number().min(0).max(1_000_000_000)
});

export const budgetBatchSchema = z.object({
  month: z.string().regex(monthRegex, "월 형식이 올바르지 않습니다."),
  entries: z.array(budgetEntrySchema).min(1)
});
