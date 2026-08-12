import crypto from "crypto";
import { createSessionToken } from "@/lib/auth/session";
import { getSupabaseServerClient } from "@/lib/supabase/server";

// Autentica usuario contra Supabase con comparacion exacta (case sensitive)
export async function loginUser(usuario, password) {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("usuarios")
    .select("id, usuario, password, nombre, apellido")
    .eq("usuario", usuario)
    .maybeSingle();

  if (error) {
    console.error("[authController] Supabase usuarios:", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });

    return {
      ok: false,
      status: 500,
      message: "Error al consultar credenciales.",
      debug:
        process.env.NODE_ENV === "development"
          ? {
              code: error.code,
              message: error.message,
              hint: error.hint,
            }
          : undefined,
    };
  }

  if (!data || data.password !== password) {
    return {
      ok: false,
      status: 401,
      message: "Usuario o contraseña incorrectos.",
    };
  }

  const sessionUser = {
    idusuario: data.id,
    idsesion: `ses-${crypto.randomUUID()}-${data.usuario}`,
    nombre: data.nombre,
    apellido: data.apellido,
  };

  const token = createSessionToken(sessionUser);

  return {
    ok: true,
    data: {
      user: sessionUser,
      token,
    },
  };
}
