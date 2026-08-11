import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function getPagosByUser(idusuario) {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("pagos")
    .select("id, cliente, monto, fecha")
    .eq("id_usuario", idusuario)
    .order("id", { ascending: true });

  if (error) {
    return {
      ok: false,
      status: 500,
      message: "Error al obtener pagos.",
    };
  }

  return {
    ok: true,
    data: data ?? [],
  };
}
