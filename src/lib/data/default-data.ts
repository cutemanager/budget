import { formatDateValue, formatMonthValue } from "@/lib/utils/date";
import type { Database } from "@/types/database";

type CategoryInsert = Database["public"]["Tables"]["categories"]["Insert"];
type TransactionInsert = Database["public"]["Tables"]["transactions"]["Insert"];
type BudgetInsert = Database["public"]["Tables"]["budgets"]["Insert"];

export const DEFAULT_CATEGORIES: CategoryInsert[] = [
  {
    id: "cat-exp-food",
    name: "식비",
    type: "expense",
    color: "#f97316",
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "cat-exp-transport",
    name: "교통",
    type: "expense",
    color: "#2563eb",
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "cat-exp-cafe",
    name: "카페·간식",
    type: "expense",
    color: "#f59e0b",
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "cat-exp-shopping",
    name: "쇼핑",
    type: "expense",
    color: "#e11d48",
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "cat-exp-home",
    name: "주거",
    type: "expense",
    color: "#7c3aed",
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "cat-exp-bills",
    name: "공과금",
    type: "expense",
    color: "#0f766e",
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "cat-exp-phone",
    name: "통신",
    type: "expense",
    color: "#4f46e5",
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "cat-exp-health",
    name: "의료",
    type: "expense",
    color: "#059669",
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "cat-exp-hobby",
    name: "취미",
    type: "expense",
    color: "#db2777",
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "cat-exp-other",
    name: "기타 지출",
    type: "expense",
    color: "#6b7280",
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "cat-inc-salary",
    name: "급여",
    type: "income",
    color: "#16a34a",
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "cat-inc-side",
    name: "부수입",
    type: "income",
    color: "#15803d",
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "cat-inc-gift",
    name: "용돈",
    type: "income",
    color: "#65a30d",
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "cat-inc-other",
    name: "기타 수입",
    type: "income",
    color: "#22c55e",
    created_at: "2026-01-01T00:00:00.000Z"
  }
];

function toIsoDate(year: number, monthIndex: number, day: number, hour = 0, minute = 0) {
  return new Date(year, monthIndex, day, hour, minute).toISOString();
}

function toDateValue(year: number, monthIndex: number, day: number) {
  return formatDateValue(new Date(year, monthIndex, day));
}

