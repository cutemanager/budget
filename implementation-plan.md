# 개인 가계부 웹사이트 구현 계획서

## 1. 구현 목표

이번 구현은 `Next.js + React`를 기반으로 하고, 데이터 저장은 우선 `JSON 파일`로 단순하게 시작합니다.

핵심 목표는 아래와 같습니다.

- 빠른 입력 기능을 가장 먼저 완성한다.
- 월별 대시보드와 예산 경고를 안정적으로 보여준다.
- 나중에 DB로 이전하기 쉽도록 데이터 접근 구조를 분리한다.

## 2. 구현 전제

초기 버전은 아래 전제로 설계합니다.

- 단일 사용자 개인용 MVP
- 서버에서 JSON 파일을 읽고 쓰는 방식
- 인증 기능은 후순위로 두고 먼저 핵심 흐름 완성
- 로컬 개발 또는 단일 서버 환경 기준

주의할 점:

- JSON 파일 저장은 간단하지만 동시 사용자가 많아지면 불리합니다.
- 배포 환경에 따라 서버 파일 쓰기가 제한될 수 있으므로 초기 MVP 용도로만 적합합니다.
- 그래서 데이터 접근 코드는 `lib` 계층으로 분리해 두고, 나중에 DB로 교체 가능하게 설계합니다.

## 3. 기술 스택

- 프레임워크: Next.js
- UI 라이브러리: React
- 언어: TypeScript
- 스타일: Tailwind CSS
- 차트: Recharts
- 데이터 저장: JSON 파일
- 서버 파일 접근: Node.js `fs/promises`
- 유효성 검사: Zod

## 4. 앱 구조 방향

Next.js는 `App Router` 기준으로 구성합니다.

추천 페이지:

- `/` : 월별 대시보드
- `/quick-entry` : 빠른 입력 페이지
- `/history` : 내역 조회 페이지
- `/budgets` : 예산 관리 페이지

추천 폴더 구조:

```text
src/
  app/
    page.tsx
    quick-entry/page.tsx
    history/page.tsx
    budgets/page.tsx
    api/
      dashboard/route.ts
      transactions/route.ts
      transactions/[id]/route.ts
      categories/route.ts
      budgets/route.ts
  components/
    dashboard/
    quick-entry/
    history/
    budgets/
    common/
  lib/
    data/
      file-db.ts
      categories-repository.ts
      transactions-repository.ts
      budgets-repository.ts
      dashboard-service.ts
    utils/
      currency.ts
      date.ts
      validators.ts
  types/
    category.ts
    transaction.ts
    budget.ts
data/
  categories.json
  transactions.json
  budgets.json
  settings.json
```

## 5. JSON 저장 구조

초기에는 파일을 엔티티별로 분리하는 방식이 관리하기 쉽습니다.

### `data/categories.json`

```json
[
  {
    "id": "cat_exp_food",
    "name": "식비",
    "type": "expense",
    "color": "#f97316",
    "createdAt": "2026-04-22T00:00:00.000Z"
  }
]
```

### `data/transactions.json`

```json
[
  {
    "id": "txn_001",
    "type": "expense",
    "amount": 15000,
    "categoryId": "cat_exp_food",
    "paymentMethod": "card",
    "memo": "점심",
    "transactionDate": "2026-04-22",
    "createdAt": "2026-04-22T03:00:00.000Z"
  }
]
```

### `data/budgets.json`

```json
[
  {
    "id": "budget_2026_04_total",
    "month": "2026-04",
    "categoryId": null,
    "amount": 1500000,
    "createdAt": "2026-04-22T00:00:00.000Z"
  }
]
```

### `data/settings.json`

```json
{
  "currency": "KRW",
  "defaultPaymentMethod": "card",
  "lastUsedCategoryId": "cat_exp_food"
}
```

## 6. 타입 설계

핵심 타입은 아래처럼 분리합니다.

### `Category`

- `id`
- `name`
- `type`
- `color`
- `createdAt`

### `Transaction`

- `id`
- `type`
- `amount`
- `categoryId`
- `paymentMethod`
- `memo`
- `transactionDate`
- `createdAt`

### `Budget`

- `id`
- `month`
- `categoryId | null`
- `amount`
- `createdAt`

### `DashboardSummary`

- `month`
- `totalIncome`
- `totalExpense`
- `balance`
- `categoryBreakdown`
- `dailyExpenses`
- `budgetAlerts`
- `recentTransactions`

## 7. 서버 구현 방식

JSON 파일 읽기/쓰기는 반드시 서버에서만 처리합니다.

구현 원칙:

- `fs/promises`는 `lib/data` 내부에서만 사용
- React 클라이언트 컴포넌트는 API 호출만 수행
- 파일 읽기/쓰기 로직은 페이지 컴포넌트에 직접 넣지 않음

핵심 유틸리티:

- `readJsonFile<T>(path)`
- `writeJsonFile<T>(path, data)`
- `generateId(prefix)`

안전한 저장 전략:

- 파일을 읽고 메모리에서 수정
- 검증 후 전체 파일 다시 저장
- 가능하면 임시 파일 저장 후 교체 방식 사용

## 8. API 설계

초기 구현은 Route Handler 기준으로 진행합니다.

### 거래내역

- `GET /api/transactions`
  - 월, 카테고리, 타입, 검색어 기준 목록 조회
- `POST /api/transactions`
  - 새 거래 등록
