import { loginUser } from "@/controllers/authController";
import { envErrorResponse, getRequiredEnv } from "@/lib/env";

export async function POST(request) {
  try {
    getRequiredEnv();
  } catch {
    return envErrorResponse();
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Cuerpo de peticion invalido." }, { status: 400 });
  }

  const usuario = body?.usuario?.trim();
  const password = body?.password;

  if (!usuario || !password) {
    return Response.json(
      { error: "Usuario y contraseña son obligatorios." },
      { status: 400 }
    );
  }

  const result = await loginUser(usuario, password);

  if (!result.ok) {
    return Response.json({ error: result.message }, { status: result.status });
  }

  return Response.json(result.data);
}
