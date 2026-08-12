const STORAGE_KEY = "org-negocios-user";

function getStoredSession() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

// Cliente HTTP del frontend. Envia token y x-user-id en cada peticion protegida
export async function apiRequest(endpoint, options = {}) {
  const session = getStoredSession();

  if (!session?.token || !session?.idusuario) {
    throw new Error("Sesion no valida. Debes iniciar sesion nuevamente.");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.token}`,
    "x-user-id": String(session.idusuario),
    ...options.headers,
  };

  const response = await fetch(`/api/${endpoint}`, {
    ...options,
    headers,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || "Error en la peticion.");
  }

  return payload;
}

export async function apiGet(endpoint) {
  return apiRequest(endpoint, { method: "GET" });
}

export async function apiPost(endpoint, body) {
  return apiRequest(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function apiPut(endpoint, body) {
  return apiRequest(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function apiDelete(endpoint, body) {
  return apiRequest(endpoint, {
    method: "DELETE",
    body: JSON.stringify(body),
  });
}
