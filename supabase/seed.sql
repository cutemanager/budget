insert into public.categories (id, name, type, color, created_at) values
  ('cat-exp-food', '식비', 'expense', '#f97316', '2026-04-01T00:00:00.000Z'),
  ('cat-exp-transport', '교통', 'expense', '#2563eb', '2026-04-01T00:00:00.000Z'),
  ('cat-exp-cafe', '카페/간식', 'expense', '#f59e0b', '2026-04-01T00:00:00.000Z'),
  ('cat-exp-shopping', '쇼핑', 'expense', '#e11d48', '2026-04-01T00:00:00.000Z'),
  ('cat-exp-home', '주거', 'expense', '#7c3aed', '2026-04-01T00:00:00.000Z'),
  ('cat-exp-bills', '공과금', 'expense', '#0f766e', '2026-04-01T00:00:00.000Z'),
  ('cat-exp-phone', '통신', 'expense', '#4f46e5', '2026-04-01T00:00:00.000Z'),
  ('cat-exp-health', '의료', 'expense', '#059669', '2026-04-01T00:00:00.000Z'),
  ('cat-exp-hobby', '취미', 'expense', '#db2777', '2026-04-01T00:00:00.000Z'),
  ('cat-exp-other', '기타', 'expense', '#6b7280', '2026-04-01T00:00:00.000Z'),
  ('cat-inc-salary', '월급', 'income', '#16a34a', '2026-04-01T00:00:00.000Z'),
  ('cat-inc-side', '부수입', 'income', '#15803d', '2026-04-01T00:00:00.000Z'),
  ('cat-inc-gift', '용돈', 'income', '#65a30d', '2026-04-01T00:00:00.000Z'),
  ('cat-inc-other', '기타수입', 'income', '#22c55e', '2026-04-01T00:00:00.000Z')
on conflict (id) do update set
  name = excluded.name,
  type = excluded.type,
  color = excluded.color,
  created_at = excluded.created_at;

insert into public.transactions (
  id, type, amount, category_id, payment_method, memo, transaction_date, created_at
) values
  ('txn-001', 'expense', 12000, 'cat-exp-food', 'card', '점심', '2026-04-02', '2026-04-02T03:00:00.000Z'),
  ('txn-002', 'expense', 47000, 'cat-exp-transport', 'card', '교통카드 충전', '2026-04-03', '2026-04-03T03:00:00.000Z'),
  ('txn-003', 'expense', 6500, 'cat-exp-cafe', 'card', '아메리카노', '2026-04-04', '2026-04-04T02:30:00.000Z'),
  ('txn-004', 'income', 3200000, 'cat-inc-salary', 'bank', '급여', '2026-04-05', '2026-04-05T01:00:00.000Z'),
  ('txn-005', 'expense', 38000, 'cat-exp-food', 'card', '장보기', '2026-04-06', '2026-04-06T05:10:00.000Z'),
  ('txn-006', 'expense', 89000, 'cat-exp-shopping', 'card', '생필품', '2026-04-08', '2026-04-08T11:10:00.000Z'),
  ('txn-007', 'expense', 650000, 'cat-exp-home', 'bank', '월세', '2026-04-01', '2026-04-01T02:00:00.000Z'),
  ('txn-008', 'expense', 74000, 'cat-exp-bills', 'bank', '전기/가스', '2026-04-10', '2026-04-10T02:00:00.000Z'),
  ('txn-009', 'expense', 55000, 'cat-exp-phone', 'bank', '휴대폰 요금', '2026-04-11', '2026-04-11T02:00:00.000Z'),
  ('txn-010', 'expense', 42000, 'cat-exp-hobby', 'card', '책 구매', '2026-04-13', '2026-04-13T08:00:00.000Z'),
  ('txn-011', 'income', 180000, 'cat-inc-side', 'bank', '프리랜서 작업', '2026-04-15', '2026-04-15T07:30:00.000Z'),
  ('txn-012', 'expense', 30000, 'cat-exp-health', 'card', '약국', '2026-04-18', '2026-04-18T09:40:00.000Z')
on conflict (id) do update set
  type = excluded.type,
  amount = excluded.amount,
  category_id = excluded.category_id,
  payment_method = excluded.payment_method,
  memo = excluded.memo,
  transaction_date = excluded.transaction_date,
  created_at = excluded.created_at;

insert into public.budgets (id, month, category_id, amount, created_at) values
  ('budget-2026-04-total', '2026-04', null, 1500000, '2026-04-01T00:00:00.000Z'),
  ('budget-2026-04-food', '2026-04', 'cat-exp-food', 400000, '2026-04-01T00:00:00.000Z'),
  ('budget-2026-04-transport', '2026-04', 'cat-exp-transport', 80000, '2026-04-01T00:00:00.000Z'),
  ('budget-2026-04-shopping', '2026-04', 'cat-exp-shopping', 150000, '2026-04-01T00:00:00.000Z'),
  ('budget-2026-04-cafe', '2026-04', 'cat-exp-cafe', 70000, '2026-04-01T00:00:00.000Z'),
  ('budget-2026-04-hobby', '2026-04', 'cat-exp-hobby', 60000, '2026-04-01T00:00:00.000Z')
on conflict (id) do update set
  month = excluded.month,
  category_id = excluded.category_id,
  amount = excluded.amount,
  created_at = excluded.created_at;

insert into public.app_settings (id, currency, default_payment_method, last_used_category_id, updated_at) values
  ('global', 'KRW', 'card', 'cat-exp-food', timezone('utc', now()))
on conflict (id) do update set
  currency = excluded.currency,
  default_payment_method = excluded.default_payment_method,
  last_used_category_id = excluded.last_used_category_id,
  updated_at = timezone('utc', now());
