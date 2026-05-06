"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type SampleDataSeederProps = {
  title?: string;
  description?: string;
  buttonLabel?: string;
};

export function SampleDataSeeder({
  title = "테스트 데이터 넣기",
  description = "기본 카테고리, 이번 달 샘플 거래, 예산 데이터를 한 번에 채웁니다.",
  buttonLabel = "샘플 데이터 반영"
}: SampleDataSeederProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSeed() {
    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/setup/sample-data", {
        method: "POST"
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "샘플 데이터를 반영하지 못했습니다.");
        return;
      }

      setMessage(result.message ?? "샘플 데이터를 반영했습니다.");

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
        <h3 className="text-lg font-bold text-ink">{title}</h3>
        <p className="text-sm leading-6 text-ink/65">{description}</p>
      </div>

      <div className="mt-4 space-y-3">
        <button
          className="rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-ink transition hover:opacity-90 disabled:opacity-60"
          disabled={isPending || isSubmitting}
          onClick={handleSeed}
          type="button"
        >
          {buttonLabel}
        </button>

        {message ? <p className="text-sm font-medium text-mint">{message}</p> : null}
        {error ? <p className="text-sm font-medium text-rose">{error}</p> : null}
      </div>
    </section>
  );
}
