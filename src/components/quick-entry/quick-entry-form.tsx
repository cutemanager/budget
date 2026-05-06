"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import type { Category, CategoryType } from "@/types/category";
import type { PaymentMethod } from "@/types/transaction";

type QuickEntryFormProps = {
  categories: Category[];
  defaultPaymentMethod: PaymentMethod;
  lastUsedCategoryId: string | null;
  today: string;
};

type FormState = {
  type: CategoryType;
  amount: string;
  categoryId: string;
  paymentMethod: PaymentMethod;
  memo: string;
  transactionDate: string;
};

function pickDefaultCategory(type: CategoryType, categories: Category[], preferredId?: string | null) {
  const filtered = categories.filter((category) => category.type === type);
  const preferred = filtered.find((category) => category.id === preferredId);
  return preferred?.id ?? filtered[0]?.id ?? "";
}

export function QuickEntryForm({
  categories,
  defaultPaymentMethod,
  lastUsedCategoryId,
  today
}: QuickEntryFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormState>(() => ({
    type: "expense",
    amount: "",
    categoryId: pickDefaultCategory("expense", categories, lastUsedCategoryId),
    paymentMethod: defaultPaymentMethod,
    memo: "",
    transactionDate: today
  }));

  const visibleCategories = categories.filter((category) => category.type === form.type);

  useEffect(() => {
    const exists = visibleCategories.some((category) => category.id === form.categoryId);

    if (!exists) {
      setForm((current) => ({
        ...current,
        categoryId: pickDefaultCategory(current.type, categories, lastUsedCategoryId)
      }));
    }
  }, [categories, form.categoryId, form.type, lastUsedCategoryId, visibleCategories]);

  function updateField<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((current) => ({
      ...current,
      [key]: value
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount)
        })
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "거래내역을 저장하지 못했습니다.");
        return;
      }

      setMessage("저장되었습니다. 바로 다음 입력을 이어갈 수 있어요.");
      setForm((current) => ({
        ...current,
        amount: "",
        memo: "",
        categoryId: pickDefaultCategory(current.type, categories, result.categoryId ?? current.categoryId)
      }));

      startTransition(() => {
        router.refresh();
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="rounded-4xl border border-white/70 bg-white/80 p-5 shadow-soft">
      <div className="space-y-1">
        <h2 className="text-xl font-black text-ink">빠른 입력</h2>
        <p className="text-sm text-ink/65">숫자를 먼저 넣고 바로 저장할 수 있게 입력 흐름을 짧게 설계했습니다.</p>
      </div>

      <form className="mt-5 space-y-5" onSubmit={handleSubmit}>
        <div className="flex gap-2 rounded-3xl bg-sand p-1">
          {(["expense", "income"] as const).map((type) => (
            <button
              className={`flex-1 rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                form.type === type ? "bg-ink text-paper" : "text-ink/65"
              }`}
              key={type}
              onClick={() => updateField("type", type)}
              type="button"
            >
              {type === "expense" ? "지출" : "수입"}
            </button>
          ))}
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-ink">금액</span>
          <input
            autoFocus
            className="w-full rounded-3xl border border-black/10 bg-paper px-5 py-4 text-2xl font-black tracking-tight text-ink outline-none focus:border-accent"
            inputMode="numeric"
            min="0"
            onChange={(event) => updateField("amount", event.target.value)}
            placeholder="0"
            type="number"
            value={form.amount}
          />
        </label>

        <div className="space-y-2">
          <span className="text-sm font-medium text-ink">카테고리</span>
          <div className="flex flex-wrap gap-2">
            {visibleCategories.map((category) => (
              <button
                className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${
                  form.categoryId === category.id
                    ? "border-transparent bg-ink text-paper"
                    : "border-black/10 bg-white text-ink/75 hover:border-accent"
                }`}
                key={category.id}
                onClick={() => updateField("categoryId", category.id)}
                type="button"
              >
                {category.name}
              </button>
            ))}
          </div>
          <select
            className="w-full rounded-2xl border border-black/10 bg-paper px-4 py-3 text-sm outline-none focus:border-accent"
            onChange={(event) => updateField("categoryId", event.target.value)}
            value={form.categoryId}
          >
            {visibleCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">날짜</span>
            <input
              className="w-full rounded-2xl border border-black/10 bg-paper px-4 py-3 outline-none focus:border-accent"
              onChange={(event) => updateField("transactionDate", event.target.value)}
              type="date"
              value={form.transactionDate}
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">결제수단</span>
            <select
              className="w-full rounded-2xl border border-black/10 bg-paper px-4 py-3 outline-none focus:border-accent"
              onChange={(event) => updateField("paymentMethod", event.target.value as PaymentMethod)}
              value={form.paymentMethod}
            >
              <option value="card">카드</option>
              <option value="cash">현금</option>
              <option value="bank">계좌이체</option>
              <option value="other">기타</option>
            </select>
          </label>
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-ink">메모</span>
          <input
            className="w-full rounded-2xl border border-black/10 bg-paper px-4 py-3 outline-none focus:border-accent"
            onChange={(event) => updateField("memo", event.target.value)}
            placeholder="예: 점심, 월세, 프리랜서 작업"
            value={form.memo}
          />
        </label>

        {message ? <p className="text-sm font-medium text-mint">{message}</p> : null}
        {error ? <p className="text-sm font-medium text-rose">{error}</p> : null}

        <button
          className="w-full rounded-3xl bg-ink px-5 py-4 text-sm font-semibold text-paper transition hover:bg-clay disabled:opacity-60"
          disabled={isPending || isSubmitting}
          type="submit"
        >
          저장하고 계속 입력
        </button>
      </form>
    </section>
  );
}
