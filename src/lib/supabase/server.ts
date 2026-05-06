import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseConfig } from "@/lib/supabase/config";
import type { Database } from "@/types/database";

let cachedClient: SupabaseClient<Database> | null = null;

export function createSupabaseServerClient() {
  if (cachedClient) {
    return cachedClient;
  }

  const { url, secretKey } = getSupabaseConfig();

  cachedClient = createClient<Database>(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false
    }
  });

  return cachedClient;
}
