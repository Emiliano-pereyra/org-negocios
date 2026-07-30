"use client";

import { createContext, useContext, useEffect, useState } from "react";
import credentials from "@/data/credentials.json";
import users from "@/data/users.json";

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

  // Valida credenciales con comparacion exacta (case sensitive)
  function login(usuario, password) {
    const match = credentials.find(
      (item) => item.usuario === usuario && item.password === password
    );

    if (!match) {
      return { ok: false, message: "Usuario o contraseña incorrectos." };
    }

    const userData = users.find((item) => item.usuario === match.usuario);

    if (!userData) {
      return { ok: false, message: "No se encontraron datos del usuario." };
    }

    const sessionUser = {
      idusuario: userData.idusuario,
      idsesion: userData.idsesion,
      nombre: userData.nombre,
      apellido: userData.apellido,
    };

    setUser(sessionUser);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));

    return { ok: true };
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
