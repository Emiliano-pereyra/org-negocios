"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks({ items, className = "" }) {
  const pathname = usePathname();

  return (
    <nav className={className}>
      <ul className="flex flex-wrap items-center gap-1 sm:gap-2">
        {items.map((item) => {
          const isActive = pathname === item.href;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`rounded-md px-2 py-1.5 text-sm transition sm:px-3 ${
                  isActive
                    ? "bg-neutral-100 font-medium text-neutral-900"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
