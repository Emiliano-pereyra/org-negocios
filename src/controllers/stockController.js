import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  getServerCache,
  invalidateServerCache,
  setServerCache,
} from "@/lib/cache/serverCache";

const CACHE_NAMESPACE = "stock";
const MAX_BATCH_CREATE = 10;

async function fetchStockFromDb(idusuario) {
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

function syncStockCache(idusuario, data) {
  setServerCache(CACHE_NAMESPACE, idusuario, data);
}

export async function getStockByUser(idusuario, { useCache = true } = {}) {
  if (useCache) {
    const cached = getServerCache(CACHE_NAMESPACE, idusuario);
    if (cached) {
      return { ok: true, data: cached.data, fromCache: true };
    }
  }

  const result = await fetchStockFromDb(idusuario);

  if (result.ok) {
    syncStockCache(idusuario, result.data);
  }

  return result;
}

export async function createStockProducts(idusuario, products) {
  if (!Array.isArray(products) || products.length === 0) {
    return {
      ok: false,
      status: 400,
      message: "Debes enviar al menos un producto.",
    };
  }

  if (products.length > MAX_BATCH_CREATE) {
    return {
      ok: false,
      status: 400,
      message: `Solo puedes agregar hasta ${MAX_BATCH_CREATE} productos a la vez.`,
    };
  }

  const payload = [];

  for (const product of products) {
    const nombre = product?.nombre?.trim();

    if (!nombre) {
      return {
        ok: false,
        status: 400,
        message: "El nombre es obligatorio en todos los productos.",
      };
    }

    payload.push({
      id_usuario: idusuario,
      nombre,
      cantidad: Number(product.cantidad ?? 0) || 0,
      precio: Number(product.precio ?? 0) || 0,
    });
  }

  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase.from("stock").insert(payload).select("id, nombre, cantidad, precio");

  if (error) {
    return {
      ok: false,
      status: 500,
      message: "Error al crear productos.",
    };
  }

  const cached = getServerCache(CACHE_NAMESPACE, idusuario);
  const nextData = cached ? [...cached.data, ...(data ?? [])] : null;

  if (nextData) {
    syncStockCache(idusuario, nextData);
  } else {
    invalidateServerCache(CACHE_NAMESPACE, idusuario);
  }

  return {
    ok: true,
    data: data ?? [],
    cache: nextData,
  };
}

export async function updateStockProduct(idusuario, product) {
  const id = Number(product?.id);
  const nombre = product?.nombre?.trim();

  if (!id || !nombre) {
    return {
      ok: false,
      status: 400,
      message: "Id y nombre son obligatorios para editar.",
    };
  }

  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("stock")
    .update({
      nombre,
      cantidad: Number(product.cantidad ?? 0) || 0,
      precio: Number(product.precio ?? 0) || 0,
    })
    .eq("id", id)
    .eq("id_usuario", idusuario)
    .select("id, nombre, cantidad, precio")
    .maybeSingle();

  if (error) {
    return {
      ok: false,
      status: 500,
      message: "Error al actualizar producto.",
    };
  }

  if (!data) {
    return {
      ok: false,
      status: 404,
      message: "Producto no encontrado.",
    };
  }

  const cached = getServerCache(CACHE_NAMESPACE, idusuario);

  if (cached) {
    const nextData = cached.data.map((item) => (item.id === data.id ? data : item));
    syncStockCache(idusuario, nextData);
    return { ok: true, data, cache: nextData };
  }

  invalidateServerCache(CACHE_NAMESPACE, idusuario);
  return { ok: true, data };
}

export async function deleteStockProduct(idusuario, productId) {
  const id = Number(productId);

  if (!id) {
    return {
      ok: false,
      status: 400,
      message: "Id de producto invalido.",
    };
  }

  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("stock")
    .delete()
    .eq("id", id)
    .eq("id_usuario", idusuario)
    .select("id")
    .maybeSingle();

  if (error) {
    return {
      ok: false,
      status: 500,
      message: "Error al eliminar producto.",
    };
  }

  if (!data) {
    return {
      ok: false,
      status: 404,
      message: "Producto no encontrado.",
    };
  }

  const cached = getServerCache(CACHE_NAMESPACE, idusuario);

  if (cached) {
    const nextData = cached.data.filter((item) => item.id !== id);
    syncStockCache(idusuario, nextData);
    return { ok: true, data: { id }, cache: nextData };
  }

  invalidateServerCache(CACHE_NAMESPACE, idusuario);
  return { ok: true, data: { id } };
}
