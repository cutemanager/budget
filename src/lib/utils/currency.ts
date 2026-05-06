const krwFormatter = new Intl.NumberFormat("ko-KR", {
  style: "currency",
  currency: "KRW",
  maximumFractionDigits: 0
});

const numberFormatter = new Intl.NumberFormat("ko-KR");

export function formatCurrency(value: number) {
  return krwFormatter.format(value);
}

export function formatNumber(value: number) {
  return numberFormatter.format(value);
}
