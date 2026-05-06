function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function formatMonthValue(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}

export function formatDateValue(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function getCurrentMonth() {
  return formatMonthValue(new Date());
}

export function getTodayValue() {
  return formatDateValue(new Date());
}

export function isMonthString(value?: string | null): value is string {
  return Boolean(value && /^\d{4}-\d{2}$/.test(value));
}

export function isDateString(value?: string | null): value is string {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

export function formatMonthLabel(month: string) {
  const [year, monthNumber] = month.split("-");
  return `${year}년 ${Number(monthNumber)}월`;
}

export function formatDateLabel(dateString: string) {
  const date = new Date(`${dateString}T12:00:00`);

  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    weekday: "short"
  }).format(date);
}
