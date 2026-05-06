type MonthFilterFormProps = {
  action: string;
  month: string;
  title: string;
  description: string;
};

export function MonthFilterForm({ action, month, title, description }: MonthFilterFormProps) {
  return (
    <section className="rounded-4xl border border-white/70 bg-white/75 p-5 shadow-soft backdrop-blur">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-ink">{title}</h2>
          <p className="text-sm text-ink/65">{description}</p>
        </div>

        <form action={action} className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="text-sm font-semibold text-ink" htmlFor={`${action}-month`}>
            기준 월
          </label>
          <input
            className="rounded-2xl border border-black/10 bg-paper px-4 py-2 text-sm text-ink outline-none ring-0 transition focus:border-accent"
            defaultValue={month}
            id={`${action}-month`}
            name="month"
            type="month"
          />
          <button
            className="rounded-2xl bg-ink px-4 py-2 text-sm font-semibold text-paper transition hover:bg-clay"
            type="submit"
          >
            적용
          </button>
        </form>
      </div>
    </section>
  );
}
