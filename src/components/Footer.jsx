"use client";

import { NAV_ITEMS } from "@/config/navigation";
import { useUser } from "@/context/UserContext";
import ContactIcons from "@/components/ContactIcons";
import NavLinks from "@/components/NavLinks";
import SiteLogo from "@/components/SiteLogo";

export default function Footer() {
  const { user } = useUser();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <SiteLogo href={user ? "/home" : "/"} />
            <p className="max-w-xs text-sm text-neutral-600">
              Herramientas simples para organizar stock, pagos y clientes de tu negocio.
            </p>
            <ContactIcons />
          </div>

          {user && (
            <div>
              <p className="mb-3 text-sm font-medium text-neutral-900">Secciones</p>
              <NavLinks items={NAV_ITEMS} className="max-w-sm" />
            </div>
          )}
        </div>

        <p className="mt-8 border-t border-neutral-200 pt-4 text-center text-xs text-neutral-500 sm:text-left">
          Copyright {currentYear} Org Negocios. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
