import { createClient } from "@supabase/supabase-js";
import { getRequiredEnv } from "@/lib/env";

// Cliente Supabase exclusivo del servidor con service_role
export function getSupabaseServerClient() {
  const { supabaseUrl, supabaseServiceRoleKey } = getRequiredEnv();

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
