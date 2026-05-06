"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { formatCurrency } from "@/lib/utils/currency";
import { formatDateLabel } from "@/lib/utils/date";
import type { Category, CategoryType } from "@/types/category";
import type { EnrichedTransaction, PaymentMethod } from "@/types/transaction";

type Filters = {
  month: string;
  q?: string;
  type?: CategoryType | "";
  categoryId?: string;
};

type HistoryManagerProps = {
  categories: Category[];
  filters: Filters;
  transactions: EnrichedTransaction[];
};

type EditState = {
  id: string;
  type: CategoryType;
  amount: string;
  categoryId: string;
  paymentMethod: PaymentMethod;
  memo: string;
  transactionDate: string;
};

function buildQuery(filters: Filters) {
  const params = new URLSearchParams();
  params.set("month", filters.month);

  if (filters.q) {
    params.set("q", filters.q);
  }

  if (filters.type) {
    params.set("type", filters.type);
  }

  if (filters.categoryId) {
    params.set("categoryId", filters.categoryId);
  }

  return params.toString();
}

export function HistoryManager({ categories, filters, transactions }: HistoryManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [month, setMonth] = useState(filters.month);
  const [q, setQ] = useState(filters.q ?? "");
  const [type, setType] = useState<Filters["type"]>(filters.type ?? "");
  const [categoryId, setCategoryId] = useState(filters.categoryId ?? "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<EditState | null>(null);

  useEffect(() => {
    setMonth(filters.month);
    setQ(filters.q ?? "");
    setType(filters.type ?? "");
    setCategoryId(filters.categoryId ?? "");
  }, [filters.categoryId, filters.month, filters.q, filters.type]);

  const visibleCategories = categories.filter((category) => !type || category.type === type);
  const editCategories = categories.filter((category) => category.type === editing?.type);

  function applyFilters() {
    router.push(`/history?${buildQuery({ month, q, type, categoryId })}`);
  }

  function openEdit(transaction: EnrichedTransaction) {
    setMessage("");
    setError("");
    setEditing({
      id: transaction.id,
      type: transaction.type,
      amount: String(transaction.amount),
      categoryId: transaction.categoryId,
      paymentMethod: transaction.paymentMethod,
      memo: transaction.memo,
      transactionDate: transaction.transactionDate
    });
  }

  async function handleDelete(id: string) {
    setMessage("");
    setError("");

    if (!window.confirm("이 거래내역을 삭제할까요?")) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const result = await response.json();
        setError(result.error ?? "삭제하지 못했습니다.");
        return;
      }

      setMessage("거래내역을 삭제했습니다.");
      startTransition(() => {
        router.refresh();
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleEditSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editing) {
      return;
    }

    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/transactions/${editing.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: editing.type,
          amount: Number(editing.amount),
          categoryId: editing.categoryId,
          paymentMethod: editing.paymentMethod,
          memo: editing.memo,
          transactionDate: editing.transactionDate
        })
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "수정하지 못했습니다.");
        return;
      }

      setEditing(null);
      setMessage("거래내역을 수정했습니다.");
      startTransition(() => {
        router.refresh();
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-5">
      <section className="rounded-4xl border border-white/70 bg-white/80 p-5 shadow-soft">
        <div className="flex flex-col gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-ink">내역 필터</h2>
            <p className="text-sm text-ink/65">월, 타입, 카테고리, 메모 검색어로 거래내역을 좁혀 볼 수 있습니다.</p>
          </div>

          <div className="grid gap-3 md:grid-cols-4">
            <label className="space-y-2 text-sm font-medium text-ink">
              월
              <input
                className="w-full rounded-2xl border border-black/10 bg-paper px-4 py-3 outline-none focus:border-accent"
                onChange={(event) => setMonth(event.target.value)}
                type="month"
                value={month}
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-ink">
              타입
              <select
                className="w-full rounded-2xl border border-black/10 bg-paper px-4 py-3 outline-none focus:border-accent"
                onChange={(event) => {
                  setType(event.target.value as Filters["type"]);
                  setCategoryId("");
                }}
                value={type}
              >
                <option value="">전체</option>
                <option value="expense">지출</option>
                <option value="income">수입</option>
              </select>
            </label>

            <label className="space-y-2 text-sm font-medium text-ink">
              카테고리
              <select
                className="w-full rounded-2xl border border-black/10 bg-paper px-4 py-3 outline-none focus:border-accent"
                onChange={(event) => setCategoryId(event.target.value)}
                value={categoryId}
              >
                <option value="">전체</option>
                {visibleCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm font-medium text-ink">
              검색
              <input
                className="w-full rounded-2xl border border-black/10 bg-paper px-4 py-3 outline-none focus:border-accent"
                onChange={(event) => setQ(event.target.value)}
                placeholder="메모 검색"
                value={q}
              />
            </label>
          </div>

          <div className="flex justify-end">
            <button
              className="rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-paper transition hover:bg-clay"
              onClick={applyFilters}
              type="button"
            >
              필터 적용
            </button>
          </div>
        </div>
      </section>

      {message ? <p className="text-sm font-semibold text-mint">{message}</p> : null}
      {error ? <p className="text-sm font-semibold text-rose">{error}</p> : null}

      <section className="rounded-4xl border border-white/70 bg-white/80 p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-ink">거래내역</h2>
          <span className="text-sm text-ink/50">{transactions.length}건</span>
        </div>

        {transactions.length === 0 ? (
          <p className="mt-4 text-sm text-ink/60">조건에 맞는 거래내역이 없습니다.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-black/10 text-xs uppercase tracking-[0.15em] text-ink/45">
                  <th className="px-3 py-3">날짜</th>
                  <th className="px-3 py-3">구분</th>
                  <th className="px-3 py-3">카테고리</th>
                  <th className="px-3 py-3">결제수단</th>
                  <th className="px-3 py-3">메모</th>
                  <th className="px-3 py-3">금액</th>
                  <th className="px-3 py-3 text-right">관리</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr className="border-b border-black/5 last:border-b-0" key={transaction.id}>
                    <td className="px-3 py-4 text-sm text-ink/70">{formatDateLabel(transaction.transactionDate)}</td>
                    <td className="px-3 py-4 text-sm font-semibold text-ink">
                      {transaction.type === "expense" ? "지출" : "수입"}
                    </td>
                    <td className="px-3 py-4 text-sm text-ink">{transaction.categoryName}</td>
                    <td className="px-3 py-4 text-sm text-ink/70">{transaction.paymentMethod}</td>
                    <td className="px-3 py-4 text-sm text-ink/70">{transaction.memo || "-"}</td>
                    <td className="px-3 py-4 text-sm font-bold text-ink">
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          className="rounded-full border border-black/10 px-3 py-2 text-xs font-semibold text-ink transition hover:border-accent"
                          onClick={() => openEdit(transaction)}
                          type="button"
                        >
                          수정
                        </button>
                        <button
                          className="rounded-full border border-rose/20 px-3 py-2 text-xs font-semibold text-rose transition hover:bg-rose/10"
                          onClick={() => handleDelete(transaction.id)}
                          type="button"
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {editing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/35 p-4">
          <div className="w-full max-w-2xl rounded-4xl bg-paper p-6 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-ink">거래내역 수정</h3>
                <p className="mt-1 text-sm text-ink/65">수정 후 저장하면 목록이 바로 갱신됩니다.</p>
              </div>
              <button
                className="rounded-full border border-black/10 px-3 py-2 text-xs font-semibold text-ink"
                onClick={() => setEditing(null)}
                type="button"
              >
                닫기
              </button>
            </div>

            <form className="mt-5 space-y-4" onSubmit={handleEditSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-ink">
                  구분
                  <select
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-accent"
                    onChange={(event) =>
                      setEditing((current) =>
                        current
                          ? {
                              ...current,
                              type: event.target.value as CategoryType,
                              categoryId:
                                categories.find((category) => category.type === event.target.value)?.id ?? current.categoryId
                            }
                          : current
                      )
                    }
                    value={editing.type}
                  >
                    <option value="expense">지출</option>
                    <option value="income">수입</option>
                  </select>
                </label>

                <label className="space-y-2 text-sm font-medium text-ink">
                  금액
                  <input
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-accent"
                    onChange={(event) =>
                      setEditing((current) => (current ? { ...current, amount: event.target.value } : current))
                    }
                    type="number"
                    value={editing.amount}
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-ink">
                  카테고리
                  <select
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-accent"
                    onChange={(event) =>
                      setEditing((current) => (current ? { ...current, categoryId: event.target.value } : current))
                    }
                    value={editing.categoryId}
                  >
                    {editCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 text-sm font-medium text-ink">
                  결제수단
                  <select
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-accent"
                    onChange={(event) =>
                      setEditing((current) =>
                        current ? { ...current, paymentMethod: event.target.value as PaymentMethod } : current
                      )
                    }
                    value={editing.paymentMethod}
                  >
                    <option value="card">카드</option>
                    <option value="cash">현금</option>
                    <option value="bank">계좌이체</option>
                    <option value="other">기타</option>
                  </select>
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-ink">
                  날짜
                  <input
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-accent"
                    onChange={(event) =>
                      setEditing((current) =>
                        current ? { ...current, transactionDate: event.target.value } : current
                      )
                    }
                    type="date"
                    value={editing.transactionDate}
                  />
                </label>

                <label className="space-y-2 text-sm font-medium text-ink">
                  메모
                  <input
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-accent"
                    onChange={(event) =>
                      setEditing((current) => (current ? { ...current, memo: event.target.value } : current))
                    }
                    value={editing.memo}
                  />
                </label>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  className="rounded-2xl border border-black/10 px-4 py-3 text-sm font-semibold text-ink"
                  onClick={() => setEditing(null)}
                  type="button"
                >
                  취소
                </button>
                <button
                  className="rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-paper transition hover:bg-clay disabled:opacity-60"
                  disabled={isPending || isSubmitting}
                  type="submit"
                >
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
