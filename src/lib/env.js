const REQUIRED_VARS = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SESSION_SECRET",
];

function cleanEnvValue(value) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return trimmed;
  }

  // Evita que comillas del .env rompan URL o claves API
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

// Valida que todas las variables existan. Sin fallback por seguridad.
export function getRequiredEnv() {
  const missing = REQUIRED_VARS.filter((name) => !cleanEnvValue(process.env[name]));

  if (missing.length > 0) {
    const error = new Error("MISSING_ENV");
    error.missing = missing;
    throw error;
  }

  return {
    supabaseUrl: cleanEnvValue(process.env.SUPABASE_URL),
    supabaseServiceRoleKey: cleanEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY),
    sessionSecret: cleanEnvValue(process.env.SESSION_SECRET),
  };
}

export function envErrorResponse() {
  return Response.json(
    { error: "Configuracion del servidor incompleta. Peticion cancelada." },
    { status: 503 }
  );
}
