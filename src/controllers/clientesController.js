import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function getClientesByUser(idusuario) {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("clientes")
    .select("id, nombre, telefono, email")
    .eq("id_usuario", idusuario)
    .order("id", { ascending: true });

  if (error) {
    return {
      ok: false,
      status: 500,
      message: "Error al obtener clientes.",
    };
  }

  return {
    ok: true,
    data: data ?? [],
  };
}
