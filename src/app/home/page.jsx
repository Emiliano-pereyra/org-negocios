"use client";

import AuthGuard from "@/components/AuthGuard";
import CardMenu from "@/components/CardMenu";
import { useUser } from "@/context/UserContext";

function HomeContent() {
  const { user } = useUser();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Bienvenido, {user.nombre} {user.apellido}
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Selecciona una seccion para continuar.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <CardMenu variant="stock" />
        <CardMenu variant="pagos" />
        <CardMenu variant="clientes" />
      </div>
    </main>
  );
}

export default function HomePage() {
  return (
    <AuthGuard>
      <HomeContent />
    </AuthGuard>
  );
}
