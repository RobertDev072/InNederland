"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/logo";
import { NAV_ITEMS } from "@/components/layout/sidebar";
import { signOut } from "@/lib/auth/actions";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col border-b border-navy-100 bg-white md:hidden">
      <div className="flex h-14 items-center justify-between px-4">
        <Logo />
        <form action={signOut}>
          <button type="submit" className="text-sm font-medium text-navy-500">
            Uitloggen
          </button>
        </form>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium",
                active ? "bg-orange-50 text-orange-700" : "text-navy-600 hover:bg-navy-50",
              )}
            >
              <Icon className="size-3.5" />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
