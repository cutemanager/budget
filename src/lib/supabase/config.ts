export const SUPABASE_ENV_ERROR_MESSAGE =
  "Supabase 환경 변수가 설정되지 않았습니다. `.env.local`에 `NEXT_PUBLIC_SUPABASE_URL`과 `SUPABASE_SECRET_KEY`를 넣어 주세요.";

export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !secretKey) {
    throw new Error(SUPABASE_ENV_ERROR_MESSAGE);
  }

  return {
    url,
    secretKey
  };
}

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY)
  );
}