export function buildSampleBudgetData(baseDate = new Date()) {
  const year = baseDate.getFullYear();
  const monthIndex = baseDate.getMonth();
  const month = formatMonthValue(new Date(year, monthIndex, 1));
  const prefix = month.replace("-", "");

  const transactions: TransactionInsert[] = [
    {
      id: `txn-sample-${prefix}-001`,
      type: "expense",
      amount: 650000,
      category_id: "cat-exp-home",
      payment_method: "bank",
      memo: "월세",
      transaction_date: toDateValue(year, monthIndex, 1),
      created_at: toIsoDate(year, monthIndex, 1, 9, 0)
    },
    {
      id: `txn-sample-${prefix}-002`,
      type: "expense",
      amount: 12000,
      category_id: "cat-exp-food",
      payment_method: "card",
      memo: "점심",
      transaction_date: toDateValue(year, monthIndex, 2),
      created_at: toIsoDate(year, monthIndex, 2, 12, 10)
    },
    {
      id: `txn-sample-${prefix}-003`,
      type: "expense",
      amount: 47000,
      category_id: "cat-exp-transport",
      payment_method: "card",
      memo: "교통카드 충전",
      transaction_date: toDateValue(year, monthIndex, 3),
      created_at: toIsoDate(year, monthIndex, 3, 8, 20)
    },
    {
      id: `txn-sample-${prefix}-004`,
      type: "expense",
      amount: 6500,
      category_id: "cat-exp-cafe",
      payment_method: "card",
      memo: "아메리카노",
      transaction_date: toDateValue(year, monthIndex, 4),
      created_at: toIsoDate(year, monthIndex, 4, 15, 30)
    },
    {
      id: `txn-sample-${prefix}-005`,
      type: "income",
      amount: 3200000,
      category_id: "cat-inc-salary",
      payment_method: "bank",
      memo: "월급",
      transaction_date: toDateValue(year, monthIndex, 5),
      created_at: toIsoDate(year, monthIndex, 5, 10, 0)
    },
    {
      id: `txn-sample-${prefix}-006`,
      type: "expense",
      amount: 38000,
      category_id: "cat-exp-food",
      payment_method: "card",
      memo: "저녁 식사",
      transaction_date: toDateValue(year, monthIndex, 8),
      created_at: toIsoDate(year, monthIndex, 8, 19, 5)
    },
    {
      id: `txn-sample-${prefix}-007`,
      type: "expense",
      amount: 74000,
      category_id: "cat-exp-bills",
      payment_method: "bank",
      memo: "전기·가스",
      transaction_date: toDateValue(year, monthIndex, 10),
      created_at: toIsoDate(year, monthIndex, 10, 9, 15)
    },
    {
      id: `txn-sample-${prefix}-008`,
      type: "expense",
      amount: 89000,
      category_id: "cat-exp-shopping",
      payment_method: "card",
      memo: "생활용품",
      transaction_date: toDateValue(year, monthIndex, 11),
      created_at: toIsoDate(year, monthIndex, 11, 18, 45)
    },
    {
      id: `txn-sample-${prefix}-009`,
      type: "expense",
      amount: 55000,
      category_id: "cat-exp-phone",
      payment_method: "bank",
      memo: "휴대폰 요금",
      transaction_date: toDateValue(year, monthIndex, 12),
      created_at: toIsoDate(year, monthIndex, 12, 9, 10)
    },
    {
      id: `txn-sample-${prefix}-010`,
      type: "income",
      amount: 180000,
      category_id: "cat-inc-side",
      payment_method: "bank",
      memo: "사이드 프로젝트",
      transaction_date: toDateValue(year, monthIndex, 15),
      created_at: toIsoDate(year, monthIndex, 15, 20, 0)
    },
    {
      id: `txn-sample-${prefix}-011`,
      type: "expense",
      amount: 30000,
      category_id: "cat-exp-health",
      payment_method: "card",
      memo: "약국",
      transaction_date: toDateValue(year, monthIndex, 18),
      created_at: toIsoDate(year, monthIndex, 18, 13, 25)
    },
    {
      id: `txn-sample-${prefix}-012`,
      type: "expense",
      amount: 42000,
      category_id: "cat-exp-hobby",
      payment_method: "card",
      memo: "책 구매",
      transaction_date: toDateValue(year, monthIndex, 22),
      created_at: toIsoDate(year, monthIndex, 22, 17, 5)
    }
  ];

  const budgets: BudgetInsert[] = [
    {
      id: `budget-sample-${prefix}-total`,
      month,
      category_id: null,
      amount: 1500000,
      created_at: toIsoDate(year, monthIndex, 1)
    },
    {
      id: `budget-sample-${prefix}-food`,
      month,
      category_id: "cat-exp-food",
      amount: 400000,
      created_at: toIsoDate(year, monthIndex, 1)
    },
    {
      id: `budget-sample-${prefix}-transport`,
      month,
      category_id: "cat-exp-transport",
      amount: 100000,
      created_at: toIsoDate(year, monthIndex, 1)
    },
    {
      id: `budget-sample-${prefix}-shopping`,
      month,
      category_id: "cat-exp-shopping",
      amount: 180000,
      created_at: toIsoDate(year, monthIndex, 1)
    },
    {
      id: `budget-sample-${prefix}-cafe`,
      month,
      category_id: "cat-exp-cafe",
      amount: 80000,
      created_at: toIsoDate(year, monthIndex, 1)
    },
    {
      id: `budget-sample-${prefix}-hobby`,
      month,
      category_id: "cat-exp-hobby",
      amount: 90000,
      created_at: toIsoDate(year, monthIndex, 1)
    }
  ];

  return {
    month,
    categories: DEFAULT_CATEGORIES,
    transactions,
    budgets
  };
}
