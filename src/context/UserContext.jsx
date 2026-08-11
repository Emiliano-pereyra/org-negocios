"use client";

import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "org-negocios-user";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  // Restaura la sesion guardada al recargar la pagina
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
    }
    setIsReady(true);
  }, []);

  // Login contra API protegida del servidor (Supabase)
  async function login(usuario, password) {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        return {
          ok: false,
          message: payload.error || "No se pudo iniciar sesion.",
        };
      }

      const sessionUser = {
        ...payload.user,
        token: payload.token,
      };

      setUser(sessionUser);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));

      return { ok: true };
    } catch {
      return {
        ok: false,
        message: "Error de conexion con el servidor.",
      };
    }
  }

  function logout() {
    setUser(null);
    sessionStorage.removeItem(STORAGE_KEY);
  }

  return (
    <UserContext.Provider value={{ user, isReady, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser debe usarse dentro de UserProvider.");
  }

  return context;
}