- `PATCH /api/transactions/[id]`
  - 거래 수정
- `DELETE /api/transactions/[id]`
  - 거래 삭제

### 카테고리

- `GET /api/categories`
  - 카테고리 목록 조회
- `POST /api/categories`
  - 카테고리 추가

### 예산

- `GET /api/budgets?month=2026-04`
  - 해당 월 예산 목록 조회
- `POST /api/budgets`
  - 월 전체 예산 또는 카테고리 예산 저장

### 대시보드

- `GET /api/dashboard?month=2026-04`
  - 월별 요약, 차트 데이터, 예산 경고 조회

## 9. React 컴포넌트 설계

### 대시보드

추천 컴포넌트:

- `SummaryCards`
- `ExpensePieChart`
- `DailyExpenseChart`
- `BudgetAlertList`
- `RecentTransactionList`
- `MonthSwitcher`

### 빠른 입력

추천 컴포넌트:

- `EntryTypeToggle`
- `AmountInput`
- `CategorySelector`
- `PaymentMethodSelect`
- `MemoInput`
- `QuickEntryForm`

### 내역 조회

추천 컴포넌트:

- `HistoryFilterBar`
- `TransactionTable`
- `TransactionEditDialog`
- `SearchInput`

### 예산 관리

추천 컴포넌트:

- `MonthlyBudgetCard`
- `CategoryBudgetList`
- `BudgetProgressBar`
- `BudgetForm`

## 10. 상태 관리 방향

초기 버전은 전역 상태 라이브러리 없이 진행해도 충분합니다.

추천 방식:

- 페이지 데이터는 서버 컴포넌트에서 조회
- 입력/필터 UI 상태는 클라이언트 컴포넌트에서 `useState`로 관리
- 폼 제출 후 `router.refresh()` 또는 재조회로 화면 갱신

나중에 상태가 복잡해지면 고려할 것:

- React Query
- Zustand

## 11. 핵심 로직 구현 순서

### 1단계: 프로젝트 기본 세팅

- Next.js 프로젝트 생성
- TypeScript 및 Tailwind 설정
- 기본 레이아웃 구성
- 공통 타입 파일 생성

### 2단계: JSON 저장소 계층 만들기

- `data/*.json` 파일 생성
- `lib/data/file-db.ts` 작성
- 읽기/쓰기 유틸리티 구현
- 카테고리/거래/예산 저장소 분리

### 3단계: 거래 입력 기능 구현

- 빠른 입력 페이지 UI 작성
- 거래 생성 API 작성
- 저장 후 폼 초기화 처리
- 최근 카테고리 기본 선택 처리

### 4단계: 내역 조회 기능 구현

- 월 필터
- 카테고리 필터
- 검색 기능
- 수정/삭제 API 연결

### 5단계: 대시보드 구현

- 월별 총수입/총지출/잔액 계산
- 카테고리 비율 계산
- 일별 지출 집계
- 최근 거래내역 표시

### 6단계: 예산 기능 구현

- 월 전체 예산 입력
- 카테고리별 예산 입력
- 사용률 계산
- 80% 이상, 100% 이상 경고 표시

### 7단계: 마감 다듬기

- 입력 오류 메시지 정리
- 빈 상태 화면 추가
- 모바일 UI 다듬기
- 데이터 포맷 통일

## 12. 화면별 구현 체크리스트

### 대시보드

- 선택한 월 기준으로 데이터가 바뀌는가
- 총수입, 총지출, 잔액이 정확한가
- 차트 데이터가 없는 경우 빈 상태를 보여주는가
- 예산 경고가 조건에 맞게 노출되는가

### 빠른 입력

- 금액 입력이 가장 먼저 보이는가
- 기본 날짜가 오늘로 들어가는가
- 저장 후 다음 입력이 쉬운가
- 필수값 누락 시 메시지가 명확한가

### 내역 조회

- 월별 필터가 동작하는가
- 검색과 카테고리 필터가 함께 동작하는가
- 수정 후 목록이 즉시 갱신되는가
- 삭제 전에 확인 절차가 있는가

### 예산 관리

- 월 예산과 카테고리 예산을 따로 저장할 수 있는가
- 사용률 퍼센트가 정확한가
- 80% 이상과 100% 이상 상태가 구분되는가

## 13. 추후 DB 이전을 위한 준비

나중에 Supabase나 PostgreSQL로 바꾸기 쉽게 하려면 아래 원칙을 지키는 것이 좋습니다.

- 페이지는 저장소 구현을 직접 알지 않게 한다.
- `repository` 함수만 통해 데이터에 접근한다.
- 타입과 검증 스키마를 파일 저장소와 분리한다.
- 계산 로직은 `dashboard-service.ts` 같은 서비스 계층에 둔다.

이렇게 하면 이후에는 `JSON repository`만 `DB repository`로 교체해도 대부분의 UI 코드는 유지할 수 있습니다.

## 14. 최종 구현 제안

이번 버전은 `빠르게 기록하고, 이번 달 소비를 보고, 예산 초과를 확인하는 것`에 집중하는 것이 가장 좋습니다.

구현 우선순위는 아래 순서가 가장 안정적입니다.

1. 빠른 입력
2. 내역 조회
3. 대시보드
4. 예산 관리

이 순서로 만들면 초반부터 실제로 사용할 수 있는 형태가 나오고, 이후 JSON 저장소를 실제 DB로 옮길 때도 구조를 유지하기 쉽습니다.
