import { createClient } from "@supabase/supabase-js";
import { getRequiredEnv } from "@/lib/env";

function normalizeSupabaseUrl(url) {
  // El SDK espera la URL base del proyecto, sin /rest/v1
  return url.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
}

// Cliente Supabase exclusivo del servidor con service_role o sb_secret
export function getSupabaseServerClient() {
  const { supabaseUrl, supabaseServiceRoleKey } = getRequiredEnv();
  const baseUrl = normalizeSupabaseUrl(supabaseUrl);

  return createClient(baseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

