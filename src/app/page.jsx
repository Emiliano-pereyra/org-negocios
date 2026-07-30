"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function LoginPage() {
  const { user, isReady, login } = useUser();
  const router = useRouter();

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Si ya hay sesion activa, redirige al home
  useEffect(() => {
    if (isReady && user) {
      router.replace("/home");
    }
  }, [isReady, user, router]);

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const result = login(usuario, password);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    router.push("/home");
  }

  if (!isReady || user) {
    return (
      <div className="flex flex-1 items-center justify-center text-neutral-500">
        Cargando...
      </div>
    );
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-semibold text-neutral-900">Iniciar sesion</h1>
        <p className="mb-6 text-sm text-neutral-600">
          Ingresa tus credenciales para acceder al panel.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="usuario" className="mb-1 block text-sm text-neutral-700">
              Usuario
            </label>
            <input
              id="usuario"
              type="text"
              value={usuario}
              onChange={(event) => setUsuario(event.target.value)}
              autoComplete="username"
              required
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm text-neutral-700">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none"
            />
          </div>

          {error && (
            <p className="text-sm text-neutral-700" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-md bg-neutral-900 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-700"
          >
            Ingresar
          </button>
        </form>
      </div>
    </main>
  );
}
