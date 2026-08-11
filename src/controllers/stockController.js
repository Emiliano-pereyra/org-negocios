import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function getStockByUser(idusuario) {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("stock")
    .select("id, nombre, cantidad, precio")
    .eq("id_usuario", idusuario)
    .order("id", { ascending: true });

  if (error) {
    return {
      ok: false,
      status: 500,
      message: "Error al obtener stock.",
    };
  }

  return {
    ok: true,
    data: data ?? [],
  };
}
