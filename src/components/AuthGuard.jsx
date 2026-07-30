"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function AuthGuard({ children }) {
  const { user, isReady } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isReady && !user) {
      router.replace("/");
    }
  }, [isReady, user, router]);

  if (!isReady || !user) {
    return (
      <div className="flex flex-1 items-center justify-center text-neutral-500">
        Cargando...
      </div>
    );
  }

  return children;
}
