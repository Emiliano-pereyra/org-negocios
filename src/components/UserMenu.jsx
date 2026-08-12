"use client";

import { useEffect, useRef, useState } from "react";

function getInitials(nombre, apellido) {
  const first = nombre?.charAt(0)?.toUpperCase() ?? "";
  const last = apellido?.charAt(0)?.toUpperCase() ?? "";
  return `${first}${last}`;
}

export default function UserMenu({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const initials = getInitials(user.nombre, user.apellido);

  // Cierra el menu al hacer click fuera del componente
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    setIsOpen(false);
    onLogout();
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Menu de usuario"
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-neutral-300 bg-neutral-100 text-sm font-semibold text-neutral-900 transition hover:border-neutral-400 hover:bg-neutral-200"
      >
        {initials}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-52 rounded-md border border-neutral-200 bg-white py-1 shadow-lg">
          <div className="border-b border-neutral-200 px-4 py-3">
            <p className="text-sm font-medium text-neutral-900">
              {user.nombre} {user.apellido}
            </p>
            <p className="text-xs text-neutral-500">Sesion activa</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full cursor-pointer px-4 py-2.5 text-left text-sm text-neutral-900 transition hover:bg-neutral-100"
          >
            Cerrar sesion
          </button>
        </div>
      )}
    </div>
  );
}
