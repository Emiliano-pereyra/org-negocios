import { envErrorResponse, getRequiredEnv } from "@/lib/env";
import { validateSecureRequest } from "@/lib/auth/validateRequest";

// Wrapper para rutas protegidas: env + token + x-user-id
export function withAuth(handler) {
  return async function secureRoute(request) {
    try {
      getRequiredEnv();
    } catch {
      return envErrorResponse();
    }

    const validation = validateSecureRequest(request);

    if (!validation.ok) {
      return Response.json({ error: validation.message }, { status: validation.status });
    }

    return handler(request, validation.user);
  };
}
