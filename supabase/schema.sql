create table if not exists public.categories (
  id text primary key,
  name text not null,
  type text not null check (type in ('income', 'expense')),
  color text not null check (color ~ '^#[A-Fa-f0-9]{6}$'),
  created_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists categories_type_name_unique_idx
  on public.categories (type, lower(name));

create table if not exists public.transactions (
  id text primary key,
  type text not null check (type in ('income', 'expense')),
  amount bigint not null check (amount > 0),
  category_id text not null references public.categories(id) on delete restrict,
  payment_method text not null check (payment_method in ('card', 'cash', 'bank', 'other')),
  memo text not null default '',
  transaction_date date not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists transactions_transaction_date_idx
  on public.transactions (transaction_date desc, created_at desc);

create index if not exists transactions_category_id_idx
  on public.transactions (category_id);

create table if not exists public.budgets (
  id text primary key,
  month text not null check (month ~ '^\d{4}-\d{2}$'),
  category_id text references public.categories(id) on delete cascade,
  amount bigint not null check (amount > 0),
  created_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists budgets_month_category_unique_idx
  on public.budgets (month, category_id)
  where category_id is not null;

create unique index if not exists budgets_month_total_unique_idx
  on public.budgets (month)
  where category_id is null;

create table if not exists public.app_settings (
  id text primary key,
  currency text not null default 'KRW',
  default_payment_method text not null default 'card'
    check (default_payment_method in ('card', 'cash', 'bank', 'other')),
  last_used_category_id text references public.categories(id) on delete set null,
  updated_at timestamptz not null default timezone('utc', now())
);

insert into public.app_settings (id, currency, default_payment_method, last_used_category_id)
values ('global', 'KRW', 'card', null)
on conflict (id) do nothing;
