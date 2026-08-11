import { verifySessionToken } from "@/lib/auth/session";

// Valida token en Authorization y que x-user-id coincida con la sesion
export function validateSecureRequest(request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      ok: false,
      status: 401,
      message: "Token de autorizacion requerido.",
    };
  }

  const token = authHeader.slice(7).trim();
  const userIdHeader = request.headers.get("x-user-id")?.trim();

  if (!userIdHeader) {
    return {
      ok: false,
      status: 400,
      message: "Header x-user-id requerido.",
    };
  }

  const session = verifySessionToken(token);

  if (!session) {
    return {
      ok: false,
      status: 401,
      message: "Token invalido o expirado.",
    };
  }

  if (String(session.idusuario) !== String(userIdHeader)) {
    return {
      ok: false,
      status: 403,
      message: "El id de usuario no coincide con la sesion.",
    };
  }

  return {
    ok: true,
    user: session,
  };
}
