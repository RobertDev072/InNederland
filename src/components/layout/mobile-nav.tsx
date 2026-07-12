"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/logo";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { NAV_ITEM_DEFS } from "@/components/layout/sidebar";
import { signOut } from "@/lib/auth/actions";

export function MobileNav({ isAdmin }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const t = useTranslations("Nav");
  const tCommon = useTranslations("Common");
  const navItems = NAV_ITEM_DEFS.map((item) => ({ ...item, label: t(item.key) }));

  return (
    <div className="flex flex-col border-b border-navy-100 bg-white md:hidden">
      <div className="flex h-14 items-center justify-between gap-2 px-4">
        <Logo />
        <div className="flex items-center gap-2">
          <LanguageSwitcher className="w-auto text-xs" />
          <form action={signOut}>
            <button type="submit" className="text-sm font-medium text-navy-500">
              {tCommon("signOut")}
            </button>
          </form>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3">
        {navItems.map(({ href, label, icon: Icon }) => {
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
        {isAdmin ? (
          <Link
            href="/admin"
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium",
              pathname.startsWith("/admin") ? "bg-orange-50 text-orange-700" : "text-navy-600 hover:bg-navy-50",
            )}
          >
            <ShieldCheck className="size-3.5" />
            {t("admin")}
          </Link>
        ) : null}
      </nav>
    </div>
  );
}
