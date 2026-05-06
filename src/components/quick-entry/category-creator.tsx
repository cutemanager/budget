"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type { CategoryType } from "@/types/category";

const presetColors = ["#f97316", "#2563eb", "#e11d48", "#16a34a", "#7c3aed", "#0f766e"];

export function CategoryCreator() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [type, setType] = useState<CategoryType>("expense");
  const [name, setName] = useState("");
  const [color, setColor] = useState(presetColors[0]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          type,
          color
        })
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "카테고리를 저장하지 못했습니다.");
        return;
      }

      setName("");
      setMessage("카테고리를 추가했습니다.");
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
        <h3 className="text-lg font-bold text-ink">카테고리 추가</h3>
        <p className="text-sm text-ink/65">자주 쓰는 카테고리를 바로 추가해서 입력 흐름을 끊지 않게 만듭니다.</p>
      </div>

      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-ink">
            구분
            <select
              className="w-full rounded-2xl border border-black/10 bg-paper px-4 py-3 outline-none focus:border-accent"
              onChange={(event) => setType(event.target.value as CategoryType)}
              value={type}
            >
              <option value="expense">지출</option>
              <option value="income">수입</option>
            </select>
          </label>

          <label className="space-y-2 text-sm font-medium text-ink">
            이름
            <input
              className="w-full rounded-2xl border border-black/10 bg-paper px-4 py-3 outline-none focus:border-accent"
              onChange={(event) => setName(event.target.value)}
              placeholder="예: 반려동물"
              value={name}
            />
          </label>
        </div>

        <div className="space-y-2">
          <span className="text-sm font-medium text-ink">색상</span>
          <div className="flex flex-wrap gap-2">
            {presetColors.map((presetColor) => (
              <button
                aria-label={`색상 ${presetColor}`}
                className={`h-10 w-10 rounded-full border-2 ${
                  color === presetColor ? "border-ink" : "border-white"
                }`}
                key={presetColor}
                onClick={() => setColor(presetColor)}
                style={{ backgroundColor: presetColor }}
                type="button"
              />
            ))}
          </div>
        </div>

        {message ? <p className="text-sm font-medium text-mint">{message}</p> : null}
        {error ? <p className="text-sm font-medium text-rose">{error}</p> : null}

        <button
          className="rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-paper transition hover:bg-clay disabled:opacity-60"
          disabled={isPending || isSubmitting}
          type="submit"
        >
          카테고리 저장
        </button>
      </form>
    </section>
  );
}
