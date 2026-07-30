"use client";

import { usePathname, useRouter } from "next/navigation";
import { NAV_ITEMS } from "@/config/navigation";
import { useUser } from "@/context/UserContext";
import NavLinks from "@/components/NavLinks";
import SiteLogo from "@/components/SiteLogo";
import UserMenu from "@/components/UserMenu";

export default function Header() {
  const { user, logout } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/";

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:py-0">
        <SiteLogo href={user ? "/home" : "/"} />

        {!isLoginPage && user && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <NavLinks items={NAV_ITEMS} />
            <div className="flex items-center justify-end border-t border-neutral-200 pt-3 sm:border-t-0 sm:pt-0">
              <UserMenu user={user} onLogout={handleLogout} />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
