const REQUIRED_VARS = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SESSION_SECRET",
];

// Valida que todas las variables existan. Sin fallback por seguridad.
export function getRequiredEnv() {
  const missing = REQUIRED_VARS.filter((name) => !process.env[name]?.trim());

  if (missing.length > 0) {
    const error = new Error("MISSING_ENV");
    error.missing = missing;
    throw error;
  }

  return {
    supabaseUrl: process.env.SUPABASE_URL.trim(),
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY.trim(),
    sessionSecret: process.env.SESSION_SECRET.trim(),
  };
}

export function envErrorResponse() {
  return Response.json(
    { error: "Configuracion del servidor incompleta. Peticion cancelada." },
    { status: 503 }
  );
}
